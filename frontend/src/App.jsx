import React, { useState, useEffect } from 'react';
import { 
  Container, Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Select, MenuItem, InputLabel, FormControl, Box, 
  Paper, Typography, IconButton, ThemeProvider, createTheme, 
  CssBaseline, Avatar, Divider, Chip
} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Search as SearchIcon, AlternateEmail as EmailIcon,
  Fingerprint as IdIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';

// Tema Supernova - Dark Mode Profissional
const supernovaTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1' }, 
    background: { default: '#050B18', paper: 'rgba(255, 255, 255, 0.03)' },
    text: { primary: '#FFFFFF', secondary: '#94A3B8' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h4: { fontWeight: 900, letterSpacing: '-0.06em' },
  },
  shape: { borderRadius: 24 },
});

const API_URL = 'https://climba.onrender.com/clientes';

function App() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({}); 
  const [formData, setFormData] = useState({ nome: '', email: '', data_nascimento: null, profissao: '', observacoes: '' });

  const fetchClientes = async () => {
    try {
      const res = await axios.get(`${API_URL}?search=${search}`);
      setClientes(res.data);
    } catch (err) { console.error("Erro ao buscar clientes:", err); }
  };

  useEffect(() => { fetchClientes(); }, [search]);

  // Validação de campos
  const validate = () => {
    let tempErrors = {};
    if (!formData.nome?.trim()) tempErrors.nome = "O nome é obrigatório.";
    if (!formData.profissao) tempErrors.profissao = "Selecione uma profissão.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "O e-mail é obrigatório.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Formato de e-mail inválido.";
    }
    if (!formData.data_nascimento) {
      tempErrors.data_nascimento = "A data é obrigatória.";
    } else if (!dayjs(formData.data_nascimento).isBefore(dayjs(), 'day')) {
      tempErrors.data_nascimento = "A data deve ser anterior a hoje.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        data_nascimento: dayjs(formData.data_nascimento).format('YYYY-MM-DD'),
        profissao: formData.profissao,
        observacoes: formData.observacoes || ""
      };

      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      handleClose();
      fetchClientes();
    } catch (err) { 
      console.error("Erro no Servidor:", err.response?.data);
      if (err.response?.status === 400) {
        setErrors({ ...errors, email: "E-mail já cadastrado ou dados inválidos." });
      } else {
        alert("Erro ao salvar no banco de dados.");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ nome: '', email: '', data_nascimento: null, profissao: '', observacoes: '' });
    setErrors({});
  };

  // Funções para Exclusão Customizada
  const triggerDelete = (id) => {
    setClienteParaExcluir(id);
    setDeleteDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL}/${clienteParaExcluir}`);
      setDeleteDialogOpen(false);
      fetchClientes();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <ThemeProvider theme={supernovaTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ minHeight: '100vh', py: 8, background: '#050B18' }}>
          <Container maxWidth="sm">
            
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
              Climba<span style={{ color: '#6366F1' }}>Core</span>
            </Typography>

            {/* Barra de Busca */}
            <Paper elevation={0} sx={{ p: '6px 20px', mb: 5, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px' }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
              <TextField 
                fullWidth 
                variant="standard" 
                placeholder="Filtrar por nome ou e-mail..." 
                InputProps={{ disableUnderline: true }} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </Paper>

            {/* Lista de Clientes */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {clientes.map((c) => (
                <Paper key={c.id} sx={{ 
                  p: 3, borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 900 }}>{c.nome?.charAt(0)}</Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, wordBreak: 'break-word', lineHeight: 1.2, mb: 0.5 }}>{c.nome}</Typography>
                      <Chip label={c.profissao} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 900, bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => { setFormData({...c, data_nascimento: dayjs(c.data_nascimento)}); setOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#F43F5E' }} onClick={() => triggerDelete(c.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">{c.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IdIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">{dayjs(c.data_nascimento).format('DD/MM/YYYY')}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => setOpen(true)} 
              sx={{ mt: 6, py: 2, borderRadius: '20px', fontWeight: 700 }}
            >
              ADICIONAR CLIENTE
            </Button>
          </Container>

          {/* MODAL DE CADASTRO / EDIÇÃO */}
          <Dialog 
            open={open} 
            onClose={handleClose} 
            fullWidth 
            maxWidth="xs"
            disableRestoreFocus
            disableEnforceFocus
            PaperProps={{ sx: { background: '#0F172A', borderRadius: '32px', backgroundImage: 'none' } }}
          >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 900, pt: 4, color: '#FFF' }}>Perfil do Cliente</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField label="Nome Completo *" fullWidth error={!!errors.nome} helperText={errors.nome} value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} sx={{ mt: 1 }} />
              <TextField label="E-mail *" fullWidth error={!!errors.email} helperText={errors.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker 
                  label="Nascimento *"
                  value={formData.data_nascimento} 
                  onChange={(v) => setFormData({...formData, data_nascimento: v})}
                  slotProps={{ textField: { fullWidth: true, error: !!errors.data_nascimento, helperText: errors.data_nascimento } }}
                />
                <FormControl fullWidth error={!!errors.profissao}>
                  <InputLabel id="prof-label">Profissão *</InputLabel>
                  <Select labelId="prof-label" label="Profissão *" value={formData.profissao} onChange={(e) => setFormData({...formData, profissao: e.target.value})}>
                    <MenuItem value="Programador">Programador</MenuItem>
                    <MenuItem value="Consultor de Vendas">Consultor de Vendas</MenuItem>
                    <MenuItem value="SDR">SDR</MenuItem>
                    <MenuItem value="Suporte ao Cliente">Suporte ao Cliente</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField label="Observações" multiline rows={3} fullWidth value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} />
            </DialogContent>
            <DialogActions sx={{ p: 4, justifyContent: 'center', gap: 2 }}>
              <Button onClick={handleClose} sx={{ color: '#94A3B8' }}>CANCELAR</Button>
              <Button onClick={handleSubmit} variant="contained" sx={{ px: 5, py: 1.5, borderRadius: '50px', fontWeight: 700, bgcolor: '#6366F1' }}>SALVAR</Button>
            </DialogActions>
          </Dialog>

          {/* NOVO MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (ADEUS LOCALHOST DIZ) */}
          <Dialog 
            open={deleteDialogOpen} 
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{ sx: { background: '#0F172A', borderRadius: '24px', p: 1 } }}
          >
            <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Deseja remover este cliente? Esta ação não pode ser desfeita.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#94A3B8' }}>CANCELAR</Button>
              <Button 
                onClick={confirmarExclusao} 
                variant="contained" 
                sx={{ bgcolor: '#F43F5E', '&:hover': { bgcolor: '#E11D48' }, borderRadius: '50px', px: 3 }}
              >
                EXCLUIR
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;