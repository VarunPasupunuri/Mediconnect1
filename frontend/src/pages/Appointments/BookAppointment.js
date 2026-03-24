import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, CreditCard, User, CheckCircle } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM',
];

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');

  useEffect(() => {
    API.get(`/doctors/${doctorId}`).then(({ data }) => setDoctor(data.doctor)).catch(() => {
      // Mock Doctor if backend is down
      setDoctor({
        user: { _id: doctorId || 'mock-doc', name: 'Dr. Sarah (Offline Demo)' },
        specialization: 'General Physician',
        hospital: 'MediConnect Demo Clinic',
        consultationFee: 500
      });
    });
  }, [doctorId]);

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/appointments', {
        doctorId: doctor?.user?._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
      });
      if (paymentMode === 'online') {
        await API.put(`/appointments/${data.appointment._id}/payment`);
      }
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      console.warn('Backend unavailable, booking offline');
      const localAppts = JSON.parse(localStorage.getItem('mediconnect_appointments')) || [];
      const newAppt = {
        _id: Date.now().toString(),
        doctor: doctor.user || { name: 'Dr. Unknown' },
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
        status: 'pending',
        paymentStatus: paymentMode === 'online' ? 'paid' : 'pending'
      };
      localStorage.setItem('mediconnect_appointments', JSON.stringify([newAppt, ...localAppts]));
      toast.success('Appointment booked offline!');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  // Get next 14 days
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      dates.push(d);
    }
    return dates;
  };

  if (!doctor) return (
    <div className="page-container flex justify-center items-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="page-container max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Appointment</h1>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {['Date & Time', 'Reason', 'Payment'].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Doctor Info */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
          {doctor.user?.name?.[3] || doctor.user?.name?.[0]}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">{doctor.user?.name}</h2>
          <p className="text-sm text-blue-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.hospital}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-400">Consultation</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₹{doctor.consultationFee}</p>
        </div>
      </div>

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <div className="card p-5 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Select Date
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {getAvailableDates().map((d) => {
              const val = d.toISOString().split('T')[0];
              return (
                <button
                  key={val}
                  onClick={() => setSelectedDate(val)}
                  className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[64px] ${
                    selectedDate === val
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                  }`}
                >
                  <span className="text-xs font-medium">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                  <span className="text-lg font-bold">{d.getDate()}</span>
                  <span className="text-xs">{d.toLocaleDateString('en', { month: 'short' })}</span>
                </button>
              );
            })}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Select Time Slot
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                  selectedSlot === slot
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={() => step === 1 && (selectedDate && selectedSlot ? setStep(2) : toast.error('Select date and time'))}
            className="btn-primary w-full"
          >
            Next: Add Reason
          </button>
        </div>
      )}

      {/* Step 2: Reason */}
      {step === 2 && (
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Visit Reason (Optional)
          </h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your symptoms or reason for visit..."
            className="input-field min-h-[120px] resize-none"
          />
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm">
            <p className="font-semibold text-gray-800 dark:text-white mb-2">Appointment Summary</p>
            <p className="text-gray-600 dark:text-gray-400">📅 {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-gray-600 dark:text-gray-400">⏰ {selectedSlot}</p>
            <p className="text-gray-600 dark:text-gray-400">💰 Fee: ₹{doctor.consultationFee}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Proceed to Payment</button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" /> Payment
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'online', label: '💳 Pay Online', sub: 'UPI / Card / Netbanking' },
              { id: 'cash', label: '💵 Pay at Clinic', sub: 'Pay during visit' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMode(m.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMode === m.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="font-semibold text-sm text-gray-800 dark:text-white">{m.label}</p>
                <p className="text-xs text-gray-500">{m.sub}</p>
              </button>
            ))}
          </div>

          {paymentMode === 'online' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Details (Demo)</p>
              <input type="text" placeholder="4242 4242 4242 4242" className="input-field" defaultValue="4242 4242 4242 4242" readOnly />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/YY" className="input-field" defaultValue="12/26" readOnly />
                <input type="text" placeholder="CVV" className="input-field" defaultValue="123" readOnly />
              </div>
            </div>
          )}

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-gray-800 dark:text-white">Total Amount</span>
            <span className="text-xl font-bold text-green-600">₹{doctor.consultationFee}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button onClick={handleBook} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? 'Processing...' : (
                <><CheckCircle className="w-4 h-4" /> Confirm Booking</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
