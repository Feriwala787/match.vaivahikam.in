import { Question } from './types';

// ECR-R (Experiences in Close Relationships - Revised)
// Fraley, Waller & Brennan (2000) — Public domain equivalent items
// 18 Anxiety + 18 Avoidance = 36 items, 7-point Likert adapted to 5-point

export const ecrR: Question[] = [
  // ═══ ATTACHMENT ANXIETY (18 items) ═══
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

  // ═══ ATTACHMENT AVOIDANCE (18 items) ═══
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
