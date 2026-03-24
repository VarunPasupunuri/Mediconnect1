const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Diet plan generator based on goal, age, weight
const generateDietPlan = (age, weight, goal, gender) => {
  const bmr =
    gender === 'female'
      ? 447.6 + 9.25 * weight + 3.1 * 160 - 4.33 * age
      : 88.36 + 13.4 * weight + 5.0 * 170 - 5.7 * age;

  let calories = bmr * 1.55; // moderate activity
  if (goal === 'weight-loss') calories -= 500;
  if (goal === 'weight-gain') calories += 500;
  calories = Math.round(calories);

  const plans = {
    'weight-loss': {
      breakfast: [
        '2 boiled eggs + 1 slice whole wheat toast + black coffee',
        'Greek yogurt with berries + 1 tsp honey',
        'Oatmeal with almond milk + 1 banana',
      ],
      lunch: [
        'Grilled chicken salad with olive oil dressing + lemon water',
        'Quinoa bowl with veggies and tofu',
        'Dal + brown rice + cucumber salad',
      ],
      dinner: [
        'Steamed fish + roasted vegetables + green tea',
        'Lentil soup + 2 multigrain rotis',
        'Grilled paneer + stir-fried vegetables',
      ],
      snacks: ['Apple + green tea', 'A handful of almonds', 'Carrot sticks with hummus'],
    },
    'weight-gain': {
      breakfast: [
        '4 scrambled eggs + 2 slices bread + banana smoothie with milk',
        'Paneer bhurji + 2 parathas + full-fat milk',
        'Peanut butter oat smoothie + boiled eggs',
      ],
      lunch: [
        'Chicken curry + 3 rotis + dal + rice',
        'Pasta with meat sauce + garlic bread',
        'Rajma + 2 cups rice + curd',
      ],
      dinner: [
        'Mutton/paneer gravy + rice + roti + sweet lassi',
        'Salmon fillet + mashed potatoes + bread',
        'Dal makhani + 3 rotis + glass of milk',
      ],
      snacks: ['Peanut butter + banana', 'Full-fat yogurt + granola', 'Cheese sandwich + milk'],
    },
    'maintenance': {
      breakfast: [
        '2 eggs (any style) + 1 multigrain toast + fruit',
        'Idli (3) + sambar + coconut chutney',
        'Porridge + nuts + fresh juice',
      ],
      lunch: [
        'Mixed veg + 2 rotis + curd + salad',
        'Brown rice + dal + sabzi + buttermilk',
        'Chicken stir fry + noodles + soup',
      ],
      dinner: [
        'Soup + 2 rotis + sabzi + dal',
        'Grilled fish/paneer + salad + rice',
        'Khichdi + papad + pickle',
      ],
      snacks: ['Fruit salad', 'Roasted makhana', 'Green tea + digestive biscuits'],
    },
  };

  const plan = plans[goal] || plans['maintenance'];
  const dayIndex = new Date().getDay() % 3;

  return {
    goal,
    estimatedCalories: calories,
    bmi: (weight / (1.7 * 1.7)).toFixed(1),
    meals: {
      breakfast: plan.breakfast[dayIndex],
      lunch: plan.lunch[dayIndex],
      dinner: plan.dinner[dayIndex],
      morningSnack: plan.snacks[0],
      eveningSnack: plan.snacks[1],
    },
    hydration: '8-10 glasses of water per day',
    tips: [
      'Eat slowly and mindfully',
      'Avoid processed and sugary foods',
      'Include seasonal fruits and vegetables',
      `Target ${calories} calories daily for ${goal.replace('-', ' ')}`,
    ],
  };
};

// @route POST /api/diet-plan
router.post('/', protect, async (req, res) => {
  try {
    const { age, weight, goal, gender } = req.body;
    if (!age || !weight || !goal) {
      return res.status(400).json({ success: false, message: 'Age, weight, and goal are required' });
    }

    const plan = generateDietPlan(Number(age), Number(weight), goal, gender || 'male');

    // Save plan to user's profile
    await User.findByIdAndUpdate(req.user._id, {
      $push: { dietPlans: { plan, goal, date: new Date() } },
    });

    res.json({ success: true, dietPlan: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/diet-plan/history - Get saved diet plans
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('dietPlans');
    res.json({ success: true, dietPlans: user.dietPlans.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
