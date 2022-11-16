export interface SearchQuery {
  query: string;
  filters: {
    [key: string]: string;
  };
}
