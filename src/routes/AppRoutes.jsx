import { Routes, Route } from 'react-router-dom'
import AdminRoute from './AdminRoute'

// Public
import Home from '../pages/public/Home'
import Gallery from '../pages/public/Gallery'
import PaintingDetail from '../pages/public/PaintingDetail'
import Order from '../pages/public/Order'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import NotFound from '../pages/public/NotFound'

// Admin
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import PaintingsList from '../pages/admin/PaintingsList'
import PaintingForm from '../pages/admin/PaintingForm'
import OrdersList from '../pages/admin/OrdersList'
import OrderDetail from '../pages/admin/OrderDetail'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/painting/:slug" element={<PaintingDetail />} />
      <Route path="/order/:slug" element={<Order />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/paintings" element={<AdminRoute><PaintingsList /></AdminRoute>} />
      <Route path="/admin/paintings/new" element={<AdminRoute><PaintingForm /></AdminRoute>} />
      <Route path="/admin/paintings/:id/edit" element={<AdminRoute><PaintingForm /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><OrdersList /></AdminRoute>} />
      <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetail /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
