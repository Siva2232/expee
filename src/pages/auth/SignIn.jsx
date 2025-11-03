// // src/pages/auth/SignIn.jsx
// import React, { useState } from "react";
// import { supabase } from "../../lib/supabaseClient";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import { Link, useNavigate } from "react-router-dom";

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) setError(error.message);
//     else navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <form onSubmit={handleSignIn} className="bg-white shadow-lg p-8 rounded-2xl w-96 space-y-4">
//         <h2 className="text-2xl font-semibold text-center">Sign In</h2>
//         <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <Button fullWidth type="submit">Sign In</Button>
//         <p className="text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link to="/auth/signup" className="text-blue-600 hover:underline">Sign Up</Link>
//         </p>
//       </form>
//     </div>
//   );
// }
// src/pages/auth/SignIn.jsx
import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@uxinity.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "demo@uxinity.com" && password === "demo123") {
      const demoUser = {
        id: "demo-user-001",
        email: "demo@uxinity.com",
        name: "Demo User",
        role: "demo",
      };
      localStorage.setItem("demoUser", JSON.stringify(demoUser));

      console.log("✅ Logged in as demo user");
      navigate("/dashboard"); // this must match the route path
    } else {
      setError("Invalid credentials. Use demo@uxinity.com / demo123");
    }
  };

  const handleDemoSignIn = () => {
    const demoUser = {
      id: "demo-user-001",
      email: "demo@uxinity.com",
      name: "Demo User",
      role: "demo",
    };
    localStorage.setItem("demoUser", JSON.stringify(demoUser));

    console.log("✅ Demo login successful");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-2xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button fullWidth type="submit">
          Sign In
        </Button>

        <Button
          fullWidth
          type="button"
          onClick={handleDemoSignIn}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Use Demo Account
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
