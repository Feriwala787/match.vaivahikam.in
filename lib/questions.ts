export type LikertScale = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  instrument: 'IPIP-NEO' | 'ECR-R' | 'DARK-CORE' | 'WVS' | 'DEALBREAKER';
  dimension: string;
  facet?: string;
  reversed?: boolean;
}

// IPIP-NEO Big Five (50 items — 10 per domain)
const ipipNeo: Question[] = [
  // OPENNESS (O)
  { id: 'O1', text: 'I have a vivid imagination.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination' },
  { id: 'O2', text: 'I am interested in abstract ideas.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O3', text: 'I have a rich vocabulary.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O4', text: 'I enjoy hearing new ideas.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'openness_to_values' },
  { id: 'O5', text: 'I carry the conversation to a higher level.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O6', text: 'I do not like art.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'aesthetics', reversed: true },
  { id: 'O7', text: 'I avoid philosophical discussions.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect', reversed: true },
  { id: 'O8', text: 'I do not enjoy going to art museums.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'aesthetics', reversed: true },
  { id: 'O9', text: 'I tend to vote for liberal political candidates.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'openness_to_values' },
  { id: 'O10', text: 'I enjoy wild flights of fantasy.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination' },

  // CONSCIENTIOUSNESS (C)
  { id: 'C1', text: 'I am always prepared.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline' },
  { id: 'C2', text: 'I pay attention to details.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness' },
  { id: 'C3', text: 'I get chores done right away.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline' },
  { id: 'C4', text: 'I like order.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness' },
  { id: 'C5', text: 'I follow a schedule.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness' },
  { id: 'C6', text: 'I am exacting in my work.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'achievement_striving' },
  { id: 'C7', text: 'I leave my belongings around.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness', reversed: true },
  { id: 'C8', text: 'I make a mess of things.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness', reversed: true },
  { id: 'C9', text: 'I often forget to put things back in their proper place.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness', reversed: true },
  { id: 'C10', text: 'I shirk my duties.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness', reversed: true },

  // EXTRAVERSION (E)
  { id: 'E1', text: 'I am the life of the party.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness' },
  { id: 'E2', text: 'I feel comfortable around people.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'warmth' },
  { id: 'E3', text: 'I start conversations.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness' },
  { id: 'E4', text: 'I talk to a lot of different people at parties.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness' },
  { id: 'E5', text: 'I don\'t mind being the center of attention.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness' },
  { id: 'E6', text: 'I don\'t talk a lot.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness', reversed: true },
  { id: 'E7', text: 'I keep in the background.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness', reversed: true },
  { id: 'E8', text: 'I have little to say.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness', reversed: true },
  { id: 'E9', text: 'I don\'t like to draw attention to myself.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness', reversed: true },
  { id: 'E10', text: 'I am quiet around strangers.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'warmth', reversed: true },

  // AGREEABLENESS (A)
  { id: 'A1', text: 'I feel others\' emotions.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'tender_mindedness' },
  { id: 'A2', text: 'I make people feel at ease.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'warmth' },
  { id: 'A3', text: 'I am interested in people.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'warmth' },
  { id: 'A4', text: 'I sympathize with others\' feelings.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'tender_mindedness' },
  { id: 'A5', text: 'I take time out for others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism' },
  { id: 'A6', text: 'I am not really interested in others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'warmth', reversed: true },
  { id: 'A7', text: 'I insult people.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'compliance', reversed: true },
  { id: 'A8', text: 'I am not interested in other people\'s problems.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism', reversed: true },
  { id: 'A9', text: 'I feel little concern for others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'tender_mindedness', reversed: true },
  { id: 'A10', text: 'I am hard to get to know.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'trust', reversed: true },

  // NEUROTICISM (N)
  { id: 'N1', text: 'I get stressed out easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety' },
  { id: 'N2', text: 'I worry about things.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety' },
  { id: 'N3', text: 'I am easily disturbed.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'vulnerability' },
  { id: 'N4', text: 'I get upset easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'angry_hostility' },
  { id: 'N5', text: 'I change my mood a lot.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N6', text: 'I have frequent mood swings.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N7', text: 'I get irritated easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'angry_hostility' },
  { id: 'N8', text: 'I often feel blue.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N9', text: 'I am relaxed most of the time.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety', reversed: true },
  { id: 'N10', text: 'I seldom feel blue.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression', reversed: true },
];

// ECR-R Attachment (36 items — 18 Anxiety, 18 Avoidance)
const ecrR: Question[] = [
  // ANXIETY
  { id: 'ECR_AX1', text: 'I worry about being abandoned.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX2', text: 'I worry a lot about my relationships.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX3', text: 'I worry that romantic partners won\'t care about me as much as I care about them.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX4', text: 'I worry a fair amount about losing my partner.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX5', text: 'I often wish that my partner\'s feelings for me were as strong as my feelings for them.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX6', text: 'When my partner is out of sight, I worry that they might become interested in someone else.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX7', text: 'When I show my feelings for romantic partners, I\'m afraid they will not feel the same about me.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX8', text: 'I rarely worry about my partner leaving me.', instrument: 'ECR-R', dimension: 'attachment_anxiety', reversed: true },
  { id: 'ECR_AX9', text: 'My romantic partner makes me doubt myself.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX10', text: 'I do not often worry about being abandoned.', instrument: 'ECR-R', dimension: 'attachment_anxiety', reversed: true },
  { id: 'ECR_AX11', text: 'I find that my partner(s) don\'t want to get as close as I would like.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX12', text: 'Sometimes romantic partners change their feelings about me for no apparent reason.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX13', text: 'My desire to be very close sometimes scares people away.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX14', text: 'I\'m afraid that once a romantic partner gets to know me, they won\'t like who I really am.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX15', text: 'It makes me mad that I don\'t get the affection and support I need from my partner.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX16', text: 'I worry that I won\'t measure up to other people.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX17', text: 'My partner only seems to notice me when I\'m angry.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },
  { id: 'ECR_AX18', text: 'I need a lot of reassurance that I am loved by my partner.', instrument: 'ECR-R', dimension: 'attachment_anxiety' },

  // AVOIDANCE
  { id: 'ECR_AV1', text: 'I prefer not to show a partner how I feel deep down.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV2', text: 'I feel comfortable sharing my private thoughts and feelings with my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV3', text: 'I find it difficult to allow myself to depend on romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV4', text: 'I am very comfortable being close to romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV5', text: 'I don\'t feel comfortable opening up to romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV6', text: 'I prefer not to be too close to romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV7', text: 'I get uncomfortable when a romantic partner wants to be very close.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV8', text: 'I find it relatively easy to get close to my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV9', text: 'It\'s not difficult for me to get close to my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV10', text: 'I usually discuss my problems and concerns with my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV11', text: 'It helps to turn to my romantic partner in times of need.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV12', text: 'I tell my partner just about everything.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV13', text: 'I talk things over with my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV14', text: 'I am nervous when partners get too close to me.', instrument: 'ECR-R', dimension: 'attachment_avoidance' },
  { id: 'ECR_AV15', text: 'I feel comfortable depending on romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV16', text: 'I find it easy to depend on romantic partners.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV17', text: 'It\'s easy for me to be affectionate with my partner.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
  { id: 'ECR_AV18', text: 'My partner really understands me and my needs.', instrument: 'ECR-R', dimension: 'attachment_avoidance', reversed: true },
];

// Dark Core (D-Core) — 12 items covering Machiavellianism, Narcissism, Psychopathy
const darkCore: Question[] = [
  // MACHIAVELLIANISM
  { id: 'DC_M1', text: 'It\'s not wise to tell your secrets.', instrument: 'DARK-CORE', dimension: 'machiavellianism' },
  { id: 'DC_M2', text: 'I like to use clever manipulation to get my way.', instrument: 'DARK-CORE', dimension: 'machiavellianism' },
  { id: 'DC_M3', text: 'Whatever it takes, you must get the important people on your side.', instrument: 'DARK-CORE', dimension: 'machiavellianism' },
  { id: 'DC_M4', text: 'Avoid direct conflict with others because they may be useful in the future.', instrument: 'DARK-CORE', dimension: 'machiavellianism' },

  // NARCISSISM
  { id: 'DC_N1', text: 'People see me as a natural leader.', instrument: 'DARK-CORE', dimension: 'narcissism' },
  { id: 'DC_N2', text: 'I hate being the center of attention.', instrument: 'DARK-CORE', dimension: 'narcissism', reversed: true },
  { id: 'DC_N3', text: 'Many group activities tend to be dull without me.', instrument: 'DARK-CORE', dimension: 'narcissism' },
  { id: 'DC_N4', text: 'I know that I am special because everyone keeps telling me so.', instrument: 'DARK-CORE', dimension: 'narcissism' },

  // PSYCHOPATHY
  { id: 'DC_P1', text: 'I tend to lack remorse.', instrument: 'DARK-CORE', dimension: 'psychopathy' },
  { id: 'DC_P2', text: 'I tend to be callous or insensitive.', instrument: 'DARK-CORE', dimension: 'psychopathy' },
  { id: 'DC_P3', text: 'I tend to not be too concerned with morality or the morality of my actions.', instrument: 'DARK-CORE', dimension: 'psychopathy' },
  { id: 'DC_P4', text: 'I have used deceit or lied to get my way.', instrument: 'DARK-CORE', dimension: 'psychopathy' },
];

// World Values Survey — Emotional Intelligence & Values (20 items)
const wvs: Question[] = [
  { id: 'WVS1', text: 'I can usually tell how others are feeling.', instrument: 'WVS', dimension: 'emotional_intelligence' },
  { id: 'WVS2', text: 'I find it easy to put myself in someone else\'s shoes.', instrument: 'WVS', dimension: 'emotional_intelligence' },
  { id: 'WVS3', text: 'I am good at managing my emotions during conflict.', instrument: 'WVS', dimension: 'emotional_intelligence' },
  { id: 'WVS4', text: 'I can calm myself down when I feel anxious or upset.', instrument: 'WVS', dimension: 'emotional_intelligence' },
  { id: 'WVS5', text: 'I pay attention to how my words affect others.', instrument: 'WVS', dimension: 'emotional_intelligence' },
  { id: 'WVS6', text: 'Family should always come before personal ambition.', instrument: 'WVS', dimension: 'family_values' },
  { id: 'WVS7', text: 'Elders in the family should have the final say in major decisions.', instrument: 'WVS', dimension: 'family_values' },
  { id: 'WVS8', text: 'A married couple should live independently from their parents.', instrument: 'WVS', dimension: 'family_values' },
  { id: 'WVS9', text: 'Both partners should contribute equally to household responsibilities.', instrument: 'WVS', dimension: 'gender_roles' },
  { id: 'WVS10', text: 'A woman\'s career is just as important as a man\'s.', instrument: 'WVS', dimension: 'gender_roles' },
  { id: 'WVS11', text: 'Financial decisions should be made jointly by both partners.', instrument: 'WVS', dimension: 'financial_values' },
  { id: 'WVS12', text: 'Saving money is more important than enjoying life now.', instrument: 'WVS', dimension: 'financial_values' },
  { id: 'WVS13', text: 'I believe in a higher spiritual power.', instrument: 'WVS', dimension: 'spirituality' },
  { id: 'WVS14', text: 'Religious practices are an important part of my daily life.', instrument: 'WVS', dimension: 'spirituality' },
  { id: 'WVS15', text: 'I value personal freedom over social conformity.', instrument: 'WVS', dimension: 'autonomy' },
  { id: 'WVS16', text: 'Tradition and cultural customs are very important to me.', instrument: 'WVS', dimension: 'tradition' },
  { id: 'WVS17', text: 'I believe people should be free to choose their own lifestyle.', instrument: 'WVS', dimension: 'autonomy' },
  { id: 'WVS18', text: 'Social reputation matters a great deal to me.', instrument: 'WVS', dimension: 'tradition' },
  { id: 'WVS19', text: 'I prefer stability and routine over adventure and change.', instrument: 'WVS', dimension: 'stability' },
  { id: 'WVS20', text: 'I am comfortable with ambiguity and uncertainty in life.', instrument: 'WVS', dimension: 'stability' },
];

// Dealbreakers — Non-compensatory hard gates (12 items, categorical)
export interface DealbreakQuestion {
  id: string;
  text: string;
  instrument: 'DEALBREAKER';
  dimension: string;
  options: string[];
}

export const dealbreakers: DealbreakQuestion[] = [
  { id: 'DB1', text: 'Do you want children?', instrument: 'DEALBREAKER', dimension: 'children', options: ['Yes, definitely', 'Open to it', 'No, never'] },
  { id: 'DB2', text: 'How many children do you ideally want?', instrument: 'DEALBREAKER', dimension: 'children_count', options: ['0', '1', '2', '3+'] },
  { id: 'DB3', text: 'Where do you expect to live after marriage?', instrument: 'DEALBREAKER', dimension: 'living_arrangement', options: ['With my family/in-laws', 'Nearby but separate', 'Completely independent', 'Flexible'] },
  { id: 'DB4', text: 'How involved should in-laws be in daily married life?', instrument: 'DEALBREAKER', dimension: 'inlaw_involvement', options: ['Very involved', 'Somewhat involved', 'Minimal involvement', 'No involvement'] },
  { id: 'DB5', text: 'What is your stance on relocation for career?', instrument: 'DEALBREAKER', dimension: 'relocation', options: ['Will not relocate', 'Open to relocating domestically', 'Open to relocating internationally', 'Fully flexible'] },
  { id: 'DB6', text: 'How important is religious/spiritual alignment with your partner?', instrument: 'DEALBREAKER', dimension: 'religion_importance', options: ['Must share same faith', 'Prefer same faith', 'Doesn\'t matter', 'Prefer secular'] },
  { id: 'DB7', text: 'What is your expectation about your partner working after marriage?', instrument: 'DEALBREAKER', dimension: 'partner_career', options: ['Must work', 'Prefer they work', 'Their choice', 'Prefer they don\'t work'] },
  { id: 'DB8', text: 'How do you feel about substance use (alcohol/tobacco)?', instrument: 'DEALBREAKER', dimension: 'substance_use', options: ['Absolutely not acceptable', 'Occasional social use is fine', 'Regular use is fine', 'No preference'] },
  { id: 'DB9', text: 'What is your stance on financial independence?', instrument: 'DEALBREAKER', dimension: 'financial_independence', options: ['Fully joint finances', 'Mostly joint with personal allowance', 'Split finances equally', 'Completely separate finances'] },
  { id: 'DB10', text: 'How important is physical fitness/health to you in a partner?', instrument: 'DEALBREAKER', dimension: 'health', options: ['Very important', 'Somewhat important', 'Not important'] },
  { id: 'DB11', text: 'What is your communication style during conflict?', instrument: 'DEALBREAKER', dimension: 'conflict_style', options: ['Discuss immediately', 'Need time to cool off first', 'Avoid conflict', 'Seek third-party mediation'] },
  { id: 'DB12', text: 'How do you feel about pets in the household?', instrument: 'DEALBREAKER', dimension: 'pets', options: ['Love pets, must have them', 'Open to pets', 'Prefer no pets', 'Absolutely no pets'] },
];

// Combine all Likert-scale questions
export const likertQuestions: Question[] = [...ipipNeo, ...ecrR, ...darkCore, ...wvs];

// Total question count
export const TOTAL_QUESTIONS = likertQuestions.length + dealbreakers.length;

// Section metadata for UI
export const sections = [
  { id: 'personality', label: 'Personality Profile', instrument: 'IPIP-NEO' as const, count: 50 },
  { id: 'attachment', label: 'Attachment Style', instrument: 'ECR-R' as const, count: 36 },
  { id: 'dark_traits', label: 'Interpersonal Style', instrument: 'DARK-CORE' as const, count: 12 },
  { id: 'values', label: 'Values & Emotional Intelligence', instrument: 'WVS' as const, count: 20 },
  { id: 'dealbreakers', label: 'Life Priorities & Dealbreakers', instrument: 'DEALBREAKER' as const, count: 12 },
];
