/* eslint-disable */
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FileText, UploadCloud, File, Trash2, Calendar, Download, Eye, Stethoscope } from 'lucide-react';

const MOCK_RECORDS = [
  { _id: 'r1', title: 'Annual Blood Test Report', type: 'Lab Result', date: '2023-11-15', doctor: 'Dr. Sarah Jenkins', fileUrl: '#' },
  { _id: 'r2', title: 'Chest X-Ray', type: 'Imaging', date: '2023-08-22', doctor: 'Dr. Michael Chen', fileUrl: '#' },
  { _id: 'r3', title: 'Vaccination Certificate', type: 'Prescription', date: '2023-01-10', doctor: 'General Clinic', fileUrl: '#' },
];

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/medical-history');
        setRecords(data.records || []);
      } catch {
        const local = JSON.parse(localStorage.getItem('mediconnect_history')) || MOCK_RECORDS;
        setRecords(local);
        localStorage.setItem('mediconnect_history', JSON.stringify(local));
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    // Simulating upload
    setTimeout(() => {
      const newRec = { _id: Date.now().toString(), title: file.name, type: 'Document', date: new Date().toISOString().split('T')[0], doctor: 'Self Uploaded', fileUrl: '#' };
      const updated = [newRec, ...records];
      setRecords(updated);
      localStorage.setItem('mediconnect_history', JSON.stringify(updated));
      setUploading(false);
      toast.success('Document uploaded successfully!');
    }, 1500);
  };

  const handleDelete = (id) => {
    const updated = records.filter(r => r._id !== id);
    setRecords(updated);
    localStorage.setItem('mediconnect_history', JSON.stringify(updated));
    toast.success('Document deleted');
  };

  const getTypeColor = (type) => {
    if (type.includes('Lab')) return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (type.includes('Imaging')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  return (
    <div className="page-container max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Medical History</h1>
            <p className="text-slate-500 text-sm">Securely store and manage your health records</p>
          </div>
        </div>
        
        {/* Upload Zone */}
        <div className="relative">
          <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={uploading} accept=".pdf,.jpg,.jpeg,.png" />
          <label htmlFor="file-upload" className={`btn-primary py-2.5 px-5 cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><UploadCloud className="w-4 h-4" /> Upload Record</>}
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-2xl border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <File className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">You haven't uploaded any medical records yet. Keep all your prescriptions and lab reports in one secure place.</p>
          <label htmlFor="file-upload" className="btn-secondary cursor-pointer border border-slate-700">Upload Your First Record</label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((r, i) => (
            <div key={r._id} className="group rounded-2xl p-5 border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden" 
              style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-violet-500 to-blue-500 pointer-events-none" />
              
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-2 ${getTypeColor(r.type)}`}>{r.type}</span>
                  <h3 className="font-bold text-slate-100 text-sm truncate" title={r.title}>{r.title}</h3>
                </div>
                <button onClick={() => handleDelete(r._id)} className="p-2 -mr-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-5 flex-1 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" /> {r.date}
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" /> <span className="truncate">{r.doctor}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn-ghost py-2 text-xs flex-1 justify-center border border-slate-700 bg-slate-800/40 hover:bg-slate-800">
                  <Eye className="w-3.5 h-3.5" /> View
                </a>
                <a href={r.fileUrl} download className="btn-secondary py-2 text-xs flex-1 justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
