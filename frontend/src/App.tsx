import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import CustomerLayout from "./components/layouts/CustomerLayout";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import CustomerProducts from "./pages/customer/Products";
import CustomerOrders from "./pages/customer/Orders";
import CustomerProfile from "./pages/customer/Profile";
import { CartProvider } from "./contexts/CartContext";
import AdminLayout from "./components/layouts/AdminLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/products" replace />}
              />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Customer routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute>
                  <CartProvider>
                    <CustomerLayout />
                  </CartProvider>
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/customer/products" replace />}
              />
              <Route path="products" element={<CustomerProducts />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </ApolloProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
