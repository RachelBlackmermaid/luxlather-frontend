import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Oil from "./pages/Oil";
import Soap from "./pages/Soap";
import Contact from "./pages/Contact";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import About from "./pages/About";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import AdminContactInbox from "./pages/AdminContactInbox";
import AdminOrders from "./pages/AdminOrders";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import AccountPage from "./pages/AccountPage";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <main className="bg-gray-100">
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen w-full pt-20 px-4 justify-center items-center text-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/oil" element={<Oil />} />
            <Route path="/soap" element={<Soap />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/contact" element={<AdminContactInbox />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/signup" element={<CustomerSignup />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<MyOrders />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
