import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const LoadingState = () => (
  <div className='h-full w-full'>
    <div className='animate-pulse space-y-3'>
      <div className='h-4 bg-gray-200 rounded w-full dark:bg-gray-700'></div>
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center gap-2'>
            <div className='h-3 bg-gray-200 rounded w-full dark:bg-gray-700'></div>
            <div className='h-3 bg-gray-200 rounded w-full dark:bg-gray-700'></div>
            {i === 0 && (
              <div className='h-5 bg-gray-200 rounded w-full dark:bg-gray-700'></div>
            )}
          </div>
        ))}
      </div>
      <div className='h-4 bg-gray-200 rounded w-full mt-4 dark:bg-gray-700'></div>
    </div>
  </div>
);

export default function Books() {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError('Failed to load books');
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!books) {
    return <LoadingState />;
  }

  return (
    <div className='flex flex-col'>
      <p className='text-sm font-light my-1'>
        Let's be honest—I don't really read books. Who has the time to flip
        through pages when audiobooks exist? I can enjoy a great story while
        pretending to fold laundry or on my commute to… the fridge. My favorite
        audiobook genres? Mysteries and thriller romances (nothing like love and
        murder to keep things interesting), true crime (for that "glad it's not
        me" vibe), history books (because who doesn't love reliving the drama of
        the past?), and IT books (because debugging my brain is just as fun as
        debugging code).
      </p>
      <div className='h-full'>
        <div className='mt-4 flex w-fit flex-col'>
          <ul className='list-inside list-disc'>
            {books.slice(0, 5).map((book, index) => (
              <li key={book.slug}>
                <a
                  href={`/books/${book.slug}`}
                  className='hover:font-bold hover:underline'
                >
                  {book.title}
                </a>
                <span className='text-xs font-thin italic'>
                  {` - ${book.author}`}
                </span>{' '}
                {index === 0 && (
                  <Badge variant='secondary'>
                    Listening Now{' '}
                    <span className='relative flex h-3 w-3 ml-2'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
                      <span className='relative inline-flex h-3 w-3 rounded-full bg-green-500' />
                    </span>
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          <a href='/books'>
            <Button variant='link' className='pl-0'>
              View More
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
