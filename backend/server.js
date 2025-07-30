require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro ao conectar MongoDB:', err));

// Modelos
const Produto = mongoose.model('Produto', new mongoose.Schema({
  nome: String,
  descricao: String,
  preco: Number,
  imagem: String,
}));

const Pedido = mongoose.model('Pedido', new mongoose.Schema({
  nome: String,
  itens: Array,
  total: Number,
  data: { type: Date, default: Date.now }
}));

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
// Listar produtos
app.get('/produtos', async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

// Criar produto (só admin/uso interno)
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, imagem } = req.body;
  if (!nome || !preco) return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  const produto = new Produto({ nome, descricao, preco, imagem });
  await produto.save();
  res.json(produto);
});

// Fazer pedido
app.post('/pedidos', async (req, res) => {
  const { nome, itens, total } = req.body;
  if (!nome || !Array.isArray(itens) || !total) {
    return res.status(400).json({ erro: 'Dados do pedido incompletos' });
  }
  const pedido = new Pedido({ nome, itens, total });
  await pedido.save();
  res.json({ mensagem: 'Pedido recebido com sucesso!', pedido });
});

// Listar pedidos (admin)
app.get('/pedidos', async (req, res) => {
  const pedidos = await Pedido.find().sort('-data');
  res.json(pedidos);
});

// Start
app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:' + PORT);
});