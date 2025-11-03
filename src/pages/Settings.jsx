// src/pages/Settings.jsx
import React from "react";
import Layout from "../layouts/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Settings() {
  return (
      <div className="max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Profile Settings</h2>
        <Input label="Name" placeholder="Your name" />
        <Input label="Email" placeholder="you@example.com" />
        <Button>Save Changes</Button>
      </div>
  );
}
