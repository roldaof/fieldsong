import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FieldSong — Daily Clarity Ritual',
  description:
    'A daily Bhagavad Gita verse paired with Stoic philosophy. Build a clarity practice that fits your morning.',
  openGraph: {
    title: 'FieldSong — Daily Clarity Ritual',
    description:
      'Ancient wisdom, modern practice. A Bhagavad Gita verse and Stoic quote delivered daily.',
    url: 'https://fieldsong.app',
    siteName: 'FieldSong',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
