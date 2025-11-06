// src/pages/Task.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus, Calendar, User, CheckCircle, Clock,
  Edit2, Save, X,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import DashboardLayout from "../components/DashboardLayout";

const TASK_KEY = "crm-compass-tasks-v2";

const TEAM = [
  { id: "u1", name: "AntonyJoseph", avatar: "A" },
  { id: "u2", name: "HariKrishnan", avatar: "H" },
  { id: "u3", name: "AkshayKumar", avatar: "A" },
//   { id: "u4", name: "Diana", avatar: "D" },
];

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const { addNotification } = useNotifications();
  const editRefs = useRef({});

  // Load tasks
  useEffect(() => {
    const raw = localStorage.getItem(TASK_KEY);
    if (raw) {
      try { setTasks(JSON.parse(raw)); }
      catch (e) { console.error("Failed to load tasks", e); }
    }
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Due-date alerts
  useEffect(() => {
    const check = () => {
      const now = new Date();
      tasks.forEach(t => {
        if (t.completed || !t.dueDate) return;
        const due = new Date(t.dueDate);
        const days = Math.floor((due - now) / (1000 * 60 * 60 * 24));
        if (days === 0) addNotification(`Due today: "${t.title}"`);
        else if (days === 1) addNotification(`Due tomorrow: "${t.title}"`);
      });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [tasks, addNotification]);

  // Add
  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const ass = TEAM.find(m => m.id === assigneeId) || null;
    const nt = {
      id: Date.now(),
      title,
      dueDate,
      assigneeId: ass?.id || "",
      assigneeName: ass?.name || "",
      assigneeAvatar: ass?.avatar || "",
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(p => [nt, ...p]);
    addNotification(`Task assigned to ${ass?.name || "—"}: "${title}"`);
    setTitle(""); setDueDate(""); setAssigneeId(""); setPriority("medium");
  };

  // Toggle complete
  const toggle = (id) => {
    setTasks(p => {
      const t = p.find(x => x.id === id);
      const upd = p.map(x => x.id === id ? { ...x, completed: !x.completed } : x);
      addNotification(`Task "${t.title}" ${t.completed ? "reopened" : "completed"}`);
      return upd;
    });
  };

  // Edit
  const startEdit = id => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id) => {
    const r = editRefs.current[id];
    if (!r) return;
    const old = tasks.find(x => x.id === id);
    const ass = TEAM.find(m => m.id === r.assignee.value) || null;
    const upd = {
      ...old,
      title: r.title.value.trim() || old.title,
      dueDate: r.due.value || old.dueDate,
      assigneeId: ass?.id || "",
      assigneeName: ass?.name || "",
      assigneeAvatar: ass?.avatar || "",
      priority: r.priority.value || old.priority,
    };
    setTasks(p => p.map(x => x.id === id ? upd : x));
    addNotification(`Task updated: "${upd.title}"`);
    setEditingId(null);
  };

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  const Card = ({ task }) => {
    const editing = editingId === task.id;
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-xl border backdrop-blur-sm transition-all group ${
          task.completed ? "bg-gray-50/70 border-gray-200" : "bg-white/80 border-gray-200 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => toggle(task.id)}
            className={`p-1 rounded-full transition ${task.completed ? "bg-emerald-500 text-white" : "border-2 border-gray-300 hover:border-emerald-500"}`}>
            <CheckCircle size={18} />
          </button>

          {editing ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
              <input ref={el => editRefs.current[task.id] = { ...editRefs.current[task.id], title: el }} defaultValue={task.title} className="px-2 py-1 border rounded-lg focus:border-indigo-500 outline-none" autoFocus />
              <input ref={el => editRefs.current[task.id] = { ...editRefs.current[task.id], due: el }} type="date" defaultValue={task.dueDate} className="px-2 py-1 border rounded-lg focus:border-indigo-500 outline-none" />
              <select ref={el => editRefs.current[task.id] = { ...editRefs.current[task.id], assignee: el }} defaultValue={task.assigneeId} className="px-2 py-1 border rounded-lg focus:border-indigo-500 outline-none">
                <option value="">—</option>
                {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select ref={el => editRefs.current[task.id] = { ...editRefs.current[task.id], priority: el }} defaultValue={task.priority} className="px-2 py-1 border rounded-lg focus:border-indigo-500 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{task.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                {task.dueDate && <span className="flex items-center gap-1"><Calendar size={13} />{new Date(task.dueDate).toLocaleDateString()}</span>}
                {task.assigneeName && <span className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{task.assigneeAvatar}</div>
                  {task.assigneeName}
                </span>}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                  {task.priority}
                </span>
                {task.completed && <span className="text-emerald-600 font-medium">Completed</span>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} onClick={() => saveEdit(task.id)} className="p-1 text-emerald-600"><Save size={16} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} onClick={cancelEdit} className="p-1 text-gray-600"><X size={16} /></motion.button>
              </>
            ) : (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }} onClick={() => startEdit(task.id)} className="p-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition"><Edit2 size={16} /></motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Add Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Create New Task</h1>
          <form onSubmit={handleAdd} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title..." className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-400" />
                  <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none">
                    <option value="">—</option>
                    {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Plus size={20} /> Add Task
            </motion.button>
          </form>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={22} className="text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">{pending.length}</span>
            </div>
            <div className="space-y-3">
              {pending.length === 0 ? (
                <p className="text-center text-gray-500 py-6 bg-gray-50/50 rounded-xl">No pending tasks. Add one above!</p>
              ) : pending.map(t => <Card key={t.id} task={t} />)}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={22} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Completed Tasks</h2>
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">{done.length}</span>
            </div>
            <div className="space-y-3">
              {done.length === 0 ? (
                <p className="text-center text-gray-500 py-6 bg-gray-50/50 rounded-xl">No completed tasks yet.</p>
              ) : done.map(t => <Card key={t.id} task={t} />)}
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Task;