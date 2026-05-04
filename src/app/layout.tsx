import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'FoodyDipti',
  description: 'A content-focused recipe archive for a single food influencer.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>
            <Container>{children}</Container>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}