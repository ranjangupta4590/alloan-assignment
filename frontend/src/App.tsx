import React from 'react';
import StockSelector from './components/StockSelector';
import DurationSelector from './components/DurationSelector';
import StockChart from './components/StockChart';
import { useAppSelector } from './redux/hooks';

const App: React.FC = () => {
  const selectedStock = useAppSelector((state) => state.stock.selectedStock);
  const selectedDuration = useAppSelector((state) => state.stock.selectedDuration);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Stock Graph Viewer</h1>
        <div className="flex flex-col gap-4">
          <StockSelector />
          {selectedStock && <DurationSelector />}
          {selectedStock && selectedDuration && <StockChart />}
        </div>
      </div>
    </div>
  );
};

export default App;
