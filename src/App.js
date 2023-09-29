import React, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

const currencyNames = require('./assets/data/conversions.json');

const InputField = ({ value, onChange, isValid }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    className={`px-4 py-2 border ${isValid ? 'border-gray-300' : 'border-red-500'} rounded w-1/4 max-h-9`}
  />
);

const CurrencySelector = ({ value, onChange, options }) => (
  <Listbox as="div" className="mr-2 w-1/3" value={value} onChange={onChange}>
    <div className="mt-1 relative">
      <Listbox.Button className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        {value} ({options[value]})
      </Listbox.Button>
      <Listbox.Options className="mt-2 absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        {Object.keys(options).map((currency) => (
          <Listbox.Option key={currency} value={currency}>
            {({ active, selected }) => (
              <div className={`${active ? 'text-white bg-indigo-600' : 'text-gray-900'} cursor-pointer select-none relative px-4 py-2`}>
                {currency} ({options[currency]})
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

const Result = ({ amount, fromCurrency, convertedAmount, toCurrency }) => (
  <div className="p-4 bg-gray-100 rounded">
    {amount} {fromCurrency} is approximately {convertedAmount ? convertedAmount.toFixed(4) : 'Calculating...'} {toCurrency}
  </div>
);

const App = () => {
  const [baseRates, setBaseRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('NOK');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const API_KEY = '262a36b33262d887a482c003';
  const BASE_CURRENCY = 'USD';

  const isValidAmount = (amount) => amount > 0;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result === 'success') {
          setBaseRates(data.conversion_rates);
        }
      });
  }, []);

  useEffect(() => {
    if (baseRates[toCurrency] && baseRates[fromCurrency]) {
      const rate = baseRates[toCurrency] / baseRates[fromCurrency];
      setConvertedAmount(amount * rate);
    }
  }, [amount, toCurrency, fromCurrency, baseRates]);

  return (
    <div className="App min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="container mx-auto p-6 bg-white rounded shadow-md max-w-4xl">
        <h1 className="text-3xl mb-4 text-gray-800">Currency Converter</h1>
        <div className="flex items-center justify-between mb-4">
          <InputField value={amount} onChange={(e) => isValidAmount(e.target.value) && setAmount(e.target.value)} isValid={isValidAmount(amount)} />
          <CurrencySelector value={fromCurrency} onChange={setFromCurrency} options={currencyNames} />
          <span class="material-symbols-outlined hover:cursor-pointer" onClick={swapCurrencies}>compare_arrows</span>
          <CurrencySelector value={toCurrency} onChange={setToCurrency} options={currencyNames} />
        </div>
        <Result amount={amount} fromCurrency={fromCurrency} convertedAmount={convertedAmount} toCurrency={toCurrency} />
      </div>
    </div>
  );
};

export default App;