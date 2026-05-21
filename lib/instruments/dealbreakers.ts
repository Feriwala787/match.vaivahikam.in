import { DealbreakQuestion } from './types';

// Custom Dealbreaker Set — 20 items
// Non-compensatory hard gates for arranged marriage context
// Covers: Family planning, finances, in-laws, lifestyle, religion, career

export const dealbreakers: DealbreakQuestion[] = [
  // Family Planning
  { id: 'DB1', text: 'Do you want children?', instrument: 'DEALBREAKER', dimension: 'children', options: ['Yes, definitely', 'Open to it', 'No, never'] },
  { id: 'DB2', text: 'How many children do you ideally want?', instrument: 'DEALBREAKER', dimension: 'children_count', options: ['0', '1', '2', '3+'] },
  { id: 'DB3', text: 'How soon after marriage would you want children?', instrument: 'DEALBREAKER', dimension: 'children_timing', options: ['Within 1 year', '2-3 years', '4+ years', 'Not sure / flexible'] },

  // Living & In-Laws
  { id: 'DB4', text: 'Where do you expect to live after marriage?', instrument: 'DEALBREAKER', dimension: 'living_arrangement', options: ['With my family/in-laws', 'Nearby but separate', 'Completely independent', 'Flexible'] },
  { id: 'DB5', text: 'How involved should in-laws be in daily married life?', instrument: 'DEALBREAKER', dimension: 'inlaw_involvement', options: ['Very involved', 'Somewhat involved', 'Minimal involvement', 'No involvement'] },
  { id: 'DB6', text: 'Would you be willing to financially support your partner\'s parents?', instrument: 'DEALBREAKER', dimension: 'inlaw_financial', options: ['Yes, fully', 'Partially, within limits', 'Only in emergencies', 'No'] },

  // Career & Relocation
  { id: 'DB7', text: 'What is your stance on relocation for career?', instrument: 'DEALBREAKER', dimension: 'relocation', options: ['Will not relocate', 'Open to relocating domestically', 'Open to relocating internationally', 'Fully flexible'] },
  { id: 'DB8', text: 'What is your expectation about your partner working after marriage?', instrument: 'DEALBREAKER', dimension: 'partner_career', options: ['Must work', 'Prefer they work', 'Their choice entirely', 'Prefer they don\'t work'] },
  { id: 'DB9', text: 'How would you feel if your partner earned significantly more than you?', instrument: 'DEALBREAKER', dimension: 'income_dynamic', options: ['Very comfortable', 'Somewhat comfortable', 'Uncomfortable', 'Strongly uncomfortable'] },

  // Finances
  { id: 'DB10', text: 'What is your stance on financial management in marriage?', instrument: 'DEALBREAKER', dimension: 'financial_management', options: ['Fully joint finances', 'Mostly joint with personal allowance', 'Split finances equally', 'Completely separate finances'] },
  { id: 'DB11', text: 'How do you feel about taking on debt (loans, EMIs)?', instrument: 'DEALBREAKER', dimension: 'debt_tolerance', options: ['Avoid all debt', 'Only for home/education', 'Comfortable with managed debt', 'No strong opinion'] },
  { id: 'DB12', text: 'What percentage of income should go to savings/investments?', instrument: 'DEALBREAKER', dimension: 'savings_rate', options: ['Less than 10%', '10-25%', '25-40%', 'More than 40%'] },

  // Religion & Values
  { id: 'DB13', text: 'How important is religious/spiritual alignment with your partner?', instrument: 'DEALBREAKER', dimension: 'religion_importance', options: ['Must share same faith', 'Prefer same faith', 'Doesn\'t matter', 'Prefer secular'] },
  { id: 'DB14', text: 'How do you feel about substance use (alcohol/tobacco)?', instrument: 'DEALBREAKER', dimension: 'substance_use', options: ['Absolutely not acceptable', 'Occasional social use is fine', 'Regular use is fine', 'No preference'] },

  // Lifestyle
  { id: 'DB15', text: 'How important is physical fitness/health to you in a partner?', instrument: 'DEALBREAKER', dimension: 'health', options: ['Very important - must be active', 'Somewhat important', 'Not important at all'] },
  { id: 'DB16', text: 'What is your communication style during conflict?', instrument: 'DEALBREAKER', dimension: 'conflict_style', options: ['Discuss immediately', 'Need time to cool off first', 'Avoid conflict entirely', 'Seek third-party mediation'] },
  { id: 'DB17', text: 'How do you feel about pets in the household?', instrument: 'DEALBREAKER', dimension: 'pets', options: ['Love pets, must have them', 'Open to pets', 'Prefer no pets', 'Absolutely no pets'] },
  { id: 'DB18', text: 'How important is alone time / personal space to you?', instrument: 'DEALBREAKER', dimension: 'personal_space', options: ['Need significant alone time daily', 'Need some alone time', 'Prefer being together most of the time', 'Want to be together always'] },

  // Social & Extended Family
  { id: 'DB19', text: 'How often do you expect to socialize with extended family?', instrument: 'DEALBREAKER', dimension: 'family_socializing', options: ['Weekly', 'Monthly', 'A few times a year', 'Rarely/never'] },
  { id: 'DB20', text: 'Who should have the primary say in major life decisions (home purchase, city, schooling)?', instrument: 'DEALBREAKER', dimension: 'decision_authority', options: ['Both partners equally', 'Whoever has more expertise', 'The higher earner', 'Elders/family should guide'] },
];
