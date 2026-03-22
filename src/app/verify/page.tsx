"use client";
import React, { useState } from 'react';
import { useCertificates } from '@/contexts/CertificateContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, Fingerprint, Calendar, UserCheck, Landmark, FileCheck } from "lucide-react";
import Link from 'next/link';

export default function VerifyPortal() {
  const [searchHash, setSearchHash] = useState('');
  const [result, setResult] = useState<any>(null);
  const { certificates } = useCertificates();
  const { allUsers } = useAuth();

  const handleVerify = () => {
    // On cherche soit par le Hash complet, soit par l'ID du bloc
    const cert = certificates.find(c => 
        (c.blockchainHash === searchHash || c.id === searchHash) && 
        c.status === 'valide_blockchain'
    );
    setResult(cert || "not_found");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* BARRE DE NAVIGATION PUBLIQUE */}
      <nav className="bg-[#0F172A] text-white px-10 py-4 flex justify-between items-center shadow-md">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <ShieldCheck className="text-amber-400" size={28} />
          <h1 className="text-sm font-black uppercase tracking-widest">University Ledger Explorer</h1>
        </Link>
        <Link href="/login">
            <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10 text-[10px] font-bold">ACCÈS ADMINISTRATION</Button>
        </Link>
      </nav>

      {/* SECTION RECHERCHE */}
      <div className="bg-white border-b shadow-sm py-20 px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <Landmark size={48} className="mx-auto text-slate-800" />
            <h1 className="text-4xl font-serif font-bold text-slate-900">Vérification de l'Authenticité</h1>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                Saisissez l'empreinte numérique (Hash SHA-256) ou l'identifiant du certificat pour auditer sa validité sur le registre blockchain.
            </p>
          </div>

          <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
              <Input 
                placeholder="Coller le Hash SHA-256 du diplôme..." 
                className="bg-transparent border-none text-slate-900 h-14 pl-6 focus-visible:ring-0 font-mono text-xs" 
                value={searchHash} 
                onChange={(e) => setSearchHash(e.target.value)} 
              />
              <Button onClick={handleVerify} className="bg-[#0F172A] hover:bg-blue-900 text-white font-bold px-10 rounded-xl h-14 transition-all">
                AUDITER LE BLOC
              </Button>
          </div>
        </div>
      </div>

      {/* SECTION RÉSULTATS */}
      <div className="max-w-4xl mx-auto py-16 px-8">
        
        {/* CAS : NON TROUVÉ */}
        {result === "not_found" && ( 
            <div className="p-10 border-2 border-dashed border-red-200 bg-red-50 text-red-600 text-center rounded-3xl">
                <div className="flex justify-center mb-4"><AlertCircle size={40} /></div>
                <h2 className="font-black uppercase tracking-tighter text-lg">Certificat non répertorié</h2>
                <p className="text-sm opacity-80 mt-1">L'empreinte fournie ne correspond à aucun enregistrement valide sur ce nœud blockchain.</p>
            </div> 
        )}

        {/* CAS : CERTIFICAT TROUVÉ (L'AUDIT) */}
        {result && result !== "not_found" && (
          <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
            
            {/* Header du rapport */}
            <div className="bg-emerald-500 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <FileCheck size={28} />
                    <span className="font-black uppercase tracking-widest text-xs">Rapport d'Audit Positif</span>
                </div>
                <Badge className="bg-white text-emerald-600 font-black px-4 py-1">CERTIFIÉ CONFORME</Badge>
            </div>

            <div className="p-12 space-y-12">
               {/* Infos Étudiant */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-1">
                     <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Titulaire du Diplôme</p>
                     <p className="text-3xl font-serif font-bold text-slate-900 uppercase leading-none">{result.studentName}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Titre Académique</p>
                     <p className="text-3xl font-serif font-bold text-blue-900 uppercase leading-none">{result.major}</p>
                  </div>
               </div>

               {/* Preuve Cryptographique */}
               <div className="space-y-6 bg-slate-50 p-10 rounded-[1.5rem] border border-slate-100 shadow-inner">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black uppercase tracking-widest">
                        <Fingerprint size={16}/> Signature Numérique (Hash SHA-256)
                    </div>
                    <p className="font-mono text-[11px] text-slate-500 break-all bg-white p-4 border rounded-xl shadow-sm uppercase leading-relaxed">
                        {result.blockchainHash}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black uppercase tracking-widest">
                        <UserCheck size={16}/> Chaîne de Confiance (Validateurs)
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.signaturesData.map((s:any, i:number) => {
                            const prof = allUsers.find(u => u.id === s.teacherId);
                            return (
                                <div key={i} className="bg-white px-5 py-3 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase text-slate-800">Prof. {prof?.lastName}</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Nœud Certificateur #{i+1}</span>
                                    </div>
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                </div>
                            )
                        })}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest justify-center md:justify-start">
                            <Calendar size={14}/> Date de Certification
                        </div>
                        <p className="text-xs font-bold text-slate-700 uppercase">{result.timestamp}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Identifiant du Bloc</p>
                        <Badge variant="outline" className="font-mono text-blue-600 border-blue-200">{result.id}</Badge>
                    </div>
                  </div>

               </div>

               {/* Footer de sécurité */}
               <div className="text-center pt-4">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#0F172A] rounded-full text-white">
                        <ShieldCheck size={14} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Données Inaltérables sur Ledger Local</span>
                    </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer de la page */}
      <footer className="text-center py-10 opacity-30 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2024 Registre Universitaire - Sécurité et Blockchain
      </footer>
    </div>
  );
}

// Composant icône manquant
function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}