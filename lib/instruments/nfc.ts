import { Question } from './types';

// Need for Cognition Scale (NFC-18) — Cacioppo, Petty & Kao (1984)
// Measures tendency to engage in and enjoy effortful cognitive activity
// Public domain equivalent items

export const nfc: Question[] = [
  { id: 'NFC1', text: 'I prefer complex to simple problems.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC2', text: 'I like to have the responsibility of handling a situation that requires a lot of thinking.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC3', text: 'Thinking is not my idea of fun.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC4', text: 'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC5', text: 'I try to anticipate and avoid situations where there is a likely chance I will have to think in depth about something.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC6', text: 'I find satisfaction in deliberating hard and for long hours.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC7', text: 'I only think as hard as I have to.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC8', text: 'I prefer to think about small, daily projects rather than long-term ones.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC9', text: 'I like tasks that require little thought once I\'ve learned them.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC10', text: 'The idea of relying on thought to make my way to the top appeals to me.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC11', text: 'I really enjoy a task that involves coming up with new solutions to problems.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC12', text: 'Learning new ways to think doesn\'t excite me very much.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC13', text: 'I prefer my life to be filled with puzzles that I must solve.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC14', text: 'The notion of thinking abstractly is appealing to me.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC15', text: 'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.', instrument: 'NFC', dimension: 'need_for_cognition' },
  { id: 'NFC16', text: 'I feel relief rather than satisfaction after completing a task that required a lot of mental effort.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC17', text: 'It\'s enough for me that something gets the job done; I don\'t care how or why it works.', instrument: 'NFC', dimension: 'need_for_cognition', reversed: true },
  { id: 'NFC18', text: 'I usually end up deliberating about issues even when they do not affect me personally.', instrument: 'NFC', dimension: 'need_for_cognition' },
];
