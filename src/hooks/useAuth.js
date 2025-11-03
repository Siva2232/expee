// // src/hooks/useAuth.js
// import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const session = supabase.auth.getSession().then(({ data }) => {
//       setUser(data?.session?.user || null);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   const signIn = async (email, password) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//   };

//   const signUp = async (email, password) => {
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//   };

//   return { user, loading, signIn, signUp, signOut };
// }
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("demoUser"));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    if (email === "demo@uxinity.com" && password === "demo123") {
      const demoUser = {
        id: "demo-user-001",
        email: "demo@uxinity.com",
        name: "Demo User",
        role: "demo",
      };
      localStorage.setItem("demoUser", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    throw new Error("Invalid credentials");
  };

  const signUp = async (email, password) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      name: "New User",
      role: "user",
    };
    localStorage.setItem("demoUser", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signOut = async () => {
    localStorage.removeItem("demoUser");
    setUser(null);
  };

  return { user, loading, signIn, signUp, signOut };
}
