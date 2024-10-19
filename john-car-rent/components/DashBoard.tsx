'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styles from './Dashboard.module.css';
import CustomTooltip from './CustomTooltip'; // Import the custom tooltip component

// Define the interface for the stats data
interface StatsData {
  carCount: number;
  userCount: number;
  incomeData: { id: string; total: number }[];
}

const DashBoard = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axios.get<StatsData>('/api/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };
    fetchStatsData();
  }, []);

  if (!statsData) {
    return <div>Loading...</div>;
  }

  // Combine the data into a single array for the bar chart
  const combinedData = [
    { name: 'Total Income', value: statsData.incomeData.reduce((sum, item) => sum + item.total, 0), color: '#8884d8' },
    { name: 'Cars', value: statsData.carCount, color: '#82ca9d' },
    { name: 'Users', value: statsData.userCount, color: '#ffc658' },
  ];

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <div className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={combinedData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#000' }} /> {/* Ensure X-axis labels are not black */}
            <YAxis tick={{ fill: '#000' }} /> {/* Ensure Y-axis labels are not black */}
            <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip component */}
            <Bar dataKey="value">
              {combinedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashBoard;