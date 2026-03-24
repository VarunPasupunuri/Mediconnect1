/* eslint-disable */
import React, { useState } from 'react';
import { Utensils, Droplets, Flame, Apple, Coffee, Moon, Sun, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_PLAN = {
  calories: 2100,
  water: 2.5,
  protein: 120,
  carbs: 250,
  fats: 65,
  meals: {
    breakfast: { time: '08:00 AM', items: ['Oatmeal with berries', '2 Boiled eggs', 'Green tea'], status: 'completed' },
    lunch: { time: '01:00 PM', items: ['Grilled chicken breast', 'Quinoa salad', 'Greek yogurt'], status: 'pending' },
    snacks: { time: '04:30 PM', items: ['Handful of almonds', 'Apple'], status: 'pending' },
    dinner: { time: '08:00 PM', items: ['Baked salmon', 'Steamed broccoli', 'Sweet potato mash'], status: 'pending' }
  }
};

const MacroCard = ({ icon: Icon, label, value, unit, color, pct, bg }) => (
  <div className="rounded-2xl p-5 border relative overflow-hidden group" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${bg} group-hover:opacity-40 transition-opacity`} />
    <div className="flex items-center gap-4 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} border border-white/10`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-white">{value} <span className="text-xs font-medium text-slate-400">{unit}</span></p>
      </div>
    </div>
    {/* Progress bar */}
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className={`h-full rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const DietPlan = () => {
  const [plan, setPlan] = useState(MOCK_PLAN);

  const toggleMeal = (mealKey) => {
    setPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealKey]: {
          ...prev.meals[mealKey],
          status: prev.meals[mealKey].status === 'completed' ? 'pending' : 'completed'
        }
      }
    }));
    toast.success('Meal status updated');
  };

  const completedCount = Object.values(plan.meals).filter(m => m.status === 'completed').length;
  const totalMeals = Object.keys(plan.meals).length;

  return (
    <div className="page-container max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg,#052e16 0%,#064e3b 50%,#0f766e 100%)' }}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-40 bg-emerald-500" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <Utensils className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <p className="text-emerald-200/70 text-sm font-bold uppercase tracking-widest mb-1">Daily Plan</p>
              <h1 className="text-3xl font-black text-white tracking-tight">Keto Reset Phase 1</h1>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-6 text-center">
            <div>
              <p className="text-xs text-emerald-200/60 uppercase font-bold tracking-wider mb-1">Calories</p>
              <p className="text-2xl font-black text-white">{plan.calories}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-xs text-emerald-200/60 uppercase font-bold tracking-wider mb-1">Water</p>
              <p className="text-2xl font-black text-white">{plan.water}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <h2 className="text-lg font-bold text-white mb-4">Macronutrients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MacroCard icon={Flame} label="Protein" value={plan.protein} unit="g" color="text-rose-400" pct={65} bg="bg-rose-500/10" />
        <MacroCard icon={Utensils} label="Carbs" value={plan.carbs} unit="g" color="text-amber-400" pct={40} bg="bg-amber-500/10" />
        <MacroCard icon={Droplets} label="Fats" value={plan.fats} unit="g" color="text-yellow-400" pct={80} bg="bg-yellow-500/10" />
      </div>

      {/* Meal Schedule */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Today's Meals</h2>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {completedCount} of {totalMeals} Completed
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(plan.meals).map(([key, meal], i) => {
          const isCompleted = meal.status === 'completed';
          const iconMap = { breakfast: Sun, lunch: Coffee, snacks: Apple, dinner: Moon };
          const Icon = iconMap[key] || Utensils;

          return (
            <div key={key} className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg ${isCompleted ? 'opacity-70' : 'hover:-translate-y-1'}`}
              style={{ background: isCompleted ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.02)', borderColor: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.06)' }}>
              
              <div className="flex items-center gap-4 sm:w-48 flex-shrink-0 border-r" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white capitalize">{key}</h3>
                  <p className="text-xs font-bold text-slate-500">{meal.time}</p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <ul className="space-y-1.5 list-inside">
                  {meal.items.map((item, j) => (
                    <li key={j} className={`text-sm flex items-start gap-2 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => toggleMeal(key)}
                className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600' : 'bg-transparent text-slate-500 border-slate-700 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10'}`}>
                <Check className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DietPlan;
