import React, { useState, useRef } from 'react';
import { Camera, Search, Scan, Pill, AlertTriangle, CheckCircle, Info, UploadCloud, X, Zap, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MOCK_RESULT = {
  name: "Amoxicillin 500mg",
  genericName: "Amoxicillin Trihydrate",
  type: "Antibiotic (Penicillin class)",
  uses: ["Bacterial infections", "Pneumonia", "Bronchitis", "Ear infections"],
  sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Rash"],
  instructions: "Take with food to minimize stomach upset. Complete entire course.",
  warnings: [
    "Do not take if allergic to penicillin",
    "May decrease effectiveness of oral contraceptives"
  ]
};

const MedicineScanner = () => {
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const startScan = (src) => {
    setScanning(true);
    setResult(null);
    // Simulate API delay
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setScanning(false);
      if (!src) setQuery(''); // clear text query if it's an image scan
    }, 2500);
  };

  const handleTextSearch = () => {
    if (!query) return toast.error('Enter a medicine name');
    setImage(null);
    startScan('text');
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file.');
    }
    const url = URL.createObjectURL(file);
    setImage(url);
    setQuery('');
    startScan('image');
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    setScanning(false);
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-5 shadow-xl shadow-blue-500/20 relative" style={{ transform: 'rotate(10deg)' }}>
          <div className="absolute inset-0 border border-white/20 rounded-3xl" />
          <Scan className="w-8 h-8 text-white" style={{ transform: 'rotate(-10deg)' }} />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Medicine Scanner</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Take a photo, upload an image, or type the prescription name to instantly identify medications.</p>
      </motion.div>

      {/* Main Scanner/Uploader Zone */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10"
      >
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="uploader"
              exit={{ opacity: 0, scale: 0.95 }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative rounded-3xl p-8 border-2 border-dashed transition-all duration-300 overflow-hidden group ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700/60 bg-slate-900/50 hover:border-slate-600'}`}
              style={{ backdropFilter: 'blur(16px)' }}
            >
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[80px] pointer-events-none rounded-full" />

              <div className="flex flex-col items-center justify-center text-center relative z-10 py-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <UploadCloud className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Upload or drop image</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">Supports JPG, PNG. Snap a clear photo of the medicine box or strip.</p>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none btn-secondary">
                    <ImageIcon className="w-4 h-4" /> Browse Files
                  </button>
                  <button onClick={() => cameraInputRef.current?.click()} className="flex-1 sm:flex-none btn-primary shadow-[0_0_16px_rgba(37,99,235,0.4)]">
                    <Camera className="w-4 h-4" /> Take Photo
                  </button>

                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => processFile(e.target.files?.[0])} />
                  {/* Capture="environment" attempts to force rear camera on mobile */}
                  <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={e => processFile(e.target.files?.[0])} />
                </div>

                <div className="w-full flex items-center gap-4 my-8 opacity-60">
                  <span className="h-px bg-slate-700 flex-1" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">OR</span>
                  <span className="h-px bg-slate-700 flex-1" />
                </div>

                <div className="w-full max-w-md relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Type medicine name manually..." 
                      value={query} 
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTextSearch()}
                      className="w-full h-12 pl-11 pr-4 rounded-xl text-white placeholder:text-slate-500 font-medium transition-all bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                    />
                  </div>
                  <button onClick={handleTextSearch} className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <button 
                onClick={clearImage}
                disabled={scanning}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-video sm:aspect-[21/9] w-full flex items-center justify-center bg-black/50 overflow-hidden">
                <img src={image} alt="Medicine" className={`w-full h-full object-contain transition-opacity duration-300 ${scanning ? 'opacity-50 blur-[2px]' : 'opacity-100'}`} />
                
                {/* Simulated AI Scanning Laser */}
                {scanning && (
                  <>
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-20"
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "98%", "0%"] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                      <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-sm font-bold text-white tracking-widest uppercase">AI is Analyzing</span>
                        <div className="flex gap-1">
                          {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Section */}
      {scanning && !image && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-sm font-bold text-blue-400">Searching global database...</span>
          </div>
        </div>
      )}

      {result && !scanning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-3xl p-6 border relative overflow-hidden glass z-10" style={{ background: 'linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,58,138,0.2))', borderColor: 'rgba(59,130,246,0.3)' }}>
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl bg-blue-600/20 pointer-events-none" />
            
            <div className="flex items-start gap-5 mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
                <Pill className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white tracking-tight">{result.name}</h2>
                <p className="text-blue-300/80 font-medium mt-1">{result.genericName}</p>
                <span className="inline-block mt-3 text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest">{result.type}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="p-5 rounded-2xl border bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Primary Uses</h3>
                <ul className="space-y-2">
                  {result.uses.map((u, i) => <li key={i} className="text-slate-300 text-sm flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgb(16,185,129)]" /> {u}</li>)}
                </ul>
              </div>

              <div className="p-5 rounded-2xl border bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Side Effects</h3>
                <ul className="space-y-2">
                  {result.sideEffects.map((s, i) => <li key={i} className="text-amber-200/90 text-sm flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgb(245,158,11)]" /> {s}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-4 p-5 rounded-2xl border flex items-start gap-4 bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10 transition-colors relative z-10">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Instructions</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed">{result.instructions}</p>
              </div>
            </div>

            <div className="mt-4 p-5 rounded-2xl border bg-red-500/5 border-red-500/10 hover:bg-red-500/10 transition-colors relative z-10">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Important Warnings</h3>
              <ul className="space-y-2 text-red-200/90 text-sm">
                {result.warnings.map((w, i) => <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgb(239,68,68)]" />{w}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MedicineScanner;
