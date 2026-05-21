import { Question } from './types';

// Short Dark Triad (SD3) — Jones & Paulhus (2014)
// 27 items: 9 Machiavellianism, 9 Narcissism, 9 Psychopathy
// Public domain equivalent items from IPIP Dark Triad markers

export const darkTriad: Question[] = [
  // ═══ MACHIAVELLIANISM (9 items) ═══
  { id: 'DT_M1', text: 'It\'s not wise to tell your secrets.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M2', text: 'I like to use clever manipulation to get my way.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M3', text: 'Whatever it takes, you must get the important people on your side.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M4', text: 'Avoid direct conflict with others because they may be useful in the future.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M5', text: 'It\'s wise to keep track of information that you can use against people later.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M6', text: 'You should wait for the right time to get back at people.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M7', text: 'There are things you should hide from other people to preserve your reputation.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M8', text: 'Make sure your plans benefit yourself, not others.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },
  { id: 'DT_M9', text: 'Most people can be manipulated.', instrument: 'DARK-TRIAD', dimension: 'machiavellianism' },

  // ═══ NARCISSISM (9 items) ═══
  { id: 'DT_N1', text: 'People see me as a natural leader.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },
  { id: 'DT_N2', text: 'I hate being the center of attention.', instrument: 'DARK-TRIAD', dimension: 'narcissism', reversed: true },
  { id: 'DT_N3', text: 'Many group activities tend to be dull without me.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },
  { id: 'DT_N4', text: 'I know that I am special because everyone keeps telling me so.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },
  { id: 'DT_N5', text: 'I like to get acquainted with important people.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },
  { id: 'DT_N6', text: 'I feel embarrassed if someone compliments me.', instrument: 'DARK-TRIAD', dimension: 'narcissism', reversed: true },
  { id: 'DT_N7', text: 'I have been compared to famous people.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },
  { id: 'DT_N8', text: 'I am an average person.', instrument: 'DARK-TRIAD', dimension: 'narcissism', reversed: true },
  { id: 'DT_N9', text: 'I insist on getting the respect I deserve.', instrument: 'DARK-TRIAD', dimension: 'narcissism' },

  // ═══ PSYCHOPATHY (9 items) ═══
  { id: 'DT_P1', text: 'I like to get revenge on authorities.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P2', text: 'I avoid dangerous situations.', instrument: 'DARK-TRIAD', dimension: 'psychopathy', reversed: true },
  { id: 'DT_P3', text: 'Payback needs to be quick and nasty.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P4', text: 'People often say I\'m out of control.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P5', text: 'It\'s true that I can be mean to others.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P6', text: 'People who mess with me always regret it.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P7', text: 'I have never gotten into trouble with the law.', instrument: 'DARK-TRIAD', dimension: 'psychopathy', reversed: true },
  { id: 'DT_P8', text: 'I enjoy having sex with people I hardly know.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
  { id: 'DT_P9', text: 'I\'ll say anything to get what I want.', instrument: 'DARK-TRIAD', dimension: 'psychopathy' },
];
