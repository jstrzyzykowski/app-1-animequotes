import React from 'react';
import './Quote.css';

const Quote = ({quoteText, quoteCharacter, quoteAnime}) => {
  return (
    <figure>
      <blockquote>
        {quoteText}
      </blockquote>
      <figcaption>
        &mdash; {quoteCharacter}, <cite>{quoteAnime}</cite>
      </figcaption>
    </figure>
  );
}

export default Quote;