// src/components/tracker/ExperienceRow.jsx
import React from "react";
import { Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function ExperienceRow({ item, onDelete }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-all">
      <td className="py-2 px-3 text-gray-800">{item.title}</td>
      <td className="py-2 px-3 text-gray-600">{item.category}</td>
      <td className="py-2 px-3 font-medium text-blue-600">{item.value}</td>
      <td className="py-2 px-3 text-gray-500">{item.date}</td>
      <td className="py-2 px-3 text-right">
        <Button
          variant="outline"
          onClick={() => onDelete(item.id)}
          className="!p-1"
        >
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
}
