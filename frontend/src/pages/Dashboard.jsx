import LogoutButton from "../components/logout";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          StudySync
        </h1>

        <LogoutButton />
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-semibold">
          Welcome to StudySync
        </h2>
      </main>
    </div>
  );
}

export default Dashboard;