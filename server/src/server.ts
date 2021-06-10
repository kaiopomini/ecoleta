import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  console.log('listagem de usuários');
  return res.json([
    'Kaio',
    'Kamila',
    'Jinx',
    'teste'
  ]);
});

app.listen(3333);