import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { ZoomAccount } from "@/lib/models/zoom"
import { useRouter } from "next/navigation"

function ViewZoom() {
    const router = useRouter()
    const { zoomAccounts } = useZoomAccounts();

    const addZoomAccount = () => {
        router.push('/settings/add')
    }
    const editZoomAccount = (id: string) => {
        router.push(`/settings/${id}`)
    }
    return (
        <>
            <div>Zoom Accounts</div>
            
            <button onClick={() => { addZoomAccount() }}>Add Account</button>
            <ul>
                {zoomAccounts.map((account, index) => (
                    <li
                        key={index}
                        onClick={() => { editZoomAccount(account.id!) }}
                    >{account.email}</li>
                ))}
            </ul>
        </>
    )
}

export default ViewZoom