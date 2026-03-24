import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Patient Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Doctors from './pages/Doctors/Doctors';
import DoctorDetail from './pages/Doctors/DoctorDetail';
import Appointments from './pages/Appointments/Appointments';
import BookAppointment from './pages/Appointments/BookAppointment';
import MedicalHistory from './pages/MedicalHistory/MedicalHistory';
import SymptomChecker from './pages/SymptomChecker/SymptomChecker';
import DietPlan from './pages/DietPlan/DietPlan';
import MedicineScanner from './pages/MedicineScanner/MedicineScanner';
import Reminders from './pages/Reminders/Reminders';
import HealthTips from './pages/HealthTips/HealthTips';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

// Admin Pages
import AdminPanel from './pages/Admin/AdminPanel';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Patient Routes */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/book/:doctorId" element={<BookAppointment />} />
        <Route path="medical-history" element={<MedicalHistory />} />
        <Route path="symptom-checker" element={<SymptomChecker />} />
        <Route path="diet-plan" element={<DietPlan />} />
        <Route path="medicine-scanner" element={<MedicineScanner />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="health-tips" element={<HealthTips />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        {/* Doctor Routes */}
        <Route path="doctor" element={<RoleRoute roles={['doctor']}><DoctorDashboard /></RoleRoute>} />
        {/* Admin Routes */}
        <Route path="admin" element={<RoleRoute roles={['admin']}><AdminPanel /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontSize: '14px' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
