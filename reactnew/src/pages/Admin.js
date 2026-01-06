import api from "../api/axios";
import { useEffect, useState } from "react";
import { Layout, Loader, ErrorMessage } from "../ui/Layout";
import { logout } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("users/me/profile/"),
      api.get("admin/audit-logs/"),
      api.get("users/") // ✅ fetch all users (global scope)
    ])
      .then(([profileRes, logsRes, usersRes]) => {
        setProfile(profileRes.data);
        setLogs(logsRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => setError("Access denied"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout isAdmin={true} onTabChange={setActiveTab}>
      <div className="center-wrapper">
        <div className="profile-card admin-card">
          <h2>Admin Dashboard</h2>

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={activeTab === "details" ? "active" : ""}
              onClick={() => setActiveTab("details")}
            >
              Admin Details
            </button>

            <button
              className={activeTab === "logs" ? "active" : ""}
              onClick={() => setActiveTab("logs")}
            >
              Audit Logs
            </button>

            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          </div>

          {/* Admin Details */}
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
                    <td>{profile.username}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{profile.email}</td>
                  </tr>
                  <tr>
                    <td>Team</td>
                    <td>{profile.team || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <button className="logout-inside" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* Audit Logs */}
          {activeTab === "logs" && (
            <>
              {logs.length === 0 ? (
                <p>No audit logs available.</p>
              ) : (
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Actor</th>
                      <th>Action</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i}>
                        <td>{log.actor}</td>
                        <td>{log.action}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* Users (Global Scope) */}
          {activeTab === "users" && (
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.team || "N/A"}</td>
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
