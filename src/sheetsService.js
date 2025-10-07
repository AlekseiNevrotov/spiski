const axios = require('axios');
const appendToSheet = async (data) => {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  console.log('Значение GOOGLE_SCRIPT_URL из env:', scriptUrl);
  if (!scriptUrl || !scriptUrl.startsWith('https://')) {
    throw new Error('Invalid or missing GOOGLE_SCRIPT_URL in .env');
  }
  try {
    const response = await axios.post(scriptUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.data.status !== 'success') {
      throw new Error('Ошибка в Google Apps Script');
    }
  } catch (error) {
    throw new Error('Не удалось отправить данные: ' + error.message);
  }
};
module.exports = { appendToSheet };