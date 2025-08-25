interface IPrize {
  rank: string;
  name: string;
  description: string;
  caption: string;
  quantity: number;
  imgUrl: string;
  probability: number;
}

export default interface IKuji {
  _id: string;
  title: string;
  images: string[];
  price: number;
  category: 'Anime' | 'Game' | 'Other';
  prizes: IPrize[];
  totalTickets: number;
  remainingTickets: number;
  isActive: boolean;
  createdAt: string;
}
