import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "../config";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SIDE - IMAGE */}
        <div className="md:w-1/2  relative">
          <img
            src="/images/students.svg"
            alt="Students studying together"
            className="w-full h-full object-cover min-h-[300px] md:min-h-[600px]"
          />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex items-center">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-slate-900 text-center">
              Create Account
            </h1>

            <p className="text-slate-500 text-center mt-2 mb-8">
              Join StudySync
            </p>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-14 border border-slate-300 rounded-lg
                 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2
                   w-8 h-8 rounded-full
                   flex items-center justify-center
                   bg-slate-100
                   text-slate-500
                   hover:bg-slate-200
                   hover:text-slate-700
                   transition-all"
                    >
                      {showPassword ? (
                        <EyeOff size={17} strokeWidth={1.8} />
                      ) : (
                        <Eye size={17} strokeWidth={1.8} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {message && (
              <p className="text-center text-sm mt-4 text-slate-600">
                {message}
              </p>
            )}

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
