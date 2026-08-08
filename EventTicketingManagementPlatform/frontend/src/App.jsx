import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AddEvent from "./pages/AddEvent";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Tickets from "./pages/Tickets";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Chatbot from "./pages/Chatbot";
import AddSpeaker from "./pages/AddSpeaker";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/tickets/:id" element={<Tickets />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/add-speaker/:eventId" element={<AddSpeaker />} />
        </Routes>
        {/* Chatbot appears on all pages */}
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;