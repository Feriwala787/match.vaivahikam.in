import { Question } from './types';

// Situational Judgment Tests + Repair Mechanics + Engagement Pacing
// These are BEHAVIORAL measures — they bypass self-report bias.
// Placed after Coping (Brief COPE) in the psychometric battery.

export const behavioral: Question[] = [
  // ═══ SITUATIONAL JUDGMENT TESTS ═══
  // Users can't fake these — they don't know which answer the algorithm "wants"

  { id: 'SJT1', text: 'You and your spouse agree on a specific way to manage your finances. Your parents strongly disagree and tell you to do it their way. What do you actually do?', instrument: 'BRIEF-COPE', dimension: 'boundary_setting', facet: 'sjt' },
  // Scoring: A=1(enmeshed), B=2(avoidant), C=5(healthy), D=1(aggressive)

  { id: 'SJT2', text: 'Your spouse has had a terrible, exhausting day at work. You have a family dinner planned at your parents\' house that evening. What happens?', instrument: 'BRIEF-COPE', dimension: 'partner_priority', facet: 'sjt' },
  // Scoring: A=2(rigid), B=4(balanced), C=3(avoidant of family)

  { id: 'SJT3', text: 'Your partner makes a large purchase (₹50,000+) without consulting you first. How do you react?', instrument: 'BRIEF-COPE', dimension: 'financial_boundaries', facet: 'sjt' },
  // Scoring: A=4(structured), B=3(flexible), C=2(disengaged)

  { id: 'SJT4', text: 'Your partner gets a dream job offer in another city. It would mean uprooting your life. What do you do?', instrument: 'BRIEF-COPE', dimension: 'sacrifice_willingness', facet: 'sjt' },
  // Scoring: A=5(selfless), B=4(balanced), C=1(rigid)

  // ═══ MECHANICS OF REPAIR (Apology Languages) ═══
  // Tied to attachment style — how someone repairs reveals their relational wiring

  { id: 'REPAIR1', text: 'After a heated argument, what is the best way for your partner to make things right with you?', instrument: 'ECR-R', dimension: 'repair_style', facet: 'repair' },
  // A=space(avoidant), B=verbal(secure), C=logic(intellectual), D=physical(anxious-secure)

  { id: 'REPAIR2', text: 'When YOU are the one who was wrong in an argument, how do you typically try to repair things?', instrument: 'ECR-R', dimension: 'repair_giving', facet: 'repair' },
  // Same options, measures giving vs receiving repair

  // ═══ ENGAGEMENT PACING ═══
  // Measures introversion, trust walls, and emotional availability speed

  { id: 'PACE1', text: 'Once an engagement is finalized, how often do you expect to communicate before the wedding?', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'pacing' },
  // A=5(high contact), B=3(moderate), C=1(low contact)

  { id: 'PACE2', text: 'How long does it usually take for you to open up about your deep insecurities?', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'pacing' },
  // A=5(open), B=3(moderate), C=1(guarded)
];

// SJT scoring map — maps answer text to a 1-5 score
export const sjtScoring: Record<string, Record<string, number>> = {
  SJT1: {
    "Follow my parents' advice out of respect": 1,
    "Follow my spouse's plan but tell my parents we are doing it their way to avoid conflict": 2,
    "Kindly but firmly tell my parents that my spouse and I have made our decision": 5,
    "Argue with my parents until they agree with me": 1,
  },
  SJT2: {
    "We both go; family obligations are non-negotiable": 2,
    "I go alone and make an excuse for them so they can rest": 5,
    "We cancel entirely and stay home together": 3,
  },
  SJT3: {
    "I would be very upset — all big purchases must be discussed": 4,
    "I'd be slightly annoyed but let it go": 3,
    "It's their money, they can spend it however they want": 2,
  },
  SJT4: {
    "Support them fully and move without hesitation": 5,
    "Discuss it seriously — I'd move only if conditions are right": 4,
    "I would not move; they should find something local": 1,
  },
  REPAIR1: {
    'Giving me space for a few hours, then acting normal': 2,
    'Offering a direct verbal "I am sorry" and admitting they were wrong': 5,
    'Explaining why they acted that way so I can understand their logic': 3,
    'Making a physical gesture (a hug, making me tea)': 4,
  },
  REPAIR2: {
    'Giving me space for a few hours, then acting normal': 2,
    'Offering a direct verbal "I am sorry" and admitting they were wrong': 5,
    'Explaining why they acted that way so I can understand their logic': 3,
    'Making a physical gesture (a hug, making me tea)': 4,
  },
  PACE1: {
    'Texting/calling constantly throughout the day': 5,
    'A quick check-in once a day': 3,
    'A few times a week is enough': 1,
  },
  PACE2: {
    'I am an open book immediately': 5,
    'It takes me a few months of trust-building': 3,
    'It takes me years to fully trust someone': 1,
  },
};
