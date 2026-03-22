"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificates } from '@/contexts/CertificateContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ShieldCheck, Trash2, CheckCircle2, XCircle, Users, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  // CORRECTION : On déstructure addTeacher ici pour qu'il soit défini !
  const { user, logout, addTeacher, removeUser, allUsers, approveUser, checkIdentityMatch, isApogeeValid } = useAuth();
  const { certificates, assignTeachers, deleteCertificate } = useCertificates();
  const router = useRouter();
  
  const [newTeacher, setNewTeacher] = useState({ firstName: '', lastName: '', username: '', password: '' });
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [currentCertId, setCurrentCertId] = useState<string | null>(null);

  useEffect(() => { if (!user || user.role !== 'admin') router.push('/login'); }, [user, router]);

  if (!user) return null;

  const teachers = allUsers.filter(u => u.role === 'teacher');
  const pendingAccounts = allUsers.filter(u => u.role === 'student' && !u.isApproved);
  const pendingRequests = certificates.filter(c => c.status === 'en_attente_admin');

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans">
      <nav className="bg-[#1e293b] text-white px-10 py-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-amber-400" size={36} />
          <h1 className="text-2xl font-serif">Audit Central de l'Université</h1>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="border-white/20 text-white">Déconnexion</Button>
      </nav>

      <main className="p-10 max-w-7xl mx-auto space-y-12">
        <Tabs defaultValue="accounts">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 mb-8 flex gap-8">
            <TabsTrigger value="accounts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 font-serif text-lg">Validation des Identités</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 font-serif text-lg">Signatures Diplômes</TabsTrigger>
            <TabsTrigger value="faculty" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 font-serif text-lg">Gestion Faculté</TabsTrigger>
          </TabsList>

          {/* TAB 1 : VALIDATION COMPTES */}
          <TabsContent value="accounts">
            <Card className="border shadow-sm rounded-none">
              <CardHeader className="bg-slate-50 border-b italic font-serif"><CardTitle>Matching : Code Apogée + CIN</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow className="bg-slate-50/50">
                    <TableHead className="font-serif font-bold pl-8">Étudiant</TableHead>
                    <TableHead className="font-serif font-bold text-center">Audit Correspondance</TableHead>
                    <TableHead className="text-right font-serif font-bold pr-10">Action</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {pendingAccounts.map(account => {
                      const isMatch = checkIdentityMatch(account.codeApogee || "", account.cin || "");
                      return (
                        <TableRow key={account.id} className="border-b">
                          <TableCell className="font-serif text-lg py-6 pl-8 uppercase">{account.firstName} {account.lastName} <span className="text-xs text-slate-400">({account.codeApogee} / {account.cin})</span></TableCell>
                          <TableCell>
                             <div className={`mx-auto max-w-[220px] flex items-center justify-center gap-3 p-2 border-2 ${isMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {isMatch ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}
                                <span className="text-[10px] font-black uppercase tracking-widest">{isMatch ? "Identité Certifiée" : "Discordance Détectée"}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                             <Button onClick={() => approveUser(account.id)} className="bg-emerald-700 hover:bg-emerald-800 text-xs px-6 font-bold" disabled={!isMatch}>Approuver</Button>
                             <Button variant="ghost" onClick={() => removeUser(account.id)} className="text-red-600 hover:bg-red-50 ml-2 font-bold uppercase text-[10px]">Rejeter</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2 : SIGNATURES DIPLOMES */}
          <TabsContent value="requests">
             <Card className="border shadow-md rounded-none">
                <CardHeader className="bg-slate-50 border-b font-serif italic"><CardTitle>Assigner les validateurs pour le consensus</CardTitle></CardHeader>
                <Table>
                    <TableBody>
                        {pendingRequests.map(cert => (
                            <TableRow key={cert.id} className="border-b">
                                <TableCell className="pl-10 font-serif text-xl py-8 uppercase">{cert.studentName} — <span className="text-blue-800 italic normal-case">{cert.major}</span></TableCell>
                                <TableCell className="text-right pr-10">
                                    <Dialog open={!!currentCertId && currentCertId === cert.id} onOpenChange={(o) => !o && setCurrentCertId(null)}>
                                        <DialogTrigger asChild><Button onClick={() => setCurrentCertId(cert.id)} className="bg-slate-800 text-xs px-8 uppercase font-bold">Assigner</Button></DialogTrigger>
                                        <DialogContent className="font-serif">
                                            <DialogHeader><DialogTitle className="text-xl italic">Sélection des Signataires</DialogTitle></DialogHeader>
                                            <div className="py-4 space-y-3">
                                                {teachers.map(t => (
                                                    <div key={t.id} className="flex items-center gap-4 p-4 border hover:bg-slate-50">
                                                        <Checkbox onCheckedChange={(c) => c ? setSelectedTeachers([...selectedTeachers, t.id]) : setSelectedTeachers(selectedTeachers.filter(id => id !== t.id))} />
                                                        <label className="text-sm font-bold uppercase">Prof. {t.firstName} {t.lastName}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            <DialogFooter><Button onClick={() => {assignTeachers(cert.id, selectedTeachers); setCurrentCertId(null); setSelectedTeachers([])}} className="w-full bg-[#1E293B] h-12 font-bold">Lancer le Consensus</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="ghost" onClick={() => deleteCertificate(cert.id)} className="text-red-400 ml-4"><Trash2 size={18} /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
          </TabsContent>

          {/* TAB 3 : GESTION FACULTE */}
          <TabsContent value="faculty">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <Card className="lg:col-span-1 border shadow-md rounded-none h-fit">
                    <CardHeader className="bg-slate-800 text-white"><CardTitle className="text-xs uppercase font-serif tracking-widest flex items-center gap-2"><UserPlus size={16}/> Inscrire Enseignant</CardTitle></CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <Input placeholder="PRÉNOM" value={newTeacher.firstName} onChange={e => setNewTeacher({...newTeacher, firstName: e.target.value})} />
                        <Input placeholder="NOM" value={newTeacher.lastName} onChange={e => setNewTeacher({...newTeacher, lastName: e.target.value})} />
                        <Input placeholder="USERNAME" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} />
                        <Input type="password" placeholder="MOT DE PASSE" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} />
                        <Button onClick={(e) => {e.preventDefault(); addTeacher(newTeacher); setNewTeacher({firstName:'', lastName:'', username:'', password:''})}} className="w-full bg-slate-900 font-bold uppercase text-[10px] h-12">Enregistrer Node</Button>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 border shadow-md rounded-none overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b font-serif italic"><CardTitle className="flex items-center gap-2"><Users size={18}/> Membres de la Faculté</CardTitle></CardHeader>
                    <Table>
                        <TableBody>
                            {teachers.map(t => (
                                <TableRow key={t.id} className="border-b">
                                    <TableCell className="pl-10 py-5 font-serif text-lg uppercase">PROF. {t.firstName} {t.lastName}</TableCell>
                                    <TableCell className="text-right pr-10"><Button variant="ghost" onClick={() => removeUser(t.id)} className="text-red-500 hover:bg-red-50"><Trash2 size={20} /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}