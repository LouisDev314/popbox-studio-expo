import IPrize from '@/app/models/prize';

export default interface ISeries {
  title: string;
  price: number;
  category: 'Anime' | 'Game' | 'Other';
  prizes: IPrize[],
  totalTickets: number,
  remainingTickets: number,
};
