"use server";

import { Book, NewBook } from "@/types";
import { 
  getBooks as getBooksFromDb, 
  deleteBook as deleteBookFromDb,
  insertBook as insertBookToDb,
  getBookById
} from "@/persistence/books";
import { getBookMetaData } from "@/gutenbergApi";
import { getBookAnalysis, askBookQuestion } from "@/llm";

export const getBooks = async (): Promise<{ data?: Book[], error?: string }> => {
  try {
    const books = await getBooksFromDb();
    return {
      data: books
    };
  } catch (error) {
    console.error("Failed to fetch books", error);
    return {
      error: "Failed to fetch books",
    };
  }
};

export const deleteBook = async (id: string): Promise<{ data?: string, error?: string }> => {
  try {
    await deleteBookFromDb(id);
    return {
      data: "Book deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete book", error);
    return {
      error: "Failed to delete book",
    };
  }
}

export const insertBook = async (book: Partial<Book>): Promise<{ data?: string, error?: string }> => {
  try {
    await insertBookToDb(book);
    return {
      data: "Book inserted successfully"
    };
  } catch (error) {
    console.error("Failed to insert book", error);
    return {
      error: "Failed to insert book",
    };
  }
}

export const fetchBook = async (bookId: string): Promise<{ data?: Book, error?: string }> => {
  try {
    const book = await getBookById(bookId);
    return {
      data: book
    };
  } catch (error) {
    console.error("Failed to fetch book", error);
    return {
      error: "Failed to fetch book",
    };
  }
}

export const fetchNewBook = async (bookId: string) : Promise< { data?: NewBook, error?: string }> => {
  try {
    const metaData = await getBookMetaData(bookId);
    const contentUrl = metaData?.formats?.["text/plain; charset=us-ascii"];
    const llmAnalysis = await getBookAnalysis(metaData);
    const newBook : NewBook = {
      metaData,
      llmAnalysis,
      bookId,
      contentUrl,
    }
    return {
      data: newBook,
    };
  } catch (error) {
    console.log("error fetching book", error);
    return {
      error: "Failed to fetch book data",
    };
  }
};

export const askQuestion = async (bookId: string, question: string): Promise<{ data?: string, error?: string }> => {
  try {
    const book = await getBookById(bookId);
    if (!book?.metaData) {
      return {
        error: "Book not found or missing metadata"
      };
    }
    const answer = await askBookQuestion(book.metaData, question);
    return {
      data: answer
    };
  } catch (error) {
    console.error("Failed to get answer for book question", error);
    return {
      error: "Failed to get answer for book question",
    };
  }
};


