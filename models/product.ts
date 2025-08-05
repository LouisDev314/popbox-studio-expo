export default interface IProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  inventory: number;
  material: string;
  size: number;
  isActive: boolean;
  createdAt: string;
};
