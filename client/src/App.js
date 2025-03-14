import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TeeTimePage from './pages/TeeTimePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Embedding Integration
import ModalPage from './pages/ModalPage';

/**
 * MainLayout - Wraps routes with header and footer
 * @param {Object} props - Component props
 * @returns {JSX.Element} Layout with header, content area, and footer
 */
const MainLayout = ({ children }) => (
  <>
    <Header />
    <Container className="py-4 flex-grow-1">
      {children}
    </Container>
    <Footer />
  </>
);

/**
 * App - Main application component with routing configuration
 * 
 * The application has two distinct layouts:
 * 1. ModalPage - Rendered without header/footer for embedding in iframes
 * 2. Main application routes - Rendered with header and footer
 * 
 * @returns {JSX.Element} The complete application with routing
 */
function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          {/* Special route for embedding in partner websites */}
          <Route path="/modal" element={<ModalPage />} />
          
          {/* Main application routes with standard layout */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
          <Route path="/tee-time/:id" element={<MainLayout><TeeTimePage /></MainLayout>} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
          <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
          
          {/* Protected routes - require authentication */}
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          
          {/* Error and fallback routes */}
          <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 