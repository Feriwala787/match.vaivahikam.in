export interface LifestyleQuestion {
  id: string;
  text: string;
  category: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  parentId?: string;
  showWhen?: string[]; // show this child when parent answer is one of these
}

export const lifestyleQuestions: LifestyleQuestion[] = [
  // ═══ ENTERTAINMENT & ARTS ═══
  {
    id: 'LS1', text: 'Do you actively listen to music?', category: 'Entertainment & Arts',
    type: 'single', options: ['Yes', 'No'],
  },
  {
    id: 'LS1a', text: 'What are your top 2 favorite genres?', category: 'Entertainment & Arts',
    type: 'multi', options: ['Classical', 'Pop', 'Rock', 'Hip-Hop', 'Regional/Folk', 'Electronic', 'Indie', 'R&B/Soul', 'Jazz'],
    parentId: 'LS1', showWhen: ['Yes'],
  },
  {
    id: 'LS1b', text: 'Who is your all-time favorite artist, or what is your go-to song?', category: 'Entertainment & Arts',
    type: 'text',
    parentId: 'LS1', showWhen: ['Yes'],
  },
  {
    id: 'LS2', text: 'How do you prefer to watch movies or shows?', category: 'Entertainment & Arts',
    type: 'single', options: ['Love going to the cinema', 'Streaming at home (Netflix, etc.)', 'I rarely watch movies/shows'],
  },
  {
    id: 'LS2a', text: 'What is your favorite genre to watch?', category: 'Entertainment & Arts',
    type: 'single', options: ['Sci-Fi', 'Rom-Com', 'Action', 'Thriller', 'Documentaries', 'Drama', 'Anime', 'Horror'],
    parentId: 'LS2', showWhen: ['Love going to the cinema', 'Streaming at home (Netflix, etc.)'],
  },

  // ═══ PHYSICAL ACTIVITY & SPORTS ═══
  {
    id: 'LS3', text: 'How important is physical fitness in your daily life?', category: 'Physical Activity & Sports',
    type: 'single', options: ['Very important (Daily routine)', 'Somewhat important (A few times a week)', 'Not a priority'],
  },
  {
    id: 'LS3a', text: 'How do you usually stay active?', category: 'Physical Activity & Sports',
    type: 'multi', options: ['Gym/Weights', 'Yoga', 'Running/Walking', 'Swimming', 'Home Workouts', 'Dance', 'Martial Arts'],
    parentId: 'LS3', showWhen: ['Very important (Daily routine)', 'Somewhat important (A few times a week)'],
  },
  {
    id: 'LS4', text: 'Are you interested in sports?', category: 'Physical Activity & Sports',
    type: 'single', options: ['Yes, I actively follow/play', 'No, not really'],
  },
  {
    id: 'LS4a', text: 'Which sports are you most passionate about?', category: 'Physical Activity & Sports',
    type: 'multi', options: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'F1', 'Kabaddi', 'Chess', 'Table Tennis'],
    parentId: 'LS4', showWhen: ['Yes, I actively follow/play'],
  },
  {
    id: 'LS4b', text: 'Do you play them, or just watch?', category: 'Physical Activity & Sports',
    type: 'single', options: ['I play', 'I only watch', 'A bit of both'],
    parentId: 'LS4', showWhen: ['Yes, I actively follow/play'],
  },

  // ═══ WEEKEND VIBE & TRAVEL ═══
  {
    id: 'LS5', text: 'If you have a completely free weekend, what is your ideal way to spend it?', category: 'Weekend Vibe & Travel',
    type: 'single', options: ['Relaxing at home and recharging', 'Exploring the city or trying new activities', 'Socializing and meeting friends/family', 'Catching up on chores and errands'],
  },
  {
    id: 'LS6', text: 'What is your relationship with traveling?', category: 'Weekend Vibe & Travel',
    type: 'single', options: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)', 'I prefer the comfort of home'],
  },
  {
    id: 'LS6a', text: 'What is your preferred travel style?', category: 'Weekend Vibe & Travel',
    type: 'single', options: ['Luxury resorts & relaxing', 'Backpacking & adventure', 'Cultural & historical sites', 'Nature & wildlife'],
    parentId: 'LS6', showWhen: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)'],
  },
  {
    id: 'LS6b', text: 'Name one dream destination on your bucket list.', category: 'Weekend Vibe & Travel',
    type: 'text',
    parentId: 'LS6', showWhen: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)'],
  },

  // ═══ CONSUMPTION & DINING ═══
  {
    id: 'LS7', text: 'What is your general approach to clothing and fashion?', category: 'Consumption & Dining',
    type: 'single', options: ['Strictly branded / designer wear', 'Comfort is more important than brands', 'A mix of both', 'Traditional/ethnic wear mostly', 'I do not care about fashion at all'],
  },
  {
    id: 'LS8', text: 'How often do you eat out or order food?', category: 'Consumption & Dining',
    type: 'single', options: ['Multiple times a week', 'About once a week', 'Rarely / Special occasions only'],
  },
  {
    id: 'LS8a', text: 'What is your preferred dining vibe?', category: 'Consumption & Dining',
    type: 'single', options: ['Fine dining / Fancy restaurants', 'Casual cafes', 'Street food', 'Pubs / Lounges'],
    parentId: 'LS8', showWhen: ['Multiple times a week', 'About once a week'],
  },

  // ═══ PETS & ANIMALS ═══
  {
    id: 'LS9', text: 'Are you an animal lover / do you want pets at home?', category: 'Pets & Animals',
    type: 'single', options: ['Yes, absolutely', 'No, I prefer a pet-free home', 'I am neutral / okay either way'],
  },
  {
    id: 'LS9a', text: 'Are you a dog person, a cat person, or both?', category: 'Pets & Animals',
    type: 'single', options: ['Dogs', 'Cats', 'Both', 'Other'],
    parentId: 'LS9', showWhen: ['Yes, absolutely'],
  },
];

// Get only parent (mandatory) questions
export const parentQuestions = lifestyleQuestions.filter(q => !q.parentId);

// Get visible child questions based on current answers
export function getVisibleQuestions(answers: Record<string, string | string[]>): LifestyleQuestion[] {
  return lifestyleQuestions.filter(q => {
    if (!q.parentId) return true;
    const parentAnswer = answers[q.parentId];
    if (!parentAnswer) return false;
    const parentVal = Array.isArray(parentAnswer) ? parentAnswer[0] : parentAnswer;
    return q.showWhen?.includes(parentVal) ?? false;
  });
}
