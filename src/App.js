import React, { useState, useEffect } from 'react';

const App = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('NOK');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const API_KEY = '262a36b33262d887a482c003';

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        } else {
          console.error(`Error: ${data['error-type']}`);
        }
      });
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency]) {
      setConvertedAmount(amount * rates[toCurrency]);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        to
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      {convertedAmount !== null && (
        <div>
          {amount} {fromCurrency} is approximately {convertedAmount.toFixed(2)}{' '}
          {toCurrency}
        </div>
      )}
    </div>
  );
};

export default App;