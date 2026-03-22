"use client";
import React from 'react';
import { Certificate } from '@/contexts/CertificateContext';
import { User } from '@/contexts/AuthContext';
import { ShieldCheck, Award } from 'lucide-react';

export const CertificateView = ({ cert, users }: { cert: Certificate, users: User[] }) => {
  return (
    <div id="diploma-to-print" className="w-[800px] h-[580px] bg-white border-[15px] border-double border-slate-200 p-12 relative shadow-2xl mx-auto overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Award size={300} />
      </div>

      <div className="text-center space-y-6 relative z-10">
        <h3 className="text-slate-500 uppercase tracking-[5px] font-bold text-sm">République Universitaire Digitale</h3>
        <h1 className="text-5xl font-serif text-slate-900 mt-8">DIPLÔME DE FIN D'ÉTUDES</h1>
        
        <div className="py-8">
          <p className="text-slate-600 text-xl italic">Il est certifié par la présente que</p>
          <h2 className="text-4xl font-bold text-blue-900 mt-2 uppercase">{cert.studentName}</h2>
        </div>

        <p className="text-slate-600 text-lg leading-relaxed">
          a satisfait aux exigences académiques et a obtenu le titre de <br/>
          <span className="font-bold text-slate-900 text-2xl">{cert.major}</span> <br/>
          au titre de l'année universitaire <span className="font-bold">{cert.year}</span>.
        </p>

        {/* Signatures Area */}
        <div className="flex justify-around mt-16 pt-8 border-t border-slate-100">
          {cert.signaturesData.map((sig, index) => {
             const teacher = users.find(u => u.id === sig.teacherId);
             return (
               <div key={index} className="text-center">
                 <img src={sig.signatureImage} alt="signature" className="h-16 mx-auto mb-2 mix-blend-multiply" />
                 <p className="text-xs font-bold text-slate-900">Prof. {teacher?.lastName}</p>
                 <p className="text-[10px] text-slate-400">Validé le {new Date(sig.date).toLocaleDateString()}</p>
               </div>
             )
          })}
        </div>

        {/* Blockchain Proof (Footer) */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end border-t pt-4">
           <div className="text-left">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Digital Blockchain ID</p>
              <p className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded mt-1 truncate w-[450px]">
                {cert.blockchainHash}
              </p>
           </div>
           <div className="flex flex-col items-center">
              <ShieldCheck className="text-emerald-600 mb-1" size={32} />
              <p className="text-[9px] font-bold text-emerald-700 uppercase">Verified on Ledger</p>
           </div>
        </div>
      </div>
    </div>
  );
};