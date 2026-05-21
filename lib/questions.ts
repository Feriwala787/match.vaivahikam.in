export type { Question, DealbreakQuestion, LikertScale } from './instruments/types';

import { ipipNeo } from './instruments/ipip-neo';
import { ecrR } from './instruments/ecr-r';
import { darkTriad } from './instruments/dark-triad';
import { teique } from './instruments/teique';
import { briefCope } from './instruments/brief-cope';
import { nfc } from './instruments/nfc';
import { dealbreakers } from './instruments/dealbreakers';

// Re-export dealbreakers for use in scoring
export { dealbreakers };

// All Likert-scale questions combined (265 items total)
export const likertQuestions = [...ipipNeo, ...ecrR, ...darkTriad, ...teique, ...briefCope, ...nfc];

// Total question count (Likert + Dealbreakers)
export const TOTAL_QUESTIONS = likertQuestions.length + dealbreakers.length;

// Section metadata for UI progress tracking
export const sections = [
  { id: 'personality', label: 'Core Personality (IPIP-NEO)', instrument: 'IPIP-NEO' as const, count: 120 },
  { id: 'attachment', label: 'Relational Style (Attachment)', instrument: 'ECR-R' as const, count: 36 },
  { id: 'dark_traits', label: 'Protective Filter (Dark Traits)', instrument: 'DARK-TRIAD' as const, count: 27 },
  { id: 'emotional_intelligence', label: 'Emotional Navigation (EI)', instrument: 'TEIQue' as const, count: 30 },
  { id: 'coping', label: 'Coping Mechanisms (Stress)', instrument: 'BRIEF-COPE' as const, count: 14 },
  { id: 'cognition', label: 'Intellectual Match (NFC)', instrument: 'NFC' as const, count: 18 },
  { id: 'dealbreakers', label: 'Values & Boundaries', instrument: 'DEALBREAKER' as const, count: 20 },
];
