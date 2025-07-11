export default interface IProduct {
  _id: string;
  title: string;
  description: string;
  imgUrl: string[];
  category: string;
  price: number;
  inventory: number;
  material: string;
  size: number;
  isActive: boolean;
};
