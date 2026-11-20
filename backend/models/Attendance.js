
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyAttendance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentEmail = user.email;

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentEmail) {
      setError("Student login details not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(
      `http://127.0.0.1:5000/attendance/by-email/${encodeURIComponent(
        studentEmail
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load attendance records");
        }
        return response.json();
      })
      .then((data) => {
        setAttendance(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentEmail]);

  const totalClasses = attendance.length;

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const percentage =
    totalClasses > 0
      ? ((presentCount / totalClasses) * 100).toFixed(1)
      : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Attendance</h1>
          <p style={styles.subtitle}>
            View your attendance records and overall percentage.
          </p>
        </div>

        <Link to="/student-dashboard" style={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <p style={styles.message}>Loading attendance...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <>
          <div style={styles.summary}>
            <div style={styles.card}>
              <h3>Total Classes</h3>
              <h2>{totalClasses}</h2>
            </div>

            <div style={styles.card}>
              <h3>Present</h3>
              <h2 style={{ color: "#16a34a" }}>{presentCount}</h2>
            </div>

            <div style={styles.card}>
              <h3>Absent</h3>
              <h2 style={{ color: "#dc2626" }}>{absentCount}</h2>
            </div>

            <div style={styles.card}>
              <h3>Attendance</h3>
              <h2 style={{ color: "#2563eb" }}>{percentage}%</h2>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <h2 style={styles.tableTitle}>Attendance History</h2>

            {attendance.length === 0 ? (
              <p style={styles.message}>
                No attendance records found.
              </p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>S.No</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((item, index) => (
                    <tr key={item._id || index}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                      <td style={styles.td}>
                        {item.studentName || "-"}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            backgroundColor:
                              item.status === "Present"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              item.status === "Present"
                                ? "#166534"
                                : "#991b1b",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px",
  },
  title: {
    margin: 0,
    color: "#1e293b",
    fontSize: "28px",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },
  backButton: {
    backgroundColor: "#1e40af",
    color: "white",
    padding: "11px 18px",
    borderRadius: "7px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  tableContainer: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflowX: "auto",
  },
  tableTitle: {
    color: "#1e293b",
    marginTop: 0,
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    padding: "14px",
    borderBottom: "1px solid #dbeafe",
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
  },
  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  message: {
    padding: "20px",
    color: "#64748b",
    textAlign: "center",
  },
  error: {
    padding: "15px",
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
  },
};

export default MyAttendance;
