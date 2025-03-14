import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Check authentication status on component mount and route change
  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedName = localStorage.getItem('userName') || '';
    
    setIsAuthenticated(authStatus);
    setUserName(storedName);
  }, [location.pathname]);
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // Update state
    setIsAuthenticated(false);
    setUserName('');
    
    // Navigate to home
    navigate('/');
  };
  
  // Function to handle smooth scrolling to sections on the homepage
  const scrollToSection = (sectionId) => {
    // Check if we're on the homepage
    if (location.pathname !== '/') {
      // Navigate to homepage with the section hash
      navigate(`/#${sectionId}`);
    } else {
      // We're already on the homepage, just scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <i className="fas fa-golf-ball me-2"></i>
            GolfingGrouper
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/search">
              <Nav.Link>Find Tee Times</Nav.Link>
            </LinkContainer>
            
            <Nav.Link onClick={() => scrollToSection('how-it-works')}>
              How It Works
            </Nav.Link>
            
            <NavDropdown title="Resources" id="resources-dropdown">
              <NavDropdown.Item onClick={() => scrollToSection('golf-tips')}>
                Golf Tips
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => scrollToSection('faq')}>
                FAQ
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://partners.golfinggrouper.com" target="_blank">
                Partner With Us
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={userName || 'My Account'} 
                id="user-dropdown"
                align="end"
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/profile?tab=preferences">
                  <NavDropdown.Item>Golf Preferences</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/profile?tab=bookings">
                  <NavDropdown.Item>Booking History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="success" className="ms-2">Sign Up</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 