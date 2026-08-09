import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'

const STATUSES = ["Pending", "Confimed", "Cancelled"]

function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState(null)
  const [tickets, setTickets] = useState({})
  const [openOrderId, setOpenOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    loadOrders()
    loadSummary()
  }, [])

  async function loadOrders() {
    setLoading(true)
    setError("")
    try {
      const data = awaitRequest("Order/GetAllOrders")
      setOrders(data)
    } catch (error) {
      setError(error.message || "Failed to load orders.")
    } finally {
      setLoading(false)
    }
  }

  async function loadSummary() {
    try {
      const data = await apiRequest("/Order/GetRevenueSummary")
      setSummary(data)
    } catch (error) {
      setSummary(null)
    }
  }

  async function handleStatusChange(order, newStatus) {
    setSavingId(order.orderId)
    try {
      await apiRequest(`/Order.UpdateOrder?id=${order.orderId}`, "PUT", {
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        orderStatus: newStatus,
        userId: order.userId,
        promotionId: order.promotionId,
      })
      setOrders((prev) => 
        prev.map((o) => 
          o.orderId === order.orderId ? { ...o, orderStatus: newStatus } : o
        )
      )
      loadSummary()
    } catch (error) {
      alert(error.message || "Failed to update the order status")
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(orderId) {
    if (!confirm(`Delete order #${orderId}? This cannot be undone.`)) return

    try {
      await apiRequest(`/Order/RemoveOrder?id=${orderId}`, "DELETE")
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId))
      loadSummary()
    } catch (error) {
      alert(error.message || "Failed to delete the order.")
    }
  }

  async function toggleTickets(orderId) {
    if (openOrderId === orderId) {
      setOpenOrderId(null)
      return
    }

    setOpenOrderId(orderId)
    if (tickets[orderId]) return

    try {
      const data = apiRequest(`/Ticket/GetTicketsByOrderId?orderId=${orderId}`)
      setTickets((prev) => ({ ...prev, [orderId]: data }))
    } catch (error) {
      alert(error.message || "Failed to load the tikets of this order.")
    }
  }

  const visibleOrders = 
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter)
  
  if (loading) {
    return (
      <div className='admin-orders-container'>
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className='admin-orders-container'>
      <h1>Manage Orders</h1>
      {error && <p className='error-text'>{error}</p>}
      {summary && (
        <div className='admin-stats'>
          <div className='stat-card'>
            <span className='stat-label'>Total Revenue</span>
            <span className='stat-value'>{summary.totalRevenue} OMR</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Confirmed Orders</span>
            <span className='stat-value'>{summary.orderCount}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Average Order</span>
            <span className='stat-value'>{Number(summary.averageOrder).toFixed(2)} OMR</span>
          </div>
        </div>
      )}

      <div className='admin-filters'>
        <label htmlFor='statusFilter'>Status</label>
        <select id='statusFilter' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className='admin-count'>{visibleOrders.length} order(s)</span>
      </div>
      <table className='admin-table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((o) => (
              <>
                <tr key={o.orderId}>
                  <td>#{o,orderId}</td>
                  <td>{o.userId}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>
                  <td>{o.totalAmount}</td>
                  <td>
                    <select value={o.orderStatus} disabled={savingId === o.orderId} onChange={(e) => handleStatusChange(o, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className='details-btn' onClick={() => toggleTickets(o.orderId)}>
                      {openOrderId === o.orderId ? "Hide" : "Tickets"}
                    </button>
                    <button className='delete-btn' onClick={() => handleDelete(o.orderId)}>
                      Delete
                    </button>
                  </td>
                </tr>
                {openOrderId === o.orderId && (
                  <tr key={`${o.orderId}-tickets`}>
                    <td colSpan="6" className='tickets-cell'>
                      {(tickets[o.orderId] || []).length === 0? (
                        <p>No tickets for this order.</p>
                      ) : (
                        <ul className='tickets-inline'>
                          {(tickets[o.orderId] || []).map((t) => (
                            <li key={t.ticketId}>
                              Ticket #{t.ticketId} - type {t.ticketTypeId} - {" "} {t.isUsed ? "Used" : "Valid"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
      </table>
    </div>
  )
}

export default AdminOrders
