"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificates, Certificate } from '@/contexts/CertificateContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CertificateModal } from "@/components/CertificateModal";
import { GraduationCap, Send, Clock, CheckCircle2, FileText, LogOut, Trash2, Download, Search } from "lucide-react";

export default function StudentDashboard() {
  const { user, logout, allUsers } = useAuth();
  const { certificates, requestCertificate, deleteCertificate } = useCertificates();
  const router = useRouter();

  const [major, setMajor] = useState('');
  const [year, setYear] = useState('2024');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/login');
  }, [user, router]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await requestCertificate({
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      major: major,
      year: year
    });
    setMajor('');
  };

  const myCerts = certificates.filter(c => c.studentId === user?.id);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
          <GraduationCap size={28} />
          <span>ESPACE ÉTUDIANT</span>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="sm" onClick={() => router.push('/verify')} className="text-slate-600">
             <Search size={16} className="mr-2" /> Explorer Blockchain
          </Button>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <span className="text-slate-600 font-medium">Hiba OUAFI</span>
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-500">
            <LogOut size={18} className="mr-2" /> Quitter
          </Button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto space-y-8 w-full">
        <Card className="border-l-4 border-l-indigo-600 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Nouvelle Demande</CardTitle>
            <CardDescription>Entrez les détails de votre diplôme pour validation par les autorités.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Filière / Diplôme</label>
                <Input placeholder="ex: Master Cybersécurité" value={major} onChange={e => setMajor(e.target.value)} required />
              </div>
              <div className="w-full sm:w-32 space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Année</label>
                <Input type="number" value={year} onChange={e => setYear(e.target.value)} required />
              </div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-8 h-10">
                Envoyer <Send size={16} className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
            <CardTitle>Mes Certificats</CardTitle>
            <Badge variant="outline">{myCerts.length} document(s)</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6">Détails du Diplôme</TableHead>
                  <TableHead>État du Registre</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCerts.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-16 text-slate-400 italic">Aucune demande enregistrée.</TableCell></TableRow>
                ) : (
                  myCerts.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-6 py-4">
                         <p className="font-bold text-slate-700 uppercase">{cert.major}</p>
                         <p className="text-xs text-slate-400 italic">Promotion {cert.year}</p>
                      </TableCell>
                      <TableCell>
                        {cert.status === 'en_attente_admin' && <Badge className="bg-orange-50 text-orange-600 border-orange-200">Validation Administration</Badge>}
                        {cert.status === 'en_attente_signatures' && <Badge className="bg-blue-50 text-blue-600 border-blue-200">Signatures ({cert.signedBy.length}/{cert.requiredSignatures.length})</Badge>}
                        {cert.status === 'valide_blockchain' && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold">✓ Blockchain Verified</Badge>}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          {cert.status === 'valide_blockchain' && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedCert(cert); setIsModalOpen(true); }}>
                              <Download size={16} className="mr-1" /> Voir
                            </Button>
                          )}
                          
                          {/* LOGIQUE LOGIQUE : Un étudiant peut supprimer son certificat s'il le souhaite (Droit à l'oubli) */}
                          <Button variant="ghost" size="sm" onClick={() => { if(confirm("Supprimer ce certificat du registre ?")) deleteCertificate(cert.id) }} className="text-red-400 hover:bg-red-50">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {selectedCert && (
        <CertificateModal isOpen={isModalOpen} onClose={setIsModalOpen} cert={selectedCert} allUsers={allUsers} />
      )}
    </div>
  );
}