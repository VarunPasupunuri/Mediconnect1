const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock medicine database
const medicineDB = [
  {
    name: 'paracetamol',
    aliases: ['acetaminophen', 'tylenol', 'crocin', 'dolo'],
    uses: 'Fever, mild to moderate pain relief (headache, toothache, muscle ache, cold)',
    dosage: 'Adults: 500mg–1g every 4–6 hours. Max 4g/day. Children: 10–15mg/kg every 4–6 hours.',
    sideEffects: 'Rare at normal doses. Overdose can cause serious liver damage.',
    warnings: 'Do not exceed the recommended dose. Avoid alcohol. Consult a doctor if symptoms persist.',
    category: 'Analgesic / Antipyretic',
  },
  {
    name: 'ibuprofen',
    aliases: ['advil', 'brufen', 'nurofen', 'combiflam'],
    uses: 'Pain relief, fever, anti-inflammatory (arthritis, muscle pain, menstrual cramps)',
    dosage: 'Adults: 200–400mg every 4–6 hours with food. Max 1200mg/day without prescription.',
    sideEffects: 'Stomach upset, nausea, dizziness, increased blood pressure (with long-term use).',
    warnings: 'Avoid on empty stomach. Not recommended in late pregnancy. Avoid if you have kidney issues.',
    category: 'NSAID / Anti-inflammatory',
  },
  {
    name: 'amoxicillin',
    aliases: ['amoxil', 'trimox', 'moxatag'],
    uses: 'Bacterial infections (ear, throat, urinary tract, skin, pneumonia)',
    dosage: 'Adults: 250–500mg every 8 hours or 500–875mg every 12 hours. Complete full course.',
    sideEffects: 'Diarrhea, nausea, rash, allergic reactions in penicillin-sensitive individuals.',
    warnings: 'Always complete the antibiotic course. Avoid if allergic to penicillin. Prescription required.',
    category: 'Antibiotic (Penicillin class)',
  },
  {
    name: 'metformin',
    aliases: ['glucophage', 'glycomet', 'fortamet'],
    uses: 'Type 2 diabetes management — controls blood sugar levels',
    dosage: 'Adults: Start 500mg twice daily with meals. Increase gradually. Max 2000–2550mg/day.',
    sideEffects: 'Nausea, diarrhea, stomach upset (usually temporary). Rarely: lactic acidosis.',
    warnings: 'Monitor kidney function regularly. Avoid alcohol. Do not use if kidney/liver disease. Prescription required.',
    category: 'Antidiabetic (Biguanide)',
  },
  {
    name: 'omeprazole',
    aliases: ['prilosec', 'losec', 'omez', 'pantoprazole'],
    uses: 'Acid reflux (GERD), stomach ulcers, heartburn, H. pylori infection',
    dosage: 'Adults: 20–40mg once daily before breakfast. Duration varies by condition.',
    sideEffects: 'Headache, nausea, diarrhea, stomach pain. Long-term: low magnesium/B12 levels.',
    warnings: 'Not for immediate heartburn relief. Consult doctor for use beyond 14 days.',
    category: 'Proton Pump Inhibitor (PPI)',
  },
  {
    name: 'cetirizine',
    aliases: ['zyrtec', 'reactine', 'cetzine', 'alerid'],
    uses: 'Allergies, hay fever, allergic rhinitis, urticaria (hives), itching',
    dosage: 'Adults: 10mg once daily. Children (6–12): 5mg twice daily or 10mg once daily.',
    sideEffects: 'Drowsiness, dry mouth, fatigue, headache.',
    warnings: 'May cause drowsiness — avoid driving. Caution with alcohol. Safe for most adults.',
    category: 'Antihistamine',
  },
  {
    name: 'atorvastatin',
    aliases: ['lipitor', 'atorlip', 'torvast'],
    uses: 'High cholesterol, prevention of cardiovascular disease',
    dosage: 'Adults: 10–80mg once daily (usually at night). Dose adjusted by doctor.',
    sideEffects: 'Muscle pain, nausea, headache, elevated liver enzymes.',
    warnings: 'Regular liver and muscle function tests needed. Avoid grapefruit juice. Prescription required.',
    category: 'Statin / Cholesterol-lowering',
  },
  {
    name: 'amlodipine',
    aliases: ['norvasc', 'amlip', 'stamlo', 'amlong'],
    uses: 'High blood pressure (hypertension), angina (chest pain)',
    dosage: 'Adults: 5–10mg once daily. Elderly: Start at 2.5mg.',
    sideEffects: 'Ankle swelling, flushing, dizziness, headache, palpitations.',
    warnings: 'Do not stop abruptly. Monitor blood pressure regularly. Prescription required.',
    category: 'Calcium Channel Blocker / Antihypertensive',
  },
  {
    name: 'azithromycin',
    aliases: ['zithromax', 'zithrox', 'azee', 'z-pack'],
    uses: 'Bacterial infections — respiratory, ear, skin, STIs, community-acquired pneumonia',
    dosage: 'Adults: 500mg on day 1, then 250mg days 2–5. (Or as prescribed by doctor).',
    sideEffects: 'Nausea, diarrhea, abdominal pain, allergic reactions.',
    warnings: 'Complete the full course. Avoid if allergic to macrolides. May affect heart rhythm. Prescription required.',
    category: 'Antibiotic (Macrolide)',
  },
  {
    name: 'salbutamol',
    aliases: ['albuterol', 'ventolin', 'asthalin', 'proventil'],
    uses: 'Asthma, bronchospasm, COPD — opens airways for easier breathing',
    dosage: 'Inhaler: 1–2 puffs every 4–6 hours as needed. Max 4 times daily.',
    sideEffects: 'Tremors, rapid heartbeat, headache, dizziness.',
    warnings: 'For relief only — not a preventive inhaler. See doctor if needed more than twice a week.',
    category: 'Bronchodilator (Beta-agonist)',
  },
];

// @route POST /api/medicine-scan
router.post('/', protect, (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ success: false, message: 'Please provide a medicine name' });
    }

    const query = medicineName.toLowerCase().trim();
    const found = medicineDB.find(
      (m) =>
        m.name.includes(query) ||
        query.includes(m.name) ||
        m.aliases.some((a) => a.includes(query) || query.includes(a))
    );

    if (!found) {
      return res.json({
        success: false,
        message: `Medicine "${medicineName}" not found in our database. Please consult a pharmacist.`,
        suggestion: 'Try common medicine names like Paracetamol, Ibuprofen, Amoxicillin, etc.',
      });
    }

    res.json({
      success: true,
      medicine: found,
      disclaimer: '⚠️ This information is for educational purposes only. Always follow your doctor\'s prescription.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all medicines in database
router.get('/list', protect, (req, res) => {
  res.json({
    success: true,
    medicines: medicineDB.map((m) => ({ name: m.name, category: m.category, aliases: m.aliases })),
  });
});

module.exports = router;
