import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { Star, MapPin, Briefcase, Globe, Calendar, Award, Navigation } from 'lucide-react';
import { MOCK_DOCTORS } from './Doctors';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          API.get(`/doctors/${id}`),
          API.get(`/reviews/${doctor?.user?._id || ''}`),
        ]);
        setDoctor(docRes.data.doctor);
        setReviews(revRes.data.reviews || []);
      } catch {
        console.warn('Backend unavailable, using local mock data');
        const mockDoc = MOCK_DOCTORS.find(d => d._id === id) || MOCK_DOCTORS[0];
        setDoctor(mockDoc);
        setReviews([
          { _id: 'r1', patient: { name: 'John Doe' }, rating: 5, comment: 'Excellent doctor! Very attentive and caring.' },
          { _id: 'r2', patient: { name: 'Jane Smith' }, rating: 4, comment: 'Good experience, but had to wait 15 mins.' }
        ]);
      }
      finally { setLoading(false); }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <div className="page-container flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
  if (!doctor) return <div className="page-container text-center text-gray-500">Doctor not found</div>;

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));

  return (
    <div className="page-container">
      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {doctor.user?.name?.[3] || doctor.user?.name?.[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{doctor.user?.name}</h1>
                <p className="text-blue-600 font-semibold">{doctor.specialization}</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(doctor.rating)}
                  <span className="text-sm text-gray-500 ml-1">{doctor.rating} ({doctor.totalReviews} reviews)</span>
                </div>
              </div>
              <Link
                to={`/appointments/book/${id}`}
                className="btn-primary flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 col-span-2 sm:col-span-3">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /> 
                <div>
                  <p className="font-semibold">{doctor.hospital}</p>
                  {doctor.address && <p className="text-xs mt-0.5">{doctor.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4 text-blue-500" /> {doctor.experience} yrs experience
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe className="w-4 h-4 text-blue-500" /> {doctor.languages?.join(', ') || 'English, Hindi'}
              </div>
              {doctor.lat && doctor.lng && (
                <div className="col-span-2 sm:col-span-3 mt-2">
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${doctor.lat},${doctor.lng}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-xl font-semibold text-sm transition-colors border border-blue-200 dark:border-blue-800 w-fit"
                  >
                    <Navigation className="w-4 h-4" /> Get Directions via Google Maps
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        {doctor.about && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.about}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Qualifications */}
        <div className="card p-5">
          <h2 className="section-header mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Qualifications
          </h2>
          <div className="space-y-2">
            {doctor.qualifications?.map((q, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{i + 1}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{q}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Consultation Fee</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{doctor.consultationFee}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="section-header mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Availability
          </h2>
          <div className="space-y-3">
            {doctor.availability?.map((day) => (
              <div key={day.day} className="flex items-start gap-3">
                <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0 pt-1">{day.day}</span>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <span
                      key={slot.time}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                        slot.isBooked
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-500 line-through'
                          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {(!doctor.availability || doctor.availability.length === 0) && (
              <p className="text-sm text-gray-400">No availability set by doctor.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card p-5">
        <h2 className="section-header mb-4">Patient Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {r.patient?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">{r.patient?.name}</p>
                    <div className="flex">{renderStars(r.rating)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetail;
