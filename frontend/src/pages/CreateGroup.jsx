import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function CreateGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    description: "",
    memberLimit: "",
    scheduledAt: "",
    location: "",
    meetingLink: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: formData.subject,
          name: formData.name,
          description: formData.description,
          memberLimit: Number(formData.memberLimit),
          scheduledAt: formData.scheduledAt || undefined,
          location: formData.location || undefined,
          meetingLink: formData.meetingLink || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create group");
        setLoading(false);
        return;
      }

      setMessage("Group created successfully!");

      setFormData({
        subject: "",
        name: "",
        description: "",
        memberLimit: "",
        scheduledAt: "",
        location: "",
        meetingLink: "",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="form-panel w-full max-w-lg rounded-2xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Study Group
          </h1>
          <p className="text-slate-500 mt-2">
            Set up a new group and invite others to join
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Mathematics"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Weekend Study Group"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What will your group study?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              rows="3"
            />
          </div>

          {/* Member Limit */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Member Limit <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="memberLimit"
              value={formData.memberLimit}
              onChange={handleChange}
              placeholder="e.g. 10"
              min="1"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Schedule & Location (Optional)
            </p>
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Central Library, Room 204"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm text-center font-medium">
              {message}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Back Link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          <Link
            to="/dashboard"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CreateGroup;
