import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DepthData {
  price: number;
  bidSize?: number;
  askSize?: number;
}

const mockDepthData: DepthData[] = [
  { price: 90, bidSize: 50 },
  { price: 92, bidSize: 45 },
  { price: 94, bidSize: 38 },
  { price: 96, bidSize: 30 },
  { price: 98, bidSize: 22 },
  { price: 100, bidSize: 15 },
  { price: 102, askSize: 10 },
  { price: 104, askSize: 18 },
  { price: 106, askSize: 28 },
  { price: 108, askSize: 35 },
  { price: 110, askSize: 42 },
  { price: 112, askSize: 55 },
];

// Process data to be cumulative for a proper depth chart
// Bids: sum from right to left (if sorted by price) or just cumulative
// For bids, as price decreases, cumulative size increases.
// For asks, as price increases, cumulative size increases.

const bids = mockDepthData
  .filter((d) => d.bidSize !== undefined)
  .sort((a, b) => b.price - a.price)
  .map((d, i, arr) => ({
    price: d.price,
    bidSize: arr.slice(0, i + 1).reduce((sum, curr) => sum + (curr.bidSize || 0), 0),
  }));

const asks = mockDepthData
  .filter((d) => d.askSize !== undefined)
  .sort((a, b) => a.price - b.price)
  .map((d, i, arr) => ({
    price: d.price,
    askSize: arr.slice(0, i + 1).reduce((sum, curr) => sum + (curr.askSize || 0), 0),
  }));

const combinedData = [...bids.sort((a, b) => a.price - b.price), ...asks.sort((a, b) => a.price - b.price)];

export default function MarketDepthChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={combinedData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAsk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis 
            dataKey="price" 
            stroke="#525252" 
            fontSize={10} 
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis 
            stroke="#525252" 
            fontSize={10} 
            hide
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0A0A0B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '10px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#10B981', strokeWidth: 1 }}
          />
          <Area
            type="stepAfter"
            dataKey="bidSize"
            stroke="#10B981"
            fillOpacity={1}
            fill="url(#colorBid)"
            strokeWidth={2}
          />
          <Area
            type="stepAfter"
            dataKey="askSize"
            stroke="#EF4444"
            fillOpacity={1}
            fill="url(#colorAsk)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
