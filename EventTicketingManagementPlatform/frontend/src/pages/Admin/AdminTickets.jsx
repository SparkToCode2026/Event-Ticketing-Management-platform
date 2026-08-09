import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'
import '../../styles/AdminTickets.css'

function AdminTickets() {

  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [usageFilter, setUsageFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingId, setsavingId] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTickets()
    loadStats()
  }, [])

  async function loadTickets() {
    setLoading(true)
    setError("")
    try {
      const data = await apiRequest("/Ticket/GetAllTickets")
      setTickets(data)
    } catch (error) {
      setError(error.message || "Failed to load tickets.")
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const data = await apiRequest("/Ticket/GetTicketUsageStatistics")
      setStats(data)
    } catch (error) {
      setStats(null)
    }
  }

  async function handleMarkAsUsed(ticketId) {
    setsavingId(ticketId)
    try {
      await apiRequest(`/Ticket/MarkTicketAsUsed?id=${ticketId}`, "PATCH")
      setTickets((prev) => prev.map((t) => (t.ticketId === ticketId ? { ...t, isUsed: true } : t)))
      loadStats()
    } catch (error) {
      alert(error.message || "Failed to mark the ticket as used.")
    } finally {
      setsavingId(null)
    }
  }

  async function handleDelete(ticketId) {
    if (!confirm(`Delete ticket #${ticketId}? this cannot be undone.`)) return

    try {
      await apiRequest(`/Ticket/DeleteTicket?id=${ticketId}`, "DELETE")
      setTickets((prev) => prev.filter((T) => T.ticketId !== ticketId))
      loadStats()
    } catch (error) {
      alert(error.message || "Failed to delete the ticket.")
    }
  }

  const visibleTickets = tickets.filter((t) => {
    if (usageFilter === "Used" && !t.isUsed) return false
    if (usageFilter === "Valid" && t.isUsed) return false
    if (search && String(t.orderId) !== search.trim()) return false
    return true
  })

  if (loading) {
    return (
     <div className='admin-tickets-container'>
        <p>Loading tickets...</p>
      </div>
    )
  }

  return (
    <div className='admin-tickets-container'>
      <h1>Manage Tickets</h1>
      {error && <p className='error-text'>{error}</p>}
      {stats && (
        <div className='admin-stats'>
          <div className='stat-card'>
            <span className='stat-label'>Total Tickets</span>
            <span className='stat-value'>{stats.totalTickets}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Used</span>
            <span className='stat-value'>{stats.usedTickets}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Still Valid</span>
            <span className='stat-value'>{stats.unusedTickets}</span>
          </div>
        </div>
      )}

      <div className='admin-filters'>
        <label htmlFor='usageFilter'>Usage</label>
        <select id='usageFilter' value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Valid">Valid</option>
          <option value="Used">Used</option>
        </select>
        <label htmlFor='search'>Order ID</label>
        <input
          id='search'
          type='number'
          placeholder='e.g. 3'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className='admin-count'>{visibleTickets.length} ticket(s)</span>
      </div>
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Order ID</th>
            <th>Ticket Type ID</th>
            <th>Issued At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleTickets.map((t) => (
            <tr key={t.ticketId}>
              <td>#{t.ticketId}</td>
              <td>#{t.orderId}</td>
              <td>{t.ticketTypeId}</td>
              <td>{new Date(t.issuedAt).toLocaleString()}</td>
              <td>
                <span className={t.isUsed ? "badge used" : "badge valid"}>
                  {t.isUsed ? "Used" : "Valid"}
                </span>
              </td>
              <td>
                {!t.isUsed && (
                  <button className='use-btn' disabled={savingId === t.ticketId} onClick={() => handleMarkAsUsed(t.ticketId)}>
                    Mark Used
                  </button>
                )}
                <button className='delete-btn' onClick={() => handleDelete(t.ticketId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTickets
