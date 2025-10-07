const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { appendToSheet } = require('./sheetsService');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.post('/submit', async (req, res) => {
  const { surname, name, phone } = req.body;
  try {
    await appendToSheet({ surname, name, phone });
    res.redirect(`/submit.html?message=${encodeURIComponent('Форма успешно отправлена! 😊')}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/submit.html?message=${encodeURIComponent('Ошибка: ' + error.message)}`);
  }
});
app.get('/submit.html', (req, res) => {
  const message = req.query.message || 'Что-то пошло не так.';
  res.sendFile(path.join(__dirname, '..', 'submit.html'), { headers: { 'X-Message': message } });
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});