import Layout from '@/components/Layout';
import Head from 'next/head';

const instruments = [
  {
    name: 'IPIP-NEO 120',
    items: 120,
    measures: 'Big Five Personality — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (30 facets)',
    source: 'International Personality Item Pool (ipip.ori.org)',
    reference: 'Goldberg, L.R. (1999). A broad-bandwidth, public domain, personality inventory measuring the lower-level facets of several five-factor models.',
    why: 'The Big Five is the most validated personality model in psychology. Similarity on Conscientiousness and Agreeableness is the strongest predictor of relationship satisfaction.',
  },
  {
    name: 'ECR-R (Attachment)',
    items: 36,
    measures: 'Attachment Anxiety (fear of abandonment) & Attachment Avoidance (fear of intimacy)',
    source: 'Fraley, Waller & Brennan (2000)',
    reference: 'Fraley, R.C., Waller, N.G., & Brennan, K.A. (2000). An item response theory analysis of self-report measures of adult attachment. Journal of Personality and Social Psychology, 78(2), 350-365.',
    why: 'Attachment style is the #1 predictor of relationship quality. The Anxious-Avoidant pairing is the leading predictor of marital dissatisfaction.',
  },
  {
    name: 'Short Dark Triad (SD3)',
    items: 27,
    measures: 'Machiavellianism (manipulation), Narcissism (grandiosity), Psychopathy (callousness)',
    source: 'Jones & Paulhus (2014)',
    reference: 'Jones, D.N., & Paulhus, D.L. (2014). Introducing the Short Dark Triad (SD3): A brief measure of dark personality traits. Assessment, 21(1), 28-41.',
    why: 'Used as a protective filter. High Dark Triad scores predict exploitative relationship behavior. Our algorithm auto-blocks dangerous pairings.',
  },
  {
    name: 'TEIQue-SF (Emotional Intelligence)',
    items: 30,
    measures: 'Well-being, Self-Control, Emotionality (empathy), Sociability',
    source: 'Petrides (2009)',
    reference: 'Petrides, K.V. (2009). Psychometric properties of the Trait Emotional Intelligence Questionnaire (TEIQue). In C. Stough, D.H. Saklofske, & J.D.A. Parker (Eds.), Assessing Emotional Intelligence.',
    why: 'Emotional intelligence predicts conflict resolution ability. Large EQ gaps between partners lead to emotional labor imbalance.',
  },
  {
    name: 'Brief COPE',
    items: 14,
    measures: 'Active Coping (problem-solving), Avoidant Coping (denial/shutdown), Support-Seeking',
    source: 'Carver (1997)',
    reference: 'Carver, C.S. (1997). You want to measure coping but your protocol\'s too long: Consider the Brief COPE. International Journal of Behavioral Medicine, 4(1), 92-100.',
    why: 'How partners handle stress determines whether conflicts get resolved or fester. Two avoidant copers = chronic unresolved resentment.',
  },
  {
    name: 'NFC-18 (Need for Cognition)',
    items: 18,
    measures: 'Enjoyment of deep thinking, intellectual engagement, preference for complex problems',
    source: 'Cacioppo, Petty & Kao (1984)',
    reference: 'Cacioppo, J.T., Petty, R.E., & Kao, C.F. (1984). The efficient assessment of need for cognition. Journal of Personality Assessment, 48(3), 306-307.',
    why: 'Intellectual compatibility contributes to long-term conversational satisfaction. Weighted at 5% — a bonus, not a dealbreaker.',
  },
];

export default function Science() {
  return (
    <>
      <Head>
        <title>The Science — Relational Blueprint</title>
      </Head>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">The Science Behind the Algorithm</h1>
            <p className="text-text-muted mt-2">Every question in our assessment comes from a peer-reviewed, public-domain psychological instrument.</p>
          </div>

          {/* Methodology */}
          <div className="bg-surface rounded-2xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-4">Scoring Methodology</h2>
            <div className="space-y-3 text-sm text-text-muted">
              <p><span className="text-text font-medium">Phase 1 — Reward:</span> Euclidean distance across healthy personality and EQ dimensions. Measures how similar two people are on traits that predict harmony.</p>
              <p><span className="text-text font-medium">Phase 2 — Audit:</span> Clinical penalty matrix that detects and penalizes dangerous trait combinations (Anxious×Avoidant trap, Dark Triad exploitation, Neuroticism amplification).</p>
              <p><span className="text-text font-medium">Weights:</span> Personality 35% + Emotional Intelligence 35% + Coping 15% + Intellectual Match 5% + Secure Attachment Bonus 10%.</p>
              <p><span className="text-text font-medium">Hard Gates:</span> Non-compensatory dealbreaker checks. Incompatible life goals = 0% regardless of personality match.</p>
            </div>
          </div>

          {/* Instruments */}
          <h2 className="text-xl font-bold">The 6 Clinical Instruments</h2>
          {instruments.map(inst => (
            <div key={inst.name} className="bg-surface rounded-2xl p-6 border border-surface-light">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary-light">{inst.name}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{inst.items} items</span>
              </div>
              <p className="text-sm text-text mb-2"><span className="text-text-muted">Measures:</span> {inst.measures}</p>
              <p className="text-sm text-text mb-2"><span className="text-text-muted">Source:</span> {inst.source}</p>
              <p className="text-sm text-text mb-3"><span className="text-text-muted">Why we use it:</span> {inst.why}</p>
              <p className="text-xs text-text-muted italic">{inst.reference}</p>
            </div>
          ))}

          {/* Risk Matrix */}
          <div className="bg-surface rounded-2xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-4">Clinical Risk Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-light">
                    <th className="text-left py-2 text-text-muted font-normal">Risk Pattern</th>
                    <th className="text-left py-2 text-text-muted font-normal">Penalty</th>
                    <th className="text-left py-2 text-text-muted font-normal">Research Basis</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  <tr className="border-b border-surface-light/50"><td className="py-2">Anxious × Avoidant Attachment</td><td>-20%</td><td>Mikulincer & Shaver (2007)</td></tr>
                  <tr className="border-b border-surface-light/50"><td className="py-2">Predator-Prey (Dark Triad × Agreeable)</td><td>Auto-fail</td><td>Paulhus & Williams (2002)</td></tr>
                  <tr className="border-b border-surface-light/50"><td className="py-2">Dual High Neuroticism</td><td>-15%</td><td>Gottman (1994)</td></tr>
                  <tr className="border-b border-surface-light/50"><td className="py-2">Traditional Narcissism Trap</td><td>-20%</td><td>Campbell & Foster (2002)</td></tr>
                  <tr className="border-b border-surface-light/50"><td className="py-2">EQ Asymmetry (&gt;35 gap)</td><td>-10%</td><td>Brackett et al. (2005)</td></tr>
                  <tr className="border-b border-surface-light/50"><td className="py-2">Both Secure Attachment</td><td>+10% bonus</td><td>Hazan & Shaver (1987)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-4 text-center">
            <p className="text-text-muted text-xs">
              All instruments use public-domain items. This platform does not provide clinical diagnoses.
              It is a data-driven starting point for deeper conversation, not a replacement for professional premarital counseling.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
