import DashBoard from "@components/DashBoard";
import User from "@components/User";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import styles from './admin.module.css';

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${styles.scrollableContainer}`}>
      {session?.user ? (
        <h2 className="text-2xl">Admin page - welcome back {session?.user.username}</h2>
      ) : (
        <h2 className="text-2xl">Please login to see this admin page</h2>
      )}
      <div className="mt-4">
        <h2>Client Session</h2>
        <User />
      </div>
      <div className="mt-4">
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      <DashBoard />
    </div>
  );
};

export default page;