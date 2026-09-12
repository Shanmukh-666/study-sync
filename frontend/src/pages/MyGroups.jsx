import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/groups/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch groups");
        }

        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-slate-900">
            Study<span className="text-blue-500">Sync</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-slate-600 hover:text-blue-500 font-medium transition"
            >
              Dashboard
            </Link>

            <Link
              to="/my-groups"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              My Groups
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-blue-500 font-semibold text-sm uppercase tracking-wide">
            StudySync
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-2">My Groups</h1>

          <p className="text-slate-500 mt-2">
            Groups you created or joined for collaborative learning.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-slate-500">Loading your groups...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-2xl">
              📚
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mt-5">
              No groups yet
            </h2>

            <p className="text-slate-500 mt-2">
              Create or join a study group to see it here.
            </p>

            <Link
              to="/dashboard"
              className="inline-block mt-6 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              Explore Groups
            </Link>
          </div>
        )}

        {/* Groups */}
        {!loading && !error && groups.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const currentMembers = group.members.length + 1;
              const percentage = Math.min(
                (currentMembers / group.memberLimit) * 100,
                100,
              );

              const isFull = currentMembers >= group.memberLimit;

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6"
                >
                  {/* Subject */}
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-500 text-sm font-semibold rounded-full">
                    {group.subject}
                  </span>

                  {/* Group name */}
                  <h2 className="text-xl font-bold text-slate-900 mt-4">
                    {group.name}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-500 text-sm mt-2 min-h-[40px]">
                    {group.description}
                  </p>

                  {/* Members */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Members</span>

                      <span className="font-semibold text-slate-700">
                        {currentMembers} / {group.memberLimit}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Created by
                    </p>

                    <p className="text-sm text-slate-600 mt-1 truncate">
                      {group.creator.email}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isFull ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {isFull ? "Group Full" : "Open for members"}
                    </span>

                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition">
                      View Group
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyGroups;
