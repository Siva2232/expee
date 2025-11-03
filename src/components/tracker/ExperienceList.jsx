// src/components/tracker/ExperienceList.jsx
import React from "react";
import Card from "../ui/Card";
import ExperienceRow from "./ExperienceRow";

export default function ExperienceList({ data = [], onDelete }) {
  return (
    <Card className="w-full overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Experience Entries
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No experiences yet.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="py-2 px-3 rounded-l-lg">Title</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Value</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <ExperienceRow key={item.id} item={item} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
