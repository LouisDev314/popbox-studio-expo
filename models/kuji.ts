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
  title: string;
  price: number;
  category: 'Anime' | 'Game' | 'Other';
  prizes: IPrize[],
  totalTickets: number,
  remainingTickets: number,
};
