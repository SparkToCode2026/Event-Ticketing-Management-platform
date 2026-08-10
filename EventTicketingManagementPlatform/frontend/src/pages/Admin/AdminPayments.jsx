import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminPayments.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_OPTIONS = [
  "Completed",
  "Pending",
  "Failed",
  "Refunded",
];

const COLORS = [
  "#e2198eba",
  "#f59e0b",
  "#ef4444",
  "#10b1d58c",
];

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [userStatistics, setUserStatistics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadPayments();
    loadStatistics();
    loadUserStatistics();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/Payment/GetAllPayments");
      setPayments(data);
    } catch (err) {
      setError(err.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStatistics() {
    try {
      const data = await apiRequest("/Payment/Statistics");
      setStatistics(data);
    } catch (err) {
      console.error("Failed to load payment statistics:", err);
    }
  }

  async function loadUserStatistics() {
    try {
      const data = await apiRequest("/Payment/UserStatistics");
      setUserStatistics(data);
    } catch (err) {
      console.error("Failed to load user statistics:", err);
    }
  }

  async function handleStatusChange(paymentId, newStatus) {
    setSavingId(paymentId);

    try {
      await apiRequest(
        `/Payment/UpdatePaymentStatus?id=${paymentId}`,
        "PATCH",
        newStatus
      );

      setPayments((prev) =>
        prev.map((payment) =>
          payment.paymentId === paymentId
            ? { ...payment, paymentStatus: newStatus }
            : payment
        )
      );

      await loadStatistics();
      await loadUserStatistics();
    } catch (err) {
      alert(err.message || "Failed to update payment status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(paymentId) {
    const confirmed = window.confirm(
      `Delete payment #${paymentId}? This cannot be undone.`
    );

    if (!confirmed) return;

    setSavingId(paymentId);

    try {
      await apiRequest(
        `/Payment/DeletePayment?id=${paymentId}`,
        "DELETE"
      );

      setPayments((prev) =>
        prev.filter((payment) => payment.paymentId !== paymentId)
      );

      await loadStatistics();
      await loadUserStatistics();
    } catch (err) {
      alert(err.message || "Failed to delete payment.");
    } finally {
      setSavingId(null);
    }
  }

  const revenueChartData = statistics
    ? [
        {
          name: "This Month",
          amount: Number(statistics.monthlyRevenue || 0),
        },
        {
          name: "This Year",
          amount: Number(statistics.yearlyRevenue || 0),
        },
        {
          name: "Total",
          amount: Number(statistics.totalRevenue || 0),
        },
      ]
    : [];

  const customerChartData = userStatistics.map((user) => ({
    name: user.userName,
    amount: Number(user.totalPaid || 0),
  }));

  const statusChartData = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: payments.filter(
      (payment) => payment.paymentStatus === status
    ).length,
  })).filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="payments-loading">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="payments-page">

      <div className="payments-header">
        <h1>Payment Management</h1>
        <p>
          Monitor payments, revenue and customer spending.
        </p>
      </div>

      {error && (
        <div className="payments-error">
          {error}
        </div>
      )}

      {statistics && (
        <div className="payment-stats-grid">

          <div className="payment-stat-card">
            <div className="stat-icon revenue-icon">💰</div>
            <div>
              <span>Total Revenue</span>
              <strong>
                {Number(statistics.totalRevenue || 0).toFixed(2)} OMR
              </strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon month-icon">📅</div>
            <div>
              <span>This Month</span>
              <strong>
                {Number(statistics.monthlyRevenue || 0).toFixed(2)} OMR
              </strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon year-icon">📊</div>
            <div>
              <span>This Year</span>
              <strong>
                {Number(statistics.yearlyRevenue || 0).toFixed(2)} OMR
              </strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon payments-icon">💳</div>
            <div>
              <span>Completed Payments</span>
              <strong>
                {statistics.totalPayments || 0}
              </strong>
            </div>
          </div>

        </div>
      )}

      <div className="payment-charts">

        <div className="payment-chart-card">
          <h2>Revenue Overview</h2>
          <p>Monthly, yearly and total revenue</p>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#f6a841d2"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="payment-chart-card">
          <h2>Payment Status</h2>
          <p>Distribution of payment statuses</p>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>

              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                label
              >
                {statusChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <section className="payment-section">

        <div className="section-header">
          <h2>Customer Payment Statistics</h2>
          <p>
            See how much each customer has paid.
          </p>
        </div>

        {customerChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#32d2e0ab"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">
            No customer payment statistics available.
          </div>
        )}

      </section>

      <section className="payment-section">

        <div className="section-header">
          <h2>Customer Payments</h2>
          <p>Total amount paid by each customer.</p>
        </div>

        {userStatistics.length === 0 ? (
          <div className="empty-state">
            No payment statistics available.
          </div>
        ) : (
          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Total Paid</th>
                  <th>Payment Count</th>
                </tr>
              </thead>

              <tbody>

                {userStatistics.map((user) => (
                  <tr key={user.userId}>

                    <td>
                      <div className="user-cell">

                        <div className="user-avatar">
                          {user.userName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {user.userName}
                        </span>

                      </div>
                    </td>

                    <td className="amount-cell">
                      {Number(user.totalPaid || 0).toFixed(2)} OMR
                    </td>

                    <td>
                      <span className="payment-count">
                        {user.paymentCount}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      <section className="payment-section">

        <div className="section-header">
          <h2>All Payments</h2>
          <p>
            View and manage all payment transactions.
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            No payments found.
          </div>
        ) : (
          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((payment) => (
                  <tr key={payment.paymentId}>

                    <td>#{payment.paymentId}</td>

                    <td>#{payment.orderId}</td>

                    <td>{payment.paymentMethod}</td>

                    <td className="amount-cell">
                      {Number(
                        payment.paymentAmount || 0
                      ).toFixed(2)} OMR
                    </td>

                    <td>
                      <select
                        className="payment-status"
                        value={payment.paymentStatus}
                        disabled={
                          savingId === payment.paymentId
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            payment.paymentId,
                            e.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="payment-delete-btn"
                        disabled={
                          savingId === payment.paymentId
                        }
                        onClick={() =>
                          handleDelete(
                            payment.paymentId
                          )
                        }
                      >
                        {savingId === payment.paymentId
                          ? "..."
                          : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}