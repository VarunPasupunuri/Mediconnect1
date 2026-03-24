import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Search, Star, MapPin, Briefcase, ChevronRight, Filter, Award, Navigation } from 'lucide-react';

const SPECIALIZATIONS = [
  'All', 'General Physician', 'Cardiologist', 'Neurologist', 'Dermatologist',
  'Orthopedist', 'Pediatrician', 'Psychiatrist', 'Gynecologist', 'Gastroenterologist',
];

const SPEC_COLORS = {
  'Cardiologist': { from: 'from-red-500', to: 'to-rose-600', bg: 'bg-red-500/10', text: 'text-red-400' },
  'Neurologist': { from: 'from-purple-500', to: 'to-violet-600', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'Dermatologist': { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'General Physician': { from: 'from-blue-500', to: 'to-indigo-600', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Pediatrician': { from: 'from-amber-400', to: 'to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'Psychiatrist': { from: 'from-indigo-500', to: 'to-blue-600', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  'Orthopedist': { from: 'from-teal-500', to: 'to-cyan-600', bg: 'bg-teal-500/10', text: 'text-teal-400' },
  'Gynecologist': { from: 'from-fuchsia-500', to: 'to-pink-600', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
  'Gastroenterologist': { from: 'from-green-500', to: 'to-emerald-600', bg: 'bg-green-500/10', text: 'text-green-400' },
};

export const MOCK_DOCTORS = [
  { _id: 'mock-doc-1', user: { name: 'Dr. Sarah Jenkins' }, specialization: 'Cardiologist', rating: 4.8, totalReviews: 124, hospital: 'City Heart Center', experience: 12, consultationFee: 800, about: 'Expert in heart failure and rhythm disorders.', available: true, lat: 17.4120, lng: 78.4350, address: 'Banjara Hills, Hyderabad' },
  { _id: 'mock-doc-2', user: { name: 'Dr. Michael Chen' }, specialization: 'General Physician', rating: 4.5, totalReviews: 89, hospital: 'MediCare Clinic', experience: 8, consultationFee: 500, about: 'Friendly GP for all basic healthcare needs.', available: true, lat: 17.4401, lng: 78.3489, address: 'Gachibowli, Hyderabad' },
  { _id: 'mock-doc-3', user: { name: 'Dr. Emily Patel' }, specialization: 'Dermatologist', rating: 4.9, totalReviews: 210, hospital: 'SkinTone Care', experience: 15, consultationFee: 1000, about: 'Expert in complex skin conditions and cosmetic treatments.', available: false, lat: 17.4300, lng: 78.4000, address: 'Jubilee Hills, Hyderabad' },
  { _id: 'mock-doc-4', user: { name: 'Dr. Robert Smith' }, specialization: 'Neurologist', rating: 4.7, totalReviews: 145, hospital: 'Brain & Spine Institute', experience: 20, consultationFee: 1500, about: 'Leading expert in migraines, epilepsy, neuropathy.', available: true, lat: 17.4500, lng: 78.3800, address: 'Madhapur, Hyderabad' },
  { _id: 'mock-doc-5', user: { name: 'Dr. Anita Desai' }, specialization: 'Pediatrician', rating: 4.6, totalReviews: 320, hospital: 'Happy Kids Hospital', experience: 10, consultationFee: 600, about: 'Compassionate pediatric care from newborns to teens.', available: true, lat: 17.4000, lng: 78.4500, address: 'Ameerpet, Hyderabad' },
];

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-slate-700'}`} />
    ))}
  </div>
);

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (specialization !== 'All') params.append('specialization', specialization);
        if (search) params.append('search', search);
        const { data } = await API.get(`/doctors?${params}`);
        setDoctors(data.doctors || []);
      } catch {
        let filtered = MOCK_DOCTORS;
        if (specialization !== 'All') filtered = filtered.filter(d => d.specialization === specialization);
        if (search) { const s = search.toLowerCase(); filtered = filtered.filter(d => d.user.name.toLowerCase().includes(s) || d.hospital.toLowerCase().includes(s)); }
        setDoctors(filtered);
      } finally { setLoading(false); }
    };
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [search, specialization]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Find Doctors</h1>
          <p className="text-slate-500 text-sm mt-0.5">Verified specialists — {doctors.length} available</p>
        </div>
        <div className="badge-green text-xs font-bold py-1.5 px-3 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 inline-block animate-pulse" />
          Live availability
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 border space-y-3" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search by name or hospital..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select value={specialization} onChange={e => setSpecialization(e.target.value)}
              className="input-field pl-10 pr-8 w-full sm:w-56 appearance-none" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}>
              {SPECIALIZATIONS.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
            </select>
          </div>
        </div>
        {/* Specialty pills */}
        <div className="flex gap-2 flex-wrap">
          {SPECIALIZATIONS.slice(0, 8).map(s => {
            const active = specialization === s;
            return (
              <button key={s} onClick={() => setSpecialization(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-700" />
          <p className="text-slate-400 text-sm">No doctors found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc, idx) => {
            const colors = SPEC_COLORS[doc.specialization] || { from: 'from-blue-500', to: 'to-indigo-600', bg: 'bg-blue-500/10', text: 'text-blue-400' };
            return (
              <div key={doc._id} className="group rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${colors.from} ${colors.to}`}
                  style={{ opacity: 0 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.04'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'} />

                {/* Top – avatar + info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center text-white text-xl font-black`}>
                      {doc.user?.name?.[4] || doc.user?.name?.[0]}
                    </div>
                    {/* Availability dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-900 ${doc.available !== false ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-100 truncate text-sm">{doc.user?.name}</h3>
                    <span className={`text-xs font-bold ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>{doc.specialization}</span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Stars rating={doc.rating} />
                      <span className="text-xs text-slate-500">({doc.totalReviews})</span>
                    </div>
                  </div>
                  {doc.rating >= 4.8 && <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{doc.hospital}{doc.address ? `, ${doc.address}` : ''}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 flex-shrink-0" /><span>{doc.experience} yrs experience</span>
                    </div>
                    {doc.lat && doc.lng && (
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`, '_blank'); }}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                      >
                        <Navigation className="w-3 h-3" /> Directions
                      </button>
                    )}
                  </div>
                </div>

                {/* Fee + CTAs */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Fee</p>
                    <p className="text-base font-black text-white">₹{doc.consultationFee}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/doctors/${doc._id}`} className="btn-ghost py-2 px-3 text-xs border border-slate-700">View</Link>
                    <Link to={`/appointments/book/${doc._id}`} className="btn-primary py-2 px-3 text-xs">
                      Book <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Doctors;
