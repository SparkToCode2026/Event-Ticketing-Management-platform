import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import "../styles/Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await apiRequest(`/Order/GetOrderById/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError("Couldn't load order details.");
      } finally {
        setOrderLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  async function handlePayment(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest("/Payment/AddPayment", "POST", {
        paymentMethod,
        orderId: Number(orderId),
      });

      setSuccess("Payment completed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-page">
      <h1>Payment</h1>

      <div className="payment-card">
        <h2>Complete Your Payment</h2>

        <div className="summary-box">
          <p>Order ID</p>
          <strong>#{orderId}</strong>

          <p>Total Amount</p>
          <strong>
            {orderLoading ? "Loading..." : order ? `${order.totalAmount?.toFixed(2)} OMR` : "—"}
          </strong>
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handlePayment}>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select payment method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}