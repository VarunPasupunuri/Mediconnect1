// MediConnect Backend Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

// Global Fallback State (Mock DB)
global.dbConnected = false;
global.mockUsers = [
  { _id: 'mock_patient', name: 'Patient Demo', email: 'patient@mediconnect.com', role: 'patient', password: 'patient123' },
  { _id: 'mock_doctor', name: 'Dr. Priya', email: 'priya@mediconnect.com', role: 'doctor', password: 'doctor123', specialization: 'Cardiologist' },
  { _id: 'mock_admin', name: 'Admin Demo', email: 'admin@mediconnect.com', role: 'admin', password: 'admin123' }
];

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.set('bufferCommands', false); // Fail fast if DB disconnected
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediconnect', {
    serverSelectionTimeoutMS: 10000 // 10 seconds timeout for slower networks
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    global.dbConnected = true;
    app.listen(PORT, () => {
      console.log(`🚀 MediConnect Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️ Running in Mock Mode - Database is unavailable');
    global.dbConnected = false;
    app.listen(PORT, () => {
      console.log(`🚀 MediConnect Server running on port ${PORT} (MOCK DB MODE)`);
    });
  });

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-history', require('./routes/medicalHistoryRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/health-tips', require('./routes/healthTipRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/symptom-checker', require('./routes/symptomRoutes'));
app.use('/api/diet-plan', require('./routes/dietRoutes'));
app.use('/api/medicine-scan', require('./routes/medicineRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'MediConnect API is running', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


