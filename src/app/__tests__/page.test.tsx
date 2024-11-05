import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../page";
import { getBooks, deleteBook } from "../book.actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../book.actions", () => ({
  getBooks: jest.fn(),
  deleteBook: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  toast: jest.fn(),
}));

// Mock router
const pushMock = jest.fn();
const mockUseRouter = useRouter as jest.Mock;
mockUseRouter.mockImplementation(() => ({
  push: pushMock,
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful books fetch
    (getBooks as jest.Mock).mockResolvedValue({
      data: [
        {
          _id: "1",
          bookId: "123",
          metaData: {
            title: "Test Book",
            authors: [{ name: "Test Author" }],
            subjects: ["Test Subject"],
            download_count: 100,
          },
        },
      ],
      error: null,
    });
  });

  it("renders the main components", async () => {
    render(<Home />);
    
    expect(await screen.findByText("Gutenberg Explorer")).toBeInTheDocument();
    expect(await screen.findByText("Book ID")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("fetches and displays books on mount", async () => {
    render(<Home />);
    
    expect(await screen.findByText("Test Book")).toBeInTheDocument();
    expect(await screen.findByText("Test Author")).toBeInTheDocument();
    expect(await screen.findByText("Test Subject")).toBeInTheDocument();
    expect(await screen.findByText("100")).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    render(<Home />);

    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "123" } });
    const searchButton = await screen.findByRole("button", { name: "Search" });
    fireEvent.click(searchButton);

    expect(pushMock).toHaveBeenCalledWith("/book-detail?id=123");
  });

  it("handles enter key for search", async () => {
    render(<Home />);

    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(pushMock).toHaveBeenCalledWith("/book-detail?id=123");
  });

  it("handles book deletion", async () => {
    (deleteBook as jest.Mock).mockResolvedValue({
      data: "Book deleted successfully",
      error: null,
    });

    render(<Home />);

    expect(await screen.findByRole("button", { name: "Delete" })).toBeInTheDocument();

    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteBook).toHaveBeenCalledWith("1");
      expect(toast).toHaveBeenCalledWith({
        description: "Book deleted successfully",
      });
    });
  });

  it("handles book view", async () => {
    render(<Home />);

    expect(await screen.findByRole("button", { name: "View" })).toBeInTheDocument();

    const viewButton = await screen.findByRole("button", { name: "View" });
    fireEvent.click(viewButton);

    expect(pushMock).toHaveBeenCalledWith("/book-detail?id=123&itemId=1");
  });

  it("handles error in fetching books", async () => {
    (getBooks as jest.Mock).mockResolvedValue({
      data: null,
      error: "Failed to fetch books",
    });

    render(<Home />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        description: "Failed to fetch books",
        variant: "destructive",
      });
    });
  });

  it("handles error in deleting book", async () => {
    (deleteBook as jest.Mock).mockResolvedValue({
      data: null,
      error: "Failed to delete book",
    });

    render(<Home />);

    expect(await screen.findByRole("button", { name: "Delete" })).toBeInTheDocument();

    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        description: "Failed to delete book",
        variant: "destructive",
      });
    });
  });
}); 