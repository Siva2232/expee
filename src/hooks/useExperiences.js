// src/hooks/useExperiences.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function useExperiences(userId) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all experiences for current user
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) console.error(error);
      else setExperiences(data || []);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  // Add new experience
  const addExperience = async (entry) => {
    const { data, error } = await supabase
      .from("experiences")
      .insert([{ ...entry, user_id: userId }])
      .select();

    if (error) throw error;
    setExperiences((prev) => [data[0], ...prev]);
  };

  // Delete experience
  const deleteExperience = async (id) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  return { experiences, loading, addExperience, deleteExperience };
}
