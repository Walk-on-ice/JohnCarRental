'use client';

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

const UserAccountNav = () => {
  return (
    <Button onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/sign-in`
    })} variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>
          Sign Out
    </Button>
  )
}

export default UserAccountNav