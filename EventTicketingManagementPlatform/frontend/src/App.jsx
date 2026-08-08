import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1 className="container mt-4">Welcome to HexaCode</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;