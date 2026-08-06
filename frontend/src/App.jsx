import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { AdminRoute } from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';

import AdminDashboard from './components/admin/Dashboard';
import AdminProducts from './components/admin/Products';
import AdminProductForm from './components/admin/ProductForm';
import AdminCategories from './components/admin/Categories';
import AdminCategoryForm from './components/admin/CategoryForm';
import AdminAttributes from './components/admin/Attributes';
import AdminAttributeForm from './components/admin/AttributeForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/category/:slug" element={<Category />} />
              <Route path="/product/:slug" element={<ProductDetail />} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
              <Route path="/admin/products/:slug/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />

              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/categories/new" element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />
              <Route path="/admin/categories/:slug/edit" element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />

              <Route path="/admin/attributes" element={<AdminRoute><AdminAttributes /></AdminRoute>} />
              <Route path="/admin/attributes/new" element={<AdminRoute><AdminAttributeForm /></AdminRoute>} />
              <Route path="/admin/attributes/:slug/edit" element={<AdminRoute><AdminAttributeForm /></AdminRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;