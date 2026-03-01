import type { TherapistProfile, StudentSession } from '../types';

export const MOCK_THERAPIST_PROFILE: TherapistProfile = {
  id: 201,
  name: 'Dr. Ananya Sharma',
  departments: [
    {
      id: 'cs',
      name: 'Computer Science',
      totalStudents: 1250,
      safeZone: 900,
      mildDangerZone: 250,
      criticalZone: 100,
      students: [
        { id: 1001, name: 'Rahul Mehta', severityLevel: 'safe', lastCheckIn: '2025-11-25T10:30:00Z', sessionsCompleted: 5 },
        { id: 1002, name: 'Priya Sharma', severityLevel: 'safe', lastCheckIn: '2025-11-26T14:00:00Z', sessionsCompleted: 3 },
        { id: 1003, name: 'Arjun Patel', severityLevel: 'mild', lastCheckIn: '2025-11-27T09:15:00Z', sessionsCompleted: 2 },
        { id: 1004, name: 'Neha Desai', severityLevel: 'critical', lastCheckIn: '2025-11-28T11:00:00Z', sessionsCompleted: 8 },
        { id: 1005, name: 'Vikram Singh', severityLevel: 'mild', lastCheckIn: '2025-11-24T16:30:00Z', sessionsCompleted: 4 },
        { id: 1006, name: 'Anjali Reddy', severityLevel: 'safe', lastCheckIn: '2025-11-23T13:45:00Z', sessionsCompleted: 6 },
        { id: 1007, name: 'Karthik Iyer', severityLevel: 'critical', lastCheckIn: '2025-11-28T08:00:00Z', sessionsCompleted: 10 },
        { id: 1008, name: 'Deepika Nair', severityLevel: 'mild', lastCheckIn: '2025-11-26T15:20:00Z', sessionsCompleted: 3 },
      ],
    },
    {
      id: 'arts',
      name: 'Liberal Arts',
      totalStudents: 850,
      safeZone: 500,
      mildDangerZone: 280,
      criticalZone: 70,
      students: [
        { id: 2001, name: 'Sanjay Kumar', severityLevel: 'safe', lastCheckIn: '2025-11-25T12:00:00Z', sessionsCompleted: 4 },
        { id: 2002, name: 'Meera Joshi', severityLevel: 'mild', lastCheckIn: '2025-11-27T10:30:00Z', sessionsCompleted: 2 },
        { id: 2003, name: 'Aditya Kapoor', severityLevel: 'critical', lastCheckIn: '2025-11-28T14:15:00Z', sessionsCompleted: 7 },
        { id: 2004, name: 'Pooja Agarwal', severityLevel: 'safe', lastCheckIn: '2025-11-26T11:00:00Z', sessionsCompleted: 5 },
        { id: 2005, name: 'Rajesh Pillai', severityLevel: 'mild', lastCheckIn: '2025-11-24T09:45:00Z', sessionsCompleted: 3 },
      ],
    },
  ],
  assistants: [
    { id: 301, name: 'Rohan Verma' },
    { id: 302, name: 'Sneha Gupta' },
  ],
  volunteers: [
    { id: 401, name: 'Amit Singh' },
    { id: 402, name: 'Kavita Reddy' },
    { id: 403, name: 'Vivek Kumar' },
  ],
};

// Mock sessions data for students
export const MOCK_STUDENT_SESSIONS: Record<number, StudentSession[]> = {
  1001: [
    { id: 's1', studentId: 1001, therapistId: 201, date: '2025-11-15', time: '10:00 AM', status: 'completed', notes: 'Good progress, student is managing stress well.' },
    { id: 's2', studentId: 1001, therapistId: 201, date: '2025-11-22', time: '10:00 AM', status: 'completed', notes: 'Continued improvement in coping mechanisms.' },
    { id: 's3', studentId: 1001, therapistId: 201, date: '2025-12-02', time: '10:00 AM', status: 'scheduled' },
  ],
  1004: [
    { id: 's4', studentId: 1004, therapistId: 201, date: '2025-11-10', time: '2:00 PM', status: 'completed', notes: 'Student showed signs of anxiety. Discussed breathing exercises.' },
    { id: 's5', studentId: 1004, therapistId: 201, date: '2025-11-17', time: '2:00 PM', status: 'completed', notes: 'Significant improvement, practicing daily mindfulness.' },
    { id: 's6', studentId: 1004, therapistId: 201, date: '2025-11-24', time: '2:00 PM', status: 'completed', notes: 'Still dealing with academic pressure, needs continued support.' },
    { id: 's7', studentId: 1004, therapistId: 201, date: '2025-11-29', time: '2:00 PM', status: 'scheduled' },
    { id: 's8', studentId: 1004, therapistId: 201, date: '2025-12-06', time: '2:00 PM', status: 'scheduled' },
  ],
  2003: [
    { id: 's9', studentId: 2003, therapistId: 201, date: '2025-11-12', time: '11:00 AM', status: 'completed', notes: 'Initial assessment, high stress levels detected.' },
    { id: 's10', studentId: 2003, therapistId: 201, date: '2025-11-19', time: '11:00 AM', status: 'completed', notes: 'Working on stress management techniques.' },
    { id: 's11', studentId: 2003, therapistId: 201, date: '2025-11-26', time: '11:00 AM', status: 'completed', notes: 'Family issues discussed, recommended regular check-ins.' },
    { id: 's12', studentId: 2003, therapistId: 201, date: '2025-12-03', time: '11:00 AM', status: 'scheduled' },
  ],
};

