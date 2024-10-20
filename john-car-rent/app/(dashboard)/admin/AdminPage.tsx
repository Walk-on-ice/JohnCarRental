'use client';

import React, { useState } from 'react';
import DashBoard from "@components/DashBoard";
import User from "@components/User";
import styles from './admin.module.css';

const SECRET_PASSWORD = "554"; // Replace with your actual secret password

interface AdminPageProps {
  session: {
    user?: {
      username: string;
      email: string;
    };
  };
}

const AdminPage: React.FC<AdminPageProps> = ({ session }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl mb-4">Enter Admin Password</h2>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
            placeholder="Enter password"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Submit</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row items-start justify-between pt-16 ${styles.container}`}>
      <div className={`flex flex-col items-center justify-center space-y-4 ${styles.content}`}>
        {session?.user ? (
          <h2 className="text-2xl">Admin page - welcome back {session?.user.username}</h2>
        ) : (
          <h2 className="text-2xl">Please login to see this admin page</h2>
        )}
        <div className={styles.card}>
          <h2>Client Session</h2>
          <User />
        </div>
        <div className={styles.card}>
          <h2>Server Session</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
        <div className={styles.card}>
          <h2>Recent Activities</h2>
          <ul>
            <li>Logged in</li>
            <li>Viewed dashboard</li>
            <li>Updated profile</li>
          </ul>
        </div>
        <div className={styles.card}>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="https://www.facebook.com/KMITL.RoboticsAI/?locale=th_TH" target="_blank" rel="noopener noreferrer">RAI facebook</a></li>
            <li><a href="https://github.com/Walk-on-ice/JohnCarRental" target="_blank" rel="noopener noreferrer">Github</a></li>
          </ul>
        </div>
        <div className={styles.card}>
          <h2>Profile Summary</h2>
          <p>Name: {session?.user?.username}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
      </div>
      <DashBoard />
    </div>
  );
};

export default AdminPage;