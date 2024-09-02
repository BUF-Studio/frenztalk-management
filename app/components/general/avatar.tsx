import type React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/utils/manage-class-name";

type AvatarProps = {
  url?: string | null;
};

const UserAvatar: React.FC<AvatarProps> = ({ url, ...props }) => {
  const containerClasses =
    "relative w-full h-full overflow-hidden rounded-full";

  if (url) {
    return (
      <div className={containerClasses} {...props}>
        <Image src={url} layout="fill" objectFit="cover" alt="User Avatar" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        containerClasses,
        "flex items-center justify-center bg-gray-200 dark:bg-gray-700"
      )}
    >
      <User className="w-3/5 h-3/5 text-gray-500 dark:text-gray-400" />
    </div>
  );
};

export default UserAvatar;
