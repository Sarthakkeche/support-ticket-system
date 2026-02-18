/* eslint-disable no-undef */
import { useState } from "react";
import API from "../api";

const TicketForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "low",
    status: "open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "description" && value.length > 15) {
      setLoading(true);
      try {
        const res = await API.post("tickets/classify/", {
          description: value,
          
        });
        

        if (res.data.suggested_category) {
          setForm((prev) => ({
            ...prev,
            category: res.data.suggested_category,
            priority: res.data.suggested_priority,
          }));
        }
      } catch (err) {err}
      setLoading(false);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  await API.post("tickets/", form);

  if (onCreated) {
    onCreated();
  }

  setForm({
    title: "",
    description: "",
    category: "general",
    priority: "low",
    status: "open",
  });
};

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Create Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading && (
          <p className="text-sm text-blue-400">
            AI is analyzing...
          </p>
        )}

        <div className="flex gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-gray-700"
          >
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-gray-700"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
