import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import "../styles/Orders.css"

function Orders() {

  const { user } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [tickets, setTickets] = useState({})
  const [openOrderId, setOpenOrderId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    loadOrders()
  }, [user])

  async function loadOrders() {
    setLoading(true)
    setError("")
    try {
      const data = await apiRequest(
        `/Order/GetOrdersByUserId?userId=${user.userId}`
      )
      setOrders(data)
    } catch (error) {
      setError(error.message || "Failed to load your orders.")
    } finally {
      setLoading(false)
    }
  }

  async function toggleTickets(orderId) {
    if (openOrderId === orderId) {
      setOpenOrderId(null)
      return
    }

    setOpenOrderId(orderId)

    if (tickets[orderId]) {
      return
    }

    try {
      const data = await apiRequest(`/Ticket/GetTicketsByOrderId?orderId=${orderId}`)
      setTickets((prev) => ({ ...prev, [orderId]: data }))
    } catch (error) {
      alert(error.message || "Failed to load the tickets of this order.")
    }
  }

  function statusClass(status) {
    if (status === "Confirmed") {
      return "status confirmed"
    }
    if (status === "Cancelled") {
      return "status cancelled"
    }
    return "status pending"
  }

  if (loading) {
    return (
      <div className='orders-page'>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className='orders-page'>
      <h1>My Orders</h1>
      
      {error && <p className='error-text'>{error}</p>}
      {orders.length === 0 ? (
        <div className='orders-empty'>
          <p>You have no orders yet.</p>
          <button onClick={() => navigate("/events")}>Browse Events</button>
        </div>
      ) : (
        <div className='orders-list'>
          {orders.map((o) => (
            <div className='order-card' key={o.orderId}>
              <div className='order-header'>
                <div>
                  <h2>Order #{o.orderId}</h2>
                  <p>{new Date(o.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={statusClass(o.orderStatus)}>{o.orderStatus}</span>
              </div>
              <div className='order-body'>
                <p>
                  Tickets: <strong>{o.tickets ? o.tickets.length : 0}</strong>
                </p>
                <p>
                  Total: <strong>{o.totalAmount} OMR</strong>
                </p>
              </div>
              <div className='order-actions'>
                <button className='details-btn' onClick={() => toggleTickets(o.orderId)}>
                  {openOrderId === o.orderId ? "Hide Tickets" : "View Tickets"}
                </button>
                {o.orderStatus === "Pending" && (
                <button
                  className='pay-btn'
                  onClick={() => navigate(`/payment/${o.orderId}`)}
                >
                  Pay Now
                </button>
              )}
              </div>
              {openOrderId === o.orderId && (
                <table className='tickets-table'>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Issued At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tickets[o.orderId] || []).map((t) => (
                      <tr key={t.ticketId}>
                        <td>{t.ticketId}</td>
                        <td>{t.ticketType ? t.ticketType.category : "-"}</td>
                        <td>{t.ticketType ? `${t.ticketType.price} OMR` : "-"}</td>
                        <td>{new Date(t.issuedAt).toLocaleDateString()}</td>
                        <td>{t.isUsed ? "Used" : "Valid"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
