function LogoutButton() {
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
                 hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;