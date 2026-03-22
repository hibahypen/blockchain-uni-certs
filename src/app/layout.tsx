import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CertificateProvider } from "@/contexts/CertificateContext"; // On importe le moteur des certificats
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Univ Certs",
  description: "Système sécurisé de diplômes universitaires",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <AuthProvider>
          {/* On enveloppe tout avec le CertificateProvider ici */}
          <CertificateProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CertificateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}