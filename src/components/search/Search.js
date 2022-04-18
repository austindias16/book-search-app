import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';
import Card from './../cards/Card';
import { FaSearch } from 'react-icons/fa';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState({ docs: [] });

  const onInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  let API_URL = `http://openlibrary.org/search.json`;

  const fetchBooks = async () => {
    const result = await axios.get(`${API_URL}?q=${searchTerm}`);
    setBooks(result.data);
    setSearchTerm('');
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleSorting = (e) => {
    e.preventDefault();
    let bookArray = { ...books };
    if (e.target.name === 'sort by title') {
      bookArray.docs = bookArray.docs.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );
      setBooks(bookArray);
    }
    if (e.target.name === 'sort by recent') {
      bookArray.docs = bookArray.docs.sort((a, b) => {
        let publishedDateA =
            a.publish_date && a.publish_date.length > 0
              ? a.publish_date[0]
              : null,
          publishedDateB =
            b.publish_date && b.publish_date.length > 0
              ? b.publish_date[0]
              : null;
        publishedDateA =
          publishedDateA &&
          publishedDateA.match(
            /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/gi
          )[0];
        publishedDateB =
          publishedDateB &&
          publishedDateB.match(
            /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/gi
          )[0];
        return publishedDateB > publishedDateA ? 1 : -1;
      });
      setBooks(bookArray);
    }
  };

  return (
    <div>
      <form className='search-container' onSubmit={onSubmitHandler}>
        <h3 className='page-title'>Search for books</h3>
        <div className='search-group'>
          <label htmlFor='search'></label>
          <input
            className='search-box'
            name='search'
            type='search'
            value={searchTerm}
            onChange={onInputChange}
            aria-label='search'
            autoComplete='off'
          />
          <label htmlFor='submit'></label>
          <button
            className='btn'
            aria-label='submit'
            type='submit'
            name='submit'
          >
            <FaSearch />
          </button>
        </div>
      </form>
      {books.docs.length > 0 ? (
        <div className='sort-buttons'>
          <label htmlFor='sort by title'></label>
          <button
            aria-label='sort by title'
            name='sort by title'
            onClick={handleSorting}
            className='btn filter-button'
          >
            Sort by title
          </button>
          <label htmlFor='sort by recent'></label>
          <button
            aria-label='sort by recent'
            name='sort by recent'
            onClick={handleSorting}
            className='btn filter-button '
          >
            Sort by Recently Published
          </button>
        </div>
      ) : null}
      {books.docs.length > 0 && (
        <div className='search-results'>
          {books.docs.map((book, index) => {
            let imageUrl =
                book.isbn && book.isbn.length > 0
                  ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
                  : `http://via.placeholder.com/150x250`,
              authorName =
                book.author_name && book.author_name.length > 0
                  ? book.author_name[0]
                  : null,
              publishedDate =
                book.publish_date && book.publish_date.length > 0
                  ? book.publish_date[0]
                  : null;
            let cardProps = {
              book,
              index,
              imageUrl,
              authorName,
              publishedDate,
            };

            return <Card key={index} {...cardProps}></Card>;
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
