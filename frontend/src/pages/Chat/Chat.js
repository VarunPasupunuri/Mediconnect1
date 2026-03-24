/* eslint-disable */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';

const MOCK_CONTACTS = [
  { id: '1', name: 'Dr. Sarah Jenkins', role: 'Cardiologist', unread: 2, online: true, lastMsg: 'Your test results look good.' },
  { id: '2', name: 'Dr. Michael Chen', role: 'General Physician', unread: 0, online: false, lastMsg: 'Please schedule a follow-up.' },
  { id: '3', name: 'Dr. Anita Desai', role: 'Pediatrician', unread: 0, online: true, lastMsg: 'You can give him paracetamol.' },
];

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'doctor', text: 'Hello! How are you feeling today?', time: '10:00 AM', status: 'read' },
  { id: 'm2', sender: 'patient', text: 'Hi Dr. Jenkins. The chest pain has reduced, but I still feel a bit tired.', time: '10:05 AM', status: 'read' },
  { id: 'm3', sender: 'doctor', text: 'That is expected with the new medication. Make sure you are resting well.', time: '10:15 AM', status: 'read' },
  { id: 'm4', sender: 'doctor', text: 'Your recent blood work results look completely normal. No need to worry.', time: '11:30 AM', status: 'sent' },
];

const Chat = () => {
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: user?.role === 'doctor' ? 'doctor' : 'patient', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' };
    setMessages([...messages, newMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString() + '1', sender: user?.role === 'doctor' ? 'patient' : 'doctor', text: 'I received your message. I will check and get back to you shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' }]);
    }, 2000);
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <div className="page-container h-[calc(100vh-6rem)] animate-fadeIn">
      <div className="flex h-full rounded-3xl overflow-hidden border" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)' }}>
        
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-black text-white mb-4">Messages</h2>
            <div className="relative">
              <input type="text" placeholder="Search conversations..." className="w-full text-sm pl-4 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium text-white placeholder-slate-500"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {MOCK_CONTACTS.map(c => {
              const active = c.id === activeContact.id;
              return (
                <div key={c.id} onClick={() => setActiveContact(c)} 
                  className={`p-4 border-b cursor-pointer transition-all hover:bg-white/5 flex items-center gap-3 ${active ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  style={{ borderColor: active ? '#3b82f6' : 'rgba(255,255,255,0.02)' }}>
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {c.name[0]}
                    </div>
                    {c.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`font-bold text-sm truncate ${active ? 'text-blue-400' : 'text-slate-200'}`}>{c.name}</h3>
                      <span className="text-[10px] text-slate-500 font-bold">12:30 PM</span>
                    </div>
                    <p className={`text-xs truncate ${c.unread > 0 ? 'text-white font-semibold' : 'text-slate-500'}`}>{c.lastMsg}</p>
                  </div>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black justify-self-end text-white">{c.unread}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Top Bar */}
          <div className="h-20 px-6 border-b flex items-center justify-between pb-2 bg-slate-900/50 backdrop-blur-md z-10" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                {activeContact.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">{activeContact.name}</h3>
                <p className="text-xs text-blue-400 font-semibold">{activeContact.role} {activeContact.online ? '• Online' : ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><Video className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 flex flex-col">
            <div className="text-center my-4"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full">Today</span></div>
            {messages.map((m) => {
              const myMsg = m.sender === (isDoctor ? 'doctor' : 'patient');
              return (
                <div key={m.id} className={`flex max-w-[75%] ${myMsg ? 'self-end bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'self-start bg-slate-800 border border-slate-700 text-slate-200'} rounded-2xl px-5 py-3 relative group`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <div className={`flex items-center gap-1.5 mt-1 ${myMsg ? 'justify-end text-blue-200' : 'justify-start text-slate-500'} text-[10px] font-bold`}>
                    {m.time}
                    {myMsg && (m.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-blue-300" /> : <Check className="w-3.5 h-3.5" />)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t z-10" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <button type="button" className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"><Paperclip className="w-5 h-5" /></button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." 
                className="flex-1 bg-slate-800/50 text-sm text-white px-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all font-medium placeholder-slate-500" />
              <button type="button" className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"><Smile className="w-5 h-5" /></button>
              <button type="button" className="p-2.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-colors"><ImageIcon className="w-5 h-5" /></button>
              <button type="submit" disabled={!input.trim()} className="ml-2 w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-500/30">
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
