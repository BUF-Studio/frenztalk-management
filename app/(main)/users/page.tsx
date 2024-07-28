"use client";

import { softDeleteUser, usersStream } from "@/lib/firebase/user";
import {
  Badge,
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { User, UserRole } from "@/lib/models/user";
import { updateUser } from "@/lib/firebase/user";
import { useEffect, useState } from "react";
import styles from "./Page.module.scss";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import UserApprovalForm from "./userApprovalForm";
import { type Action, DataTable } from "@/app/components/dashboard/DataTable";
import { useAlert } from "@/lib/context/component/AlertContext";
import { capitalizeWords } from "@/utils/stringUtils";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();
  const hasRequest =
    users.filter((user) => user.role === UserRole.NON_VERIFIED).length > 0;

  const columns: { key: keyof User; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  const renderUserCell = (user: User, columnKey: keyof User) => {
    if (columnKey === "role") {
      return capitalizeWords(user.role);
    }

    return user[columnKey] as React.ReactNode;
  };

  useEffect(() => {
    // Set up the real-time listener for users
    const unsubscribe = usersStream((updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (showForm) {
      setShowForm(false);
      setSelectedUser(null);
    }
  };

  const handleSetRole = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const renderUserTable = (hasRole: boolean) => {
    const filteredUsers = users.filter((user) =>
      hasRole
        ? user.role === UserRole.ADMIN || user.role === UserRole.TUTOR
        : user.role === UserRole.NON_VERIFIED
    );

    const columns: { key: keyof User; label: string }[] = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ];

    const actions: Action<User>[] = hasRole
      ? []
      : [
          {
            label: "Reject",
            onClick: handleOnDelete,
            color: "error",
          },
          {
            label: "Approve",
            onClick: handleSetRole,
            color: "success",
          },
        ];

    return (
      <DataTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        renderCell={renderUserCell}
      />
    );
  };

  const handleOnDelete = (user: User) => {
    if (user === null) {
      // Handle the case where user.id is null
      showSnackbar("User ID is missing", "error");
      return;
    }

    showAlert({
      title: "Confirm Delete User?",
      message:
        "Are you sure wan to delete this user? This action cannot be undone.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      onConfirm: () => {
        console.log("User confirm delete");
        softDeleteUser(user);
        showSnackbar("User deleted successfully", "success");
      },
      onCancel: () => {
        console.log("User cancelled");
      },
    });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (formData: {
    role: UserRole;
    description?: string;
  }) => {
    if (!selectedUser) {
      showSnackbar("No user selected", "error");
      return;
    }

    try {
      const updatedUser = new User(
        selectedUser.id,
        selectedUser.name,
        selectedUser.email,
        formData.role
      );
      await updateUser(updatedUser);
      showSnackbar("User role updated successfully", "success");
      setShowForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user role", error);
      showSnackbar("Failed to update user role", "error");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab sx={{ textTransform: "none" }} label="Users" />
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <div className={styles.requestTab}>
                Request{" "}
                {hasRequest && (
                  <span className={styles.requestBadge}>
                    {
                      users.filter(
                        (user) => user.role === UserRole.NON_VERIFIED
                      ).length
                    }
                  </span>
                )}
              </div>
            }
          />
        </Tabs>
      </div>
      <div className={styles.contentContainer}>
        <div
          className={`${styles.userList} ${!showForm ? styles.fullWidth : ""}`}
        >
          {tabValue === 0 && renderUserTable(true)}
          {tabValue === 1 && hasRequest && renderUserTable(false)}
          {tabValue === 1 && !hasRequest && <p>No requests found</p>}
        </div>
        {hasRequest && showForm && (
          <div className={styles.userApprovalForms}>
            <UserApprovalForm
              user={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
