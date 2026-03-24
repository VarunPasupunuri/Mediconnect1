/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Activity, Search, AlertTriangle, Stethoscope, ChevronRight, X, Bot, Sparkles, Zap } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'fever', 'cough', 'headache', 'chest pain', 'shortness of breath', 'fatigue',
  'nausea', 'vomiting', 'abdominal pain', 'joint pain', 'skin rash', 'dizziness',
  'sore throat', 'diarrhea', 'anxiety', 'depression', 'insomnia', 'back pain',
];

const SEVERITY_CONFIG = {
  mild:            { bar: 'bg-emerald-500', pct: 25, label: '✅ Mild',          badge: 'badge-green' },
  'mild-moderate': { bar: 'bg-amber-400',  pct: 45, label: '⚠️ Mild–Moderate', badge: 'badge-yellow' },
  moderate:        { bar: 'bg-amber-500',  pct: 60, label: '⚠️ Moderate',      badge: 'badge-yellow' },
  'moderate-high': { bar: 'bg-orange-500', pct: 78, label: '🚨 Mod–High',      badge: 'badge-red' },
  high:            { bar: 'bg-red-500',    pct: 95, label: '🚨 High',          badge: 'badge-red' },
};

const MOCK_CONDITIONS = [
  { condition: 'Common Cold', severity: 'mild', matchScore: 85, specialization: 'General Physician', matchedSymptoms: ['fever', 'cough'], advice: 'Rest and drink plenty of fluids. Try throat lozenges and nasal rinses.' },
  { condition: 'COVID-19', severity: 'moderate-high', matchScore: 78, specialization: 'General Physician', matchedSymptoms: ['fever', 'cough', 'fatigue', 'shortness of breath'], advice: 'Isolate and monitor oxygen levels. Seek emergency care if it drops below 94%.' },
  { condition: 'Migraine', severity: 'moderate', matchScore: 92, specialization: 'Neurologist', matchedSymptoms: ['headache', 'nausea', 'dizziness'], advice: 'Rest in a quiet, dark room. Stay hydrated. Seek care if headache is unusually severe.' },
  { condition: 'Food Poisoning', severity: 'moderate', matchScore: 88, specialization: 'Gastroenterologist', matchedSymptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'], advice: 'Hydrate with ORS. Avoid solid foods initially. Seek care if symptoms persist >48h.' },
  { condition: 'Anxiety Disorder', severity: 'moderate', matchScore: 80, specialization: 'Psychiatrist', matchedSymptoms: ['anxiety', 'chest pain', 'shortness of breath'], advice: 'Try box breathing. Consider speaking to a mental health professional.' },
];

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl w-fit" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
    {[0, 1, 2].map(i => (
      <span key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
    <span className="text-xs text-blue-400 font-semibold ml-2">AI is analyzing…</span>
  </div>
);

const SeverityBar = ({ severity }) => {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.mild;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Severity Level</span>
        <span className={cfg.badge + ' text-[10px]'}>{cfg.label}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className={`h-full rounded-full ${cfg.bar} transition-all duration-1000`} style={{ width: `${cfg.pct}%` }} />
      </div>
    </div>
  );
};

const SymptomChecker = () => {
  const [inputSymptom, setInputSymptom] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSymptom = (s) => {
    const sym = s.trim().toLowerCase();
    if (sym && !selectedSymptoms.includes(sym)) setSelectedSymptoms(prev => [...prev, sym]);
    setInputSymptom('');
  };
  const removeSymptom = (s) => setSelectedSymptoms(prev => prev.filter(x => x !== s));

  const handleCheck = async () => {
    if (selectedSymptoms.length === 0) return toast.error('Add at least one symptom');
    setLoading(true);
    setResults(null);
    try {
      const { data } = await API.post('/symptom-checker', { symptoms: selectedSymptoms });
      setTimeout(() => { setResults(data); setLoading(false); }, 1200);
    } catch {
      const matched = MOCK_CONDITIONS.filter(c => c.matchedSymptoms.some(s => selectedSymptoms.includes(s)));
      setTimeout(() => {
        setResults({
          disclaimer: 'Results based on a rule-based offline dataset. This is NOT a clinical diagnosis.',
          results: matched.length > 0 ? matched : [MOCK_CONDITIONS[0]]
        });
        setLoading(false);
      }, 1800);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden mb-2" style={{ background: 'linear-gradient(135deg,#1d1b4b 0%,#1e2757 50%,#11215c 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: 'rgba(124,58,237,0.25)' }} />
        <div className="absolute -bottom-8 left-10 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(37,99,235,0.2)' }} />
        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">AI Symptom Checker</h1>
            <p className="text-blue-200/60 text-sm">Describe your symptoms and get instant health insights</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/80"><span className="font-bold text-amber-400">Medical Disclaimer:</span> This tool provides general health information only. Always consult a licensed healthcare provider.</p>
      </div>

      {/* Input Card */}
      <div className="rounded-2xl p-6 border space-y-5" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <h3 className="font-bold text-white text-base">Enter Your Symptoms</h3>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Type a symptom (e.g. headache)…"
              value={inputSymptom}
              onChange={e => setInputSymptom(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSymptom(inputSymptom)}
              className="input-field pl-10" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
          </div>
          <button onClick={() => addSymptom(inputSymptom)} className="btn-primary px-5">Add</button>
        </div>

        {/* Chips */}
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map(s => (
              <button key={s} onClick={() => addSymptom(s)} disabled={selectedSymptoms.includes(s)}
                className={`text-xs px-3 py-1.5 rounded-full border font-semibold capitalize transition-all ${selectedSymptoms.includes(s)
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/25'
                  : 'text-slate-500 border-slate-800 hover:border-violet-500/50 hover:text-violet-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Selected */}
        {selectedSymptoms.length > 0 && (
          <div className="p-4 rounded-2xl border" style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Selected ({selectedSymptoms.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-full text-xs font-bold shadow-sm">
                  {s}
                  <button onClick={() => removeSymptom(s)} className="hover:opacity-70 transition-opacity"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleCheck} disabled={loading || selectedSymptoms.length === 0}
          className="btn-primary w-full py-3.5 text-sm justify-center"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>
          {loading
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing…</>
            : <><Sparkles className="w-5 h-5" /> Analyze Symptoms</>}
        </button>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="animate-fadeIn">
          <TypingDots />
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <Bot className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-violet-300/80 italic">{results.disclaimer}</p>
          </div>

          <h2 className="text-xl font-black text-white">Possible Conditions</h2>

          {results.results.map((r, i) => {
            const sevCfg = SEVERITY_CONFIG[r.severity] || SEVERITY_CONFIG.mild;
            return (
              <div key={i} className="rounded-2xl p-5 border animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #7c3aed' }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{r.condition}</h3>
                    <SeverityBar severity={r.severity} />
                  </div>
                  {/* Match score ring */}
                  <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                    <svg className="rotate-[-90deg]" width="56" height="56" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                      <circle cx="28" cy="28" r="22" fill="none" stroke="url(#matchGrad)" strokeWidth="5"
                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 22}
                        strokeDashoffset={(1 - r.matchScore / 100) * 2 * Math.PI * 22} />
                      <defs>
                        <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-white">{r.matchScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(37,99,235,0.06)', borderColor: 'rgba(37,99,235,0.15)' }}>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> See a</p>
                    <p className="text-sm font-bold text-slate-100">{r.specialization}</p>
                  </div>
                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Matching Symptoms</p>
                    <p className="text-xs text-slate-400 capitalize">{r.matchedSymptoms.join(', ')}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">💡 Advice</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{r.advice}</p>
                </div>
                <Link to="/doctors" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
                  Find {r.specialization} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
