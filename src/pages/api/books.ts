import type { APIRoute } from 'astro';
import { getBooks } from '@/lib/fetchBooks';

export const GET: APIRoute = async () => {
  try {
    const books = await getBooks();
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Stronger cache prevention
        'Cache-Control':
          'private, no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
        // Add this to prevent Netlify from caching
        'x-netlify-cache-control': 'no-cache',
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
