import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchMyGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/api/groups/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch your groups");
          return;
        }

        setGroups(data.groups || []);
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">StudySync</h1>
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
        </nav>
      </header>

      <main className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">My Groups</h2>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Browse Groups
          </Link>
        </div>

        {loading && (
          <div className="mt-8 text-slate-600">Loading your groups...</div>
        )}

        {error && (
          <div className="mt-8 p-4 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="mt-8 p-8 rounded-xl bg-white shadow-sm text-slate-600">
            You have not joined or created any groups yet.
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {groups.map((group) => (
              <section
                key={group.id}
                className="bg-white rounded-xl shadow-sm border p-5"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase text-blue-600">
                      {group.subject}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {group.name}
                    </h3>
                  </div>
                  <span className="text-sm text-slate-500">
                    {group.currentMembers}/{group.memberLimit} members
                  </span>
                </div>

                <p className="text-slate-600 mt-3">{group.description}</p>

                <div className="mt-4 text-sm text-slate-500">
                  <p>Creator: {group.creator?.email}</p>
                  {group.meetingLink && <p>Link: {group.meetingLink}</p>}
                  {group.location && <p>Location: {group.location}</p>}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyGroups;
