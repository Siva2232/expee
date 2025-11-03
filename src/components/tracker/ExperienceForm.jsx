// src/components/tracker/ExperienceForm.jsx
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ExperienceForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    value: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.value) return;
    onSubmit(form);
    setForm({ title: "", category: "", value: "", date: "" });
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Add Experience
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Workout, Reading, Meditation..."
        />
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Health, Study, Hobby..."
        />
        <Input
          label="Value"
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
          placeholder="Enter value or score"
        />
        <Input
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Add Entry
          </Button>
        </div>
      </form>
    </Card>
  );
}
