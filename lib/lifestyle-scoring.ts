export interface LifestyleResult {
  overallScore: number;
  hardGateFlags: string[];
  frictionPenalties: string[];
  sharedVibeTags: string[];
  icebreakerTable: Array<{ category: string; icon: string; userA: string; userB: string }>;
  conversationHooks: string[];
  loveLanguages: { userA: string[]; userB: string[]; match: boolean; tip: string } | null;
  detailedComparison: Array<{ label: string; icon: string; userA: string; userB: string; match: boolean }>;
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

  // Aging parents — hard gate
  const agingA = val(answersA, 'aging_parents');
  const agingB = val(answersB, 'aging_parents');
  if ((agingA === 'They will eventually live with us, and we will physically care for them' && agingB === 'They will remain completely independent') ||
      (agingB === 'They will eventually live with us, and we will physically care for them' && agingA === 'They will remain completely independent')) {
    hardGateFlags.push('Caregiving Conflict: One expects aging parents to live with them while the other expects complete independence. This causes catastrophic family conflict.');
  }

  // Family influence — hard gate
  const influenceA = val(answersA, 'family_influence');
  const influenceB = val(answersB, 'family_influence');
  if ((influenceA === 'Heavy influence \u2014 they know best' && influenceB === 'Zero influence \u2014 we decide alone') ||
      (influenceB === 'Heavy influence \u2014 they know best' && influenceA === 'Zero influence \u2014 we decide alone')) {
    hardGateFlags.push('Family Authority Clash: One wants heavy parental influence over decisions while the other wants complete autonomy.');
  }

  // Religious practice hard gate
  const relPracticeA = val(answersA, 'religious_practice');
  const relPracticeB = val(answersB, 'religious_practice');
  const relExpectA = val(answersA, 'religious_expectation');
  const relExpectB = val(answersB, 'religious_expectation');
  if (relExpectA === 'Yes, must match' && relPracticeA && relPracticeB && relPracticeA !== relPracticeB) {
    hardGateFlags.push('Religious Practice Mismatch: One partner requires matching religious practice level but the other practices at a different intensity.');
  } else if (relExpectB === 'Yes, must match' && relPracticeA && relPracticeB && relPracticeA !== relPracticeB) {
    hardGateFlags.push('Religious Practice Mismatch: One partner requires matching religious practice level but the other practices at a different intensity.');
  }

  // If hard gates triggered, score = 0
  if (hardGateFlags.length > 0) {
    return { overallScore: 0, hardGateFlags, frictionPenalties, sharedVibeTags: [], icebreakerTable: [], conversationHooks: [], loveLanguages: null, detailedComparison: [] };
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

  // Social media privacy clash
  const postA = val(answersA, 'social_media_posting');
  const postB = val(answersB, 'social_media_posting');
  if ((postA === 'Love sharing everything' && postB === 'Strictly private \u2014 no posts') ||
      (postB === 'Love sharing everything' && postA === 'Strictly private \u2014 no posts')) {
    score -= 10;
    frictionPenalties.push('Social Media Privacy: One wants to share everything publicly while the other is strictly private. Daily tension guaranteed.');
  }

  // Alone time mismatch
  const aloneA = val(answersA, 'alone_time');
  const aloneB = val(answersB, 'alone_time');
  if ((aloneA === '0 \u2014 I love constant company' && aloneB === 'I need significant solitude') ||
      (aloneB === '0 \u2014 I love constant company' && aloneA === 'I need significant solitude')) {
    score -= 10;
    frictionPenalties.push('Alone Time: One craves constant togetherness while the other needs significant solitude. This creates feelings of rejection or suffocation.');
  }

  // Chronotype mismatch
  const chronoA = val(answersA, 'chronotype');
  const chronoB = val(answersB, 'chronotype');
  if ((chronoA === 'Early bird \u2014 up by 6am' && chronoB === 'Night owl \u2014 peak energy after 10pm') ||
      (chronoB === 'Early bird \u2014 up by 6am' && chronoA === 'Night owl \u2014 peak energy after 10pm')) {
    score -= 5;
    frictionPenalties.push('Daily Rhythm: Early bird vs. night owl \u2014 you\'ll rarely share peak energy hours together.');
  }

  // Therapy belief mismatch
  const therapyA = val(answersA, 'therapy_belief');
  const therapyB = val(answersB, 'therapy_belief');
  if ((therapyA === 'Strongly believe in it' && therapyB === 'Don\'t believe in it') ||
      (therapyB === 'Strongly believe in it' && therapyA === 'Don\'t believe in it')) {
    score -= 10;
    frictionPenalties.push('Mental Health: One strongly believes in therapy while the other rejects it. When the marriage hits rough patches, you won\'t agree on how to get help.');
  }

  // Cleanliness mismatch (2+ gap)
  const cleanOpts = ['Everything must be spotless', 'Reasonably tidy', 'Organized chaos', 'I\'m messy and okay with it'];
  const cleanIdxA = cleanOpts.indexOf(val(answersA, 'cleanliness'));
  const cleanIdxB = cleanOpts.indexOf(val(answersB, 'cleanliness'));
  if (cleanIdxA >= 0 && cleanIdxB >= 0 && Math.abs(cleanIdxA - cleanIdxB) >= 2) {
    score -= 10;
    frictionPenalties.push('Cleanliness Standards: Significant gap in tidiness expectations \u2014 one of the most cited daily irritants in marriages.');
  }

  // Spending tier mismatch (2+ gap)
  const spendOpts = ['Under \u20b910K', '\u20b910K - \u20b930K', '\u20b930K - \u20b975K', '\u20b975K+'];
  const spendIdxA = spendOpts.indexOf(val(answersA, 'spending_tier'));
  const spendIdxB = spendOpts.indexOf(val(answersB, 'spending_tier'));
  if (spendIdxA >= 0 && spendIdxB >= 0 && Math.abs(spendIdxA - spendIdxB) >= 2) {
    score -= 10;
    frictionPenalties.push('Spending Level: Very different monthly spending habits \u2014 what feels normal to one will feel extravagant or stingy to the other.');
  }

  // Opposite-gender friends friction
  const friendA = val(answersA, 'opposite_gender_friends');
  const friendB = val(answersB, 'opposite_gender_friends');
  if ((friendA === 'Completely fine' && friendB === 'Not acceptable') ||
      (friendB === 'Completely fine' && friendA === 'Not acceptable')) {
    score -= 10;
    frictionPenalties.push('Opposite-Gender Friendships: Fundamentally different boundaries \u2014 one sees it as normal, the other as unacceptable. Major trust friction.');
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

  // Chore Economy friction
  const choreConflicts: string[] = [];
  const cookA = val(answersA, 'chore_cooking');
  const cookB = val(answersB, 'chore_cooking');
  if (cookA === 'My partner will' && cookB === 'My partner will') {
    choreConflicts.push('Cooking: Both expect the other to cook.');
  }
  const mentalA = val(answersA, 'chore_mental_load');
  const mentalB = val(answersB, 'chore_mental_load');
  if (mentalA === 'My partner will' && mentalB === 'My partner will') {
    choreConflicts.push('Mental Load: Both expect the other to manage household logistics.');
  }
  const cleanA = val(answersA, 'chore_cleaning');
  const cleanB = val(answersB, 'chore_cleaning');
  if (cleanA === 'My partner will' && cleanB === 'My partner will') {
    choreConflicts.push('Cleaning: Both expect the other to handle it.');
  }
  if (choreConflicts.length > 0) {
    const bothWork = (careerA === 'Dual-income household' || careerB === 'Dual-income household');
    score -= choreConflicts.length * 5;
    frictionPenalties.push(`Chore Economy${bothWork ? ' (⚠️ Both work full-time!)' : ''}: ${choreConflicts.join(' ')}`);
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

  // Chronotype match bonus
  if (chronoA && chronoB && chronoA === chronoB && chronoA !== 'Flexible \u2014 depends on the day') {
    score += 3;
    sharedVibeTags.push('\u23f0 Same Daily Rhythm');
  }

  // Alone time match
  if (aloneA && aloneB && aloneA === aloneB) {
    score += 3;
    sharedVibeTags.push('\ud83e\uddd8 Same Space Needs');
  }

  // Social frequency match
  const socialA = val(answersA, 'social_frequency');
  const socialB = val(answersB, 'social_frequency');
  if (socialA && socialB && socialA === socialB) {
    score += 3;
    sharedVibeTags.push('\ud83c\udf89 Same Social Energy');
  }

  // Therapy alignment
  if (therapyA && therapyB && therapyA === therapyB && therapyA === 'Strongly believe in it') {
    score += 3;
    sharedVibeTags.push('\ud83e\ude7a Pro-Therapy');
  }

  // Cleanliness match
  if (cleanIdxA >= 0 && cleanIdxB >= 0 && cleanIdxA === cleanIdxB) {
    score += 3;
    sharedVibeTags.push('\u2728 Same Tidiness Level');
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

  // ═══ LOVE LANGUAGES ═══
  const loveA = arr(answersA, 'love_language_rank');
  const loveB = arr(answersB, 'love_language_rank');
  let loveLanguages: { userA: string[]; userB: string[]; match: boolean; tip: string } | null = null;

  if (loveA.length >= 2 && loveB.length >= 2) {
    const topA = loveA.slice(0, 2);
    const topB = loveB.slice(0, 2);
    const overlap = topA.some(l => topB.includes(l));
    if (overlap) {
      score += 5;
      sharedVibeTags.push('💕 Love Languages Aligned');
    }

    // Generate tip based on partner's #1
    const partnerBTop = loveB[0] || '';
    let tip = '';
    if (partnerBTop.includes('Words')) tip = 'Your partner feels most loved through Words of Affirmation. Tell them you appreciate them — often.';
    else if (partnerBTop.includes('Acts of Service')) tip = 'Your partner feels most loved through Acts of Service. Instead of buying a gift, try making them dinner after a long day.';
    else if (partnerBTop.includes('Gifts')) tip = 'Your partner feels most loved through Thoughtful Gifts. It\'s not about cost — it\'s about showing you thought of them.';
    else if (partnerBTop.includes('Quality Time')) tip = 'Your partner feels most loved through Quality Time. Put the phone away and give them your full attention.';
    else if (partnerBTop.includes('Touch')) tip = 'Your partner feels most loved through Physical Touch. Hold their hand, hug them — small gestures matter.';

    loveLanguages = { userA: topA, userB: topB, match: overlap, tip };
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

  // ═══ DETAILED SIDE-BY-SIDE COMPARISON (All lifestyle answers) ═══
  const detailedComparison: Array<{ label: string; icon: string; userA: string; userB: string; match: boolean }> = [];

  const comparisonFields = [
    { key: 'weekend_vibe', label: 'Ideal Weekend', icon: '🛋️' },
    { key: 'chronotype', label: 'Daily Rhythm', icon: '⏰' },
    { key: 'alone_time', label: 'Alone Time Needed', icon: '🧘' },
    { key: 'social_frequency', label: 'Social Frequency', icon: '🎉' },
    { key: 'opposite_gender_friends', label: 'Opposite-Gender Friends', icon: '🤝' },
    { key: 'fitness_importance', label: 'Fitness Priority', icon: '💪' },
    { key: 'travel_frequency', label: 'Travel Frequency', icon: '✈️' },
    { key: 'travel_style', label: 'Travel Style', icon: '🌍' },
    { key: 'healthcare_approach', label: 'Healthcare Approach', icon: '🏥' },
    { key: 'therapy_belief', label: 'Therapy/Counseling', icon: '🩺' },
    { key: 'social_media_time', label: 'Social Media Usage', icon: '📱' },
    { key: 'social_media_posting', label: 'Posting Privacy', icon: '🔒' },
    { key: 'fashion_style', label: 'Fashion Style', icon: '👔' },
    { key: 'dining_frequency', label: 'Eating Out', icon: '🍽️' },
    { key: 'dining_vibe', label: 'Dining Vibe', icon: '🍾' },
    { key: 'pets_preference', label: 'Pets', icon: '🐾' },
    { key: 'work_philosophy', label: 'Work Philosophy', icon: '💼' },
    { key: 'partner_career', label: 'Partner Career Expectation', icon: '👥' },
    { key: 'spending_habits', label: 'Saving Habits', icon: '💰' },
    { key: 'spending_tier', label: 'Monthly Spending', icon: '💳' },
    { key: 'finances_merged', label: 'Money Management', icon: '🏦' },
    { key: 'cleanliness', label: 'Cleanliness Standards', icon: '✨' },
    { key: 'chore_cooking', label: 'Who Cooks?', icon: '🍳' },
    { key: 'chore_mental_load', label: 'Who Manages Mental Load?', icon: '🧠' },
    { key: 'chore_cleaning', label: 'Who Cleans?', icon: '🧹' },
    { key: 'geography_settle', label: 'Where to Settle', icon: '🏠' },
    { key: 'relocation_willingness', label: 'Relocation Willingness', icon: '🚚' },
    { key: 'aging_parents', label: 'Aging Parents Plan', icon: '👴' },
    { key: 'family_influence', label: 'Family Influence', icon: '👨\u200d👩\u200d👧' },
    { key: 'religious_practice', label: 'Religious Practice', icon: '🙏' },
    { key: 'ultimate_dream', label: '20-Year Dream', icon: '🌟' },
    { key: 'parenting_discipline', label: 'Parenting Style', icon: '👶' },
    { key: 'parenting_education', label: 'Academic Expectations', icon: '🎓' },
    { key: 'sjt_inlaw', label: 'In-Law Boundary (Scenario)', icon: '🎭' },
    { key: 'sjt_social_battery', label: 'Social Battery (Scenario)', icon: '🔋' },
    { key: 'sjt_spending', label: 'Spending Conflict (Scenario)', icon: '💸' },
    { key: 'sjt_career_move', label: 'Career Move (Scenario)', icon: '🚀' },
    { key: 'repair_language', label: 'How to Repair After Fight', icon: '🩹' },
    { key: 'pacing_communication', label: 'Communication Frequency', icon: '📞' },
    { key: 'pacing_vulnerability', label: 'Vulnerability Timeline', icon: '🔓' },
  ];

  for (const field of comparisonFields) {
    const a = val(answersA, field.key);
    const b = val(answersB, field.key);
    if (a || b) {
      detailedComparison.push({
        label: field.label,
        icon: field.icon,
        userA: a || '—',
        userB: b || '—',
        match: a === b && a !== '',
      });
    }
  }

  return { overallScore: score, hardGateFlags, frictionPenalties, sharedVibeTags, icebreakerTable, conversationHooks, loveLanguages, detailedComparison };
}
