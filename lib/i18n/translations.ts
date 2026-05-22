export type Locale = 'en' | 'hi';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Assessment instructions
    'assessment.title': 'Psychological Assessment',
    'assessment.subtitle': '265 questions • ~60-90 minutes • Auto-saves your progress',
    'assessment.how_works': 'How This Works',
    'assessment.how_works_desc': 'You will see statements about yourself. For each one, choose how much you agree or disagree. There are no right or wrong answers — just be honest about who you actually are, not who you wish you were.',
    'assessment.options_title': 'What the Options Mean',
    'assessment.sd': 'Strongly Disagree',
    'assessment.sd_desc': 'This is completely NOT me.',
    'assessment.d': 'Disagree',
    'assessment.d_desc': 'Mostly not me, but not extreme.',
    'assessment.n': 'Neutral',
    'assessment.n_desc': "I'm in the middle / it depends.",
    'assessment.a': 'Agree',
    'assessment.a_desc': 'Mostly true for me.',
    'assessment.sa': 'Strongly Agree',
    'assessment.sa_desc': 'This is 100% me.',
    'assessment.guidelines': 'Important Guidelines',
    'assessment.guideline_honest': 'Be honest, not aspirational. Answer as you ARE, not as you want to be.',
    'assessment.guideline_instinct': "Don't overthink. Your first instinct is usually the most accurate.",
    'assessment.guideline_private': 'No one sees your raw answers. Only computed scores are used for matching.',
    'assessment.guideline_save': 'You can close and come back. Progress auto-saves after every answer.',
    'assessment.guideline_time': 'Take your time. Rushing produces inaccurate results.',
    'assessment.begin': 'I Understand — Begin Assessment',
    'assessment.submit': 'Submit',
    'assessment.submitting': 'Submitting...',
    'assessment.previous': '← Previous',
    'assessment.next': 'Next →',

    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.lifestyle': 'Lifestyle',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.assessment': 'Assessment',
    'dashboard.completed': '✓ Completed',
    'dashboard.not_completed': '⏳ Not yet completed',
    'dashboard.lifestyle': '🎨 Hobbies & Lifestyle',
    'dashboard.send_request': 'Send New Request',
  },
  hi: {
    // Assessment instructions
    'assessment.title': 'मनोवैज्ञानिक मूल्यांकन',
    'assessment.subtitle': '265 प्रश्न • ~60-90 मिनट • आपकी प्रगति स्वतः सहेजी जाती है',
    'assessment.how_works': 'यह कैसे काम करता है',
    'assessment.how_works_desc': 'आपको अपने बारे में कथन दिखाई देंगे। प्रत्येक के लिए चुनें कि आप कितना सहमत या असहमत हैं। कोई सही या गलत उत्तर नहीं है — बस ईमानदार रहें कि आप वास्तव में कैसे हैं।',
    'assessment.options_title': 'विकल्पों का अर्थ',
    'assessment.sd': 'पूर्णतः असहमत',
    'assessment.sd_desc': 'यह बिल्कुल मेरे जैसा नहीं है।',
    'assessment.d': 'असहमत',
    'assessment.d_desc': 'ज्यादातर मेरे जैसा नहीं।',
    'assessment.n': 'तटस्थ',
    'assessment.n_desc': 'मैं बीच में हूँ / निर्भर करता है।',
    'assessment.a': 'सहमत',
    'assessment.a_desc': 'ज्यादातर मेरे लिए सच है।',
    'assessment.sa': 'पूर्णतः सहमत',
    'assessment.sa_desc': 'यह 100% मैं हूँ।',
    'assessment.guidelines': 'महत्वपूर्ण दिशानिर्देश',
    'assessment.guideline_honest': 'ईमानदार रहें। जैसे आप हैं वैसे उत्तर दें, जैसा बनना चाहते हैं वैसे नहीं।',
    'assessment.guideline_instinct': 'ज्यादा न सोचें। आपकी पहली प्रवृत्ति आमतौर पर सबसे सटीक होती है।',
    'assessment.guideline_private': 'कोई आपके कच्चे उत्तर नहीं देखता। केवल गणना किए गए स्कोर का उपयोग होता है।',
    'assessment.guideline_save': 'आप बंद करके वापस आ सकते हैं। प्रगति स्वतः सहेजी जाती है।',
    'assessment.guideline_time': 'अपना समय लें। जल्दबाजी से गलत परिणाम आते हैं।',
    'assessment.begin': 'मैं समझता/समझती हूँ — मूल्यांकन शुरू करें',
    'assessment.submit': 'जमा करें',
    'assessment.submitting': 'जमा हो रहा है...',
    'assessment.previous': '← पिछला',
    'assessment.next': 'अगला →',

    // Nav
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.lifestyle': 'जीवनशैली',
    'nav.settings': 'सेटिंग्स',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',
    'nav.logout': 'लॉगआउट',

    // Dashboard
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.assessment': 'मूल्यांकन',
    'dashboard.completed': '✓ पूर्ण',
    'dashboard.not_completed': '⏳ अभी तक पूर्ण नहीं',
    'dashboard.lifestyle': '🎨 शौक और जीवनशैली',
    'dashboard.send_request': 'नया अनुरोध भेजें',
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}
