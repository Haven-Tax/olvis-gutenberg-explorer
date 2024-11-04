# Gutenberg Books Explorer

Author: Olvis Camacho

This is a [Next.js](https://nextjs.org) project that allows users to search and explore books and documents from the Gutenberg Project repository.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

To run the tests:

```bash
npm run test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About the Project

This application provides an interface to search and read books from the Gutenberg Project library. You can browse through thousands of free books and documents in the public domain.

## Features

### Book Search
- Search for books using their unique Gutenberg Book ID
- Get instant access to book details, summary, chapters, and authors, etc.

### Query History
- View your past book searches
- Delete individual search history entries
- Keep track of your reading interests

### AI-Powered Book Discussions
- Ask questions about any book in your search history
- Get intelligent responses powered by Llama model hosted on Groq

## Technologies Used

This project uses:
- [Next.js](https://nextjs.org) as the main framework
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization
- [Vercel](https://vercel.com) for deployment

## Future Improvements

There are several areas where this project could be enhanced:

### Integration Tests
- Need to implement comprehensive integration tests to ensure all components work together seamlessly
- Focus on testing the book search and display functionality

### RAG Implementation
I attempted to implement Retrieval-Augmented Generation (RAG) to enable AI-powered book discussions, but encountered some challenges:
- Groq models don't currently support embeddings
- OpenAI models rejected the embeddings due to token limits when processing book content
- This feature remains a priority for future development

## Deployment

This project is deployed on [Vercel](https://vercel.com). You can visit the live application at [https://gutenberg-explorer.vercel.app/](https://gutenberg-explorer.vercel.app/)

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Project Gutenberg](https://www.gutenberg.org/)
- [Vercel Platform](https://vercel.com)
