import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="flex items-center justify-center py-2 lg:flex-1 lg:justify-center lg:p-0">
        <Image
          src="/frenztalk-logo.jpg"
          alt="Frenztalk Logo"
          priority
          width={200}
          height={200}
          className="h-auto w-14 lg:w-48"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-start p-0">
        <div className="w-full max-w-md rounded-lg bg-gray-100 shadow-md">
          {children}
        </div>
      </div>
    </div>
  )
}