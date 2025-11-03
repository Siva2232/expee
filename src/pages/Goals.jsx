// src/pages/Goals.jsx
import React, { useState } from "react";
import {
  Target,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Flame,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { format, addDays, isAfter, isBefore } from "date-fns";

export default function Goals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete Q4 Product Launch",
      progress: 78,
      target: 100,
      unit: "%",
      deadline: addDays(new Date(), 12),
      category: "Work",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Read 12 Technical Books",
      progress: 8,
      target: 12,
      unit: "books",
      deadline: addDays(new Date(), 45),
      category: "Learning",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Run 150km This Month",
      progress: 97,
      target: 150,
      unit: "km",
      deadline: addDays(new Date(), 5),
      category: "Health",
      priority: "high",
      completed: false,
    },
    {
      id: 4,
      title: "Meditate Daily",
      progress: 21,
      target: 30,
      unit: "days",
      deadline: addDays(new Date(), 9),
      category: "Health",
      priority: "low",
      completed: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  const isOverdue = (deadline) => isBefore(deadline, new Date());
  const daysLeft = (deadline) => {
    const days = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleAddGoal = (newGoal) => {
    setGoals((prev) => [
      ...prev,
      {
        ...newGoal,
        id: Date.now(),
        progress: 0,
        completed: false,
      },
    ]);
    setShowAddModal(false);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g))
    );
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleComplete = (id) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? 0 : 100 } : g
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-600" />
              Goals
            </h1>
            <p className="text-gray-600 mt-1">Track what matters. Achieve what counts.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {goals.filter((g) => !g.completed).length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {goals.filter((g) => g.completed).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Fire</p>
                <p className="text-2xl font-bold text-orange-600 mt-1 flex items-center gap-1">
                  <Flame className="w-6 h-6" /> 12
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const overdue = isOverdue(goal.deadline);
            const days = daysLeft(goal.deadline);

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl shadow-sm border ${
                  goal.completed ? "border-green-200" : "border-gray-200"
                } p-6 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(goal.id)}
                      className="mt-1"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          goal.completed ? "text-gray-500 line-through" : "text-gray-900"
                        }`}
                      >
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </span>
                        <span className="text-gray-500">• {goal.category}</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {days === 0 ? "Today" : `${days} days left`}
                        </span>
                        {overdue && !goal.completed && (
                          <span className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {goal.progress} / {goal.target} {goal.unit}
                    </span>
                    <span className="font-medium text-indigo-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No goals yet</h3>
            <p className="text-gray-500 mt-1">Create your first goal to get started!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Goal
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingGoal) && (
        <GoalModal
          goal={editingGoal}
          onSave={editingGoal ? handleUpdateGoal : handleAddGoal}
          onClose={() => {
            setShowAddModal(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function GoalModal({ goal, onSave, onClose }) {
  const [form, setForm] = useState(
    goal || {
      title: "",
      target: "",
      unit: "tasks",
      deadline: "",
      category: "Work",
      priority: "medium",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      deadline: new Date(form.deadline),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {goal ? "Edit Goal" : "Create New Goal"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Launch new feature"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                type="number"
                required
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                required
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., km, hours, tasks"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              required
              value={form.deadline ? format(form.deadline, "yyyy-MM-dd") : ""}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>Work</option>
                <option>Learning</option>
                <option>Health</option>
                <option>Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              {goal ? "Update" : "Create"} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}