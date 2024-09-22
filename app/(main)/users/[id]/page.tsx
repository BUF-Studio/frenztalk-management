'use client'

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useUserPage } from "@/lib/context/page/userPageContext"
import { useUsers } from "@/lib/context/collection/usersContext"
import { Button } from "@/app/components/ui/button"
import UserForm from "../components/userForm"
import { ArrowBackIosNew } from "@mui/icons-material"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
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
    <>
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Add Student</h1>
      </button>
      {user ? (
        <UserForm user={user} />
      ) : (
        <p className="text-muted-foreground">Loading user details...</p>
      )}
    </>
  )
}