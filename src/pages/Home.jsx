// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Experience Tracker
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        Track your daily, weekly, monthly, and yearly growth with beautiful analytics and reports.
      </p>
      <div className="flex gap-4">
        <Link to="/auth/signin">
          <Button>Sign In</Button>
        </Link>
        <Link to="/auth/signup">
          <Button variant="outline">Create Account</Button>
        </Link>
      </div>
    </div>
  );
}
