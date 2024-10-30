import type { Metadata } from 'next';
import '../../styles/global.scss';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Form Demo',
  description: 'Form demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
