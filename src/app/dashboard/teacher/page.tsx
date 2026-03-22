"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificates } from '@/contexts/CertificateContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SignaturePad } from "@/components/SignaturePad";
import { PenTool, LogOut, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { certificates, signCertificate } = useCertificates();
  const router = useRouter();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isSignOpen, setIsSignOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'teacher') router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const myPendingTasks = certificates.filter(cert => 
    cert.requiredSignatures.includes(user.id) && !cert.signedBy.includes(user.id)
  );

  const handleManualSignature = async (signatureImage: string) => {
    if (selectedCert && user) {
      await signCertificate(selectedCert, user.id, signatureImage);
      setIsSignOpen(false);
      setSelectedCert(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xl">
          <PenTool size={28} />
          <span>VALIDATION ENSEIGNANT</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-medium">Prof. {user.firstName} {user.lastName}</span>
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-600">
            <LogOut size={18} className="mr-2" /> Déconnexion
          </Button>
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto space-y-8">
        <Card className="border-t-4 border-t-orange-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <Clock /> Demandes en attente de signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Diplôme</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPendingTasks.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-bold">{cert.studentName}</TableCell>
                    <TableCell>{cert.major}</TableCell>
                    <TableCell>
                       <Badge variant="outline">{cert.signedBy.length} / {cert.requiredSignatures.length} signés</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isSignOpen && selectedCert === cert.id} onOpenChange={(open) => {
                        setIsSignOpen(open);
                        if(open) setSelectedCert(cert.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">Apposer ma Signature</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Signature Manuelle du Diplôme</DialogTitle>
                            <p className="text-xs text-slate-500">Signez à l'aide de votre souris ou stylet.</p>
                          </DialogHeader>
                          <SignaturePad onSave={handleManualSignature} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}