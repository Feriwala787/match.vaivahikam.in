import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Relational Blueprint — Deep Compatibility for Arranged Marriage</title>
        <meta name="description" content="A clinically grounded psychometric assessment for arranged marriage compatibility." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <div className="flex flex-col items-center">
          {/* Hero */}
          <section className="text-center px-6 py-20 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Beyond Swiping.<br />
              <span className="text-primary-light">Deep Compatibility Science.</span>
            </h1>
            <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
              A 200+ item psychometric assessment built on public-domain clinical instruments.
              Designed for the arranged marriage context — where getting it right the first time matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!loading && !user ? (
                <>
                  <Link href="/auth/register" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-lg">
                    Begin Assessment
                  </Link>
                  <a href="#how-it-works" className="px-8 py-3 rounded-xl border border-surface-light text-text-muted hover:text-text hover:border-primary/50 transition text-lg">
                    How It Works
                  </a>
                </>
              ) : !loading ? (
                <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-lg">
                  Go to Dashboard
                </Link>
              ) : null}
            </div>
          </section>

          {/* Stats */}
          <section className="w-full bg-surface border-y border-surface-light py-12">
            <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '265', label: 'Psychometric Items' },
                { value: '6', label: 'Clinical Instruments' },
                { value: '18', label: 'Trait Dimensions' },
                { value: '20', label: 'Dealbreaker Gates' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary-light">{stat.value}</div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Take the Assessment', desc: 'Complete a rigorous battery covering personality, attachment, values, and dealbreakers. Progress auto-saves. ~1-2 hours.' },
                { step: '2', title: 'Send a Match Request', desc: 'Enter the username of a potential match. Both parties must consent before any psychological data is compared.' },
                { step: '3', title: 'View Your Blueprint', desc: 'The algorithm generates a detailed compatibility report with synergies, friction points, risk warnings, and radar visualizations.' },
              ].map(item => (
                <div key={item.step} className="bg-surface rounded-xl p-6 border border-surface-light">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Algorithm */}
          <section className="w-full bg-surface border-y border-surface-light py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl font-bold mb-8 text-center">The Matching Algorithm</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: '🚫 Hard Gates', desc: 'Non-compensatory dealbreaker check. Incompatible life goals = 0% match. No exceptions.' },
                  { title: '📐 Euclidean Distance', desc: 'Calculates multidimensional proximity across Big Five personality and core values.' },
                  { title: '⚠️ Risk Matrix', desc: 'Penalizes toxic combinations: Anxious×Avoidant traps, high Dark Triad, empathy asymmetry.' },
                  { title: '📊 Blueprint Output', desc: 'Compiled report with overall %, dimension breakdown, friction points, synergies, and risk warnings.' },
                ].map(item => (
                  <div key={item.title} className="p-5 rounded-lg border border-surface-light">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-text-muted text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Instruments */}
          <section className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Clinical Instruments Used</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'IPIP-NEO 120 (Big Five)', desc: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — 30 facets' },
                { name: 'ECR-R (Attachment)', desc: 'Attachment Anxiety & Avoidance — 36 items' },
                { name: 'Short Dark Triad (SD3)', desc: 'Machiavellianism, Narcissism, Psychopathy — 27 items' },
                { name: 'TEIQue-SF (Emotional Intelligence)', desc: 'Well-being, Self-Control, Emotionality, Sociability — 30 items' },
                { name: 'Brief COPE (Coping)', desc: 'Active, Avoidant, Support-Seeking coping — 14 items' },
                { name: 'NFC-18 (Intellectual Match)', desc: 'Need for Cognition — 18 items' },
              ].map(inst => (
                <div key={inst.name} className="bg-surface rounded-lg p-4 border border-surface-light">
                  <h4 className="font-semibold text-secondary">{inst.name}</h4>
                  <p className="text-text-muted text-sm">{inst.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center px-6 py-16">
            <h2 className="text-2xl font-bold mb-4">Ready to find deep alignment?</h2>
            <p className="text-text-muted mb-6">This is not a dating app. This is a costly signal of serious intent.</p>
            {!loading && !user && (
              <Link href="/auth/register" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-lg">
                Create Account & Begin
              </Link>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}
