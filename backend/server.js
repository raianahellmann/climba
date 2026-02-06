const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- configuração db
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "defaultdb",
  ssl: { rejectUnauthorized: false }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('ERRO CRÍTICO NO BANCO:', err.message);
    return;
  }
  console.log('Conexão estabelecida!');
  connection.release();
});

// --- cadastrar ---
app.post('/clientes', (req, res) => {
    const { nome, email, data_nascimento, profissao, observacoes } = req.body;
    
    console.log("Recebendo cadastro:", { nome, email });

    const sql = "INSERT INTO clientes (nome, email, data_nascimento, profissao, observacoes) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [nome, email, data_nascimento, profissao, observacoes], (err, result) => {
        if (err) {
            console.error("Erro ao Salvar:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Este e-mail já está cadastrado." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Cadastrado com sucesso!", id: result.insertId });
    });
});

// --- listar e pesquisar ---
app.get('/clientes', (req, res) => {
    const search = req.query.search || '';
    const searchTerm = `%${search}%`;
    const sql = "SELECT * FROM clientes WHERE nome LIKE ? OR email LIKE ?";
    
    db.query(sql, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error("Erro ao Listar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// --- excluir ---
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM clientes WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("Erro ao Excluir:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Removido!" });
    });
});

// --- editar ---
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, data_nascimento, profissao, observacoes } = req.body;
    const sql = "UPDATE clientes SET nome=?, email=?, data_nascimento=?, profissao=?, observacoes=? WHERE id=?";
    
    db.query(sql, [nome, email, data_nascimento, profissao, observacoes, id], (err) => {
        if (err) {
            console.error("Erro ao Editar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Atualizado!" });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API disponível em http://localhost:${PORT}/clientes`);
});