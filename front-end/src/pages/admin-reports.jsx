// AdminReports.jsx
import React, { useEffect, useState } from "react";
import { FaFileAlt, FaChartBar, FaSearch, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
} from "recharts";

function AdminReports() {
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // States
  const [allLogs, setAllLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const rowsPerPage = 10;

  // Fetch parking logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("https://parking-zlmz.onrender.com");
        setAllLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };
    fetchLogs();
  }, []);

  // Search filter
  const filteredLogs = allLogs.filter(
    (log) =>
      log.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter logs based on tab & date range
  const getFilteredByTab = () => {
    const startDate = dateFrom ? new Date(dateFrom) : new Date("1970-01-01");
    const endDate = dateTo ? new Date(dateTo) : new Date("2100-01-01");

    return filteredLogs.filter((log) => {
      const logDate = new Date(log.timeIn);
      if (logDate < startDate || logDate > endDate) return false;

      const now = new Date();
      switch (activeTab) {
        case "daily":
          return logDate.toDateString() === now.toDateString();
        case "monthly":
          return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
        case "yearly":
          return logDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const currentLogs = getFilteredByTab().slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(getFilteredByTab().length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // CSV Export
  const exportCSV = () => {
    const logsToExport = getFilteredByTab();
    const csvRows = [];
    csvRows.push(["Date", "Vehicle", "Plate No.", "Time In", "Time Out", "Total Hours", "Rate/Hour", "Total", "Status"]);

    logsToExport.forEach((log) => {
      csvRows.push([
        new Date(log.timeIn).toLocaleDateString(),
        log.vehicleType,
        log.plateNumber,
        new Date(log.timeIn).toLocaleTimeString(),
        log.timeOut ? new Date(log.timeOut).toLocaleTimeString() : "-",
        log.totalHours || "-",
        log.ratePerHour || "-",
        log.totalFee || "-",
        log.status,
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parking_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Charts
  const graphData = getFilteredByTab().map((log) => ({
    date: new Date(log.timeIn).toLocaleDateString(),
    pending: log.status === "Pending" ? 1 : 0,
    paid: log.status === "paid" ? 1 : 0,
  }));

  const vehicleCounts = {};
  getFilteredByTab().forEach((log) => {
    vehicleCounts[log.vehicleType] = (vehicleCounts[log.vehicleType] || 0) + (log.totalFee || 0);
  });
  const pieData = Object.keys(vehicleCounts).map((key) => ({ name: key, value: vehicleCounts[key] }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#FF5555"];

  // Summary
  const summaryData = {
    totalEarnings: getFilteredByTab().reduce((acc, log) => acc + (log.totalFee || 0), 0),
    vehiclesToday: getFilteredByTab().filter((log) => new Date(log.timeIn).toDateString() === new Date().toDateString()).length,
    pendingPayments: getFilteredByTab().filter((log) => log.status === "Pending").length,
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaFileAlt style={{ fontSize: "28px", marginRight: "10px", color: "#2b2b2b" }} />
          <h1 style={{ fontSize: "28px", margin: 0 }}>Reports Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <NavButton text="Dashboard" path="/admin-dashboard" />
          <NavButton text="CCTV" path="/adminCCTV" />
          <NavButton text="Reports" path="/admin-reports" active />
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <Card title="Total Earnings" value={`$${summaryData.totalEarnings}`} color="#4CAF50" />
        <Card title="Vehicles Today" value={summaryData.vehiclesToday} color="#2196F3" />
        <Card title="Pending Payments" value={summaryData.pendingPayments} color="#FF9800" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px", alignItems: "center" }}>
        <input type="date" style={inputStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" style={inputStyle} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <select style={inputStyle} value="all">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        <div style={{ position: "relative", flex: 1, maxWidth: "250px" }}>
          <input
            type="text"
            placeholder="Search by vehicle / customer / plate"
            style={{ ...inputStyle, paddingLeft: "30px", width: "100%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch style={{ position: "absolute", top: "50%", left: "8px", transform: "translateY(-50%)", color: "#555" }} />
        </div>
        <button style={exportBtnStyle} onClick={exportCSV}><FaDownload style={{ marginRight: "6px" }} /> Export CSV</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["daily", "monthly", "yearly"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? activeTabStyle : tabBtnStyle}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Report
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Plate No.</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total Hours</th>
              <th>Rate/Hour</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.ownerName}</td>
                <td>{new Date(log.timeIn).toLocaleDateString()}</td>
                <td>{log.vehicleType}</td>
                <td>{log.plateNumber}</td>
                <td>{new Date(log.timeIn).toLocaleTimeString()}</td>
                <td>{log.timeOut ? new Date(log.timeOut).toLocaleTimeString() : "-"}</td>
                <td>{log.totalHours || "-"}</td>
                <td>${log.ratePerHour || "-"}</td>
                <td>${log.totalFee || "-"}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
        <button onClick={() => handlePageChange(currentPage - 1)} style={pageBtnStyle} disabled={currentPage === 1}>Previous</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx} onClick={() => handlePageChange(idx + 1)} style={currentPage === idx + 1 ? activePageBtnStyle : pageBtnStyle}>{idx + 1}</button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} style={pageBtnStyle} disabled={currentPage === totalPages}>Next</button>
      </div>

      {/* Charts */}
      <div style={{ marginTop: "40px", width: "100%", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={chartBoxStyle}>
          <h3 style={{ marginBottom: "15px" }}><FaChartBar style={{ marginRight: "8px" }} /> Parking Trends</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={graphData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke="#FF7F50" strokeWidth={2} />
              <Line type="monotone" dataKey="paid" stroke="#32CD32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBoxStyle}>
          <h3 style={{ marginBottom: "15px" }}>Income Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <PieTooltip />
              <PieLegend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Components
const Card = ({ title, value, color }) => (
  <div style={{ flex: "1 1 200px", background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
    <span style={{ fontSize: "14px", color: "#555" }}>{title}</span>
    <span style={{ fontSize: "22px", fontWeight: "bold", color }}>{value}</span>
  </div>
);

const NavButton = ({ text, path, active }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)} style={{ padding: "8px 15px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: active ? "#2b2b2b" : "#e0e0e0", color: active ? "#fff" : "#333", fontWeight: active ? "bold" : "normal", transition: "0.2s", whiteSpace: "nowrap" }}>
      {text}
    </button>
  );
};

// Styles
const logoutBtnStyle = { padding: "8px 15px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: "#e0e0e0", color: "#333", fontWeight: "normal" };
const tabBtnStyle = { padding: "10px 18px", cursor: "pointer", backgroundColor: "#e0e0e0", color: "#333", border: "none", borderRadius: "6px" };
const activeTabStyle = { ...tabBtnStyle, backgroundColor: "#2b2b2b", color: "#fff" };
const inputStyle = { padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" };
const exportBtnStyle = { padding: "8px 15px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" };
const tableContainerStyle = { overflowX: "auto", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "center", minWidth: "900px" };
const pageBtnStyle = { padding: "6px 12px", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer", background: "#fff" };
const activePageBtnStyle = { ...pageBtnStyle, background: "#2b2b2b", color: "#fff", border: "1px solid #2b2b2b" };
const chartBoxStyle = { flex: 1, minWidth: "350px", height: "400px", background: "#fff", borderRadius: "12px", padding: "15px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };

export default AdminReports;
