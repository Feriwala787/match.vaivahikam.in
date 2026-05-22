import { likertQuestions } from './questions';

export interface TraitScores {
  // Big Five (0-100)
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  // Attachment (0-100, higher = more insecure)
  attachment_anxiety: number;
  attachment_avoidance: number;
  // Dark Triad (0-100, higher = darker)
  machiavellianism: number;
  narcissism: number;
  psychopathy: number;
  // Emotional Intelligence (0-100, higher = better)
  eq_wellbeing: number;
  eq_self_control: number;
  eq_emotionality: number;
  eq_sociability: number;
  // Coping (0-100)
  coping_active: number;
  coping_avoidant: number;
  coping_support: number;
  // Need for Cognition (0-100)
  need_for_cognition: number;
}

export interface MatchResult {
  overallScore: number;
  dealbreakersPass: boolean;
  dealbreakConflicts: string[];
  dimensionScores: Record<string, { score: number; label: string }>;
  frictionPoints: string[];
  synergies: string[];
  riskWarnings: string[];
  attachmentCombo: string;
  categoryScores: {
    personality: number;
    emotionalIntelligence: number;
    intellectualMatch: number;
    copingCompatibility: number;
    secureBonus: number;
  };
}

// ═══ SCORING ═══

export function computeTraitScores(rawAnswers: Record<string, number>): TraitScores {
  const dimensions: Record<string, { sum: number; count: number }> = {};

  for (const q of likertQuestions) {
    const raw = rawAnswers[q.id];
    if (raw == null) continue;
    const value = q.reversed ? (6 - raw) : raw;
    if (!dimensions[q.dimension]) dimensions[q.dimension] = { sum: 0, count: 0 };
    dimensions[q.dimension].sum += value;
    dimensions[q.dimension].count += 1;
  }

  // Normalize: converts mean (1-5) to 0-100 scale
  const normalize = (dim: string): number => {
    const d = dimensions[dim];
    if (!d || d.count === 0) return 50;
    return Math.round(((d.sum / d.count - 1) / 4) * 100);
  };

  return {
    openness: normalize('openness'),
    conscientiousness: normalize('conscientiousness'),
    extraversion: normalize('extraversion'),
    agreeableness: normalize('agreeableness'),
    neuroticism: normalize('neuroticism'),
    attachment_anxiety: normalize('attachment_anxiety'),
    attachment_avoidance: normalize('attachment_avoidance'),
    machiavellianism: normalize('machiavellianism'),
    narcissism: normalize('narcissism'),
    psychopathy: normalize('psychopathy'),
    eq_wellbeing: normalize('eq_wellbeing'),
    eq_self_control: normalize('eq_self_control'),
    eq_emotionality: normalize('eq_emotionality'),
    eq_sociability: normalize('eq_sociability'),
    coping_active: normalize('coping_active'),
    coping_avoidant: normalize('coping_avoidant'),
    coping_support: normalize('coping_support'),
    need_for_cognition: normalize('need_for_cognition'),
  };
}

// ═══ DEALBREAKER HARD GATES ═══

function checkDealbreakers(a: Record<string, string>, b: Record<string, string>): string[] {
  const conflicts: string[] = [];

  const rules: Array<{ id: string; label: string; incompatible: [string, string][] }> = [
    {
      id: 'DB1', label: 'Children (Want vs. Don\'t Want)',
      incompatible: [['Yes, definitely', 'No, never'], ['No, never', 'Yes, definitely']],
    },
    {
      id: 'DB4', label: 'Living Arrangement',
      incompatible: [['With my family/in-laws', 'Completely independent'], ['Completely independent', 'With my family/in-laws']],
    },
    {
      id: 'DB13', label: 'Religious Alignment',
      incompatible: [['Must share same faith', 'Prefer secular'], ['Prefer secular', 'Must share same faith']],
    },
    {
      id: 'DB14', label: 'Substance Use',
      incompatible: [['Absolutely not acceptable', 'Regular use is fine'], ['Regular use is fine', 'Absolutely not acceptable']],
    },
    {
      id: 'DB5', label: 'In-Law Involvement',
      incompatible: [['Very involved', 'No involvement'], ['No involvement', 'Very involved']],
    },
    {
      id: 'DB20', label: 'Decision Authority',
      incompatible: [['Both partners equally', 'Elders/family should guide'], ['Elders/family should guide', 'Both partners equally']],
    },
  ];

  for (const rule of rules) {
    const valA = a[rule.id];
    const valB = b[rule.id];
    if (!valA || !valB) continue;
    for (const [x, y] of rule.incompatible) {
      if ((valA === x && valB === y) || (valA === y && valB === x)) {
        conflicts.push(rule.label);
        break;
      }
    }
  }
  return conflicts;
}

