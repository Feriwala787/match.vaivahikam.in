import { likertQuestions, dealbreakers, type DealbreakQuestion } from './questions';

export interface TraitScores {
  // Big Five (0-100 scale)
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
  // EQ & Values (0-100)
  emotional_intelligence: number;
  family_values: number;
  gender_roles: number;
  financial_values: number;
  spirituality: number;
  autonomy: number;
  tradition: number;
  stability: number;
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
}

// Score raw answers into trait scores
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
    emotional_intelligence: normalize('emotional_intelligence'),
    family_values: normalize('family_values'),
    gender_roles: normalize('gender_roles'),
    financial_values: normalize('financial_values'),
    spirituality: normalize('spirituality'),
    autonomy: normalize('autonomy'),
    tradition: normalize('tradition'),
    stability: normalize('stability'),
  };
}

// Check dealbreakers — returns conflicts
function checkDealbreakers(a: Record<string, string>, b: Record<string, string>): string[] {
  const conflicts: string[] = [];
  const critical: Array<{ id: string; label: string; incompatible: [string, string][] }> = [
    {
      id: 'DB1', label: 'Children',
      incompatible: [['Yes, definitely', 'No, never'], ['No, never', 'Yes, definitely']],
    },
    {
      id: 'DB3', label: 'Living Arrangement',
      incompatible: [['With my family/in-laws', 'Completely independent'], ['Completely independent', 'With my family/in-laws']],
    },
    {
      id: 'DB6', label: 'Religious Alignment',
      incompatible: [['Must share same faith', 'Prefer secular'], ['Prefer secular', 'Must share same faith']],
    },
    {
      id: 'DB8', label: 'Substance Use',
      incompatible: [['Absolutely not acceptable', 'Regular use is fine'], ['Regular use is fine', 'Absolutely not acceptable']],
    },
  ];

  for (const rule of critical) {
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

// Euclidean distance between two trait vectors (normalized 0-100)
function euclideanProximity(a: TraitScores, b: TraitScores, keys: (keyof TraitScores)[]): number {
  const maxDist = Math.sqrt(keys.length * 100 * 100);
  let sumSq = 0;
  for (const k of keys) {
    sumSq += (a[k] - b[k]) ** 2;
  }
  const dist = Math.sqrt(sumSq);
  return Math.round((1 - dist / maxDist) * 100);
}

// Classify attachment style
function getAttachmentStyle(anxiety: number, avoidance: number): 'secure' | 'anxious' | 'avoidant' | 'fearful' {
  const anxHigh = anxiety > 50;
  const avHigh = avoidance > 50;
  if (!anxHigh && !avHigh) return 'secure';
  if (anxHigh && !avHigh) return 'anxious';
  if (!anxHigh && avHigh) return 'avoidant';
  return 'fearful';
}

// Risk matrix penalty
function computeRiskPenalty(a: TraitScores, b: TraitScores): { penalty: number; warnings: string[] } {
  let penalty = 0;
  const warnings: string[] = [];

  // Anxious-Avoidant trap
  const styleA = getAttachmentStyle(a.attachment_anxiety, a.attachment_avoidance);
  const styleB = getAttachmentStyle(b.attachment_anxiety, b.attachment_avoidance);
  if ((styleA === 'anxious' && styleB === 'avoidant') || (styleA === 'avoidant' && styleB === 'anxious')) {
    penalty += 20;
    warnings.push('Anxious-Avoidant attachment trap detected. This pairing often leads to a pursue-withdraw cycle.');
  }
  if (styleA === 'fearful' || styleB === 'fearful') {
    penalty += 10;
    warnings.push('One or both partners show fearful-avoidant attachment, indicating unresolved relational trauma.');
  }

  // High Dark Triad
  const darkA = (a.machiavellianism + a.narcissism + a.psychopathy) / 3;
  const darkB = (b.machiavellianism + b.narcissism + b.psychopathy) / 3;
  if (darkA > 65 || darkB > 65) {
    penalty += 15;
    warnings.push('Elevated dark personality traits detected. Risk of manipulative or exploitative dynamics.');
  }
  if (darkA > 65 && darkB > 65) {
    penalty += 10;
    warnings.push('Both partners show elevated dark traits. High conflict potential.');
  }

  // Empathy asymmetry
  const eqDiff = Math.abs(a.emotional_intelligence - b.emotional_intelligence);
  if (eqDiff > 40) {
    penalty += 10;
    warnings.push('Large emotional intelligence gap. The higher-EQ partner may feel emotionally unsupported.');
  }

  // High neuroticism + low agreeableness combo
  if ((a.neuroticism > 70 && b.agreeableness < 30) || (b.neuroticism > 70 && a.agreeableness < 30)) {
    penalty += 10;
    warnings.push('High neuroticism paired with low agreeableness increases conflict escalation risk.');
  }

  return { penalty: Math.min(penalty, 50), warnings };
}

// Main matching function
export function calculateMatch(
  traitsA: TraitScores,
  traitsB: TraitScores,
  dealbreakersA: Record<string, string>,
  dealbreakersB: Record<string, string>
): MatchResult {
  // Step 1: Hard gates
  const dealbreakConflicts = checkDealbreakers(dealbreakersA, dealbreakersB);
  if (dealbreakConflicts.length > 0) {
    return {
      overallScore: 0,
      dealbreakersPass: false,
      dealbreakConflicts,
      dimensionScores: {},
      frictionPoints: dealbreakConflicts.map(c => `Incompatible on: ${c}`),
      synergies: [],
      riskWarnings: ['Match blocked due to fundamental incompatibilities.'],
      attachmentCombo: `${getAttachmentStyle(traitsA.attachment_anxiety, traitsA.attachment_avoidance)}-${getAttachmentStyle(traitsB.attachment_anxiety, traitsB.attachment_avoidance)}`,
    };
  }

  // Step 2: Euclidean proximity
  const personalityKeys: (keyof TraitScores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  const valuesKeys: (keyof TraitScores)[] = ['family_values', 'gender_roles', 'financial_values', 'spirituality', 'autonomy', 'tradition', 'stability'];
  const eqKeys: (keyof TraitScores)[] = ['emotional_intelligence'];

  const personalityScore = euclideanProximity(traitsA, traitsB, personalityKeys);
  const valuesScore = euclideanProximity(traitsA, traitsB, valuesKeys);
  const eqScore = euclideanProximity(traitsA, traitsB, eqKeys);

  // Weighted composite
  const rawScore = personalityScore * 0.35 + valuesScore * 0.45 + eqScore * 0.20;

  // Step 3: Risk penalty
  const { penalty, warnings } = computeRiskPenalty(traitsA, traitsB);
  const overallScore = Math.max(0, Math.round(rawScore - penalty));

  // Step 4: Identify friction & synergy
  const frictionPoints: string[] = [];
  const synergies: string[] = [];

  const dimLabels: Record<string, string> = {
    openness: 'Openness to Experience', conscientiousness: 'Conscientiousness',
    extraversion: 'Extraversion', agreeableness: 'Agreeableness', neuroticism: 'Emotional Stability',
    family_values: 'Family Values', gender_roles: 'Gender Role Views',
    financial_values: 'Financial Philosophy', spirituality: 'Spirituality',
    autonomy: 'Personal Autonomy', tradition: 'Tradition', stability: 'Need for Stability',
    emotional_intelligence: 'Emotional Intelligence',
  };

  const allKeys = [...personalityKeys, ...valuesKeys, ...eqKeys];
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
    attachmentCombo: `${getAttachmentStyle(traitsA.attachment_anxiety, traitsA.attachment_avoidance)}-${getAttachmentStyle(traitsB.attachment_anxiety, traitsB.attachment_avoidance)}`,
  };
}
