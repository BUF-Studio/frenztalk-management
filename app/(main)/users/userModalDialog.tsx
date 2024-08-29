"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/models/user";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { updateUser } from "@/lib/firebase/user";
import { updateTutor } from "@/lib/firebase/tutor";
import { Tutor } from "@/lib/models/tutor";
import TextFieldComponent from "@/app/components/general/input/textField";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";

interface UserModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserModalDialog: React.FC<UserModalDialogProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || UserRole.NON_VERIFIED,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!user || !user.id) {
        throw new Error("User is blank");
      }

      const updatedUser = new User(user.id, formData.name, user.email, formData.role as UserRole);
      await updateUser(updatedUser);

      if (formData.role === UserRole.TUTOR) {
        const newTutor = new Tutor(user.id, formData.name, [], "", "active", "");
        await updateTutor(newTutor);
      } else if (formData.role === UserRole.ADMIN) {
        // TODO: add admin to admin collection
      }

      setUser(updatedUser);
      onClose();
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  const viewTutor = () => {
    if (user?.id) {
      router.push(`/tutors/${user.id}`);
    }
  };

  if (!isOpen) return null;

  const roleOptions = Object.values(UserRole)
    .filter((role) => role !== UserRole.NON_VERIFIED)
    .map((role) => ({
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Edit User
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Email: {user?.email}
          </div>

          <TextFieldComponent
            id="name"
            name="name"
            label="Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />

          <SelectFieldComponent
            id="role"
            name="role"
            label="User Role"
            required
            options={[
              { value: "", label: "Select a role" },
              ...roleOptions,
            ]}
            value={formData.role}
            onChange={handleInputChange}
          />

          {user?.role === UserRole.TUTOR && (
            <button
              type="button"
              onClick={viewTutor}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              View Tutor
            </button>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded hover:bg-neutral-400 dark:hover:bg-neutral-500 transition-colors font-sans text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="block select-none rounded bg-gradient-to-tr from-red-900 to-red-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModalDialog;