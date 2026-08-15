import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../services/api'
import "../styles/Tickets.css"

function Tickets() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [ticketTypes, setTicketTypes] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [promoCode, setPromoCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTicketTypes()
  }, [id])

  async function loadTicketTypes() {
    setLoading(true)
    setError("")
    try {
      const data = await apiRequest("/api/TicketType")
      const eventTypes = data.filter((t) => t.eventId === Number(id))
      setTicketTypes(eventTypes)
    } catch (error) {
      setError(error.message || "Failed to load ticket types.")
    } finally {
      setLoading(false)
    }
  }

  async function handleContinue() {
    if (!user) {
      navigate("/login")
      return
    }
    if (!selectedType) {
      setError("Please choose a ticket type first.")
      return
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.")
      return
    }

    setSaving(true)
    setError("")
    try{
      const order = await apiRequest("/Order/AddOrder", "POST", {
        items: [{ ticketTypeId: selectedType.ticketTypeId, quantity }],
        promotionCode: promoCode.trim() || null
      })

      navigate(`/payment/${order.orderId}`)
    } catch (error) {
      setError(error.message || "Failed to create the order.")
    } finally {
      setSaving(false)
    }
  }

  const total = selectedType ? selectedType.price * quantity : 0

  if (loading) {
    return (
      <div className="tickets-page">
        <p>Loading tickets...</p>
      </div>
    )
  }
  return (
    <div className="tickets-page">
      <h1>Choose Your Ticket</h1>

      <div className="ticket-card">
        <h2>Available Ticket Types</h2>
        {error && <p className='error-text'>{error}</p>}
        {ticketTypes.length === 0 ? (
          <p>No tickets are Available for this event yet.</p>
        ) : (
          ticketTypes.map((t) => (
            <label className='ticket-option' key={t.ticketTypeId}>
              <input
                type='radio'
                name='ticketType'
                checked={selectedType?.ticketTypeId === t.ticketTypeId}
                onChange={() => setSelectedType(t)}
              />
              <div>
                <h3>{t.category}</h3>
                <p>{t.benefits}</p>
              </div>
              <span>{t.price} OMR</span>
            </label>
          ))
        )}

        {selectedType && (
          <>
            <div className='ticket-quantity'>
              <label htmlFor='quantity'>Quantity</label>
              <input
                id='quantity'
                type='number'
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className='ticket-quantity'>
              <label htmlFor='promoCode'>Promo Code (optional)</label>
              <input
                id='promoCode'
                type='text'
                placeholder='e.g. SPARK'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>

            <div className='ticket-total'>
              <span>Total</span>
              <strong>{total.toFixed(2)} OMR</strong>
            </div>
          </>
        )}

        <button className='continue-button' disabled={saving || ticketTypes.length === 0} onClick={handleContinue}>
          {saving ? "Creating order..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  )
}

export default Tickets