// ═══ EUCLIDEAN DISTANCE ═══

function euclideanProximity(a: TraitScores, b: TraitScores, keys: (keyof TraitScores)[]): number {
  const maxDist = Math.sqrt(keys.length * 100 * 100);
  let sumSq = 0;
  for (const k of keys) {
    sumSq += (a[k] - b[k]) ** 2;
  }
  const dist = Math.sqrt(sumSq);
  return Math.round((1 - dist / maxDist) * 100);
}

// ═══ ATTACHMENT CLASSIFICATION ═══

function getAttachmentStyle(anxiety: number, avoidance: number): 'secure' | 'anxious' | 'avoidant' | 'fearful' {
  // Clinical threshold: 65 (not 50) — 50 is just average, not clinically significant
  const anxHigh = anxiety > 65;
  const avHigh = avoidance > 65;
  if (!anxHigh && !avHigh) return 'secure';
  if (anxHigh && !avHigh) return 'anxious';
  if (!anxHigh && avHigh) return 'avoidant';
  return 'fearful';
}

// ═══ AUDIT PHASE: NEGATIVE TRAIT OVERRIDES ═══
// Clinical principle: matching on POSITIVE traits = Synergy.
// Matching on NEGATIVE traits = Amplification (dangerous).
// Dark traits NEVER contribute positively — they only trigger penalties.

// Threshold: 75 on 0-100 scale = equivalent to >4.0 on 1-5 Likert
const HIGH_THRESHOLD = 75;
const MODERATE_THRESHOLD = 60;

