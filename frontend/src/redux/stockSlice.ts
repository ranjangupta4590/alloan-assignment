import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface StockMeta {
  id: string;
  name: string;
  symbol: string;
  available: string[];
}

export interface ChartPoint {
  timestamp: string;
  price: number;
  // Add other fields if available
}

interface StockState {
  stocks: StockMeta[];
  selectedStock: string | null;
  selectedDuration: string | null;
  chartData: ChartPoint[];
  status: string;
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: null,
  chartData: [],
  status: 'IDLE',
  loading: false,
  error: null,
};

// Thunk to fetch stocks metadata
export const fetchStocks = createAsyncThunk('stock/fetchStocks', async () => {
  const response = await axios.get<StockMeta[]>('/api/stocks');
  return response.data;
});

// Thunk to fetch chart data for a given stock and duration
export const fetchStockData = createAsyncThunk(
  'stock/fetchStockData',
  async (
    params: { id: string; duration: string },
    { getState }
  ) => {
    const response = await axios.post(`/api/stocks/${params.id}`, { duration: params.duration });
    return response.data;
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    selectStock: (state, action: PayloadAction<string>) => {
      state.selectedStock = action.payload;
      state.selectedDuration = null; // reset duration on new stock selection
      state.chartData = [];
      state.status = 'IDLE';
    },
    selectDuration: (state, action: PayloadAction<string>) => {
      state.selectedDuration = action.payload;
      state.chartData = [];
      state.status = 'IDLE';
    },
    clearStockData: (state) => {
      state.chartData = [];
      state.status = 'IDLE';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load stocks';
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        // action.payload should include { data, status }
        // Append the new data if available
        if (action.payload && action.payload.data) {
          state.chartData = action.payload.data;
          state.status = action.payload.status;
        }
      });
  },
});

export const { selectStock, selectDuration, clearStockData } = stockSlice.actions;
export const selectStocks = (state: RootState) => state.stock.stocks;
export default stockSlice.reducer;
