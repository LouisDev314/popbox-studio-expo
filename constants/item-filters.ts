import { IFilterOption } from '@/components/BottomSheet/Filters/CustomizeBottomSheetView';

const categoryOptions: IFilterOption[] = [
  { label: 'Anime', value: 'anime' },
  { label: 'Game', value: 'game' },
  { label: 'Others', value: 'others' },
];

const productSortByOptions: IFilterOption[] = [
  { label: 'Date', value: 'createdAt' },
  { label: 'Price', value: 'price' },
];

const kujiSortByOptions: IFilterOption[] = [
  { label: 'Date', value: 'createdAt' },
  { label: 'Price', value: 'price' },
  { label: 'Remaining Tickets', value: 'remainingTickets' },
];

const orderOptions: IFilterOption[] = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export const filterOptions = (isKuji?: boolean) => {
  return {
    categoryOptions,
    sortByOptions: isKuji ? kujiSortByOptions : productSortByOptions,
    orderOptions,
  };
};
