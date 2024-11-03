import { Book } from "@/types";
import mongoose, { Model } from "mongoose";

type BookModelT = Model<Book>;

const BookSchema = new mongoose.Schema<Book, BookModelT>({
  metaData: Object,
  contentUrl: String,
  llmAnalysis: Object,
  bookId: String,
});

const BookModel = mongoose?.models?.Book || mongoose.model("Book", BookSchema);

export default BookModel;
