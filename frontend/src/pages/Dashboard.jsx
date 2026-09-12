import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/logout";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch groups");
          setLoading(false);
          return;
        }

        setGroups(data.groups);
      } catch (error) {
        setError("Unable to connect to the server.");
      }

      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Navbar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Study</span>
            <span className="text-2xl font-bold text-slate-900">Sync</span>
          </Link>

          <div className="flex gap-3 items-center">
            <Link
              to="/create-group"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              + New Group
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Study Groups</h2>
          <p className="text-slate-500 mt-2 text-lg">Find a group to learn together or create your own.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading groups...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
              <span className="text-3xl text-blue-600 font-bold">+</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No study groups yet</h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-md text-lg">
              Create your first study group and start learning together.
            </p>
            <Link
              to="/create-group"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-md transition-all"
            >
              Create Your First Group
            </Link>
          </div>
        )}

        {/* Group Cards Grid */}
        {!loading && !error && groups.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Subject badge */}
                <div className="mb-4">
                  <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wide">
                    {group.subject}
                  </span>
                </div>

                {/* Group name */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {group.name}
                </h3>

                {/* Description preview */}
                {group.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed flex-grow">
                    {group.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3.5">
                  {group.scheduledAt && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scheduled</p>
                      <p className="text-sm text-slate-800 font-medium">
                        {new Date(group.scheduledAt).toLocaleString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  {group.location && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-sm text-slate-800 font-medium">{group.location}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-sm text-slate-800 font-medium">{group.memberLimit} members max</p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;