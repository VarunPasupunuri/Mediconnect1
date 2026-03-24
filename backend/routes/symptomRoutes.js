const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Rule-based symptom checker dataset
const symptomDatabase = [
  {
    symptoms: ['fever', 'cough', 'sore throat', 'runny nose', 'fatigue'],
    condition: 'Common Cold / Influenza',
    specialization: 'General Physician',
    severity: 'mild',
    advice: 'Rest, stay hydrated, and take OTC fever reducers. See a doctor if symptoms worsen.',
  },
  {
    symptoms: ['chest pain', 'shortness of breath', 'dizziness', 'heart palpitations'],
    condition: 'Possible Cardiac Issue',
    specialization: 'Cardiologist',
    severity: 'high',
    advice: 'This could be a serious condition. Seek immediate medical attention.',
  },
  {
    symptoms: ['headache', 'nausea', 'vomiting', 'sensitivity to light', 'neck stiffness'],
    condition: 'Migraine / Possible Meningitis',
    specialization: 'Neurologist',
    severity: 'moderate-high',
    advice: 'Consult a doctor promptly, especially if neck stiffness is present.',
  },
  {
    symptoms: ['abdominal pain', 'bloating', 'diarrhea', 'constipation', 'nausea'],
    condition: 'Gastrointestinal Disorder / IBS',
    specialization: 'Gastroenterologist',
    severity: 'moderate',
    advice: 'Avoid fatty/spicy foods. Stay hydrated. Consult a GI specialist if persistent.',
  },
  {
    symptoms: ['skin rash', 'itching', 'hives', 'redness', 'swelling'],
    condition: 'Allergic Reaction / Dermatitis',
    specialization: 'Dermatologist',
    severity: 'mild-moderate',
    advice: 'Avoid allergens. Apply antihistamines. See a dermatologist for persistent cases.',
  },
  {
    symptoms: ['joint pain', 'swelling', 'stiffness', 'redness around joints'],
    condition: 'Arthritis / Joint Inflammation',
    specialization: 'Orthopedist / Rheumatologist',
    severity: 'moderate',
    advice: 'Rest the affected joint. Consider anti-inflammatory medications and see a specialist.',
  },
  {
    symptoms: ['frequent urination', 'excessive thirst', 'blurred vision', 'fatigue', 'weight loss'],
    condition: 'Possible Diabetes',
    specialization: 'Endocrinologist',
    severity: 'moderate-high',
    advice: 'Get blood sugar levels checked immediately. Consult an endocrinologist.',
  },
  {
    symptoms: ['depression', 'anxiety', 'insomnia', 'mood swings', 'loss of interest'],
    condition: 'Mental Health Disorder',
    specialization: 'Psychiatrist / Psychologist',
    severity: 'moderate',
    advice: 'Speak to a mental health professional. You are not alone — help is available.',
  },
  {
    symptoms: ['difficulty breathing', 'wheezing', 'chest tightness', 'chronic cough'],
    condition: 'Asthma / Respiratory Condition',
    specialization: 'Pulmonologist',
    severity: 'moderate-high',
    advice: 'Use prescribed inhalers. Avoid triggers. See a pulmonologist for proper diagnosis.',
  },
  {
    symptoms: ['toothache', 'gum swelling', 'bleeding gums', 'tooth sensitivity'],
    condition: 'Dental / Oral Health Issue',
    specialization: 'Dentist',
    severity: 'mild',
    advice: 'Visit a dentist. Practice good oral hygiene and avoid very hot or cold foods.',
  },
  {
    symptoms: ['eye pain', 'blurred vision', 'eye redness', 'watering eyes', 'light sensitivity'],
    condition: 'Eye Infection / Vision Problem',
    specialization: 'Ophthalmologist',
    severity: 'moderate',
    advice: 'Avoid rubbing your eyes. See an ophthalmologist promptly.',
  },
  {
    symptoms: ['ear pain', 'hearing loss', 'discharge from ear', 'ringing in ears'],
    condition: 'Ear Infection / Otitis',
    specialization: 'ENT Specialist',
    severity: 'mild-moderate',
    advice: 'See an ENT specialist. Avoid inserting anything into the ear canal.',
  },
];

// @route POST /api/symptom-checker
router.post('/', protect, (req, res) => {
  try {
    const { symptoms } = req.body; // Array of symptom strings
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one symptom' });
    }

    const inputSymptoms = symptoms.map((s) => s.toLowerCase().trim());
    const results = [];

    for (const entry of symptomDatabase) {
      const matchCount = entry.symptoms.filter((s) =>
        inputSymptoms.some((input) => input.includes(s) || s.includes(input))
      ).length;

      if (matchCount > 0) {
        results.push({
          ...entry,
          matchScore: Math.round((matchCount / entry.symptoms.length) * 100),
          matchedSymptoms: entry.symptoms.filter((s) =>
            inputSymptoms.some((input) => input.includes(s) || s.includes(input))
          ),
        });
      }
    }

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);
    const top = results.slice(0, 3);

    res.json({
      success: true,
      results: top,
      disclaimer: '⚠️ This is NOT a medical diagnosis. Please consult a licensed healthcare professional.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
