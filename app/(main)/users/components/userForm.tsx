import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/models/user";
import { updateUser } from "@/lib/firebase/user";
import { Tutor } from "@/lib/models/tutor";
import { updateTutor } from "@/lib/firebase/tutor";
import { useUserPage } from "@/lib/context/page/userPageContext";

interface UserFormProps {
  user: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    role: UserRole.NON_VERIFIED,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUserPage();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        role: user.role || UserRole.NON_VERIFIED,
      });
    }
    setIsLoading(false);
  }, [user]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user || !user.id) {
        throw new Error("User is blank");
      }

      const updatedUser = new User(
        user.id,
        formData.name,
        user.email,
        formData.role as UserRole
      );
      await updateUser(updatedUser);

      if (formData.role === UserRole.TUTOR) {
        const newTutor = new Tutor(
          user.id,
          formData.name,
          [],
          "",
          "active",
          ""
        );
        await updateTutor(newTutor);
      } else if (formData.role === UserRole.ADMIN) {
        // TODO: add admin to admin collection
      }

      setUser(updatedUser);
      toast({
        title: "User Updated",
        description: `Successfully updated user: ${formData.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewTutor = () => {
    if (user?.id) {
      router.push(`/tutors/${user.id}`);
    }
  };

  const roleOptions = Object.values(UserRole)
    .filter((role) => role !== UserRole.NON_VERIFIED)
    .map((role) => ({
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        
      <Input
        type="email"
        id="email"
        name="email"
        value={user?.email}
        onChange={handleChange}
        placeholder="email"
        required
        disabled
      />

      <Input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />

      <Select
        value={formData.role}
        onValueChange={(value) =>
          handleChange({ target: { name: "role", value } })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {user?.role === UserRole.TUTOR && (
        <Button
          type="button"
          onClick={viewTutor}
          className="w-full"
          variant="secondary"
        >
          View Tutor
        </Button>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Updating..." : "Update User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
