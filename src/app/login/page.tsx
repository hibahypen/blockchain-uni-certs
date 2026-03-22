"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Landmark } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, signUpStudent } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '', password: '', firstName: '', lastName: '', confirmPassword: '', codeApogee: '', cin: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.username, formData.password);
    if (success) {
      const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
      const loggedUser = latestUsers.find((u: any) => u.username === formData.username);
      if (loggedUser.role === 'admin') router.push('/dashboard/admin');
      else if (loggedUser.role === 'teacher') router.push('/dashboard/teacher');
      else router.push('/dashboard/student');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.codeApogee.length !== 8) return toast.error("Code Apogée invalide (8 chiffres requis).");
    if (formData.password !== formData.confirmPassword) return toast.error("Mots de passe non identiques.");
    
    const success = await signUpStudent(formData);
    if (success) setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <div className="bg-[#0F172A] text-white py-2 px-10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
         <div className="flex items-center gap-2"><Lock size={12} className="text-emerald-400" /><span>Accès Sécurisé - Protocole Certifié</span></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          <div className="text-center mb-10 space-y-2">
            <Landmark size={48} className="mx-auto text-slate-800" />
            <h1 className="text-2xl font-serif font-bold text-slate-900 uppercase tracking-tighter">Registre Universitaire</h1>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
            <Tabs defaultValue="login">
              <TabsList className="flex w-full bg-slate-50 border-b h-14 p-0 rounded-none">
                <TabsTrigger value="login" className="flex-1 font-bold text-xs uppercase rounded-none">Identification</TabsTrigger>
                <TabsTrigger value="register" className="flex-1 font-bold text-xs uppercase rounded-none">S'enregistrer</TabsTrigger>
              </TabsList>

              <div className="p-10">
                <TabsContent value="login" className="mt-0 space-y-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <Input placeholder="TAPER VOTRE IDENTIFIANT RÉSEAU..." onChange={(e) => setFormData({...formData, username: e.target.value})} className="h-12 bg-slate-50" required />
                    <Input type="password" placeholder="SAISIR VOTRE MOT DE PASSE..." onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 bg-slate-50" required />
                    <Button type="submit" className="w-full bg-[#1E293B] h-14 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95">Ouvrir la session</Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-0 space-y-4">
                   <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="PRÉNOM" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                        <Input placeholder="NOM" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="CODE APOGÉE" maxLength={8} onChange={(e) => setFormData({...formData, codeApogee: e.target.value})} className="border-blue-200 font-bold" required />
                        <Input placeholder="CIN" maxLength={8} onChange={(e) => setFormData({...formData, cin: e.target.value})} className="border-blue-200 font-bold uppercase" required />
                      </div>
                      <Input placeholder="USERNAME RÉSEAU CHOISI" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="password" placeholder="MOT DE PASSE" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        <Input type="password" placeholder="CONFIRMATION" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                      </div>
                      <Button type="submit" variant="outline" className="w-full h-12 border-2 border-[#1E293B] font-bold uppercase text-[10px]">Envoyer ma demande d'accès</Button>
                   </form>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}