function computeRiskPenalty(a: TraitScores, b: TraitScores): { penalty: number; warnings: string[]; autoFail: boolean } {
  let penalty = 0;
  const warnings: string[] = [];
  let autoFail = false;

  // ─────────────────────────────────────────────────────────────────
  // 1. VOLATILITY OVERRIDE (Neuroticism Amplification)
  //    Two highly neurotic people don't stabilize each other —
  //    they amplify each other's panic and create an explosive home.
  // ─────────────────────────────────────────────────────────────────
  if (a.neuroticism > HIGH_THRESHOLD && b.neuroticism > HIGH_THRESHOLD) {
    penalty += 15;
    warnings.push('⚡ Volatility Amplification: You both experience emotions very intensely. During times of stress, you must actively work to de-escalate rather than feeding off each other\'s anxiety. Without deliberate coping strategies, this pairing risks chronic emotional escalation.');
  }

  // Dual high avoidant coping = both shut down under stress, nothing gets resolved
  if (a.coping_avoidant > HIGH_THRESHOLD && b.coping_avoidant > HIGH_THRESHOLD) {
    penalty += 10;
    warnings.push('⚡ Dual Avoidant Coping: Both partners tend to disengage under stress. Critical issues may go unresolved indefinitely, building resentment over time.');
  }

  // ─────────────────────────────────────────────────────────────────
  // 2. PREDATOR-PREY PENALTY (Dark Triad × Vulnerability)
  //    Dark traits NEVER add to compatibility. They only penalize.
  //    The most dangerous combo: high Dark Triad + high Agreeableness target.
  // ─────────────────────────────────────────────────────────────────
  const darkA = (a.machiavellianism + a.narcissism + a.psychopathy) / 3;
  const darkB = (b.machiavellianism + b.narcissism + b.psychopathy) / 3;

  // Predator-Prey: High dark traits targeting a highly agreeable/empathetic person
  if (darkA > HIGH_THRESHOLD && b.agreeableness > HIGH_THRESHOLD) {
    penalty += 40;
    autoFail = true;
    warnings.push('🚨 PROTECTIVE BLOCK — Predator-Prey Dynamic: One partner shows elevated manipulative traits while the other is highly empathetic and trusting. This combination has the highest clinical risk for emotional exploitation. Match automatically failed to protect the vulnerable partner.');
  } else if (darkB > HIGH_THRESHOLD && a.agreeableness > HIGH_THRESHOLD) {
    penalty += 40;
    autoFail = true;
    warnings.push('🚨 PROTECTIVE BLOCK — Predator-Prey Dynamic: One partner shows elevated manipulative traits while the other is highly empathetic and trusting. This combination has the highest clinical risk for emotional exploitation. Match automatically failed to protect the vulnerable partner.');
  }

  // Moderate dark + high agreeableness (not auto-fail but heavy penalty)
  if (!autoFail) {
    if ((darkA > MODERATE_THRESHOLD && b.agreeableness > HIGH_THRESHOLD) ||
        (darkB > MODERATE_THRESHOLD && a.agreeableness > HIGH_THRESHOLD)) {
      penalty += 25;
      warnings.push('⚠️ Exploitation Risk: One partner shows moderately elevated dark traits paired with a highly trusting partner. The empathetic partner may be vulnerable to subtle manipulation over time.');
    }
  }

  // Both high dark = brutal power struggle
  if (darkA > HIGH_THRESHOLD && darkB > HIGH_THRESHOLD) {
    penalty += 25;
    warnings.push('⚠️ Dual Dark Traits: Both partners show elevated manipulative tendencies. This pairing typically devolves into a destructive power struggle with no stable resolution.');
  }

  // Single high dark (general flag)
  if (!autoFail && (darkA > HIGH_THRESHOLD || darkB > HIGH_THRESHOLD)) {
    penalty += 15;
    warnings.push('⚠️ Elevated Dark Personality: One partner scores high on manipulative traits (Machiavellianism, Narcissism, or Psychopathy). Proceed with extreme caution.');
  }

  // ─────────────────────────────────────────────────────────────────
  // 3. POLARIZATION PENALTY (Anxious-Avoidant Trap)
  //    The most researched toxic attachment pairing.
  //    They don't just differ — they perfectly trigger each other.
  // ─────────────────────────────────────────────────────────────────
  const styleA = getAttachmentStyle(a.attachment_anxiety, a.attachment_avoidance);
  const styleB = getAttachmentStyle(b.attachment_anxiety, b.attachment_avoidance);

  if ((styleA === 'anxious' && styleB === 'avoidant') || (styleA === 'avoidant' && styleB === 'anxious')) {
    penalty += 20;
    warnings.push('⚡ Anxious-Avoidant Trap: Major Friction Point. When arguments happen, one partner will want to resolve it immediately while the other needs to withdraw. This pursue-withdraw cycle is the leading psychological predictor of marital dissatisfaction. You must establish strict rules for how to take "timeouts" during fights.');
  }

  // Fearful-avoidant (disorganized) — indicates unresolved trauma
  if (styleA === 'fearful' || styleB === 'fearful') {
    penalty += 10;
    warnings.push('⚠️ Disorganized Attachment: One or both partners show fearful-avoidant patterns, indicating possible unresolved relational trauma. Professional counseling strongly recommended before commitment.');
  }

  // ─────────────────────────────────────────────────────────────────
  // 4. ADDITIONAL CLINICAL OVERRIDES
  // ─────────────────────────────────────────────────────────────────

  // Traditional Narcissism Trap (arranged marriage specific)
  // Moderately narcissistic + highly agreeable & anxious partner = exploitation
  if (a.narcissism > 70 && b.agreeableness > 70 && b.neuroticism > 60) {
    penalty += 20;
    warnings.push('⚠️ Traditional Narcissism Trap: One partner shows elevated narcissism paired with a highly empathetic, anxious partner. The agreeable partner may suppress their own needs to avoid conflict, leading to chronic resentment and emotional depletion.');
  } else if (b.narcissism > 70 && a.agreeableness > 70 && a.neuroticism > 60) {
    penalty += 20;
    warnings.push('⚠️ Traditional Narcissism Trap: One partner shows elevated narcissism paired with a highly empathetic, anxious partner. The agreeable partner may suppress their own needs to avoid conflict, leading to chronic resentment and emotional depletion.');
  }

  // EQ Asymmetry — large gap means one partner carries all emotional labor
  const eqA = (a.eq_wellbeing + a.eq_self_control + a.eq_emotionality + a.eq_sociability) / 4;
  const eqB = (b.eq_wellbeing + b.eq_self_control + b.eq_emotionality + b.eq_sociability) / 4;
  if (Math.abs(eqA - eqB) > 35) {
    penalty += 10;
    warnings.push('⚠️ Emotional Intelligence Gap: The higher-EQ partner will likely bear disproportionate emotional labor, leading to burnout and resentment over time.');
  }

  // High neuroticism + low agreeableness in partner = conflict escalation
  if ((a.neuroticism > HIGH_THRESHOLD && b.agreeableness < 30) || (b.neuroticism > HIGH_THRESHOLD && a.agreeableness < 30)) {
    penalty += 10;
    warnings.push('⚠️ Conflict Escalation Risk: High emotional reactivity paired with low accommodation. Arguments are likely to escalate rapidly without resolution.');
  }

  // Low self-control + psychopathy = impulsive harmful behavior
  if ((a.eq_self_control < 25 && a.psychopathy > MODERATE_THRESHOLD) || (b.eq_self_control < 25 && b.psychopathy > MODERATE_THRESHOLD)) {
    penalty += 15;
    warnings.push('🚨 Impulse-Aggression Risk: Low emotional self-control combined with callous traits. Elevated risk of impulsive harmful behavior during conflict.');
  }

  // Coping style mismatch (one active, one avoidant)
  if ((a.coping_active > HIGH_THRESHOLD && b.coping_avoidant > HIGH_THRESHOLD) ||
      (b.coping_active > HIGH_THRESHOLD && a.coping_avoidant > HIGH_THRESHOLD)) {
    penalty += 5;
    warnings.push('⚡ Coping Mismatch: One partner confronts problems head-on while the other withdraws. This asymmetry can create frustration during stressful life events.');
  }

  // Cap total penalty (auto-fail overrides this)
  return { penalty: autoFail ? 100 : Math.min(penalty, 65), warnings, autoFail };
}

