import React from 'react';

export interface Achievement {
  id: string;
  title: string;
  category: 'FTC' | 'FLL';
  year: number;
  award?: string;
  description: string;
  learnings: string;
}

export interface TeamMember {
  name: string;
  role: string;
  department: 'Coding' | 'Inspire' | 'RoboPart';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'BIL FIRST Scrimmage — WAP',
    category: 'FTC',
    year: 2024,
    award: 'WAP (Winner)',
    description: 'First participation in FTC competitions.',
    learnings: 'Prototyping, teamwork under pressure, system reliability.'
  },
  {
    id: '2',
    title: 'Haileybury Championship',
    category: 'FLL',
    year: 2024,
    award: 'Core Values Finalist',
    description: 'Excellence in FIRST philosophy.',
    learnings: 'FIRST values, communication, professional ethics.'
  },
  {
    id: '3',
    title: 'Regional Scrimmage',
    category: 'FLL',
    year: 2024,
    award: 'Engineering Excellence Award',
    description: 'High-performance drivetrain and reliability.',
    learnings: 'Drivetrain optimization, mechanical robustness.'
  },
  {
    id: '4',
    title: 'Innovation Scrimmage',
    category: 'FLL',
    year: 2024,
    award: 'Innovation Project Winner',
    description: 'Best innovative solution presentation.',
    learnings: 'Pitching, research methodology, product design.'
  },
  {
    id: '5',
    title: 'Central Asia Open',
    category: 'FLL',
    year: 2024,
    award: 'Programming Excellence Award',
    description: 'Advanced algorithms and autonomy.',
    learnings: 'Algorithms, autonomy control, precise debugging.'
  }
];

export const TEAM_ROLES = {
  Coding: {
    title: 'Coding Team',
    description: 'Software, algorithms, and system control.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  Inspire: {
    title: 'Inspire Team',
    description: 'Communication, inspiration, and FIRST outreach.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    )
  },
  RoboPart: {
    title: 'RoboPart Team',
    description: 'Mechanics, assembly, and physical testing.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
};

