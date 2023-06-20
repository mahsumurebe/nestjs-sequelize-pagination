export interface MetaLinksInterface {
  firstUrl: URL;
  lastUrl: URL;
  nextUrl: URL | null;
  prevUrl: URL | null;
}

export interface MetaInterface {
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  offset?: number;
  totalItems?: number;
  totalPages?: number;
  itemCount?: number;
  links?: MetaLinksInterface;
}
