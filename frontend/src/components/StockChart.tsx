import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchStockData, clearStockData } from '../redux/stockSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const StockChart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedStock, selectedDuration, chartData, status } = useAppSelector((state) => state.stock);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedStock && selectedDuration) {
      // Clear previous data when a new stock/duration is selected
      dispatch(clearStockData());

      // Function to poll the API
      const poll = async () => {
        await dispatch(fetchStockData({ id: selectedStock, duration: selectedDuration }));
      };

      // Start polling every 3 seconds until complete
      poll(); // initial call
      pollingRef.current = setInterval(async () => {
        await poll();
      }, 3000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [dispatch, selectedStock, selectedDuration]);

  const data = {
    datasets: [
      {
        label: 'Price',
        data: chartData.map((point) => ({
          x: new Date(point.timestamp),
          y: point.price
        })),
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const }, // cast 'top' as a literal type
      title: { display: true, text: 'Stock Price Over Time' },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        }
      }
    }
  };
  

  return (
    <div className="mt-4">
      <Line data={data} options={options} />
      <div className="mt-2 text-center text-sm text-gray-600">
        Status: {status}
      </div>
    </div>
  );
};

export default StockChart;
