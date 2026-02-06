import React, { useState, useEffect } from 'react';
import { 
  Container, Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Select, MenuItem, InputLabel, FormControl, Box, 
  Paper, Typography, IconButton, ThemeProvider, createTheme, 
  CssBaseline, Avatar, Divider, Chip
} from '@mui/material';
import { 
  Edit as EditIcon, Delete as DeleteIcon, 
  Search as SearchIcon, AlternateEmail as EmailIcon,
  Fingerprint as IdIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const climbaTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#76DA30' }, 
    background: { default: '#1C1F26', paper: '#2D323E' },
    text: { primary: '#FFFFFF', secondary: '#9BA3AF' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h4: { fontWeight: 800 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#2D323E',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#1C1F26',
          fontWeight: 700,
          '&:hover': { backgroundColor: '#62B828' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D323E', 
          paddingLeft: '4px',
          paddingRight: '4px',
        },
      },
    },
  },
});

const API_URL = 'https://climba.onrender.com/clientes';

function App() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false); 
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

  const tratarDataBanco = (data) => {
    if (!data) return null;
    return dayjs(data.substring(0, 10));
  };

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

  const handlePreSubmit = () => {
    if (validate()) {
      setSaveDialogOpen(true);
    }
  };

  const executeSubmit = async () => {
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
      setSaveDialogOpen(false);
      handleClose();
      fetchClientes();
    } catch (err) { 
      setSaveDialogOpen(false);
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

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL}/${clienteParaExcluir}`);
      setDeleteDialogOpen(false);
      fetchClientes();
    } catch (err) { console.error("Erro ao excluir:", err); }
  };

  return (
    <ThemeProvider theme={climbaTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box sx={{ minHeight: '100vh', py: 8, background: '#1C1F26' }}>
          <Container maxWidth="sm">
            
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#FFF' }}>
              Climba<span style={{ color: '#76DA30' }}>Core</span>
            </Typography>

            <Paper elevation={0} sx={{ p: '6px 20px', mb: 5, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <SearchIcon sx={{ color: 'primary.main', mr: 2 }} />
              <TextField 
                fullWidth variant="standard" placeholder="Pesquisar..." 
                InputProps={{ disableUnderline: true }} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {clientes.map((c) => (
                <Paper key={c.id} sx={{ p: 3, borderRadius: '12px', bgcolor: '#2D323E' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: '#1C1F26', fontWeight: 'bold' }}>{c.nome?.charAt(0)}</Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{c.nome}</Typography>
                      <Chip label={c.profissao} size="small" sx={{ bgcolor: 'rgba(118, 218, 48, 0.1)', color: 'primary.main', fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => { setFormData({...c, data_nascimento: tratarDataBanco(c.data_nascimento)}); setOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#F43F5E' }} onClick={() => { setClienteParaExcluir(c.id); setDeleteDialogOpen(true); }}>
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
                      <Typography variant="caption">{tratarDataBanco(c.data_nascimento)?.format('DD/MM/YYYY')}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Button fullWidth variant="contained" onClick={() => setOpen(true)} sx={{ mt: 6, py: 1.8 }}>
              ADICIONAR CLIENTE
            </Button>
          </Container>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, pt: 4 }}>Perfil do Cliente</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField label="Nome Completo *" fullWidth error={!!errors.nome} helperText={errors.nome} value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} sx={{ mt: 1 }} />
              <TextField label="E-mail *" fullWidth error={!!errors.email} helperText={errors.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <DatePicker 
                label="Nascimento *"
                value={formData.data_nascimento} 
                onChange={(v) => setFormData({...formData, data_nascimento: v})}
                format="DD/MM/YYYY"
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

              <TextField label="Observações" multiline rows={3} fullWidth value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} />
            </DialogContent>
            <DialogActions sx={{ p: 4, justifyContent: 'center', gap: 2 }}>
              <Button onClick={handleClose} sx={{ color: 'primary.main' }}>CANCELAR</Button>
              <Button onClick={handlePreSubmit} variant="contained" sx={{ px: 4, borderRadius: '50px' }}>SALVAR</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>Confirmar Dados</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Deseja salvar as informações deste cliente?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
              <Button onClick={() => setSaveDialogOpen(false)}>REVISAR</Button>
              <Button onClick={executeSubmit} variant="contained">SALVAR</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle sx={{ textAlign: 'center' }}>Excluir Cliente?</DialogTitle>
            <DialogContent><Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>Esta ação não pode ser desfeita.</Typography></DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
              <Button onClick={() => setDeleteDialogOpen(false)}>NÃO</Button>
              <Button onClick={confirmarExclusao} variant="contained" sx={{ bgcolor: '#F43F5E', color: '#FFF' }}>EXCLUIR</Button>
            </DialogActions>
          </Dialog>

        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;