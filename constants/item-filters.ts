import { ProductCategory, ProductsOrder, ProductSortBy } from '@/enums/sort-by-filters';

export interface IItemFilters {
  title: string;
  data: IFilterOption[];
}

export interface IFilterOption {
  title: string;
  label: string;
  value: string;
}

const categoryOptions: IFilterOption[] = [
  { title: 'category', label: 'All', value: ProductCategory.All },
  { title: 'category', label: 'Anime', value: ProductCategory.Anime },
  { title: 'category', label: 'Game', value: ProductCategory.Game },
  { title: 'category', label: 'Blind Box', value: ProductCategory.BlindBox },
  { title: 'category', label: 'Others', value: ProductCategory.Others },
];

const productSortByOptions: IFilterOption[] = [
  { title: 'sortBy', label: 'Best Selling', value: ProductSortBy.SalesVolume },
  { title: 'sortBy', label: 'Date', value: ProductSortBy.Date },
  { title: 'sortBy', label: 'Price', value: ProductSortBy.Price },
];

const kujiSortByOptions: IFilterOption[] = [
  { title: 'sortBy', label: 'Date', value: 'date' },
  { title: 'sortBy', label: 'Price', value: 'price' },
  { title: 'sortBy', label: 'Remaining Tickets', value: 'remainingTickets' },
];

const orderOptions: IFilterOption[] = [
  { title: 'order', label: 'Descending', value: ProductsOrder.Desc },
  { title: 'order', label: 'Ascending', value: ProductsOrder.Asc },
];

export const filterOptions = (isKuji?: boolean): IItemFilters[] => [
  {
    title: 'Category',
    data: categoryOptions,
  },
  {
    title: 'Sort By',
    data: isKuji ? kujiSortByOptions : productSortByOptions,
  },
  {
    title: 'Order',
    data: orderOptions,
  },
];
