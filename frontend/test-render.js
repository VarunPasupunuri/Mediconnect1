const axios = require('axios');

async function test() {
  try {
    const { data } = await axios.post('https://mediconnect1-diiu.onrender.com/api/auth/register', {
      name: 'Test Render',
      email: 'render' + Date.now() + '@example.com',
      password: 'password123',
      role: 'patient',
      phone: '1234567890'
    });
    console.log('Success:', data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
