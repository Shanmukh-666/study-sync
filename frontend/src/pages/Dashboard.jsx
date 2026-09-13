import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/logout";
import JoinGroupButton from "../components/JoinGroupButton";
import { API_URL } from "../config";

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  } catch {
    return null;
  }
}

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/groups`, {
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

      setGroups(data.groups || []);
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const currentUserId = getUserIdFromToken();
  const filteredGroups = groups.filter((group) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "my" && group.creator?.id === currentUserId) ||
      (activeTab === "joined" && group.memberIds?.includes(currentUserId));
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [group.name, group.subject, group.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="app-shell">
      {/* ── Navbar ── */}
      <header className="topbar sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="brand-mark text-2xl font-extrabold text-blue-950"
          >
            <span className="text-blue-600">Study</span>
            <span className="text-blue-950">Sync</span>
          </Link>

          <div className="flex gap-3 items-center">
            <Link
              to="/my-groups"
              className="px-3 font-semibold text-blue-900 transition hover:text-blue-600"
            >
              My Groups
            </Link>
            <Link
              to="/create-group"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
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
        <div className="hero-panel mb-8 px-6 py-7 text-white sm:px-8 sm:py-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            Your learning network
          </p>
          <div className="relative z-[1] flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Find your next study circle.
              </h2>
              <p className="mt-2 max-w-xl text-blue-100">
                Discover focused groups, meet committed learners, and make every
                session count.
              </p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/15 px-5 py-3 text-sm backdrop-blur-sm">
              <span className="block text-2xl font-extrabold">
                {groups.length}
              </span>
              <span className="text-blue-100">groups available</span>
            </div>
          </div>
        </div>

        <div className="toolbar mb-8 flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="filter-tabs">
            {[
              ["all", "All Groups"],
              ["my", "My Groups"],
              ["joined", "Joined Groups"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`filter-tab text-sm font-bold ${activeTab === value ? "active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search groups"
            className="search-field w-full px-4 py-2.5 text-sm sm:w-72"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white/70 py-20">
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
          <div className="empty-panel flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
              <span className="text-3xl text-blue-600 font-bold">+</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              No study groups yet
            </h3>
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

        {!loading &&
          !error &&
          groups.length > 0 &&
          filteredGroups.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No groups found.
            </div>
          )}

        {/* Group Cards Grid */}
        {!loading && !error && filteredGroups.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="group group-card flex flex-col p-6"
              >
                {/* Subject badge */}
                <div className="mb-4 flex justify-between items-start">
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
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Scheduled
                      </p>
                      <p className="text-sm text-slate-800 font-medium">
                        {new Date(group.scheduledAt).toLocaleString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  {group.location && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Location
                      </p>
                      <p className="text-sm text-slate-800 font-medium">
                        {group.location}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Capacity
                    </p>
                    <p className="text-sm text-slate-800 font-medium">
                      {group.currentMembers || 1}/{group.memberLimit} members
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                    View Details <span>→</span>
                  </span>
                  <div onClick={(e) => e.preventDefault()}>
                    <JoinGroupButton group={group} onJoined={fetchGroups} />
                  </div>
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
