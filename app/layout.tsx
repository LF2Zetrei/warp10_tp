import './globals.css';
import { Share_Tech_Mono } from 'next/font/google';
import Navbar from './components/Navbar';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono-alien',
});

export const metadata = {
  title: 'ISS Monitor — Weyland-Yutani Corp',
  description: 'Station Spatiale — Système de surveillance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={shareTechMono.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
