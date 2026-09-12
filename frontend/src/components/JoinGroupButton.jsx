import { useState } from "react";

function JoinGroupButton({ groupId, isFull, onJoined }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to join group");
        return;
      }

      setMessage("Joined successfully!");

      if (onJoined) {
        onJoined();
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isFull) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-slate-200 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
      >
        Group Full
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition"
      >
        {loading ? "Joining..." : "Join Group"}
      </button>

      {message && <p className="text-sm text-slate-500 mt-2">{message}</p>}
    </div>
  );
}

export default JoinGroupButton;
