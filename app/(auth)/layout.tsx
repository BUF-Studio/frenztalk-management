"use client"

import { storage } from "@/lib/firebase/service/clientApp";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, 'frenztalk-logo.jpg')
        const url = await getDownloadURL(imageRef)
        setImageUrl(url)
      } catch (error) {
        console.error("Error fetching image:", error)
        setError("Failed to load image")
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()
  }, [])

  const renderLogo = () => {
    if (isLoading) {
      return <div className="w-16 h-16 lg:w-48 lg:h-48 bg-gray-200 animate-pulse rounded-full" />
    }

    if (error) {
      return <div className="text-red-500">{error}</div>
    }

    if (imageUrl) {
      return (
        <Image
          src={imageUrl}
          alt="Frenztalk Logo"
          width={200}
          height={200}
          className="h-auto w-16 lg:w-48"
        />
      )
    }

    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row p-6 gap-6">
      <div className="flex items-center justify-start lg:flex-1 lg:justify-center lg:p-0">
        {renderLogo()}
      </div>
      <div className="flex flex-1 flex-col items-center justify-start">
        <div className="flex flex-1 w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}