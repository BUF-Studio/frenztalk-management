'use client'
import React from 'react'
import ZoomForm from '../zoomForm'
import { ZoomAccount } from '@/lib/models/zoom'
import { useZoomAccounts } from '@/lib/context/collection/zoomContext'
import { useRouter } from 'next/navigation'

function EditZoom({ params }: { params: { id: string } }) {

    const {zoomAccounts} = useZoomAccounts()
    const zoom = zoomAccounts.find(account => account.id === params.id);
    const router = useRouter()

    return (
        <>
            <div>Edit Zoom</div>
            <button onClick={()=>router.back()}>back</button>
            <ZoomForm zoom={zoom}></ZoomForm>
        </>
    )
}

export default EditZoom