import api from "../api/axios";
import { useEffect, useState } from "react";
import { Layout, Loader, ErrorMessage } from "../ui/Layout";
import { logout } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("users/")
      .then(res => setUsers(res.data))
      .catch(() => setError("Access denied"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const me = users[0];                 // self
  const teamMembers = users.slice(1);  // team (if any)

  return (
    <Layout isAdmin={false}>
      <div className="center-wrapper">
        <div className="profile-card">

          <h2>User Dashboard</h2>

          {/* Tabs (same design as Admin) */}
          <div className="tab-bar">
            <button
              className={activeTab === "details" ? "active" : ""}
              onClick={() => setActiveTab("details")}
            >
              My Details
            </button>

            {teamMembers.length > 0 && (
              <button
                className={activeTab === "team" ? "active" : ""}
                onClick={() => setActiveTab("team")}
              >
                Team Members
              </button>
            )}
          </div>

          {/* My Details Tab */}
          {activeTab === "details" && (
            <>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>{me.username}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{me.email}</td>
                  </tr>
                  <tr>
                    <td>Team</td>
                    <td>{me.team || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <button className="logout-inside" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* Team Members Tab (same table style as audit logs) */}
          {activeTab === "team" && (
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </Layout>
  );
}
