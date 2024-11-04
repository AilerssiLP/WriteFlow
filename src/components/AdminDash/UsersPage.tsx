import { auth } from "@/auth"; 
import prisma from "@/prisma"; 
import UserManagement from "@/components/AdminDash/UserManagement";
import { User } from "@prisma/client"; 
import React from "react";
import { CustomUser } from "@/types/UserType";

const UsersPage: React.FC = async () => {
  const session = await auth(); 

  if (!session || session?.user.role === "USER") {
    return <div>Unauthorized access. Please contact the administrator.</div>;
  }

  const users: CustomUser[] = await prisma.user.findMany({
    include: {
      followers: {
        select: {
          followingId: true,
        },
      },
    },
  });

  const processedUsers = users.map(user => ({
    ...user,
    name: user.name ?? "",  
  }));
  
  return (
    <div>
      <UserManagement users={processedUsers} session={session} />
    </div>
  );
};

export default UsersPage;
