import { IFilterOption } from '@/components/BottomSheet/Filters/CustomizeBottomSheetView';

export interface IItemFilters {
  title: string;
  data: IFilterOption[];
}

const categoryOptions: IFilterOption[] = [
  { title: 'category', label: 'All', value: 'all' },
  { title: 'category', label: 'Anime', value: 'anime' },
  { title: 'category', label: 'Game', value: 'game' },
  { title: 'category', label: 'Blind Box', value: 'blindBox' },
  { title: 'category', label: 'Others', value: 'others' },
];

const productSortByOptions: IFilterOption[] = [
  { title: 'sortBy', label: 'Date', value: 'createdAt' },
  { title: 'sortBy', label: 'Price', value: 'price' },
];

const kujiSortByOptions: IFilterOption[] = [
  { title: 'sortBy', label: 'Date', value: 'createdAt' },
  { title: 'sortBy', label: 'Price', value: 'price' },
  { title: 'sortBy', label: 'Remaining Tickets', value: 'remainingTickets' },
];

const orderOptions: IFilterOption[] = [
  { title: 'order', label: 'Ascending', value: 'asc' },
  { title: 'order', label: 'Descending', value: 'desc' },
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
