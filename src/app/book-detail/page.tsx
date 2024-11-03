"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Book, NewBook } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { insertBook, fetchNewBook, fetchBook as fetchExistingBook } from "../book.actions";
import { QuestionForm } from "./QuestionForm";

export default function Home() {
  return (
    <Suspense>
      <PageUI />
    </Suspense>
  );
}



type NewOrExistingBook = NewBook | Book;
const PageUI = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [book, setBook] = useState<NewOrExistingBook>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id");
  const itemId = searchParams.get("itemId");
  const isReadOnly = !!itemId;

  const handleDiscard = () => router.push("/");

  const handleSave = async () => {
    if (!book) {
      return;
    }
    setSaving(true);
    const { error, data } = await insertBook(book);
    setSaving(false);
    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
      return;
    }
    toast({
      description: data,
    });
    router.push("/");
  };

  const handleSearch = React.useCallback(async (id: string) => {
    setLoading(true);
    const { data, error } = await fetchNewBook(id);

    if (error || !data) {
      toast({
        description: error,
        variant: "destructive",
      });
      router.push("/");
      setLoading(false);
      return;
    }
    setLoading(false);
    setBook(data);
  }, [router]);

  const loadExistingBook = React.useCallback(async (id: string) => {
    setLoading(true);
    const { data, error } = await fetchExistingBook(id);
    setLoading(false);

    if (error || !data) {
      toast({
        description: error,
        variant: "destructive",
      });
      router.push("/");
      return;
    }
    setBook(data);
  }, [router]); 

  useEffect(() => {
    if (isReadOnly) {
      loadExistingBook(itemId);
    } else if (bookId) {
      handleSearch(bookId);
    }
  }, [isReadOnly, itemId, bookId, handleSearch, loadExistingBook]);

  return (
    <div className="flex flex-col gap-20 items-center py-16 max-w-5xl mx-auto px-10">
      <h1 className="font-bold text-6xl text-center">Gutenberg Explorer</h1>

      {loading ? (
        "Fetching book data..."
      ) : (
        <React.Fragment>
          <div className="flex flex-col gap-6 w-full max-w-5xl">
            <div className="flex">
              <p className="text-xl font-bold w-48">Book Id</p>
              <p className="text-sm flex-1">{bookId}</p>
            </div>
            <div className="flex">
              <p className="text-xl font-bold w-48">Title</p>
              <p className="text-sm flex-1">{book?.metaData?.title}</p>
            </div>
            <div className="flex">
              <p className="text-xl font-bold w-48">Authors</p>
              <p className="text-sm flex-1">
                {book?.metaData?.authors?.map((author) => author.name).join(", ")}
              </p>
            </div>
            <div className="flex">
              <p className="text-xl font-bold w-48">Subjects</p>
              <p className="text-sm flex-1">{book?.metaData?.subjects?.join(", ")}</p>
            </div>
            <div className="flex">
              <p className="text-xl font-bold w-48">Download Count</p>
              <p className="text-sm flex-1">{book?.metaData?.download_count}</p>
            </div>

            {book?.llmAnalysis && (
              <>
                <div className="flex">
                  <p className="text-xl font-bold w-48">Summary</p>
                  <p className="text-sm flex-1">{book?.llmAnalysis?.summary}</p>
                </div>
                <div className="flex">
                  <p className="text-xl font-bold w-48">Characters</p>
                  <p className="text-sm flex-1">{book?.llmAnalysis?.characters?.join(", ")}</p>
                </div>
                <div className="flex">
                  <p className="text-xl font-bold w-48">Sentiments</p>
                  <p className="text-sm flex-1">{book?.llmAnalysis?.sentiments?.join(", ")}</p>
                </div>
                <div className="flex">
                  <p className="text-xl font-bold w-48">Plot</p>
                  <p className="text-sm flex-1">{book?.llmAnalysis?.plot}</p>
                </div>
              </>
            )}
          </div>
          {isReadOnly && <QuestionForm bookId={itemId!} />}
          <div className="flex gap-4">
            {!isReadOnly && (
              <>
                <Button
                  className="bg-red-500"
                  onClick={handleDiscard}
                  disabled={saving}
                >
                  Discard
                </Button>
                <Button
                  className="bg-green-500"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
            {isReadOnly && (
              <Button
                className="bg-blue-500"
                onClick={handleDiscard}
              >
                Back
              </Button>
            ) }
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
