import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch group");
          setLoading(false);
          return;
        }

        setGroup(data.group);
      } catch (error) {
        setError("Unable to connect to the server.");
      }

      setLoading(false);
    };

    fetchGroup();
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone.",
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete group");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-4 text-sm">
            Loading group details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold text-xl">!</span>
          </div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  const isCreator = currentUserId === group.creatorId;
  const isMember = group.members?.some((member) => member.id === currentUserId);

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/groups/${id}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to leave group");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* -- Navbar -- */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Study</span>
            <span className="text-2xl font-bold text-slate-900">Sync</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-slate-500 font-medium hover:text-blue-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* -- Header Card -- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              {/* Subject badge */}
              <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                {group.subject}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {group.name}
              </h1>

              {group.creator && (
                <p className="text-sm text-slate-400 mt-2">
                  Created by {group.creator.email}
                </p>
              )}
            </div>

            {isCreator && (
              <button
                onClick={handleDelete}
                className="self-start px-5 py-2.5 bg-white border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
              >
                Delete Group
              </button>
            )}
            {!isCreator && isMember && (
              <button
                onClick={handleLeave}
                className="self-start px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Leave Group
              </button>
            )}
          </div>

          {/* Description */}
          {group.description && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {group.description}
              </p>
            </div>
          )}
        </div>

        {/* -- Details Grid -- */}
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          {/* Schedule */}
          {group.scheduledAt && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Scheduled Date & Time
              </h3>
              <p className="text-slate-800 font-medium">
                {new Date(group.scheduledAt).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-slate-500 text-sm mt-0.5">
                {new Date(group.scheduledAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* Location */}
          {group.location && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Location
              </h3>
              <p className="text-slate-800 font-medium">{group.location}</p>
            </div>
          )}

          {/* Meeting Link */}
          {group.meetingLink && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Meeting Link
              </h3>
              <a
                href={group.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition mt-1"
              >
                Join Meeting
              </a>
            </div>
          )}

          {/* Member Limit */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Member Limit
            </h3>
            <p className="text-slate-800 font-medium">
              {group.memberLimit} members max
            </p>
          </div>

          {/* Members */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:col-span-2">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Members ({(group.members?.length || 0) + 1}/{group.memberLimit})
            </h3>
            <div className="space-y-1 text-slate-800 text-sm">
              {[group.creator, ...(group.members || [])]
                .filter(Boolean)
                .map((member) => (
                  <p key={member.id}>{member.email}</p>
                ))}
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GroupDetails;
