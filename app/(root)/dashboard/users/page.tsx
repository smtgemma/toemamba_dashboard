"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserModal } from "@/components/dashboard/UserModal";
import { UserActionMenu } from "@/components/dashboard/UserActionMenu";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";
import AppPagination from "@/components/shared/Pagination";
import { 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useGetAllUserQuery,
  useChangeStatusMutation
} from "@/lib/redux/features/user/userApi";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

const TableSkeleton = () => (
  <div className="space-y-4 p-6 animate-pulse bg-white">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-5 border-b border-gray-50">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-12" />
        <div className="h-8 bg-gray-100 rounded w-12" />
      </div>
    ))}
  </div>
);

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: usersData, isLoading: isFetching } = useGetAllUserQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [changeStatus] = useChangeStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const rawUsers = Array.isArray(usersData) ? usersData : (usersData?.data || []);
  
  // Safe calculation for server-side vs client-side slicing fallback
  const totalItems = usersData?.meta?.total || rawUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const users = usersData?.meta ? rawUsers : rawUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role.toUpperCase(),
        staffRole: data.role === "Staff" ? data.staffRole : undefined,
        line: data.line,
        shift: data.shift || "1st Shift"
      };

      if (modalMode === "add") {
        await createUser(payload).unwrap();
        toast.success("Invitation email sent to user!");
      } else if (modalMode === "edit") {
        await updateUser({ id: selectedUser.id || selectedUser._id, data: payload }).unwrap();
        toast.success("User updated successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await changeStatus(id).unwrap();
      toast.success("User status updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    try {
      const targetId = userToDelete.id || userToDelete._id;
      await deleteUser(targetId).unwrap();
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#101828]">User Management</h2>
        <button 
          onClick={handleAddUser}
          className="bg-[#101828] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2 text-sm"
        >
          <span>+Add user</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isFetching ? (
            <TableSkeleton />
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Line</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length > 0 ? (
                    users.map((user: any) => (
                      <tr key={user.id || user._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-500">{user.email}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase",
                            user.role === "ADMIN" || user.role === "SUPER_ADMIN" 
                              ? "bg-[#101828] text-white" 
                              : "bg-[#F2F4F7] text-gray-600"
                          )}>
                            {user.role}
                            {user.staffRole ? ` (${user.staffRole})` : ""}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-500">{user.line || "Not Assigned"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-500">{user.shift || "Not Assigned"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => handleToggleStatus(user.id || user._id)}
                            className={cn(
                              "inline-flex items-center px-3 py-2 rounded-lg text-[10px] font-bold border hover:opacity-80 transition-opacity min-h-[36px]",
                              user.status === "Active" 
                                ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]" 
                                : "bg-[#F2F4F7] text-[#344054] border-[#EAECF0]"
                            )}
                          >
                            {user.status || "Active"}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <UserActionMenu 
                            onView={() => handleViewUser(user)}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteClick(user)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-20 text-xs text-gray-400 font-medium">
                        No users invited yet. Click +Add user to invite shifts members.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="p-5 border-t border-gray-100 flex justify-end">
                  <AppPagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => setCurrentPage(p)}
                  />
                </div>
              )}
            </>
          )}
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
