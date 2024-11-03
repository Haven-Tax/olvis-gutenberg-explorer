"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { deleteBook, getBooks } from "./book.actions";
import { toast } from "@/hooks/use-toast";
import { Book } from "@/types";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleSearch = async () => {
    router.push(`/book-detail?id=${bookId}`);
  };

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await getBooks();
    setLoading(false);

    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
    }
    setBooks(data || []);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col gap-20 items-center py-16 max-w-5xl mx-auto">
      <h1 className="font-bold text-6xl text-center">Gutenberg Explorer</h1>
      <div className="flex items-center gap-6">
        <p className="whitespace-nowrap">Book ID</p>
        <Input
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Book Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-center">Download Count</TableHead>
            <TableHead className="text-center  w-[124px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Fetching saved books...
              </TableCell>
            </TableRow>
          )}
          {books?.map((book) => (
            <BookTableRow key={book._id} book={book} setBooks={setBooks} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface RowProps {
  book: Book;
  setBooks: Dispatch<SetStateAction<Book[]>>;
}

const BookTableRow = ({ book, setBooks }: RowProps) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    const { data, error } = await deleteBook(book._id);
    setDeleting(false);

    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
    }
    toast({
      description: data,
    });
    setBooks((prev) => prev.filter((d) => d._id !== book._id));
  };

  const handleView = async () => {
    router.push(`/book-detail?id=${book.bookId}&itemId=${book._id}`);
  };

  return (
    <TableRow>
      <TableCell>{book.bookId}</TableCell>
      <TableCell>{book.metaData?.title}</TableCell>
      <TableCell>{book.metaData?.authors?.[0]?.name}</TableCell>
      <TableCell>{book.metaData?.subjects?.[0]}</TableCell>
      <TableCell className="text-center">
        {book.metaData?.download_count}
      </TableCell>
      <TableCell className="text-center w-[124px]">
        <div className="flex gap-1">
          <Button onClick={handleView} size="sm">
            View
          </Button>
          <Button variant="destructive" onClick={handleDelete} size="sm">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
