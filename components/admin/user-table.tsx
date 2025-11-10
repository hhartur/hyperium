"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserCheck, UserX, Edit } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
  is_admin: boolean;
  created_at: Date;
}

export function UserTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("searchQuery", searchQuery);

        const response = await fetch(`/api/admin/users?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, is_admin: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update admin status");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const updateUserDetails = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          username: editForm.username,
          email: editForm.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, username: editForm.username, email: editForm.email }
            : user
        )
      );
      setEditingUser(null);
      setEditForm({ username: "", email: "" });
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const startEditing = (user: UserProfile) => {
    setEditingUser(user.id);
    setEditForm({ username: user.username, email: user.email });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Management</span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                {user.avatar_url ? (
                  <div className="relative w-10 h-10">
                    <Image
                      src={user.avatar_url}
                      alt={user.username}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* User info */}
                <div>
                  {editingUser === user.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                        placeholder="Username"
                        className="w-32"
                      />
                      <Input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-48"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Badge variant={user.is_admin ? "default" : "secondary"}>
                  {user.is_admin ? "Admin" : "User"}
                </Badge>
                {editingUser === user.id ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => updateUserDetails(user.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={user.is_admin ? "destructive" : "default"}
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    >
                      {user.is_admin ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
