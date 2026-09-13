import { useState } from "react";

function JoinGroupButton({ group, onJoined }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const groupIsFull = group.currentMembers >= group.memberLimit;

  const handleJoin = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (groupIsFull) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/groups/${group.id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to join group");
        return;
      }

      setSuccess(data.message || "Joined group successfully");
      if (typeof onJoined === "function") {
        onJoined();
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleJoin}
        disabled={loading || groupIsFull}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          groupIsFull
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        }`}
      >
        {groupIsFull ? "Group Full" : loading ? "Joining..." : "Join Group"}
      </button>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm mt-2">{success}</p>
      )}
    </div>
  );
}

export default JoinGroupButton;
