"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserModal } from "@/components/dashboard/UserModal";
import { UserActionMenu } from "@/components/dashboard/UserActionMenu";
import { DUMMY_USERS } from "@/constants/dummy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";
import { 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from "@/lib/redux/features/user/userApi";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: any) => {
    setModalMode("view");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (modalMode === "add") {
        // await createUser(data).unwrap();
        toast.success("User added successfully (Demo)");
        setUsers([...users, { ...data, id: `u${Date.now()}`, status: "Active" }]);
      } else if (modalMode === "edit") {
        // await updateUser({ id: selectedUser.id, data }).unwrap();
        toast.success("User updated successfully (Demo)");
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const confirmDelete = async () => {
    try {
      // await deleteUser(userToDelete.id).unwrap();
      toast.success("User deleted successfully (Demo)");
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#101828]">User Management</h2>
        <button 
          onClick={handleAddUser}
          className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
        >
          <span>+Add user</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Line</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold",
                      user.role === "Admin" ? "bg-[#101828] text-white" : "bg-[#F2F4F7] text-gray-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500">{user.line}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold border",
                      user.status === "Active" 
                        ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]" 
                        : "bg-[#F2F4F7] text-[#344054] border-[#EAECF0]"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <UserActionMenu 
                      onView={() => handleViewUser(user)}
                      onEdit={() => handleEditUser(user)}
                      onDelete={() => handleDeleteClick(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedUser}
        mode={modalMode}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action will permanently remove the user from the system.`}
      />
    </DashboardLayout>
  );
}
