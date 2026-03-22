"use client";
import React, { useState } from 'react';
import { useCertificates } from '@/contexts/CertificateContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, Fingerprint, Calendar, UserCheck } from "lucide-react";

export default function VerifyPortal() {
  const [searchHash, setSearchHash] = useState('');
  const [result, setResult] = useState<any>(null);
  const { certificates } = useCertificates();
  const { allUsers } = useAuth();

  const handleVerify = () => {
    const cert = certificates.find(c => c.blockchainHash === searchHash || c.id === searchHash);
    setResult(cert || "not_found");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-[#0F172A] text-white py-20 px-8 text-center space-y-6">
          <ShieldCheck size={64} className="mx-auto text-amber-400" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">Portail de Vérification Officiel</h1>
          <p className="max-w-xl mx-auto text-slate-400 text-sm">Ce registre public utilise la technologie blockchain pour garantir l'intégrité et l'authenticité des diplômes émis par l'Université.</p>
          <div className="max-w-2xl mx-auto flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
              <Input placeholder="Entrez le Hash SHA-256 du diplôme..." className="bg-transparent border-none text-white h-12" value={searchHash} onChange={(e) => setSearchHash(e.target.value)} />
              <Button onClick={handleVerify} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8">VÉRIFIER</Button>
          </div>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-8">
        {result === "not_found" && ( <div className="p-10 border-2 border-dashed border-red-200 bg-red-50 text-red-600 text-center font-bold">AUCUN ENREGISTREMENT TROUVÉ SUR LA BLOCKCHAIN</div> )}
        {result && result !== "not_found" && (
          <div className="border shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-slate-50 p-6 border-b flex justify-between items-center">
                <span className="font-bold text-slate-700 text-sm uppercase tracking-widest">Détails de l'Audit Cryptographique</span>
                <Badge className="bg-emerald-500 text-white font-bold">AUTHENTICITÉ CONFIRMÉE</Badge>
            </div>
            <div className="p-10 space-y-10">
               <div className="grid grid-cols-2 gap-10">
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Titulaire du Diplôme</p><p className="text-2xl font-black text-slate-900 uppercase">{result.studentName}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Grade Académique</p><p className="text-2xl font-black text-amber-600 uppercase">{result.major}</p></div>
               </div>
               <div className="space-y-6 bg-slate-50 p-8 rounded-xl border">
                  <div className="space-y-2"><div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase"><Fingerprint size={14}/> Signature SHA-256 (Hash)</div><p className="font-mono text-xs text-blue-600 break-all bg-white p-3 border rounded">{result.blockchainHash}</p></div>
                  <div className="space-y-4 pt-4 border-t"><div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase"><UserCheck size={14}/> Chaîne de Confiance (Signataires)</div>
                    {result.signaturesData.map((s:any, i:number) => {
                        const p = allUsers.find(u => u.id === s.teacherId);
                        return <div key={i} className="flex justify-between items-center text-xs border-b pb-2"><span>PROF. {p?.lastName.toUpperCase()}</span><span className="text-slate-400 italic">Validé le {new Date(s.date).toLocaleDateString()}</span></div>
                    })}
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center"><div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase"><Calendar size={14}/> Horodatage</div><p className="text-xs font-bold text-slate-800">{result.timestamp}</p></div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}