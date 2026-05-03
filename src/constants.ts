import { ElectionStep } from './types';

export const ELECTION_STEPS: ElectionStep[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    description: 'The first step to making your voice heard. Ensure you are eligible and registered.',
    icon: 'UserPlus',
    color: 'bg-blue-500',
    startDay: 0,
    endDay: 45,
    priority: 'High',
    details: [
      'Check eligibility (age, citizenship)',
      'Find your registration deadline',
      'Update your address or name',
      'Register online, by mail, or in person'
    ]
  },
  {
    id: 'selection',
    title: 'Candidate Selection',
    description: 'Research the people and parties running for office. Understand their platforms.',
    icon: 'Users',
    color: 'bg-purple-500',
    startDay: 30,
    endDay: 90,
    priority: 'Medium',
    details: [
      'View sample ballots',
      'Research candidate histories',
      'Compare policy positions',
      'Check endorsement lists'
    ]
  },
  {
    id: 'procedures',
    title: 'Voting Procedures',
    description: 'Know when, where, and how to cast your ballot safely and correctly.',
    icon: 'CheckSquare',
    color: 'bg-emerald-500',
    startDay: 85,
    endDay: 95,
    priority: 'High',
    details: [
      'Find your polling station',
      'Check early voting dates',
      'Request or drop off a mail-in ballot',
      'Bring required identification'
    ]
  },
  {
    id: 'results',
    title: 'Result Declaration',
    description: 'Stay updated as votes are counted and certified results are announced.',
    icon: 'TrendingUp',
    color: 'bg-orange-500',
    startDay: 95,
    endDay: 110,
    priority: 'Low',
    details: [
      'Monitor live count updates',
      'Understand projection vs. certification',
      'Track historical trends',
      'Get notified of final winners'
    ]
  }
];

export const INITIAL_ASSISTANT_MESSAGE = "Hi! I'm your VoteWise Assistant. I can help you understand the election process, track deadlines, or explain how different systems work. What would you like to know today?";
