import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Relational Blueprint — Deep Compatibility for Arranged Marriage</title>
        <meta name="description" content="A clinically grounded psychometric assessment for arranged marriage compatibility." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-light">
          <span className="text-xl font-bold text-primary-light">🧬 Relational Blueprint</span>
          <div className="flex gap-3">
            {!loading && !user && (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/10 transition">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition">
                  Register
                </Link>
              </>
            )}
            {!loading && user && (
              <Link href="/dashboard" className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition">
                Dashboard
              </Link>
            )}
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Beyond Swiping.<br />
            <span className="text-primary-light">Deep Compatibility Science.</span>
          </h1>
          <p className="text-text-muted text-lg mb-8 max-w-2xl">
            A 200+ item psychometric assessment built on public-domain clinical instruments.
            Designed for the arranged marriage context — where getting it right the first time matters most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/auth/register" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-lg">
              Begin Assessment
            </Link>
            <a href="#how-it-works" className="px-8 py-3 rounded-xl border border-surface-light text-text-muted hover:text-text hover:border-primary/50 transition text-lg">
              How It Works
            </a>
          </div>

          {/* How it works */}
          <section id="how-it-works" className="w-full text-left mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Take the Assessment', desc: 'Complete a rigorous 200+ item battery covering personality, attachment, values, and dealbreakers. ~1-2 hours.' },
                { step: '2', title: 'Send a Match Request', desc: 'Enter the username of a potential match. Both parties must consent before any data is compared.' },
                { step: '3', title: 'View Your Blueprint', desc: 'Once both accept, the algorithm generates a detailed compatibility report with synergies, friction points, and risk warnings.' },
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

          {/* Instruments */}
          <section className="w-full text-left mt-16 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Clinical Instruments Used</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'IPIP-NEO (Big Five)', desc: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism' },
                { name: 'ECR-R (Attachment)', desc: 'Attachment Anxiety & Avoidance dimensions' },
                { name: 'Dark Core (D-Core)', desc: 'Machiavellianism, Narcissism, Psychopathy' },
                { name: 'World Values Survey', desc: 'Emotional Intelligence, Family Values, Gender Roles, Spirituality' },
              ].map(inst => (
                <div key={inst.name} className="bg-surface rounded-lg p-4 border border-surface-light">
                  <h4 className="font-semibold text-secondary">{inst.name}</h4>
                  <p className="text-text-muted text-sm">{inst.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="text-center py-6 text-text-muted text-sm border-t border-surface-light">
          Built for human benefit, not profit. Open-source psychometrics.
        </footer>
      </div>
    </>
  );
}
