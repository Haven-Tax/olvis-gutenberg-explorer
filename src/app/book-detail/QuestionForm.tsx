"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { askQuestion } from "../book.actions";

interface QuestionFormProps {
  bookId: string;
}

export const QuestionForm = ({ bookId }: QuestionFormProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);

  const handleAskQuestion = async () => {
    if (!bookId || !question.trim()) return;
    
    setAskingQuestion(true);
    const { data, error } = await askQuestion(bookId, question);
    setAskingQuestion(false);

    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
      return;
    }

    setAnswer(data || "");
    setQuestion("");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl">
      <div className="flex gap-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this book..."
          className="flex-1 p-2 border rounded"
        />
        <Button
          onClick={handleAskQuestion}
          disabled={askingQuestion || !question.trim()}
          className="bg-purple-500"
        >
          {askingQuestion ? "Asking..." : "Ask"}
        </Button>
      </div>
      {answer && (
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Answer:</p>
          <p className="text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}; 