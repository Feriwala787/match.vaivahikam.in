import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth';
import { LocaleProvider } from '@/lib/i18n';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <Component {...pageProps} />
      </LocaleProvider>
    </AuthProvider>
  );
}
