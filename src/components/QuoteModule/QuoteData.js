import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../services/quoteService";
import QuoteChart from "./QuoteChart";
import "bootstrap/dist/css/bootstrap.min.css";

const QuoteData = () => {
  const [quoteData, setQuoteData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const fetchQuoteData = async () => {
    try {
      const response = await axios.get(API_URL);

      const data = Object.entries(response.data).map(([currency, value]) => ({
        currency: currency,
        price: value.brl,
      }));

      setQuoteData(data);
    } catch (error) {
      setError("Erro ao obter dados de cotação");
    }
  };

  return (
    <div className="container">
      {error && <p>{error}</p>}
      {quoteData.length > 0 ? (
        <>
          <QuoteChart data={quoteData} />
          <ul>
            {quoteData.map((quote) => (
              <li key={quote.currency}>
                {quote.currency.toUpperCase()}: R${quote.price}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Carregando dados de cotação...</p>
      )}
    </div>
  );
};

export default QuoteData;
