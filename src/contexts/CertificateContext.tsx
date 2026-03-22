"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type CertStatus = 'en_attente_admin' | 'en_attente_signatures' | 'valide_blockchain';

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  major: string;
  year: string;
  status: CertStatus;
  requiredSignatures: string[];
  signedBy: string[];
  signaturesData: { teacherId: string; date: string; signatureImage: string }[];
  blockchainHash?: string;
  timestamp?: string;
}

interface CertificateContextType {
  certificates: Certificate[];
  requestCertificate: (data: any) => Promise<void>;
  assignTeachers: (certId: string, teacherIds: string[]) => Promise<void>;
  signCertificate: (certId: string, teacherId: string, signatureImage: string) => Promise<void>;
  deleteCertificate: (certId: string) => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider = ({ children }: { children: React.ReactNode }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('univ_certs');
    if (saved) setCertificates(JSON.parse(saved));
  }, []);

  const save = (newCerts: Certificate[]) => {
    setCertificates(newCerts);
    localStorage.setItem('univ_certs', JSON.stringify(newCerts));
  };

  const requestCertificate = async (data: any) => {
    const newCert: Certificate = {
      id: `BC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      status: 'en_attente_admin',
      requiredSignatures: [],
      signedBy: [],
      signaturesData: []
    };
    save([...certificates, newCert]);
    toast.success("Demande enregistrée sur le registre.");
  };

  const assignTeachers = async (certId: string, teacherIds: string[]) => {
    const updated = certificates.map(c => 
      c.id === certId ? { ...c, status: 'en_attente_signatures' as CertStatus, requiredSignatures: teacherIds } : c
    );
    save(updated);
  };

  const signCertificate = async (certId: string, teacherId: string, signatureImage: string) => {
    const cert = certificates.find(c => c.id === certId);
    if (!cert) return;

    const signatureEntry = { teacherId, date: new Date().toISOString(), signatureImage };
    const newSignedBy = [...cert.signedBy, teacherId];
    const newSignaturesData = [...cert.signaturesData, signatureEntry];
    
    let newStatus = cert.status;
    let finalHash = cert.blockchainHash;

    if (newSignedBy.length === cert.requiredSignatures.length) {
      newStatus = 'valide_blockchain';
      const msgBuffer = new TextEncoder().encode(cert.id + cert.studentName + Date.now());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const updated = certificates.map(c => 
      c.id === certId ? { 
        ...c, 
        signedBy: newSignedBy, 
        signaturesData: newSignaturesData, 
        status: newStatus, 
        blockchainHash: finalHash, 
        timestamp: new Date().toLocaleString() 
      } : c
    );
    save(updated);
  };

  const deleteCertificate = (certId: string) => {
    const updated = certificates.filter(c => c.id !== certId);
    save(updated);
    toast.info("Certificat supprimé.");
  };

  return (
    <CertificateContext.Provider value={{ certificates, requestCertificate, assignTeachers, signCertificate, deleteCertificate }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (!context) throw new Error("useCertificates must be used within CertificateProvider");
  return context;
};