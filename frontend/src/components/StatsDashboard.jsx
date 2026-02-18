/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../api";

const StatsDashboard = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await API.get("tickets/stats/");
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed",err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  if (!stats) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse">
        <h2 className="text-2xl font-semibold mb-4">Stats Dashboard</h2>
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">
        Stats Dashboard
      </h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Total Tickets</p>
          <p className="text-3xl font-bold text-blue-400">
            {stats.total_tickets}
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Open Tickets</p>
          <p className="text-3xl font-bold text-yellow-400">
            {stats.open_tickets}
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Avg / Day</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.avg_tickets_per_day}
          </p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Priority Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-400">
            Priority Breakdown
          </h3>

          <div className="space-y-2">
            {Object.entries(stats.priority_breakdown).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between bg-gray-700 px-3 py-2 rounded"
                >
                  <span className="capitalize">{key}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-purple-400">
            Category Breakdown
          </h3>

          <div className="space-y-2">
            {Object.entries(stats.category_breakdown).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between bg-gray-700 px-3 py-2 rounded"
                >
                  <span className="capitalize">{key}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsDashboard;
