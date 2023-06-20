export interface MetaLinksInterface {
  self: URL;
  first: URL;
  previous: URL | null;
  next: URL | null;
  last: URL;
}

export interface MetaInterface {
  page: number;
  pageCount: number;
  nextPage: number | null;
  prevPage: number | null;
  offset?: number;
  totalItems?: number;
  itemCount?: number;
  links?: MetaLinksInterface;
}
