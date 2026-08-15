import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AddEvent from "./pages/AddEvent";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrganizers from "./pages/Admin/AdminOrganizers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventCategories from "./pages/Admin/AdminEventCategories";
import AdminVenues from "./pages/Admin/AdminVenues";
import AdminSpeakers from "./pages/Admin/AdminSpeakers";
import AdminTicketTypes from "./pages/Admin/AdminTicketTypes";
import AdminTickets from "./pages/Admin/AdminTickets";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/Admin/AdminPayments";
import AdminReviews from "./pages/Admin/AdminReviews";
import AdminPromotions from "./pages/Admin/AdminPromotions";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";
import MyEvents from "./pages/MyEvents";
import ReviewPage from "./pages/ReviewPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/reviews/:eventId" element={<ReviewPage />} />
            <Route path="/tickets/:id" element={<Tickets />} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/payment/:orderId" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/speakers" element={<PrivateRoute allowedRoles={["Organizer", "Admin"]}><AddSpeaker /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/my-events" element={<PrivateRoute allowedRoles={["Organizer", "Admin"]}><MyEvents /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<PrivateRoute allowedRoles={["Admin"]}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute allowedRoles={["Admin"]}><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/organizers" element={<PrivateRoute allowedRoles={["Admin"]}><AdminOrganizers /></PrivateRoute>} />
            <Route path="/admin/events" element={<PrivateRoute allowedRoles={["Admin"]}><AdminEvents /></PrivateRoute>} />
            <Route path="/admin/event-categories" element={<PrivateRoute allowedRoles={["Admin"]}><AdminEventCategories /></PrivateRoute>} />
            <Route path="/admin/venues" element={<PrivateRoute allowedRoles={["Admin"]}><AdminVenues /></PrivateRoute>} />
            <Route path="/admin/speakers" element={<PrivateRoute allowedRoles={["Admin"]}><AdminSpeakers /></PrivateRoute>} />
            <Route path="/admin/ticket-types" element={<PrivateRoute allowedRoles={["Admin"]}><AdminTicketTypes /></PrivateRoute>} />
            <Route path="/admin/tickets" element={<PrivateRoute allowedRoles={["Admin"]}><AdminTickets /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute allowedRoles={["Admin"]}><AdminOrders /></PrivateRoute>} />
            <Route path="/admin/payments" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPayments /></PrivateRoute>} />
            <Route path="/admin/reviews" element={<PrivateRoute allowedRoles={["Admin"]}><AdminReviews /></PrivateRoute>} />
            <Route path="/admin/promotions" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPromotions /></PrivateRoute>} />
          </Routes>

          {/* Chatbot appears on all pages */}
          <Chatbot />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;