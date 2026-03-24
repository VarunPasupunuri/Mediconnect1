// Seed script - populates MongoDB with sample data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const HealthTip = require('../models/HealthTip');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediconnect';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await DoctorProfile.deleteMany({});
  await HealthTip.deleteMany({});
  await Appointment.deleteMany({});
  await MedicalRecord.deleteMany({});
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@mediconnect.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9000000000',
  });

  // Create doctors
  const doctorData = [
    { name: 'Dr. Priya Sharma', email: 'priya@mediconnect.com', specialization: 'Cardiologist', experience: 12, fee: 800, hospital: 'Apollo Hospital', rating: 4.8, about: 'Expert in cardiovascular diseases with 12+ years of experience.' },
    { name: 'Dr. Rahul Mehta', email: 'rahul@mediconnect.com', specialization: 'Neurologist', experience: 8, fee: 700, hospital: 'Fortis Hospital', rating: 4.6, about: 'Specialist in neurological disorders and brain health.' },
    { name: 'Dr. Ananya Singh', email: 'ananya@mediconnect.com', specialization: 'Dermatologist', experience: 6, fee: 600, hospital: 'Max Healthcare', rating: 4.7, about: 'Expert in skin conditions and cosmetic dermatology.' },
    { name: 'Dr. Vikram Patel', email: 'vikram@mediconnect.com', specialization: 'Orthopedist', experience: 15, fee: 900, hospital: 'Medanta Hospital', rating: 4.9, about: 'Leading orthopedic surgeon specializing in joint replacements.' },
    { name: 'Dr. Kavita Rao', email: 'kavita@mediconnect.com', specialization: 'Pediatrician', experience: 10, fee: 500, hospital: 'Narayana Health', rating: 4.7, about: 'Dedicated to child health and development.' },
    { name: 'Dr. Arjun Krishnan', email: 'arjun@mediconnect.com', specialization: 'Psychiatrist', experience: 9, fee: 750, hospital: 'NIMHANS', rating: 4.5, about: 'Mental health expert focused on anxiety, depression, and behavioral therapy.' },
    { name: 'Dr. Meera Joshi', email: 'meera@mediconnect.com', specialization: 'Gynecologist', experience: 11, fee: 700, hospital: 'Cloudnine Hospital', rating: 4.8, about: 'Women\'s health specialist with expertise in obstetrics and gynecology.' },
    { name: 'Dr. Rohan Gupta', email: 'rohan@mediconnect.com', specialization: 'General Physician', experience: 5, fee: 400, hospital: 'City Clinic', rating: 4.4, about: 'Primary care physician for all general health concerns.' },
  ];

  const availabilityTemplate = [
    { day: 'Monday', slots: [{ time: '09:00 AM' }, { time: '10:00 AM' }, { time: '11:00 AM' }, { time: '02:00 PM' }, { time: '03:00 PM' }] },
    { day: 'Wednesday', slots: [{ time: '09:00 AM' }, { time: '10:00 AM' }, { time: '11:00 AM' }, { time: '02:00 PM' }, { time: '04:00 PM' }] },
    { day: 'Friday', slots: [{ time: '10:00 AM' }, { time: '11:00 AM' }, { time: '12:00 PM' }, { time: '03:00 PM' }] },
  ];

  const doctors = [];
  for (const d of doctorData) {
    const user = await User.create({
      name: d.name, email: d.email, password: 'doctor123',
      role: 'doctor', phone: '+91-9' + Math.floor(Math.random() * 900000000 + 100000000),
    });
    const profile = await DoctorProfile.create({
      user: user._id,
      specialization: d.specialization,
      experience: d.experience,
      consultationFee: d.fee,
      hospital: d.hospital,
      about: d.about,
      rating: d.rating,
      isApproved: true,
      qualifications: ['MBBS', 'MD'],
      languages: ['English', 'Hindi'],
      availability: availabilityTemplate,
    });
    doctors.push({ user, profile });
  }

  // Create patients
  const patient1 = await User.create({
    name: 'Aarav Kumar', email: 'patient@mediconnect.com', password: 'patient123',
    role: 'patient', phone: '+91-9876543210',
    dateOfBirth: new Date('1990-05-15'), gender: 'male',
    bloodGroup: 'O+', allergies: ['Penicillin', 'Dust'],
    address: 'Bangalore, Karnataka',
  });
  const patient2 = await User.create({
    name: 'Sneha Reddy', email: 'sneha@mediconnect.com', password: 'patient123',
    role: 'patient', phone: '+91-9898989898',
    dateOfBirth: new Date('1995-08-22'), gender: 'female',
    bloodGroup: 'B+', allergies: ['Shellfish'],
  });

  // Create appointments
  await Appointment.create({
    patient: patient1._id, doctor: doctors[0].user._id,
    doctorProfile: doctors[0].profile._id,
    date: new Date('2026-03-20'), timeSlot: '10:00 AM',
    status: 'confirmed', reason: 'Chest pain and shortness of breath',
    paymentStatus: 'paid', paymentAmount: 800,
  });
  await Appointment.create({
    patient: patient1._id, doctor: doctors[2].user._id,
    doctorProfile: doctors[2].profile._id,
    date: new Date('2026-03-18'), timeSlot: '09:00 AM',
    status: 'completed', reason: 'Skin rash on arms',
    notes: 'Mild allergic dermatitis. Prescribed antihistamines.',
    prescription: 'Cetirizine 10mg once daily for 7 days, Calamine lotion for external use.',
    paymentStatus: 'paid', paymentAmount: 600,
  });

  // Create medical records
  await MedicalRecord.create({
    patient: patient1._id, type: 'allergy', title: 'Penicillin Allergy',
    description: 'Severe allergic reaction to penicillin-based antibiotics. Anaphylaxis risk.',
    date: new Date('2020-03-10'), tags: ['allergy', 'antibiotic', 'emergency'],
  });
  await MedicalRecord.create({
    patient: patient1._id, type: 'disease', title: 'Type 2 Diabetes',
    description: 'Diagnosed with Type 2 Diabetes. Currently managed with Metformin 500mg.',
    date: new Date('2022-07-15'), tags: ['diabetes', 'chronic', 'endocrinology'],
  });
  await MedicalRecord.create({
    patient: patient1._id, type: 'prescription', title: 'Metformin Prescription',
    description: 'Metformin 500mg twice daily with meals for diabetes management.',
    date: new Date('2022-07-20'), doctor: doctors[0].user._id, tags: ['diabetes', 'medication'],
  });

  // Create health tips
  const healthTips = [
    { title: '10,000 Steps Daily for Better Health', content: 'Walking 10,000 steps a day can significantly improve cardiovascular health, boost metabolism, and reduce stress. Start with 5,000 steps and gradually increase.', category: 'fitness' },
    { title: 'Power of Mediterranean Diet', content: 'Rich in olive oil, fish, whole grains, and vegetables, the Mediterranean diet reduces risk of heart disease, diabetes, and cognitive decline.', category: 'nutrition' },
    { title: 'Sleep Your Way to Mental Health', content: '7-9 hours of quality sleep dramatically improves mood, cognitive function, and immune response. Maintain a consistent sleep schedule.', category: 'mental-health' },
    { title: 'Hydration: The Overlooked Healer', content: 'Drinking 8-10 glasses of water daily improves kidney function, skin health, digestion, and energy levels.', category: 'general' },
    { title: 'Mindfulness Meditation Benefits', content: 'Even 10 minutes of daily mindfulness meditation reduces anxiety, improves focus, and lowers cortisol (stress hormone) levels.', category: 'mental-health' },
    { title: 'Vitamin D: The Sunshine Vitamin', content: 'Getting 15-20 minutes of morning sunlight provides adequate Vitamin D, which is crucial for bone health, immunity, and mood regulation.', category: 'general' },
    { title: 'Strength Training After 40', content: 'Resistance training 2-3 times per week after age 40 prevents muscle loss, improves bone density, and boosts metabolism.', category: 'fitness' },
    { title: 'Gut Health and Immunity', content: 'A healthy gut microbiome is your immunity foundation. Include probiotics (yogurt, kimchi), prebiotics (bananas, oats) in your daily diet.', category: 'nutrition' },
  ];

  for (const tip of healthTips) {
    await HealthTip.create({ ...tip, author: admin._id, isPublished: true });
  }

  console.log('\n✅ Seed data created successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin:   admin@mediconnect.com / admin123');
  console.log('Doctor:  priya@mediconnect.com / doctor123');
  console.log('Patient: patient@mediconnect.com / patient123\n');
  mongoose.connection.close();
};

seed().catch(console.error);
