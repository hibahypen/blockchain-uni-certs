"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// REGISTRE OFFICIEL : Paires Apogée + CIN imposées
const UNIVERSITY_IDENTITY_REGISTRY = [
  { apogee: "22505996", cin: "JA201974" },
  { apogee: "22505997", cin: "BH123456" },
  { apogee: "11223344", cin: "ZZ000000" }
];

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
  codeApogee?: string;
  cin?: string;
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUpStudent: (data: any) => Promise<boolean>;
  addTeacher: (data: any) => Promise<boolean>;
  removeUser: (userId: string) => void;
  approveUser: (userId: string) => void;
  checkIdentityMatch: (apogee: string, cin: string) => boolean;
  isApogeeValid: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('univ_users');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      const defaultAdmin: User = { 
        id: 'admin-01', 
        username: 'admin', 
        firstName: 'Direction', 
        lastName: 'Scolarité', 
        role: 'admin', 
        password: 'admin', 
        isApproved: true 
      };
      setAllUsers([defaultAdmin]);
      localStorage.setItem('univ_users', JSON.stringify([defaultAdmin]));
    }
  }, []);

  const isApogeeValid = (code: string) => UNIVERSITY_IDENTITY_REGISTRY.some(r => r.apogee === code);

  const checkIdentityMatch = (apogee: string, cin: string) => {
    return UNIVERSITY_IDENTITY_REGISTRY.some(
      record => record.apogee === apogee && record.cin === cin.toUpperCase()
    );
  };

  const login = async (username: string, password: string) => {
    const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
    const found = latestUsers.find((u: any) => u.username === username && u.password === password);
    if (found) {
      if (!found.isApproved) {
        toast.error("Compte en attente de validation.");
        return false;
      }
      setUser(found);
      toast.success("Authentification réussie");
      return true;
    }
    toast.error("Identifiants incorrects.");
    return false;
  };

  const signUpStudent = async (data: any) => {
    const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
    if (latestUsers.find((u: any) => u.username === data.username)) {
      toast.error("Identifiant déjà utilisé.");
      return false;
    }
    const newUser = { ...data, cin: data.cin.toUpperCase(), id: `std-${Date.now()}`, role: 'student' as UserRole, isApproved: false };
    const updated = [...latestUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem('univ_users', JSON.stringify(updated));
    toast.info("Demande d'inscription envoyée.");
    return true;
  };

  const addTeacher = async (data: any) => {
    const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
    const newUser = { ...data, id: `tea-${Date.now()}`, role: 'teacher' as UserRole, isApproved: true };
    const updated = [...latestUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem('univ_users', JSON.stringify(updated));
    toast.success("Enseignant enregistré.");
    return true;
  };

  const approveUser = (userId: string) => {
    const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
    const updated = latestUsers.map((u: any) => u.id === userId ? { ...u, isApproved: true } : u);
    setAllUsers(updated);
    localStorage.setItem('univ_users', JSON.stringify(updated));
    toast.success("Identité certifiée.");
  };

  const removeUser = (userId: string) => {
    const latestUsers = JSON.parse(localStorage.getItem('univ_users') || '[]');
    const updated = latestUsers.filter((u: any) => u.id !== userId);
    setAllUsers(updated);
    localStorage.setItem('univ_users', JSON.stringify(updated));
    toast.info("Utilisateur révoqué.");
  };

  const logout = () => {
    setUser(null);
    toast.info("Session clôturée.");
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, logout, signUpStudent, addTeacher, removeUser, approveUser, checkIdentityMatch, isApogeeValid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};