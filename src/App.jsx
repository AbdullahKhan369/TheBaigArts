import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AppRoutes from './routes/AppRoutes'
import IntroCurtain from './components/layout/IntroCurtain'

export default function App() {
  return (
    <HelmetProvider>
      <IntroCurtain />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  )
}
