import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectDuration } from '../redux/stockSlice';

const DurationSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedStock = useAppSelector((state) => state.stock.selectedStock);
  const stocks = useAppSelector((state) => state.stock.stocks);
  const currentStock = stocks.find((stock) => stock.id === selectedStock);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(selectDuration(e.target.value));
  };

  if (!currentStock) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select Duration:</label>
      <select
        className="mt-1 block w-full p-2 border border-gray-300 rounded"
        onChange={handleDurationChange}
        defaultValue=""
      >
        <option value="" disabled>
          Choose duration
        </option>
        {currentStock.available.map((duration: string) => (
          <option key={duration} value={duration}>
            {duration.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DurationSelector;
