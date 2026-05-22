export interface LifestyleQuestion {
  id: string;
  text: string;
  category: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  parentId?: string;
  showWhen?: string[];
  optional?: boolean;
}

export const lifestyleQuestions: LifestyleQuestion[] = [
  // ═══════════════════════════════════════════
  // STEP 1: LEISURE & ENTERTAINMENT
  // ═══════════════════════════════════════════

  // Music
  { id: 'music_active', text: 'Do you actively listen to music?', category: 'Leisure & Entertainment', type: 'single', options: ['Yes', 'No'] },
  { id: 'music_genre', text: 'What are your top 2 favorite genres?', category: 'Leisure & Entertainment', type: 'multi', options: ['Classical', 'Pop', 'Rock', 'Hip-Hop', 'Regional/Folk', 'Electronic', 'Indie', 'R&B/Soul', 'Jazz', 'Bollywood'], parentId: 'music_active', showWhen: ['Yes'] },
  { id: 'music_favorite', text: 'Who is your favorite artist, or what is your favorite song?', category: 'Leisure & Entertainment', type: 'text', parentId: 'music_active', showWhen: ['Yes'], optional: true },

  // Screen
  { id: 'screen_preference', text: 'How do you prefer to watch movies/shows?', category: 'Leisure & Entertainment', type: 'single', options: ['Love going to the cinema', 'Streaming at home', 'I rarely watch movies/shows'] },
  { id: 'screen_genre', text: 'What is your favorite genre to watch?', category: 'Leisure & Entertainment', type: 'single', options: ['Sci-Fi', 'Rom-Com', 'Action', 'Thriller', 'Documentaries', 'Drama', 'Anime', 'Horror'], parentId: 'screen_preference', showWhen: ['Love going to the cinema', 'Streaming at home'] },
  { id: 'screen_favorite', text: 'What is your all-time favorite movie or TV show?', category: 'Leisure & Entertainment', type: 'text', parentId: 'screen_preference', showWhen: ['Love going to the cinema', 'Streaming at home'], optional: true },

  // Culture
  { id: 'culture_active', text: 'Do you enjoy reading books or visiting cultural spots like museums?', category: 'Leisure & Entertainment', type: 'single', options: ['Yes', 'No'] },
  { id: 'culture_favorite', text: 'What is your favorite book, author, or piece of art?', category: 'Leisure & Entertainment', type: 'text', parentId: 'culture_active', showWhen: ['Yes'], optional: true },

  // Weekend
  { id: 'weekend_vibe', text: 'If you have a completely free weekend, what is your ideal vibe?', category: 'Leisure & Entertainment', type: 'single', options: ['Relaxing at home and recharging', 'Exploring the city or trying new activities', 'Socializing and meeting friends/family', 'Catching up on chores and errands'] },
  { id: 'perfect_sunday', text: 'Describe your perfect Sunday in one sentence.', category: 'Leisure & Entertainment', type: 'text', optional: true },

  // ═══════════════════════════════════════════
  // STEP 2: ACTIVITY & TRAVEL
  // ═══════════════════════════════════════════

  // Fitness
  { id: 'fitness_importance', text: 'How important is physical fitness in your daily life?', category: 'Activity & Travel', type: 'single', options: ['Very important (Daily routine)', 'Somewhat important (A few times a week)', 'Not a priority'] },
  { id: 'fitness_method', text: 'How do you usually stay active?', category: 'Activity & Travel', type: 'multi', options: ['Gym/Weights', 'Yoga', 'Running/Walking', 'Swimming', 'Sports', 'Home Workouts', 'Dance', 'Martial Arts'], parentId: 'fitness_importance', showWhen: ['Very important (Daily routine)', 'Somewhat important (A few times a week)'] },

  // Sports
  { id: 'sports_active', text: 'Are you passionate about sports?', category: 'Activity & Travel', type: 'single', options: ['Yes, I actively follow/play', 'No, not really'] },
  { id: 'sports_which', text: 'Which sports are you most passionate about?', category: 'Activity & Travel', type: 'multi', options: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'F1', 'Kabaddi', 'Chess', 'Table Tennis', 'Volleyball'], parentId: 'sports_active', showWhen: ['Yes, I actively follow/play'] },
  { id: 'sports_favorite', text: 'Who is your favorite athlete or sports team?', category: 'Activity & Travel', type: 'text', parentId: 'sports_active', showWhen: ['Yes, I actively follow/play'], optional: true },

  // Travel
  { id: 'travel_frequency', text: 'What is your relationship with traveling?', category: 'Activity & Travel', type: 'single', options: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)', 'I prefer the comfort of home'] },
  { id: 'travel_style', text: 'What is your preferred travel style?', category: 'Activity & Travel', type: 'single', options: ['Luxury resorts & relaxing', 'Backpacking & adventure', 'Cultural & historical sites', 'Nature & wildlife'], parentId: 'travel_frequency', showWhen: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)'] },
  { id: 'travel_dream', text: 'What is the number one dream destination on your bucket list?', category: 'Activity & Travel', type: 'text', parentId: 'travel_frequency', showWhen: ['I love it and travel frequently', 'I enjoy it occasionally (1-2 times a year)'], optional: true },

  // ═══════════════════════════════════════════
  // STEP 3: DAILY CONSUMPTION & PETS
  // ═══════════════════════════════════════════

  // Fashion
  { id: 'fashion_style', text: 'What is your general approach to clothing and fashion?', category: 'Consumption & Pets', type: 'single', options: ['Strictly branded / designer wear', 'Comfort is more important than brands', 'A mix of both', 'Traditional/ethnic wear mostly', 'I do not care about fashion at all'] },

  // Dining
  { id: 'dining_frequency', text: 'How often do you eat out or order food?', category: 'Consumption & Pets', type: 'single', options: ['Multiple times a week', 'About once a week', 'Rarely / Special occasions only'] },
  { id: 'dining_vibe', text: 'What is your preferred dining vibe?', category: 'Consumption & Pets', type: 'single', options: ['Fine dining / Fancy restaurants', 'Casual cafes', 'Street food', 'Pubs / Lounges'], parentId: 'dining_frequency', showWhen: ['Multiple times a week', 'About once a week'] },
  { id: 'dining_favorite', text: 'What is your absolute favorite dish or cuisine?', category: 'Consumption & Pets', type: 'text', parentId: 'dining_frequency', showWhen: ['Multiple times a week', 'About once a week'], optional: true },

  // Pets
  { id: 'pets_preference', text: 'Do you want pets at home?', category: 'Consumption & Pets', type: 'single', options: ['Yes, absolutely', 'No, I prefer a pet-free home', 'I am neutral / okay either way'] },
  { id: 'pets_type', text: 'Are you a dog person, a cat person, or both?', category: 'Consumption & Pets', type: 'single', options: ['Dogs', 'Cats', 'Both', 'Other'], parentId: 'pets_preference', showWhen: ['Yes, absolutely'] },

  // ═══════════════════════════════════════════
  // STEP 4: FUTURE TRAJECTORY (Critical)
  // ═══════════════════════════════════════════

  // Work-Life
  { id: 'work_philosophy', text: 'What is your philosophy on work?', category: 'Future Trajectory', type: 'single', options: ['Work is my passion — I go all in', 'Strict 9-to-5 boundary', 'Flexible integration of work and life'] },

  // Partner Career
  { id: 'partner_career', text: "What are your expectations for your partner's career after marriage?", category: 'Future Trajectory', type: 'single', options: ['Dual-income household', 'Traditional single-income', 'Flexible — whatever works', 'Entrepreneurial duo'] },

  // Spending
  { id: 'spending_habits', text: 'How would you describe your saving habits?', category: 'Future Trajectory', type: 'single', options: ['Aggressive saver', 'Balanced — save and enjoy', 'Live in the moment'] },

  // Household Finances
  { id: 'finances_merged', text: 'How do you envision managing money in marriage?', category: 'Future Trajectory', type: 'single', options: ['Completely merged', 'Completely separate', 'Hybrid approach'] },

  // Geography
  { id: 'geography_settle', text: 'Where do you see yourself settling down long-term?', category: 'Future Trajectory', type: 'single', options: ['Current city', 'Another major domestic city', 'Settle abroad', 'Open to anywhere'] },
  { id: 'geography_where', text: 'Which specific region or country?', category: 'Future Trajectory', type: 'text', parentId: 'geography_settle', showWhen: ['Settle abroad', 'Open to anywhere'], optional: true },

  // Relocation
  { id: 'relocation_willingness', text: "Are you willing to relocate for your partner's career?", category: 'Future Trajectory', type: 'single', options: ['Yes, absolutely', 'Yes, with conditions', 'No, my location is fixed'] },

  // Ultimate Dream
  { id: 'ultimate_dream', text: 'When you look 20 years into the future, what is your ultimate dream?', category: 'Future Trajectory', type: 'single', options: ['Bustling house full of family', 'Quiet countryside life', 'High-flying urban luxury', 'Social impact & legacy', 'Early retirement & freedom'] },
];

// Get visible questions based on current answers (conditional branching)
export function getVisibleQuestions(answers: Record<string, string | string[]>): LifestyleQuestion[] {
  return lifestyleQuestions.filter(q => {
    if (!q.parentId) return true;
    const parentAnswer = answers[q.parentId];
    if (!parentAnswer) return false;
    const parentVal = Array.isArray(parentAnswer) ? parentAnswer[0] : parentAnswer;
    return q.showWhen?.includes(parentVal) ?? false;
  });
}

// Count only required (non-optional) visible questions for completion check
export function getRequiredCount(answers: Record<string, string | string[]>): { answered: number; total: number } {
  const visible = getVisibleQuestions(answers);
  const required = visible.filter(q => !q.optional);
  const answered = required.filter(q => {
    const val = answers[q.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return val.trim().length > 0;
  }).length;
  return { answered, total: required.length };
}
