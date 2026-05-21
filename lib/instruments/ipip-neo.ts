import { Question } from './types';

// IPIP-NEO 120 Items — Big Five Personality (24 items per domain, 6 facets × 4 items)
// Source: International Personality Item Pool (ipip.ori.org) — Public Domain

export const ipipNeo: Question[] = [
  // ═══ OPENNESS TO EXPERIENCE (24 items) ═══

  // Imagination
  { id: 'O1', text: 'I have a vivid imagination.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination' },
  { id: 'O2', text: 'I enjoy wild flights of fantasy.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination' },
  { id: 'O3', text: 'I love to daydream.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination' },
  { id: 'O4', text: 'I do not have a good imagination.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'imagination', reversed: true },

  // Artistic Interests
  { id: 'O5', text: 'I believe in the importance of art.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'artistic_interests' },
  { id: 'O6', text: 'I see beauty in things that others might not notice.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'artistic_interests' },
  { id: 'O7', text: 'I do not like art.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'artistic_interests', reversed: true },
  { id: 'O8', text: 'I do not enjoy going to art museums.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'artistic_interests', reversed: true },

  // Emotionality
  { id: 'O9', text: 'I experience my emotions intensely.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'emotionality' },
  { id: 'O10', text: 'I feel others\' emotions.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'emotionality' },
  { id: 'O11', text: 'I rarely notice my emotional reactions.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'emotionality', reversed: true },
  { id: 'O12', text: 'I don\'t understand people who get emotional.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'emotionality', reversed: true },

  // Adventurousness
  { id: 'O13', text: 'I prefer variety to routine.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'adventurousness' },
  { id: 'O14', text: 'I like to visit new places.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'adventurousness' },
  { id: 'O15', text: 'I am attached to conventional ways.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'adventurousness', reversed: true },
  { id: 'O16', text: 'I prefer to stick with things that I know.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'adventurousness', reversed: true },

  // Intellect
  { id: 'O17', text: 'I love to think up new ways of doing things.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O18', text: 'I enjoy hearing new ideas.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O19', text: 'I am interested in abstract ideas.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect' },
  { id: 'O20', text: 'I avoid philosophical discussions.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'intellect', reversed: true },

  // Liberalism
  { id: 'O21', text: 'I tend to vote for progressive political candidates.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'liberalism' },
  { id: 'O22', text: 'I believe that there is no absolute right or wrong.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'liberalism' },
  { id: 'O23', text: 'I believe that we should be tough on crime.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'liberalism', reversed: true },
  { id: 'O24', text: 'I believe that too much tax money goes to support artists.', instrument: 'IPIP-NEO', dimension: 'openness', facet: 'liberalism', reversed: true },

  // ═══ CONSCIENTIOUSNESS (24 items) ═══

  // Self-Efficacy
  { id: 'C1', text: 'I complete tasks successfully.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_efficacy' },
  { id: 'C2', text: 'I excel in what I do.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_efficacy' },
  { id: 'C3', text: 'I handle tasks smoothly.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_efficacy' },
  { id: 'C4', text: 'I misjudge situations.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_efficacy', reversed: true },

  // Orderliness
  { id: 'C5', text: 'I like order.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness' },
  { id: 'C6', text: 'I keep things tidy.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness' },
  { id: 'C7', text: 'I leave my belongings around.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness', reversed: true },
  { id: 'C8', text: 'I often forget to put things back in their proper place.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'orderliness', reversed: true },

  // Dutifulness
  { id: 'C9', text: 'I follow through on my commitments.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness' },
  { id: 'C10', text: 'I keep my promises.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness' },
  { id: 'C11', text: 'I tell the truth.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness' },
  { id: 'C12', text: 'I break rules.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'dutifulness', reversed: true },

  // Achievement-Striving
  { id: 'C13', text: 'I work hard.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'achievement_striving' },
  { id: 'C14', text: 'I go straight for the goal.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'achievement_striving' },
  { id: 'C15', text: 'I turn plans into actions.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'achievement_striving' },
  { id: 'C16', text: 'I do just enough work to get by.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'achievement_striving', reversed: true },

  // Self-Discipline
  { id: 'C17', text: 'I get chores done right away.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline' },
  { id: 'C18', text: 'I am always prepared.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline' },
  { id: 'C19', text: 'I waste my time.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline', reversed: true },
  { id: 'C20', text: 'I find it difficult to get down to work.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'self_discipline', reversed: true },

  // Cautiousness
  { id: 'C21', text: 'I think things through before acting.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'cautiousness' },
  { id: 'C22', text: 'I avoid mistakes.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'cautiousness' },
  { id: 'C23', text: 'I rush into things.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'cautiousness', reversed: true },
  { id: 'C24', text: 'I act without thinking.', instrument: 'IPIP-NEO', dimension: 'conscientiousness', facet: 'cautiousness', reversed: true },

  // ═══ EXTRAVERSION (24 items) ═══

  // Friendliness
  { id: 'E1', text: 'I make friends easily.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'friendliness' },
  { id: 'E2', text: 'I warm up quickly to others.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'friendliness' },
  { id: 'E3', text: 'I feel comfortable around people.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'friendliness' },
  { id: 'E4', text: 'I am hard to get to know.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'friendliness', reversed: true },

  // Gregariousness
  { id: 'E5', text: 'I love large parties.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness' },
  { id: 'E6', text: 'I talk to a lot of different people at parties.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness' },
  { id: 'E7', text: 'I prefer to be alone.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness', reversed: true },
  { id: 'E8', text: 'I avoid crowds.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'gregariousness', reversed: true },

  // Assertiveness
  { id: 'E9', text: 'I take charge.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness' },
  { id: 'E10', text: 'I try to lead others.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness' },
  { id: 'E11', text: 'I have a strong personality.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness' },
  { id: 'E12', text: 'I wait for others to lead the way.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'assertiveness', reversed: true },

  // Activity Level
  { id: 'E13', text: 'I am always busy.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'activity_level' },
  { id: 'E14', text: 'I am always on the go.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'activity_level' },
  { id: 'E15', text: 'I do a lot in my spare time.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'activity_level' },
  { id: 'E16', text: 'I like to take it easy.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'activity_level', reversed: true },

  // Excitement-Seeking
  { id: 'E17', text: 'I love excitement.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'excitement_seeking' },
  { id: 'E18', text: 'I seek adventure.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'excitement_seeking' },
  { id: 'E19', text: 'I enjoy being reckless.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'excitement_seeking' },
  { id: 'E20', text: 'I would never go hang gliding or bungee jumping.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'excitement_seeking', reversed: true },

  // Cheerfulness
  { id: 'E21', text: 'I radiate joy.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'cheerfulness' },
  { id: 'E22', text: 'I have a lot of fun.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'cheerfulness' },
  { id: 'E23', text: 'I laugh a lot.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'cheerfulness' },
  { id: 'E24', text: 'I am not easily amused.', instrument: 'IPIP-NEO', dimension: 'extraversion', facet: 'cheerfulness', reversed: true },

  // ═══ AGREEABLENESS (24 items) ═══

  // Trust
  { id: 'A1', text: 'I trust others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'trust' },
  { id: 'A2', text: 'I believe that others have good intentions.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'trust' },
  { id: 'A3', text: 'I distrust people.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'trust', reversed: true },
  { id: 'A4', text: 'I suspect hidden motives in others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'trust', reversed: true },

  // Morality
  { id: 'A5', text: 'I would never cheat on my taxes.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'morality' },
  { id: 'A6', text: 'I stick to the rules.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'morality' },
  { id: 'A7', text: 'I use flattery to get ahead.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'morality', reversed: true },
  { id: 'A8', text: 'I pretend to be concerned for others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'morality', reversed: true },

  // Altruism
  { id: 'A9', text: 'I make people feel welcome.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism' },
  { id: 'A10', text: 'I anticipate the needs of others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism' },
  { id: 'A11', text: 'I love to help others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism' },
  { id: 'A12', text: 'I am indifferent to the feelings of others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'altruism', reversed: true },

  // Cooperation
  { id: 'A13', text: 'I hate to seem pushy.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'cooperation' },
  { id: 'A14', text: 'I avoid imposing my will on others.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'cooperation' },
  { id: 'A15', text: 'I insult people.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'cooperation', reversed: true },
  { id: 'A16', text: 'I love a good fight.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'cooperation', reversed: true },

  // Modesty
  { id: 'A17', text: 'I dislike being the center of attention.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'modesty' },
  { id: 'A18', text: 'I consider myself an ordinary person.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'modesty' },
  { id: 'A19', text: 'I think highly of myself.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'modesty', reversed: true },
  { id: 'A20', text: 'I boast about my virtues.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'modesty', reversed: true },

  // Sympathy
  { id: 'A21', text: 'I sympathize with the homeless.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'sympathy' },
  { id: 'A22', text: 'I feel sympathy for those who are worse off than myself.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'sympathy' },
  { id: 'A23', text: 'I am not interested in other people\'s problems.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'sympathy', reversed: true },
  { id: 'A24', text: 'I tend to dislike soft-hearted people.', instrument: 'IPIP-NEO', dimension: 'agreeableness', facet: 'sympathy', reversed: true },

  // ═══ NEUROTICISM (24 items) ═══

  // Anxiety
  { id: 'N1', text: 'I worry about things.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety' },
  { id: 'N2', text: 'I fear for the worst.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety' },
  { id: 'N3', text: 'I am afraid of many things.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety' },
  { id: 'N4', text: 'I am relaxed most of the time.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anxiety', reversed: true },

  // Anger
  { id: 'N5', text: 'I get angry easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anger' },
  { id: 'N6', text: 'I get irritated easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anger' },
  { id: 'N7', text: 'I lose my temper.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anger' },
  { id: 'N8', text: 'I rarely get irritated.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'anger', reversed: true },

  // Depression
  { id: 'N9', text: 'I often feel blue.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N10', text: 'I dislike myself.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N11', text: 'I feel that my life lacks direction.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression' },
  { id: 'N12', text: 'I feel comfortable with myself.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'depression', reversed: true },

  // Self-Consciousness
  { id: 'N13', text: 'I find it difficult to approach others.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'self_consciousness' },
  { id: 'N14', text: 'I am easily embarrassed.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'self_consciousness' },
  { id: 'N15', text: 'I stumble over my words.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'self_consciousness' },
  { id: 'N16', text: 'I am not embarrassed easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'self_consciousness', reversed: true },

  // Immoderation
  { id: 'N17', text: 'I go on binges.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'immoderation' },
  { id: 'N18', text: 'I can\'t resist cravings.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'immoderation' },
  { id: 'N19', text: 'I easily resist temptations.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'immoderation', reversed: true },
  { id: 'N20', text: 'I am able to control my cravings.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'immoderation', reversed: true },

  // Vulnerability
  { id: 'N21', text: 'I panic easily.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'vulnerability' },
  { id: 'N22', text: 'I become overwhelmed by events.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'vulnerability' },
  { id: 'N23', text: 'I feel that I\'m unable to deal with things.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'vulnerability' },
  { id: 'N24', text: 'I remain calm under pressure.', instrument: 'IPIP-NEO', dimension: 'neuroticism', facet: 'vulnerability', reversed: true },
];
