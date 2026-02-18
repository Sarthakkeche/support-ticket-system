/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../api";

const statusColors = {
  open: "bg-yellow-500",
  in_progress: "bg-blue-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const priorityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-500",
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    search: "",
  });

  const fetchTickets = async () => {
    const params = new URLSearchParams(filters).toString();
    const res = await API.get(`tickets/?${params}`);
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleStatusChange = async (id, status) => {
    await API.patch(`tickets/${id}/`, { status });
    fetchTickets();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">
        Tickets
      </h2>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <input
          placeholder="Search..."
          className="p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="p-3 rounded-lg bg-gray-700"
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>

        <select
          className="p-3 rounded-lg bg-gray-700"
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          className="p-3 rounded-lg bg-gray-700"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

      </div>

      {/* Ticket Cards */}
      <div className="space-y-4">

        {tickets.length === 0 && (
          <p className="text-gray-400">
            No tickets found.
          </p>
        )}

        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-gray-700 p-5 rounded-lg hover:bg-gray-600 transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold">
                {ticket.title}
              </h4>

              <span
                className={`px-3 py-1 text-sm rounded-full text-white ${statusColors[ticket.status]}`}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-gray-300 mb-3">
              {ticket.description.length > 120
                ? ticket.description.slice(0, 120) + "..."
                : ticket.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="space-x-4 text-sm">
                <span className="capitalize">
                  Category: {ticket.category}
                </span>

                <span className={`capitalize ${priorityColors[ticket.priority]}`}>
                  Priority: {ticket.priority}
                </span>
              </div>

              <select
                value={ticket.status}
                onChange={(e) =>
                  handleStatusChange(ticket.id, e.target.value)
                }
                className="p-2 rounded bg-gray-800"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TicketList;
