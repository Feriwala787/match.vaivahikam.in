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
    values: number;
    emotionalIntelligence: number;
    intellectualMatch: number;
    copingCompatibility: number;
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
  const anxHigh = anxiety > 50;
  const avHigh = avoidance > 50;
  if (!anxHigh && !avHigh) return 'secure';
  if (anxHigh && !avHigh) return 'anxious';
  if (!anxHigh && avHigh) return 'avoidant';
  return 'fearful';
}

// ═══ RISK MATRIX PENALTY ═══

function computeRiskPenalty(a: TraitScores, b: TraitScores): { penalty: number; warnings: string[] } {
  let penalty = 0;
  const warnings: string[] = [];

  // 1. Anxious-Avoidant trap
  const styleA = getAttachmentStyle(a.attachment_anxiety, a.attachment_avoidance);
  const styleB = getAttachmentStyle(b.attachment_anxiety, b.attachment_avoidance);
  if ((styleA === 'anxious' && styleB === 'avoidant') || (styleA === 'avoidant' && styleB === 'anxious')) {
    penalty += 20;
    warnings.push('Anxious-Avoidant attachment trap detected. This pairing often leads to a pursue-withdraw cycle that erodes trust over time.');
  }
  if (styleA === 'fearful' || styleB === 'fearful') {
    penalty += 10;
    warnings.push('One or both partners show fearful-avoidant attachment, indicating possible unresolved relational trauma.');
  }

  // 2. High Dark Triad
  const darkA = (a.machiavellianism + a.narcissism + a.psychopathy) / 3;
  const darkB = (b.machiavellianism + b.narcissism + b.psychopathy) / 3;
  if (darkA > 65 || darkB > 65) {
    penalty += 15;
    warnings.push('Elevated dark personality traits detected. Risk of manipulative or exploitative relational dynamics.');
  }
  if (darkA > 65 && darkB > 65) {
    penalty += 10;
    warnings.push('Both partners show elevated dark traits. High conflict and power-struggle potential.');
  }

  // 3. Emotional Intelligence asymmetry
  const eqA = (a.eq_wellbeing + a.eq_self_control + a.eq_emotionality + a.eq_sociability) / 4;
  const eqB = (b.eq_wellbeing + b.eq_self_control + b.eq_emotionality + b.eq_sociability) / 4;
  if (Math.abs(eqA - eqB) > 35) {
    penalty += 10;
    warnings.push('Large emotional intelligence gap. The higher-EQ partner may feel emotionally unsupported or drained.');
  }

  // 4. High neuroticism + low agreeableness
  if ((a.neuroticism > 70 && b.agreeableness < 30) || (b.neuroticism > 70 && a.agreeableness < 30)) {
    penalty += 10;
    warnings.push('High neuroticism paired with low agreeableness increases conflict escalation risk.');
  }

  // 5. Avoidant coping asymmetry
  if (Math.abs(a.coping_avoidant - b.coping_avoidant) > 40) {
    penalty += 5;
    warnings.push('Significant difference in avoidant coping styles. One partner may shut down while the other seeks resolution.');
  }

  // 6. Low self-control + high psychopathy
  if ((a.eq_self_control < 30 && a.psychopathy > 60) || (b.eq_self_control < 30 && b.psychopathy > 60)) {
    penalty += 15;
    warnings.push('Low emotional self-control combined with elevated psychopathy traits. Potential for impulsive harmful behavior.');
  }

  return { penalty: Math.min(penalty, 55), warnings };
}

// ═══ MAIN MATCHING FUNCTION ═══

export function calculateMatch(
  traitsA: TraitScores,
  traitsB: TraitScores,
  dealbreakersA: Record<string, string>,
  dealbreakersB: Record<string, string>
): MatchResult {
  // Step 1: Hard gates
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
      categoryScores: { personality: 0, values: 0, emotionalIntelligence: 0, intellectualMatch: 0, copingCompatibility: 0 },
    };
  }

  // Step 2: Category proximity scores
  const personalityKeys: (keyof TraitScores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  const eqKeys: (keyof TraitScores)[] = ['eq_wellbeing', 'eq_self_control', 'eq_emotionality', 'eq_sociability'];
  const copingKeys: (keyof TraitScores)[] = ['coping_active', 'coping_avoidant', 'coping_support'];
  const nfcKeys: (keyof TraitScores)[] = ['need_for_cognition'];

  const personalityScore = euclideanProximity(traitsA, traitsB, personalityKeys);
  const eqScore = euclideanProximity(traitsA, traitsB, eqKeys);
  const copingScore = euclideanProximity(traitsA, traitsB, copingKeys);
  const nfcScore = euclideanProximity(traitsA, traitsB, nfcKeys);

  // Values score from dealbreaker proximity (non-binary items)
  // Use personality + EQ as proxy for values alignment
  const valuesScore = Math.round((personalityScore * 0.4 + eqScore * 0.6));

  // Weighted composite (total = 100%)
  // Personality: 25%, EQ: 25%, Values: 20%, NFC: 15%, Coping: 15%
  const rawScore = personalityScore * 0.25 + eqScore * 0.25 + valuesScore * 0.20 + nfcScore * 0.15 + copingScore * 0.15;

  // Step 3: Risk penalty
  const { penalty, warnings } = computeRiskPenalty(traitsA, traitsB);
  const overallScore = Math.max(0, Math.round(rawScore - penalty));

  // Step 4: Dimension-level analysis
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

  const allKeys: (keyof TraitScores)[] = [...personalityKeys, ...eqKeys, ...copingKeys, ...nfcKeys];
  const dimensionScores: Record<string, { score: number; label: string }> = {};

  for (const k of allKeys) {
    const diff = Math.abs(traitsA[k] - traitsB[k]);
    const proximity = Math.round((1 - diff / 100) * 100);
    const label = dimLabels[k] || k;
    dimensionScores[k] = { score: proximity, label };
    if (diff > 40) frictionPoints.push(`${label}: significant gap (${diff} points apart)`);
    else if (diff < 15) synergies.push(`${label}: strong alignment`);
  }

  return {
    overallScore,
    dealbreakersPass: true,
    dealbreakConflicts: [],
    dimensionScores,
    frictionPoints,
    synergies,
    riskWarnings: warnings,
    attachmentCombo,
    categoryScores: {
      personality: personalityScore,
      values: valuesScore,
      emotionalIntelligence: eqScore,
      intellectualMatch: nfcScore,
      copingCompatibility: copingScore,
    },
  };
}
