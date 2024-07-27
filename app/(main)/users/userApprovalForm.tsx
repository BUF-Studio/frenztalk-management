"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { type User, UserRole } from "@/lib/models/user";
import styles from "@/styles/main/users/UserApprovalForm.module.scss";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";

interface UserApprovalFormProps {
  onSubmit: (formData: {
    role: UserRole;
    description?: string;
  }) => Promise<void>;
  user?: User | null;
  onCancel: () => void;
}

const UserApprovalForm: React.FC<UserApprovalFormProps> = ({
  onSubmit,
  user,
  onCancel,
}) => {
  const [role, setRole] = useState<UserRole>(UserRole.NON_VERIFIED);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({ role, description });
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<UserRole>) => {
    setRole(event.target.value as UserRole);
  };

  return (
    <div className={styles.studentFormContainer}>
      <h2 className={styles.studentFormHeader}>User Approval</h2>
      <p className={styles.formSectionTitle}>Request Information</p>
      <form onSubmit={handleSubmit} className={styles.studentForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" value={user?.name} disabled />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="text" value={user?.email} disabled />
        </div>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={handleRoleChange}>
            <MenuItem value={UserRole.TUTOR}>Tutor</MenuItem>
            <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
          </Select>
        </FormControl>
        {role === UserRole.TUTOR && (
          <p className={styles.formSectionTitle}>Tutor Information</p>
        )}
        {role === UserRole.TUTOR && (
          <div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className={styles.spacer} />
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.formButton} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button type="submit" className={styles.formButton}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserApprovalForm;
