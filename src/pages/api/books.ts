import type { APIRoute } from 'astro';
import { getBooks } from '@/lib/fetchBooks';

export const GET: APIRoute = async () => {
  try {
    const books = await getBooks();
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch books' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