// ═══ MAIN MATCHING FUNCTION ═══
// Two-phase architecture:
//   PHASE 1 (Reward): Euclidean distance on HEALTHY traits only
//   PHASE 2 (Audit): Negative trait checks — deductions & auto-fails

export function calculateMatch(
  traitsA: TraitScores,
  traitsB: TraitScores,
  dealbreakersA: Record<string, string>,
  dealbreakersB: Record<string, string>
): MatchResult {
  // Step 1: Hard gates (dealbreakers)
  const dealbreakConflicts = checkDealbreakers(dealbreakersA, dealbreakersB);
  const attachmentCombo = `${getAttachmentStyle(traitsA.attachment_anxiety, traitsA.attachment_avoidance)}-${getAttachmentStyle(traitsB.attachment_anxiety, traitsB.attachment_avoidance)}`;

  if (dealbreakConflicts.length > 0) {
    return {
      overallScore: 0,
      dealbreakersPass: false,
      dealbreakConflicts,
      dimensionScores: {},
      frictionPoints: dealbreakConflicts.map(c => `Incompatible on: ${c}`),
      synergies: [],
      riskWarnings: ['Match blocked due to fundamental incompatibilities in life goals.'],
      attachmentCombo,
      categoryScores: { personality: 0, emotionalIntelligence: 0, intellectualMatch: 0, copingCompatibility: 0, secureBonus: 0 },
    };
  }

  // ═══ PHASE 1: REWARD (Healthy Traits Only) ═══
  // Neuroticism, Dark Triad, and Avoidant Coping are EXCLUDED from reward.
  // Values are handled entirely by the Lifestyle Engine — no double-counting.
  const healthyPersonalityKeys: (keyof TraitScores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness'];
  const eqKeys: (keyof TraitScores)[] = ['eq_wellbeing', 'eq_self_control', 'eq_emotionality', 'eq_sociability'];
  const healthyCopingKeys: (keyof TraitScores)[] = ['coping_active', 'coping_support'];
  const nfcKeys: (keyof TraitScores)[] = ['need_for_cognition'];

  const personalityScore = euclideanProximity(traitsA, traitsB, healthyPersonalityKeys);
  const eqScore = euclideanProximity(traitsA, traitsB, eqKeys);
  const copingScore = euclideanProximity(traitsA, traitsB, healthyCopingKeys);
  const nfcScore = euclideanProximity(traitsA, traitsB, nfcKeys);

  // Weighted composite — clean, no double-counting
  // Personality: 35%, EQ: 35%, Coping: 15%, NFC: 5% (weakest marital predictor)
  // Remaining 10% reserved as headroom for the Secure Attachment Bonus
  const rawScore = personalityScore * 0.35 + eqScore * 0.35 + copingScore * 0.15 + nfcScore * 0.05;

  // ═══ PHASE 2: AUDIT (Negative Trait Checks) ═══
  const { penalty, warnings, autoFail } = computeRiskPenalty(traitsA, traitsB);

  // Secure Attachment Bonus (+10%): Two securely attached people = strongest marital predictor
  let secureBonus = 0;
  if (traitsA.attachment_anxiety < 40 && traitsA.attachment_avoidance < 40 &&
      traitsB.attachment_anxiety < 40 && traitsB.attachment_avoidance < 40) {
    secureBonus = 10;
  }

  // Auto-fail: Predator-Prey dynamic detected — score forced to 0
  const overallScore = autoFail ? 0 : Math.max(0, Math.min(100, Math.round(rawScore + secureBonus - penalty)));

  // Step 4: Dimension-level analysis (for dashboard display)
  const frictionPoints: string[] = [];
  const synergies: string[] = [];

  const dimLabels: Record<string, string> = {
    openness: 'Openness to Experience',
    conscientiousness: 'Conscientiousness',
    extraversion: 'Extraversion',
    agreeableness: 'Agreeableness',
    neuroticism: 'Emotional Stability',
    eq_wellbeing: 'Emotional Well-being',
    eq_self_control: 'Emotional Self-Control',
    eq_emotionality: 'Emotional Perception',
    eq_sociability: 'Social Competence',
    coping_active: 'Active Coping',
    coping_avoidant: 'Avoidant Coping',
    coping_support: 'Support-Seeking',
    need_for_cognition: 'Intellectual Curiosity',
  };

  // Include all dimensions in display (including negative ones for transparency)
  const allDisplayKeys: (keyof TraitScores)[] = [
    ...healthyPersonalityKeys, 'neuroticism', ...eqKeys, 'coping_active', 'coping_avoidant', 'coping_support', ...nfcKeys
  ];
  const dimensionScores: Record<string, { score: number; label: string }> = {};

  for (const k of allDisplayKeys) {
    const diff = Math.abs(traitsA[k] - traitsB[k]);
    const proximity = Math.round((1 - diff / 100) * 100);
    const label = dimLabels[k] || k;
    dimensionScores[k] = { score: proximity, label };
    if (diff > 40) frictionPoints.push(`${label}: significant gap (${diff} points apart)`);
    else if (diff < 15) synergies.push(`${label}: strong alignment`);
  }

  return {
    overallScore,
    dealbreakersPass: !autoFail,
    dealbreakConflicts: autoFail ? ['Protective filter triggered'] : [],
    dimensionScores,
    frictionPoints,
    synergies,
    riskWarnings: warnings,
    attachmentCombo,
    categoryScores: {
      personality: personalityScore,
      emotionalIntelligence: eqScore,
      intellectualMatch: nfcScore,
      copingCompatibility: copingScore,
      secureBonus,
    },
  };
}
