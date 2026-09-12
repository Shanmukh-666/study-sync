import { useState } from "react";

function CreateGroup() {
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    description: "",
    memberLimit: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/groups", {
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create group");
        return;
      }

      setMessage("Group created successfully!");

      setFormData({
        subject: "",
        name: "",
        description: "",
        memberLimit: "",
      });
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Study Group
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Java"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Java Study Group"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Group for learning Java and DSA"
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Member Limit</label>
            <input
              type="number"
              name="memberLimit"
              value={formData.memberLimit}
              onChange={handleChange}
              placeholder="5"
              min="1"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Create Group
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-center mt-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateGroup;