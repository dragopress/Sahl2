import './globals.css';
import { ThemeProvider } from './theme-provider';

export const metadata = {
  title: 'SahlBiz · Le Business OS des PME Marocaines',
  description: 'Facturation conforme ICE/DGI, suivi de trésorerie en MAD, gestion commerciale, stocks, projets et IA pour entreprises au Maroc.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

