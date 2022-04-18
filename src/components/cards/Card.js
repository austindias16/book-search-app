import React from 'react';
import './Card.css';

function Card(props) {
  const { authorName, book, index, imageUrl, publishedDate } = props;
  return (
    <div className='card-container' key={index}>
      <div>
        {
          <img
            className='cover-image'
            alt={`${book.title} book`}
            src={imageUrl}
          />
        }
        <div className='text-container'>
          <div className='book-title'>{book.title && book.title}</div>
          {authorName && (
            <>
              <span>by </span> <div className='book-author'>{authorName} </div>
            </>
          )}
          {publishedDate && (
            <div className='published-date'>{publishedDate}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
