'use client';
import React from 'react'
import ZoomForm from '../zoomForm'
import { useRouter } from 'next/navigation';

function AddZoom() {
    const router = useRouter()
    return (
        <>
            <div>AddZoom</div>
            <button onClick={()=>router.back()}>back</button>
            <ZoomForm></ZoomForm>
        </>
    )
}

export default AddZoom