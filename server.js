const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Libera o acesso da página HTML à API (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const banco = new sqlite3.Database('./banco.db');

// Normaliza texto: minúsculas e sem acento (terça -> terca)
const normalizar = (t) =>
  String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Consultar o horário completo (na ordem em que foi cadastrado)
app.get('/horario', (req, res) => {
  banco.all('SELECT * FROM aulas ORDER BY id', (erro, aulas) => {
    if (erro) return res.status(500).json({ erro: erro.message });
    res.json(aulas);
  });
});

// Consultar as aulas de um dia (ex.: /horario/segunda ou /horario/terça)
app.get('/horario/:dia', (req, res) => {
  const dia = normalizar(req.params.dia);

  banco.all('SELECT * FROM aulas ORDER BY id', (erro, aulas) => {
    if (erro) return res.status(500).json({ erro: erro.message });
    res.json(aulas.filter(a => normalizar(a.dia) === dia));
  });
});

// Cadastrar aula
app.post('/aulas', (req, res) => {
  const { dia, horario, componente } = req.body;

  banco.run(
    'INSERT INTO aulas (dia, horario, componente) VALUES (?, ?, ?)',
    [dia, horario, componente],
    function (erro) {
      if (erro) return res.status(500).json({ erro: erro.message });
      res.status(201).json({ id: this.lastID, dia, horario, componente });
    }
  );
});

// Excluir aula por id
app.delete('/aulas/:id', (req, res) => {
  banco.run('DELETE FROM aulas WHERE id = ?', [Number(req.params.id)], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.message });
    res.json({ mensagem: 'Aula excluída com sucesso.' });
  });
});

app.listen(3000, () => console.log('API rodando em http://localhost:3000'));