import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { ZoomAccount } from "@/lib/models/zoom";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PurKSVct7jG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

function ViewZoom() {
  const router = useRouter();
  const { zoomAccounts } = useZoomAccounts();

  const addZoomAccount = () => {
    router.push("/settings/add");
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Zoom Accounts</h2>
        <Link
          href="/settings/add"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-500/80 transition-colors"
          prefetch={true}
        >
          Add Account
        </Link>
      </div>
      <ul className="space-y-2">
        {zoomAccounts.map((account) => (
          <li
            key={account.id}
            className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 px-4 py-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <Link href={`/settings/${account.id}`} prefetch={false}>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{account.email}</span>
                <div className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewZoom;
