const axios = require('axios');

async function test() {
  try {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Front',
      email: 'fronttest' + Date.now() + '@example.com',
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
