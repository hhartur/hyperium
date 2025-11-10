'use client'


import { UserTable } from '@/components/admin/user-table';

export default function AdminUsersPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">View and manage user accounts.</p>
      </div>
      <UserTable />
    </>
  );
}
