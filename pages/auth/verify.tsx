import Link from 'next/link';
import Layout from '@/components/Layout';

export default function VerifyEmail() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-surface-light text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
          <p className="text-text-muted text-sm mb-6">
            We&apos;ve sent a verification link to your email address.
            Click the link to activate your account, then return here to begin the assessment.
          </p>
          <Link href="/auth/login" className="inline-block px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
            Go to Login
          </Link>
        </div>
      </div>
    </Layout>
  );
}
