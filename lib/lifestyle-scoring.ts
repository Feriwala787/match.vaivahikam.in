export interface LifestyleResult {
  overallScore: number;
  hardGateFlags: string[];
  frictionPenalties: string[];
  sharedVibeTags: string[];
  icebreakerTable: Array<{ category: string; icon: string; userA: string; userB: string }>;
  conversationHooks: string[];
}

type Answers = Record<string, string | string[]>;

function val(answers: Answers, key: string): string {
  const v = answers[key];
  if (!v) return '';
  return Array.isArray(v) ? v.join(', ') : v;
}

function arr(answers: Answers, key: string): string[] {
  const v = answers[key];
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export function computeLifestyleMatch(answersA: Answers, answersB: Answers): LifestyleResult {
  const hardGateFlags: string[] = [];
  const frictionPenalties: string[] = [];
  const sharedVibeTags: string[] = [];
  const conversationHooks: string[] = [];
  let score = 50; // Start at baseline

  // ═══ TIER 1: HARD GATES (Override everything) ═══

  // Partner career conflict
  const careerA = val(answersA, 'partner_career');
  const careerB = val(answersB, 'partner_career');
  if ((careerA === 'Traditional single-income' && careerB === 'Dual-income household') ||
      (careerB === 'Traditional single-income' && careerA === 'Dual-income household')) {
    hardGateFlags.push('Fundamental Career Mismatch: One expects a dual-income household while the other expects a traditional single-income arrangement.');
  }

  // Geography + relocation conflict
  const geoA = val(answersA, 'geography_settle');
  const geoB = val(answersB, 'geography_settle');
  const relocA = val(answersA, 'relocation_willingness');
  const relocB = val(answersB, 'relocation_willingness');
  if ((geoA === 'Settle abroad' && relocB === 'No, my location is fixed') ||
      (geoB === 'Settle abroad' && relocA === 'No, my location is fixed')) {
    hardGateFlags.push('Geographic Incompatibility: One wants to settle abroad while the other refuses to relocate.');
  }

  // If hard gates triggered, score = 0
  if (hardGateFlags.length > 0) {
    return { overallScore: 0, hardGateFlags, frictionPenalties, sharedVibeTags: [], icebreakerTable: [], conversationHooks: [] };
  }

  // ═══ TIER 2: CORE FRICTION PENALTIES ═══

  // Pets clash
  const petsA = val(answersA, 'pets_preference');
  const petsB = val(answersB, 'pets_preference');
  if ((petsA === 'Yes, absolutely' && petsB === 'No, I prefer a pet-free home') ||
      (petsB === 'Yes, absolutely' && petsA === 'No, I prefer a pet-free home')) {
    score -= 15;
    frictionPenalties.push('Pets: One strongly wants pets while the other wants a pet-free home.');
  }

  // Finance clash
  const spendA = val(answersA, 'spending_habits');
  const spendB = val(answersB, 'spending_habits');
  if ((spendA === 'Aggressive saver' && spendB === 'Live in the moment') ||
      (spendB === 'Aggressive saver' && spendA === 'Live in the moment')) {
    score -= 15;
    frictionPenalties.push('Finances: Aggressive saver vs. live-in-the-moment spender — daily friction guaranteed.');
  }

  // Work-life balance mismatch
  const workA = val(answersA, 'work_philosophy');
  const workB = val(answersB, 'work_philosophy');
  if ((workA === 'Work is my passion — I go all in' && workB === 'Strict 9-to-5 boundary') ||
      (workB === 'Work is my passion — I go all in' && workA === 'Strict 9-to-5 boundary')) {
    score -= 10;
    frictionPenalties.push('Work-Life Balance: One is a workaholic while the other has strict boundaries — expect tension around time together.');
  }

  // Finance management style
  const finA = val(answersA, 'finances_merged');
  const finB = val(answersB, 'finances_merged');
  if ((finA === 'Completely merged' && finB === 'Completely separate') ||
      (finB === 'Completely merged' && finA === 'Completely separate')) {
    score -= 10;
    frictionPenalties.push('Financial Management: Completely merged vs. completely separate — fundamental disagreement on household money.');
  }

  // Ultimate dream mismatch
  const dreamA = val(answersA, 'ultimate_dream');
  const dreamB = val(answersB, 'ultimate_dream');
  if (dreamA && dreamB && dreamA !== dreamB) {
    // Only penalize if they're polar opposites
    const opposites = [['Bustling house full of family', 'Early retirement & freedom'], ['Quiet countryside life', 'High-flying urban luxury']];
    for (const [x, y] of opposites) {
      if ((dreamA === x && dreamB === y) || (dreamA === y && dreamB === x)) {
        score -= 10;
        frictionPenalties.push(`Life Vision: "${dreamA}" vs. "${dreamB}" — fundamentally different 20-year trajectories.`);
      }
    }
  }

  // ═══ TIER 3: BONUS SYNERGIES (Only add, never subtract) ═══

  // Travel style match
  const travelA = val(answersA, 'travel_style');
  const travelB = val(answersB, 'travel_style');
  if (travelA && travelB && travelA === travelB) {
    score += 5;
    sharedVibeTags.push(`🌍 ${travelA}`);
    conversationHooks.push(`You share the same travel style: ${travelA}. Plan a trip together!`);
  }

  // Dining vibe match
  const dineA = val(answersA, 'dining_vibe');
  const dineB = val(answersB, 'dining_vibe');
  if (dineA && dineB && dineA === dineB) {
    score += 5;
    sharedVibeTags.push(`🍽️ ${dineA}`);
  }

  // Weekend vibe match
  const weekendA = val(answersA, 'weekend_vibe');
  const weekendB = val(answersB, 'weekend_vibe');
  if (weekendA && weekendB && weekendA === weekendB) {
    score += 5;
    sharedVibeTags.push('🛋️ Same Weekend Energy');
    conversationHooks.push(`Your ideal weekends align: both prefer "${weekendA}".`);
  }

  // Screen genre match
  const screenA = val(answersA, 'screen_genre');
  const screenB = val(answersB, 'screen_genre');
  if (screenA && screenB && screenA === screenB) {
    score += 5;
    sharedVibeTags.push(`🎬 ${screenA} Fans`);
  }

  // Music genre overlap
  const musicA = arr(answersA, 'music_genre');
  const musicB = arr(answersB, 'music_genre');
  const musicOverlap = musicA.filter(g => musicB.includes(g));
  if (musicOverlap.length > 0) {
    score += 5;
    sharedVibeTags.push(`🎵 ${musicOverlap.join(' & ')}`);
  }

  // Fitness alignment
  const fitA = val(answersA, 'fitness_importance');
  const fitB = val(answersB, 'fitness_importance');
  if (fitA && fitB && fitA === fitB && fitA !== 'Not a priority') {
    score += 5;
    sharedVibeTags.push('💪 Fitness Aligned');
  }

  // Sports overlap
  const sportsA = arr(answersA, 'sports_which');
  const sportsB = arr(answersB, 'sports_which');
  const sportsOverlap = sportsA.filter(s => sportsB.includes(s));
  if (sportsOverlap.length > 0) {
    score += 5;
    sharedVibeTags.push(`🏆 ${sportsOverlap.join(', ')}`);
  }

  // Fashion match
  const fashionA = val(answersA, 'fashion_style');
  const fashionB = val(answersB, 'fashion_style');
  if (fashionA && fashionB && fashionA === fashionB) {
    score += 3;
    sharedVibeTags.push('👔 Same Fashion Sense');
  }

  // Work philosophy match
  if (workA && workB && workA === workB) {
    score += 5;
    sharedVibeTags.push('⚖️ Work-Life Aligned');
  }

  // Finance match
  if (finA && finB && finA === finB) {
    score += 5;
    sharedVibeTags.push('💰 Financial Harmony');
  }

  // Dream match
  if (dreamA && dreamB && dreamA === dreamB) {
    score += 8;
    sharedVibeTags.push('🌟 Same Life Vision');
    conversationHooks.push(`You share the same 20-year dream: "${dreamA}". That's rare and powerful.`);
  }

  // Cap score 0-100
  score = Math.max(0, Math.min(100, score));

  // ═══ ICEBREAKER TABLE (Text fields side-by-side) ═══
  const icebreakerTable: Array<{ category: string; icon: string; userA: string; userB: string }> = [];

  const textFields = [
    { key: 'music_favorite', category: 'Music', icon: '🎵' },
    { key: 'screen_favorite', category: 'Screen', icon: '🎬' },
    { key: 'culture_favorite', category: 'Culture', icon: '📚' },
    { key: 'perfect_sunday', category: 'Perfect Sunday', icon: '🌅' },
    { key: 'sports_favorite', category: 'Sports', icon: '🏆' },
    { key: 'travel_dream', category: 'Travel Dream', icon: '✈️' },
    { key: 'dining_favorite', category: 'Food', icon: '🍕' },
  ];

  for (const field of textFields) {
    const a = val(answersA, field.key);
    const b = val(answersB, field.key);
    if (a || b) {
      icebreakerTable.push({ category: field.category, icon: field.icon, userA: a || '—', userB: b || '—' });
    }
  }

  return { overallScore: score, hardGateFlags, frictionPenalties, sharedVibeTags, icebreakerTable, conversationHooks };
}
