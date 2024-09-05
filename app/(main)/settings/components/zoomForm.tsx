"use client";

import TextFieldComponent from "@/app/components/general/input/textField";
import { addZoomAccount, updateZoomAccount } from "@/lib/firebase/zoomAccount";
import { ZoomAccount } from "@/lib/models/zoom";
import { useEffect, useState } from "react";

interface ZoomFormProps {
  zoom?: ZoomAccount | null;
}

function ZoomForm({ zoom }: ZoomFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    clientId: "",
    clientSecret: "",
    accountId: "",
  });

  useEffect(() => {
    if (zoom) {
      setFormData({
        email: zoom.email || "",
        clientId: zoom.clientid || "",
        clientSecret: zoom.clientsecret || "",
        accountId: zoom.accountid || "",
      });
    }
  }, [zoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (zoom === null || zoom === undefined) {
      const zoomAcc = new ZoomAccount(
        null,
        formData.email,
        formData.clientId,
        formData.clientSecret,
        formData.accountId,
        []
      );
      addZoomAccount(zoomAcc);
    } else {
      const zoomAcc = new ZoomAccount(
        zoom.id,
        formData.email,
        formData.clientId,
        formData.clientSecret,
        formData.accountId,
        zoom.meetings
      );
      updateZoomAccount(zoomAcc);
    }
    console.log("Form data submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextFieldComponent
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
      />
      <TextFieldComponent
        id="accountId"
        name="accountId"
        label="Account ID"
        required
        value={formData.accountId}
        onChange={handleChange}
      />
      <TextFieldComponent
        id="clientId"
        name="clientId"
        label="Client ID"
        required
        value={formData.clientId}
        onChange={handleChange}
      />
      <TextFieldComponent
        id="clientSecret"
        name="clientSecret"
        label="Client Secret"
        type="password"
        required
        value={formData.clientSecret}
        onChange={handleChange}
      />
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="submit"
          className="block select-none rounded bg-gradient-to-tr from-red-900 to-red-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          {zoom ? "Update" : "Add"} Account
        </button>
      </div>
    </form>
  );
}

export default ZoomForm;
