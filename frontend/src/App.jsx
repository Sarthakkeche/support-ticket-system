import TicketForm from "./components/TicketForm.jsx";
import TicketList from "./components/TicketList.jsx";
import StatsDashboard from "./components/StatsDashboard.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Support Ticket System
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <TicketForm />
          <StatsDashboard />
        </div>

        <div className="mt-10">
          <TicketList />
        </div>
      </div>
    </div>
  );
}

export default App;
