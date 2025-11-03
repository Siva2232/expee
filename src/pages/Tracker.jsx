// src/pages/Tracker.jsx
import React from "react";
import Layout from "../layouts/Layout";
import ExperienceForm from "../components/tracker/ExperienceForm";
import ExperienceList from "../components/tracker/ExperienceList";

export default function Tracker() {
  return (
      <div className="grid md:grid-cols-2 gap-6">
        <ExperienceForm />
        <ExperienceList />
      </div>
  );
}
