export type BookMetaData = {
  id: number;
  title: string;
  authors: Author[];
  translators: Translator[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: Formats;
  download_count: number;
}

export type Author = {
  name: string;
  birth_year: number;
  death_year: number;
}

export type Translator = {
  name: string;
  birth_year?: number;
  death_year?: number;
}

export type Formats = {
  "text/html"?: string;
  "application/epub+zip"?: string;
  "application/x-mobipocket-ebook"?: string;
  "application/rdf+xml"?: string;
  "image/jpeg"?: string;
  "application/octet-stream"?: string;
  "text/plain; charset=us-ascii"?: string;
}

export type LlmBookAnalysis = {
  summary: string;
  characters: string[];
  sentiments: string[];
  plot: string;
}

export type Book = {
  metaData: BookMetaData;
  content?: string;
  contentUrl?: string;
  llmAnalysis?: LlmBookAnalysis;
  bookId: string;
  _id: string;
}

export type NewBook = Omit<Book, "_id">;
