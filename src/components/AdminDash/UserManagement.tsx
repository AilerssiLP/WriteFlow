"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Session } from "next-auth";
import { UserTable } from "./UserTable";
import { BulkActionBar } from "./BulkActionBar";
import { CustomUser } from "@/types/UserType";

interface UserManagementProps {
  users: CustomUser[];
  session: Session;
}

const UserManagement: React.FC<UserManagementProps> = ({ users: initialUsers, session }) => {
  const [users, setUsers] = useState<CustomUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetSelection = () => setSelectedUserIds(new Set());

  const filteredUsers = users.filter(
    (users) =>
      users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users?.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (users?.isActive ? "active" : "inactive").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
       <Sidebar user={session.user as CustomUser} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 mb-4 w-full">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow bg-transparent outline-none text-gray-700 text-lg"
          />
        </div>
        <UserTable
          users={filteredUsers}
          setUsers={setUsers}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
          session={session}
        />
        {selectedUserIds.size > 0 && (
          <BulkActionBar
            selectedUserIds={selectedUserIds}
            users={users}
            setUsers={setUsers}
            resetSelection={resetSelection}
            session={session}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
