import React from 'react';
import DashBoard from "@components/DashBoard";
import User from "@components/User";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import styles from './admin.module.css';
import AdminPage from './AdminPage';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please log in to access the admin page.</div>;
  }

  return <AdminPage session={{ ...session, user: { ...session.user, email: session.user?.email ?? '' } }} />;
};

export default Page;