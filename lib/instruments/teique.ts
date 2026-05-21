import { Question } from './types';

// Trait Emotional Intelligence Questionnaire Short Form (TEIQue-SF) Equivalent
// Petrides (2009) — Public domain equivalent items from IPIP EI markers
// 4 factors: Well-being, Self-control, Emotionality, Sociability + 2 global items

export const teique: Question[] = [
  // ═══ WELL-BEING (7 items) ═══
  { id: 'EI_WB1', text: 'I generally feel optimistic about the future.', instrument: 'TEIQue', dimension: 'eq_wellbeing' },
  { id: 'EI_WB2', text: 'I feel good about myself.', instrument: 'TEIQue', dimension: 'eq_wellbeing' },
  { id: 'EI_WB3', text: 'I believe I am full of personal strengths.', instrument: 'TEIQue', dimension: 'eq_wellbeing' },
  { id: 'EI_WB4', text: 'I generally feel satisfied with my life.', instrument: 'TEIQue', dimension: 'eq_wellbeing' },
  { id: 'EI_WB5', text: 'I feel that I have a number of good qualities.', instrument: 'TEIQue', dimension: 'eq_wellbeing' },
  { id: 'EI_WB6', text: 'I often feel unhappy with my life.', instrument: 'TEIQue', dimension: 'eq_wellbeing', reversed: true },
  { id: 'EI_WB7', text: 'I tend to see the glass as half empty rather than half full.', instrument: 'TEIQue', dimension: 'eq_wellbeing', reversed: true },

  // ═══ SELF-CONTROL (8 items) ═══
  { id: 'EI_SC1', text: 'I am usually able to control my emotions when I want to.', instrument: 'TEIQue', dimension: 'eq_self_control' },
  { id: 'EI_SC2', text: 'I can handle stress well.', instrument: 'TEIQue', dimension: 'eq_self_control' },
  { id: 'EI_SC3', text: 'I am good at managing my anger.', instrument: 'TEIQue', dimension: 'eq_self_control' },
  { id: 'EI_SC4', text: 'I can calm myself down when I feel anxious or upset.', instrument: 'TEIQue', dimension: 'eq_self_control' },
  { id: 'EI_SC5', text: 'I think before I act, even when I\'m upset.', instrument: 'TEIQue', dimension: 'eq_self_control' },
  { id: 'EI_SC6', text: 'I tend to get involved in things I later wish I could get out of.', instrument: 'TEIQue', dimension: 'eq_self_control', reversed: true },
  { id: 'EI_SC7', text: 'I often find it difficult to regulate my emotions.', instrument: 'TEIQue', dimension: 'eq_self_control', reversed: true },
  { id: 'EI_SC8', text: 'Others say I have a short fuse.', instrument: 'TEIQue', dimension: 'eq_self_control', reversed: true },

  // ═══ EMOTIONALITY (8 items) ═══
  { id: 'EI_EM1', text: 'I can usually tell how others are feeling.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM2', text: 'I find it easy to put myself in someone else\'s shoes.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM3', text: 'I pay attention to how my words affect others.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM4', text: 'I am good at reading other people\'s body language.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM5', text: 'I can easily tell if someone is interested or bored with what I am saying.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM6', text: 'I find it easy to express my emotions with words.', instrument: 'TEIQue', dimension: 'eq_emotionality' },
  { id: 'EI_EM7', text: 'I often find it difficult to see things from another person\'s viewpoint.', instrument: 'TEIQue', dimension: 'eq_emotionality', reversed: true },
  { id: 'EI_EM8', text: 'I find it hard to know what others are feeling.', instrument: 'TEIQue', dimension: 'eq_emotionality', reversed: true },

  // ═══ SOCIABILITY (7 items) ═══
  { id: 'EI_SO1', text: 'I can deal effectively with people.', instrument: 'TEIQue', dimension: 'eq_sociability' },
  { id: 'EI_SO2', text: 'I am good at getting along with people.', instrument: 'TEIQue', dimension: 'eq_sociability' },
  { id: 'EI_SO3', text: 'I can usually influence the way other people feel.', instrument: 'TEIQue', dimension: 'eq_sociability' },
  { id: 'EI_SO4', text: 'I am good at defusing tense situations.', instrument: 'TEIQue', dimension: 'eq_sociability' },
  { id: 'EI_SO5', text: 'I would describe myself as a good negotiator.', instrument: 'TEIQue', dimension: 'eq_sociability' },
  { id: 'EI_SO6', text: 'I find it difficult to stand up for my rights.', instrument: 'TEIQue', dimension: 'eq_sociability', reversed: true },
  { id: 'EI_SO7', text: 'I often find it difficult to adjust my behaviour to the people around me.', instrument: 'TEIQue', dimension: 'eq_sociability', reversed: true },
];
