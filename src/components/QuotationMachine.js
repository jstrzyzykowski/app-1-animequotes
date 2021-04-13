import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import Snackbar from './Snackbar';
import {localData} from '../data/data';
import './QuotationMachine.css';
import Quote from './Quote';

const QuotationMachine = () => {
  const [quotations, setQuotations] = useState(null);
  const [drawedQuotationItem, setDrawedQuotationItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [animeValue, setAnimeValue] = useState('');
  const [characterValue, setCharacterValue] = useState('');
  const [quoteValue, setQuoteValue] = useState('');
  const [errors, setErrors] = useState({});
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateForm();
    
    setErrors(validateForm());

    if(result.isValid) {
      const customQuote = {
        anime: animeValue,
        character: characterValue,
        quote: quoteValue
      }
      const array = [...quotations];
      array.push(customQuote);
      setQuotations(array);
      
      clearForm();
      showSnackbar();
    }
  }

  const handleClick = () => {
    setIsLoading(true);
    const drawFromApi = Math.floor(Math.random() * 2) === 0 ? false : true;
    
    drawFromApi ? getRandomQuotationFromApi().then(data => setDrawedQuotationItem(data)) : getRandomQuotationFromLocal();
  }

  async function getRandomQuotationFromApi() {
    let response = await fetch('https://animechan.vercel.app/api/random');
    setIsLoading(false);
    let data = response.json();
    return data;
  };

  const getRandomQuotationFromLocal = () => {
    const index = Math.floor(Math.random() * quotations.length);
    setDrawedQuotationItem(quotations[index]);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }

  const validateForm = () => {
    let errors = {};

    if(animeValue.trim() === '') errors.anime = 'Must not be empty';
    if(characterValue.trim() === '') errors.character = 'Must not be empty';
    if(quoteValue.trim() === '') errors.quote = 'Must not be empty';

    if(Object.keys(errors).length === 0) errors.isValid = true;
    else errors.isValid = false;

    return errors;
  }

  const handleChange = (event) => {
    const {name, value} = event.target;

    switch (name) {
      case 'anime':
        setAnimeValue(value);
        break;
      case 'character':
        setCharacterValue(value);
        break;
      case 'quote':
        setQuoteValue(value);
        break;
      default:
        break;
    }
  }

  const clearForm = () => {
    setAnimeValue('');
    setCharacterValue('');
    setQuoteValue('');
  }

  const showSnackbar = () => {
    setIsSnackbarOpen(true);
    setTimeout(() => {
      setIsSnackbarOpen(false);
    }, 3000);
  }

  const expand = () => {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    setQuotations(localData);
    getRandomQuotationFromApi()
    .then(data => setDrawedQuotationItem(data));
  }, [])

  return (
    <section className="machine">
      {isSnackbarOpen && <Snackbar/>}
      <button className="machine__draw-btn" onClick={handleClick}>
        <i className="fas fa-dice"></i>
      </button>
      <div className="machine__wrapper">
        <div className={`machine__add ${isExpanded ? 'expanded' : ''}`}>
          <h3 onClick={expand}>
            <i className={`fas fa-${isExpanded ? 'minus' : 'plus'}-square`}></i>
            Add custom quotation
          </h3>
          <form className="machine__form" onSubmit={handleSubmit}>
            <div className="machine__form-wrapper">
              <div className="machine__form-box anime">
                <input type="text" name="anime" placeholder="Anime" value={animeValue} onChange={handleChange}/>
                {errors.anime && <span>{errors.anime}</span>}
              </div>
              <div className="machine__form-box character">
                <input type="text" name="character" placeholder="Character" value={characterValue} onChange={handleChange}/>
                {errors.character && <span>{errors.character}</span>}
              </div>
            </div>
            <div className="machine__form-box quote">
              <textarea name="quote" rows="5" placeholder="Quote" value={quoteValue} onChange={handleChange}/>
              {errors.quote && <span>{errors.quote}</span>}
            </div>
            <input type="submit" value="Add Quotation"/>
          </form>
        </div>
        <div className="machine__quotation-text">
          <p>
            {isLoading ? <Loader/> : <Quote quoteText={drawedQuotationItem.quote} quoteCharacter={drawedQuotationItem.character} quoteAnime={drawedQuotationItem.anime}/>}
          </p>
        </div>
      </div>
    </section>
  );
}

export default QuotationMachine;