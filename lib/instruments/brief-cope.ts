import { Question } from './types';

// Brief COPE Equivalent — Carver (1997)
// Measures coping mechanisms under stress
// Adapted to 5-point Likert: 1=Strongly Disagree to 5=Strongly Agree
// Dimensions: Active Coping, Avoidant Coping, Support-Seeking

export const briefCope: Question[] = [
  // ═══ ACTIVE/PROBLEM-FOCUSED COPING (5 items) ═══
  { id: 'COPE_A1', text: 'When stressed, I concentrate my efforts on doing something about the situation.', instrument: 'BRIEF-COPE', dimension: 'coping_active' },
  { id: 'COPE_A2', text: 'I take action to try to make the situation better.', instrument: 'BRIEF-COPE', dimension: 'coping_active' },
  { id: 'COPE_A3', text: 'I try to come up with a strategy about what to do.', instrument: 'BRIEF-COPE', dimension: 'coping_active' },
  { id: 'COPE_A4', text: 'I think hard about what steps to take.', instrument: 'BRIEF-COPE', dimension: 'coping_active' },
  { id: 'COPE_A5', text: 'I try to see the problem in a different light, to make it seem more positive.', instrument: 'BRIEF-COPE', dimension: 'coping_active' },

  // ═══ AVOIDANT/DISENGAGEMENT COPING (5 items) ═══
  { id: 'COPE_V1', text: 'I give up trying to deal with it.', instrument: 'BRIEF-COPE', dimension: 'coping_avoidant' },
  { id: 'COPE_V2', text: 'I refuse to believe that it has happened.', instrument: 'BRIEF-COPE', dimension: 'coping_avoidant' },
  { id: 'COPE_V3', text: 'I say to myself "this isn\'t real."', instrument: 'BRIEF-COPE', dimension: 'coping_avoidant' },
  { id: 'COPE_V4', text: 'I use alcohol or other substances to make myself feel better.', instrument: 'BRIEF-COPE', dimension: 'coping_avoidant' },
  { id: 'COPE_V5', text: 'I blame myself for things that happen.', instrument: 'BRIEF-COPE', dimension: 'coping_avoidant' },

  // ═══ SUPPORT-SEEKING COPING (4 items) ═══
  { id: 'COPE_S1', text: 'I get emotional support from others.', instrument: 'BRIEF-COPE', dimension: 'coping_support' },
  { id: 'COPE_S2', text: 'I get comfort and understanding from someone.', instrument: 'BRIEF-COPE', dimension: 'coping_support' },
  { id: 'COPE_S3', text: 'I try to get advice or help from other people about what to do.', instrument: 'BRIEF-COPE', dimension: 'coping_support' },
  { id: 'COPE_S4', text: 'I talk to someone who could do something concrete about the problem.', instrument: 'BRIEF-COPE', dimension: 'coping_support' },
];
