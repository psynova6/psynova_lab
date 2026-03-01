import type { Department } from '../types';

export const MOCK_INSTITUTION_DATA: Department[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    stats: {
      totalStudents: 1250,
      safeZone: 900,
      mildDangerZone: 250,
      criticalZone: 100,
      reachedOutToTherapist: 180,
      improvedAfterSessions: 120,
    },
    students: [
      { id: 1, name: 'Rahul Sharma' },
      { id: 2, name: 'Priya Patel' },
      { id: 3, name: 'Amit Singh' },
      { id: 4, name: 'Sneha Gupta' },
      { id: 5, name: 'Vivek Kumar' },
    ],
    therapists: [
      { id: 101, name: 'Dr. Ananya Sharma', studentsAttended: 25, maxCapacity: 30 },
      { id: 102, name: 'Rohan Verma', studentsAttended: 15, maxCapacity: 25 },
    ],
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    stats: {
      totalStudents: 980,
      safeZone: 750,
      mildDangerZone: 180,
      criticalZone: 50,
      reachedOutToTherapist: 95,
      improvedAfterSessions: 70,
    },
    students: [
      { id: 6, name: 'Anjali Mehta' },
      { id: 7, name: 'Deepak Chopra' },
    ],
    therapists: [
      { id: 103, name: 'Priya Desai', studentsAttended: 18, maxCapacity: 25 },
    ],
  },
  {
    id: 'arts',
    name: 'Liberal Arts',
    stats: {
      totalStudents: 850,
      safeZone: 500,
      mildDangerZone: 280,
      criticalZone: 70,
      reachedOutToTherapist: 150,
      improvedAfterSessions: 90,
    },
    students: [
       { id: 8, name: 'Kavita Reddy' },
       { id: 9, name: 'Sanjay Iyer' },
       { id: 10, name: 'Natasha Romanoff' },
    ],
    therapists: [
      { id: 101, name: 'Dr. Ananya Sharma', studentsAttended: 12, maxCapacity: 30 },
      { id: 104, name: 'Dr. Meera Krishnan', studentsAttended: 22, maxCapacity: 25 },
    ],
  },
  {
    id: 'business',
    name: 'Business Administration',
    stats: {
      totalStudents: 1500,
      safeZone: 1100,
      mildDangerZone: 320,
      criticalZone: 80,
      reachedOutToTherapist: 210,
      improvedAfterSessions: 160,
    },
    students: [
        { id: 11, name: 'Raj Malhotra' },
    ],
    therapists: [
        { id: 102, name: 'Rohan Verma', studentsAttended: 20, maxCapacity: 25 },
        { id: 105, name: 'Vikram Singh', studentsAttended: 24, maxCapacity: 30 },
    ],
  },
];
