import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/logout";
import JoinGroupButton from "../components/JoinGroupButton";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/groups");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch groups");
        return;
      }

      setGroups(data.groups || []);
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          StudySync
        </h1>

        <nav className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-slate-700 font-medium hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/my-groups"
            className="text-slate-700 font-medium hover:text-blue-600"
          >
            My Groups
          </Link>
          <Link
            to="/create-group"
            className="text-slate-700 font-medium hover:text-blue-600"
          >
            Create Group
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-semibold">
          Welcome to StudySync
        </h2>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Study Groups
            </h3>
          </div>

          {loading && (
            <p className="text-slate-600 mt-4">Loading groups...</p>
          )}

          {error && (
            <p className="text-red-600 mt-4">{error}</p>
          )}

          {!loading && !error && groups.length === 0 && (
            <p className="text-slate-600 mt-4">
              No groups available yet.
            </p>
          )}

          {!loading && !error && groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {groups.map((group) => (
                <article
                  key={group.id}
                  className="bg-white rounded-xl border p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase text-blue-600">
                        {group.subject}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">
                        {group.name}
                      </h4>
                    </div>
                    <span className="text-sm text-slate-500">
                      {group.currentMembers}/{group.memberLimit}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-3">
                    {group.description}
                  </p>

                  <div className="text-sm text-slate-500 mt-3">
                    <p>Creator: {group.creator?.email}</p>
                    {group.location && <p>Location: {group.location}</p>}
                    {group.meetingLink && (
                      <p>Link: {group.meetingLink}</p>
                    )}
                  </div>

                  <JoinGroupButton group={group} onJoined={fetchGroups} />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;