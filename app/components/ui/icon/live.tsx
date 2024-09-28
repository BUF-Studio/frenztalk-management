/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LcEuhIBaRhd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Live() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-2 h-2 rounded-full bg-primary animate-pulse">
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-primary animate-ping opacity-75" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    )
  }