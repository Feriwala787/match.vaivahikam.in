import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-text-muted text-lg mb-6">This page doesn&apos;t exist.</p>
        <Link href="/" className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
          Go Home
        </Link>
      </div>
    </Layout>
  );
}
