import IKuji from '@/models/kuji';

export type IKujiCard = Pick<IKuji, '_id' | 'title' | 'images' | 'category' | 'price' | 'totalTickets' | 'remainingTickets' | 'createdAt'>

export interface IKujisResponse {
  items: IKujiCard[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
