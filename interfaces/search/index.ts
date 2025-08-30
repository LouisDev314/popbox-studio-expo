export interface ISearchHistoryItem {
  _id?: string;
  query: string;
  timestamp: number;
}

export interface IAutocompleteItem {
  _id: string;
  title: string;
}
