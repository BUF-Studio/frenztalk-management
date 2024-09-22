"use client";

import { useRouter } from "next/navigation";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
  CardContent,
} from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { Suspense, useEffect } from "react";
import UserForm from "../../components/userForm";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { useUsers } from "@/lib/context/collection/usersContext";

function LoadingContent() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-black dark:bg-neutral-800 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-black dark:bg-neutral-800 rounded" />
        <div className="h-4 bg-black dark:bg-neutral-800 rounded" />
        <div className="h-4 bg-black dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

export default function AddStudentModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, setUser } = useUserPage()
  const { verifiedUsers, unverifiedUsers } = useUsers()

  useEffect(() => {
    if (user === null || user.id !== params.id) {
      const allUsers = [...verifiedUsers, ...unverifiedUsers]
      const foundUser = allUsers.find((u) => u.id === params.id)
      if (foundUser) setUser(foundUser)
    }
  }, [params.id, user, verifiedUsers, unverifiedUsers, setUser])


  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>User Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <UserForm user={user} />
            ) : (
              <p className="text-muted-foreground">Loading user details...</p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
