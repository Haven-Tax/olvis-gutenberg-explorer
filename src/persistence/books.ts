import "server-only";
import connectDB from "@/lib/db";
import BookModel from "@/models/book";
import { Book } from "@/types";

export const insertBook = async (book: Partial<Book>) => {
  await connectDB();
  const newBook = new BookModel(book);
  await newBook.save();
};

export const getBooks = async (): Promise<Book[]> => {
  await connectDB();
  const books = await BookModel.find().lean<Book[]>();
  return books.map(b => ({
    ...b,
    _id: b._id + ""
  }));
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  await connectDB();
  const book = await BookModel.findById(id).lean<Book>();
  if (!book) {
    return undefined;
  }
  return {
    ...book,
    _id: book._id + ""
  } as unknown as Book;
};

export const deleteBook = async (id: string) => {
  await connectDB();
  await BookModel.findByIdAndDelete(id);
};
