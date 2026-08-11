// frontend/src/pages/Contact.jsx
import { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);

    window.location.href = `mailto:eventplatform.management@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          Have a question or need help? Send us a message and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}