'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './Dashboard.module.css';
import CustomTooltip from './CustomTooltip'; // Import the custom tooltip component

// Define the interface for the order data
interface OrderData {
  id: string;
  user: {
    id: string;
    email: string;
  };
  items: {
    id: string;
    car: {
      id: string;
      name: string;
      brand: string;
    };
    price: number;
  }[];
}

// Define the interface for the stats data
interface StatsData {
  carCount: number;
  userCount: number;
  incomeData: { id: string; price: number }[];
}

const DashBoard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<OrderData[]>('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchStatsData = async () => {
      try {
        const response = await axios.get<StatsData>('/api/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };

    fetchOrders();
    fetchStatsData();
  }, []);

  if (!orders.length) {
    return <div>Loading...</div>;
  }

  // Combine the data into a single array for the bar chart
  const combinedData = statsData ? [
    { name: 'Total Income', value: statsData.incomeData.reduce((sum, item) => sum + item.price, 0), color: '#8884d8' },
    { name: 'Cars', value: statsData.carCount, color: '#82ca9d' },
    { name: 'Users', value: statsData.userCount, color: '#ffc658' },
  ] : [];

  const totalIncome = orders.reduce((acc, order) => {
    const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
    return acc + orderTotal;
  }, 0);

  const numberOfOrders = orders.length;

  return (
    <div className={styles.dashboard}>
      <div className={styles['dashboard-stats']}>
        <div className={styles['stat-item']}>
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className={styles['stat-item']}>
          <h3>Number of Orders</h3>
          <p>{numberOfOrders}</p>
        </div>
      </div>
      <div className={styles['chart-container']}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={combinedData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#000' }} />
            <YAxis tick={{ fill: '#000' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {combinedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles['order-details']}>
        <h3>Order Details</h3>
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>User Email</th>
              <th>Car Name</th>
              <th>Car Brand</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIndex) =>
              order.items.map((item, itemIndex) => (
                <tr key={item.id}>
                  {itemIndex === 0 && (
                    <td rowSpan={order.items.length}>Order {orderIndex + 1}</td>
                  )}
                  <td>{order.user.email}</td>
                  <td>{item.car.name}</td>
                  <td>{item.car.brand}</td>
                  <td>${item.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashBoard;