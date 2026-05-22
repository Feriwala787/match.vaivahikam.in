import { lifestyleQuestions } from './lifestyle-questions';

export interface LifestyleResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  sharedInterests: string[];
  conversationHooks: string[];
  differences: string[];
}

type Answers = Record<string, string | string[]>;

// Compute lifestyle compatibility between two users
export function computeLifestyleMatch(answersA: Answers, answersB: Answers): LifestyleResult {
  const sharedInterests: string[] = [];
  const conversationHooks: string[] = [];
  const differences: string[] = [];
  const categoryPoints: Record<string, { earned: number; possible: number }> = {};

  const parentQuestions = lifestyleQuestions.filter(q => !q.parentId);

  for (const q of parentQuestions) {
    const cat = q.category;
    if (!categoryPoints[cat]) categoryPoints[cat] = { earned: 0, possible: 0 };

    const valA = answersA[q.id];
    const valB = answersB[q.id];
    if (!valA || !valB) continue;

    categoryPoints[cat].possible += 1;

    // Exact match on parent = full point
    if (valA === valB) {
      categoryPoints[cat].earned += 1;
      sharedInterests.push(`${q.text} — Both chose: "${valA}"`);
    } else {
      differences.push(`${q.text} — "${valA}" vs "${valB}"`);
    }

    // Check child questions for deeper matching
    const children = lifestyleQuestions.filter(c => c.parentId === q.id);
    for (const child of children) {
      const childA = answersA[child.id];
      const childB = answersB[child.id];
      if (!childA || !childB) continue;

      categoryPoints[cat].possible += 1;

      if (child.type === 'multi') {
        // Multi-select: score by overlap
        const arrA = Array.isArray(childA) ? childA : [childA];
        const arrB = Array.isArray(childB) ? childB : [childB];
        const overlap = arrA.filter(x => arrB.includes(x));
        if (overlap.length > 0) {
          const overlapScore = overlap.length / Math.max(arrA.length, arrB.length);
          categoryPoints[cat].earned += overlapScore;
          sharedInterests.push(`${child.text} — Shared: ${overlap.join(', ')}`);
        }
      } else if (child.type === 'single') {
        if (childA === childB) {
          categoryPoints[cat].earned += 1;
          sharedInterests.push(`${child.text} — Both: "${childA}"`);
        }
      } else if (child.type === 'text') {
        // Text fields generate conversation hooks, not scores
        const textA = typeof childA === 'string' ? childA.trim() : '';
        const textB = typeof childB === 'string' ? childB.trim() : '';
        if (textA && textB) {
          conversationHooks.push(`${child.text} — Partner A: "${textA}" | Partner B: "${textB}"`);
        }
      }
    }
  }

  // Generate specific conversation hooks from shared interests
  if (answersA['LS2a'] && answersB['LS2a'] && answersA['LS2a'] === answersB['LS2a']) {
    conversationHooks.push(`You both love watching ${answersA['LS2a']}! Plan a movie night.`);
  }
  if (answersA['LS6a'] && answersB['LS6a'] && answersA['LS6a'] === answersB['LS6a']) {
    conversationHooks.push(`You share the same travel style: ${answersA['LS6a']}. Plan a trip together!`);
  }
  if (answersA['LS5'] && answersB['LS5'] && answersA['LS5'] === answersB['LS5']) {
    conversationHooks.push(`Your ideal weekends align perfectly — both prefer: ${answersA['LS5']}.`);
  }

  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  let totalEarned = 0;
  let totalPossible = 0;

  for (const [cat, pts] of Object.entries(categoryPoints)) {
    categoryScores[cat] = pts.possible > 0 ? Math.round((pts.earned / pts.possible) * 100) : 0;
    totalEarned += pts.earned;
    totalPossible += pts.possible;
  }

  const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  return { overallScore, categoryScores, sharedInterests, conversationHooks, differences };
}
