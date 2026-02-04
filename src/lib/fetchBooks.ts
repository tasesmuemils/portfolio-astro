import { xml2js } from 'xml-js';

const RSS_URL_READ =
  'https://www.goodreads.com/review/list_rss/170718823?key=O9tanEt3nWSgtv9zXn8dXW82Ph5xFb5vcVGqhAiUc75d4B1o&shelf=read';

const RSS_URL_CURRENT =
  'https://www.goodreads.com/review/list_rss/170718823?key=O9tanEt3nWSgtv9zXn8dXW82Ph5xFb5vcVGqhAiUc75d4B1o&shelf=currently-reading';

type Book = {
  title: { _text: string };
  link: { _text: string };
  author_name: { _text: string };
};

type RssData = {
  rss: {
    channel: {
      item: Array<Book>;
    };
  };
};

async function fetchBooks(url: string): Promise<Book[]> {
  try {
    // Add cache-busting parameter to the URL
    const cacheBustUrl = `${url}&_cb=${Date.now()}`;

    const response = await fetch(cacheBustUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch books from ${url}: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const rssText = await response.text();
    const rssData = xml2js(rssText, { compact: true }) as RssData;
    return rssData.rss.channel.item || [];
  } catch (error) {
    console.error(`Error fetching books from ${url}:`, error);
    return [];
  }
}

export async function getBooks() {
  try {
    const booksRead = await fetchBooks(RSS_URL_READ);
    const booksCurrent = await fetchBooks(RSS_URL_CURRENT);
    console.log('Current books:', booksCurrent.length);
    console.log('Read books:', booksRead.length);

    const books =
      booksCurrent.length == 0 ? booksRead : [booksCurrent, ...booksRead];

    const formattedBooks = books.map((book) => {
      const title = book.title._cdata || book.title._text;
      const slug = book.book_id._text; // Assuming the last part of the URL is the slug
      const author = book.author_name._text;
      const description = book.author_name._text;
      const dates = {
        // You can set custom logic to extract dates from the RSS feed or leave them empty
        readStartDate: null, // Example, you can populate with actual date data if available
        readEndDate: null, // Example, you can populate with actual date data if available
      };
      const image =
        book.book_large_image_url._cdata || book.book_large_image_url._text;
      const rating = book.user_rating._text;
      const averageRating = book.average_rating._text;
      const long_description =
        book.book_description._cdata || book.book_description._text;
      const pages = book.book.num_pages._text;

      return {
        description,
        long_description,
        title,
        slug,
        author,
        dates,
        image,
        rating,
        averageRating,
        pages,
      };
    });

    console.log('Formatted books:', formattedBooks.length);

    return formattedBooks;
  } catch (error) {
    console.error('Error in getBooks:', error);
    return [];
  }
}
