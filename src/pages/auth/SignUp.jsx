// src/pages/auth/SignUp.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form onSubmit={handleSignUp} className="bg-white shadow-lg p-8 rounded-2xl w-96 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button fullWidth type="submit">Sign Up</Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
