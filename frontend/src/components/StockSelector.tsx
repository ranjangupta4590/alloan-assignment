import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchStocks, selectStock } from '../redux/stockSlice';

const StockSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stocks, loading } = useAppSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(selectStock(e.target.value));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select Stock:</label>
      <select
        className="mt-1 block w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
        defaultValue=""
      >
        <option value="" disabled>
          {loading ? 'Loading...' : 'Choose a stock'}
        </option>
        {stocks.map((stock) => (
          <option key={stock.id} value={stock.id}>
            {stock.name} ({stock.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default StockSelector;
