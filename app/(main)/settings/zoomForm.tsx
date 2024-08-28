'use client';

import { addZoomAccount, updateZoomAccount } from "@/lib/firebase/zoomAccount";
import { ZoomAccount } from "@/lib/models/zoom";
import { useState } from "react";

interface ZoomProps {
    zoom?: ZoomAccount | null;
}

function ZoomForm({ zoom }: ZoomProps) {


    // State to store form inputs
    const [formData, setFormData] = useState({
        email: zoom?.email ?? '',
        clientId: zoom?.clientid ?? '',
        clientSecret: zoom?.clientsecret ?? '',
        accountId: zoom?.accountid ?? ''
    });

    // Handler to update state on input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handler for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (zoom === null || zoom === undefined) {
            const zoomAcc = new ZoomAccount(null, formData.email, formData.clientId, formData.clientSecret, formData.accountId,[])
            addZoomAccount(zoomAcc)
        } else {
            const zoomAcc = new ZoomAccount(zoom.id, formData.email, formData.clientId, formData.clientSecret, formData.accountId,zoom.meetings)
            updateZoomAccount(zoomAcc)
        }
        // Perform form submission logic here
        console.log('Form data submitted:', formData);
    };

    return (

        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Account ID:</label>
                <input
                    type="text"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Client ID:</label>
                <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Client Secret:</label>
                <input
                    type="text"
                    name="clientSecret"
                    value={formData.clientSecret}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Add Account</button>
        </form>
    );
}

export default ZoomForm;