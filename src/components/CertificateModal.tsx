"use client";
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Certificate } from '@/contexts/CertificateContext';
import { User } from '@/contexts/AuthContext';
import { ShieldCheck, Award, Printer, X, Fingerprint } from 'lucide-react';
import { Button } from './ui/button';

interface Props { isOpen: boolean; onClose: (open: boolean) => void; cert: Certificate; allUsers: User[]; }

export const CertificateModal = ({ isOpen, onClose, cert, allUsers }: Props) => {
  
  const signatures = cert.signaturesData || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: '1000px', width: '95vw' }} className="p-0 bg-white border-none shadow-none focus:ring-0 outline-none overflow-hidden">
        
        <DialogTitle className="sr-only">Diplôme Officiel de l'Université</DialogTitle>

        {/* BARRE DE CONTRÔLE SUPÉRIEURE */}
        <div className="bg-[#0F172A] text-white p-4 flex justify-between items-center no-print w-full">
            <div className="flex items-center gap-3 px-2">
                <ShieldCheck className="text-amber-400" size={24} />
                <span className="font-serif italic text-sm tracking-widest opacity-90 uppercase">Secured Blockchain Certificate Registry</span>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => window.print()} className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-black h-10 px-8 uppercase text-[10px] tracking-widest shadow-lg transition-transform active:scale-95">
                    <Printer size={18} className="mr-2"/> Imprimer / Exporter PDF
                </Button>
                <Button variant="ghost" onClick={() => onClose(false)} className="text-slate-400 hover:text-white">
                    <X size={28} />
                </Button>
            </div>
        </div>

        {/* ZONE DE PRÉSENTATION (FOND CLAIR) */}
        <div className="bg-slate-100 p-6 flex justify-center items-center w-full overflow-y-auto max-h-[90vh]">
            
            {/* LE CORPS DU DIPLÔME (BLANC PUR) */}
            <div id="diploma" className="w-[900px] min-h-[650px] bg-white border-[12px] border-double border-slate-300 p-12 relative shadow-lg shrink-0 text-black font-serif flex flex-col justify-between overflow-hidden">
                
                {/* Filigrane (Sceau de fond) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <Award size={400} />
                </div>

                <div className="text-center space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                    
                    {/* HAUT DU DIPLÔME */}
                    <div className="space-y-2">
                        <h3 className="text-slate-400 uppercase tracking-[8px] font-bold text-[8px] font-sans">République Numérique Universitaire</h3>
                        <div className="flex justify-center py-1"><Award className="text-[#0F172A]" size={50} /></div>
                        <h1 className="text-5xl font-bold text-[#0F172A] border-b-2 border-slate-100 pb-3 mx-24 uppercase tracking-tighter shadow-sm">Diplôme de Master</h1>
                    </div>
                    
                    {/* TEXTE OFFICIEL */}
                    <div className="py-2">
                        <p className="text-slate-500 italic text-xl font-sans">Le Conseil de l'Université certifie officiellement que</p>
                        <h2 className="text-5xl font-black text-black uppercase tracking-tight py-3 leading-none underline decoration-slate-100 underline-offset-4">
                          {cert.studentName}
                        </h2>
                        <p className="text-slate-600 text-xl leading-relaxed font-sans">
                            a satisfait aux exigences académiques et obtenu le titre de <br/>
                            <span className="font-bold text-black text-2xl uppercase tracking-widest border-b border-black inline-block mt-1">{cert.major}</span> <br/>
                            <span className="text-base mt-2 block">Promotion de l'année <span className="font-bold text-blue-900">{cert.year}</span></span>
                        </p>
                    </div>

                    {/* ZONE DES SIGNATURES MANUELLES */}
                    <div className="grid grid-cols-2 gap-20 px-16 pt-6 border-t border-slate-100 bg-white min-h-[140px]">
                        {signatures.map((sig, i) => {
                            const prof = allUsers.find(u => u.id === sig.teacherId);
                            return (
                                <div key={i} className="text-center flex flex-col items-center justify-end">
                                    <img 
                                        src={sig.signatureImage} 
                                        className="h-16 w-auto object-contain mix-blend-multiply mb-1 transition-transform" 
                                        alt="Signature" 
                                    />
                                    <div className="h-[1.5px] bg-slate-900 w-full mb-1"></div>
                                    <p className="text-[11px] font-black text-black uppercase font-sans tracking-tight leading-none">
                                      Prof. {prof?.lastName || "AUTORITÉ"}
                                    </p>
                                    <p className="text-[7px] text-slate-400 font-sans uppercase font-bold tracking-tighter mt-1">Nœud de Validation Académique</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* --- LE HASH BLOCKCHAIN (BOITE DE SÉCURITÉ GRISE) --- */}
                    <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-4">
                        
                        <div className="text-left space-y-2 flex-1 pr-10">
                            <div className="flex items-center gap-2">
                                <Fingerprint size={16} className="text-blue-600" />
                                <p className="text-[10px] text-blue-900 font-sans font-black uppercase tracking-[0.1em]">
                                    PREUVE D'AUTHENTICITÉ BLOCKCHAIN (SHA-256)
                                </p>
                            </div>
                            
                            {/* BOITE DU HASH : TRÈS VISIBLE */}
                            <div className="bg-slate-100 p-3 rounded-lg border-2 border-slate-200 shadow-inner">
                                <p className="text-[11px] font-mono text-blue-700 break-all leading-tight uppercase font-bold tracking-tighter">
                                    {cert.blockchainHash || "EN ATTENTE DE VALIDATION FINALE"}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-center text-[8px] text-slate-500 font-sans font-bold uppercase tracking-widest mt-1">
                                <span>Timestamp: {cert.timestamp}</span>
                                <span>Block ID: {cert.id}</span>
                            </div>
                        </div>

                        {/* SCEAU DE VALIDATION */}
                        <div className="flex items-center gap-4 border-l pl-8 border-slate-100 h-20">
                            <div className="text-center font-sans">
                                <ShieldCheck className="text-emerald-600 mx-auto drop-shadow-md" size={44} />
                                <p className="text-[10px] font-black text-emerald-800 uppercase mt-1 leading-none">
                                    Verified<br/>Ledger
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};