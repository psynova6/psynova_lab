import React from 'react';

export type Role = 'institution' | 'student' | 'therapist';
export type UserRoleType = 'student' | 'therapist' | 'assistant' | 'volunteer';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
}

export interface UserProfile {
  name: string;
  avatar: string | null; // base64 string or null
}

export interface Session {
  therapistName: string;
  date: string;
  status: 'Completed';
}

export interface Notification {
  id: number;
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  onClick?: () => void;
}

export interface Reminder {
  id: number;
  task: string;
  dueDate: string; // ISO string for date and time
  reminderTiming: number; // in minutes before due date (0 for on-time)
}

export interface NotificationSettings {
  enableQuarterlyCheckin: boolean;
  enableTaskReminders: boolean;
}

// --- Institution Dashboard Types ---

export interface Student {
  id: number;
  name: string;
}

export interface Therapist {
  id: number;
  name: string;
  studentsAttended: number;
  maxCapacity: number;
}

export interface DepartmentStats {
  totalStudents: number;
  safeZone: number;
  mildDangerZone: number;
  criticalZone: number;
  reachedOutToTherapist: number;
  improvedAfterSessions: number;
}

export interface Department {
  id: string;
  name: string;
  stats: DepartmentStats;
  students: Student[];
  therapists: Therapist[];
}

// --- Therapist Dashboard Types ---

export type SeverityLevel = 'safe' | 'mild' | 'critical';

export interface Assistant {
  id: number;
  name: string;
}

export interface Volunteer {
  id: number;
  name: string;
}

export interface TherapistNote {
  id: string;
  studentId: number;
  therapistId: number;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface StudentSession {
  id: string;
  studentId: number;
  therapistId: number;
  date: string; // ISO date string
  time: string; // e.g., "10:00 AM"
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string; // Session notes (only for completed sessions)
}

export interface TherapistStudent {
  id: number;
  name: string;
  severityLevel: SeverityLevel;
  lastCheckIn?: string; // ISO date string
  sessionsCompleted: number;
}

export interface TherapistDepartmentView {
  id: string;
  name: string;
  totalStudents: number;
  safeZone: number;
  mildDangerZone: number;
  criticalZone: number;
  students: TherapistStudent[]; // Added students array
}

export interface TherapistProfile {
  id: number;
  name: string;
  departments: TherapistDepartmentView[];
  assistants: Assistant[];
  volunteers: Volunteer[];
}