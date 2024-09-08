import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row p-6 gap-6">
      <div className="flex items-center justify-start lg:flex-1 lg:justify-center lg:p-0">
        <Image
          src="/frenztalk-logo.jpg"
          alt="Frenztalk Logo"
          priority
          width={200}
          height={200}
          className="h-auto w-16 lg:w-48"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-start">
        <div className="flex flex-1 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
