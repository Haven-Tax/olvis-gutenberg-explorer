import "server-only";

import axios from "axios";
import { BookMetaData } from "./types";

export const getBookMetaData = async (bookId: string) => {
  const response = await axios.get(`https://gutendex.com/books/${bookId}`);
  return response.data as BookMetaData;
};

export const getBookContent = async (url: string) : Promise<string> => {
  const response = await axios.get(url);
  return response.data as string;
};
