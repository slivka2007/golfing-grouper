import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock login logic - would call API in real implementation
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful login
      // In a real app, this would validate credentials with the backend
      console.log('Login attempt with:', formData);
      
      if (formData.email && formData.password) {
        // Success - store auth info in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Redirect to homepage or intended destination
        navigate('/');
      } else {
        setError('Please enter both email and password.');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Login</h2>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
                <p className="mt-2">
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>Forgot Password?</a>
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <div className="mt-4 text-center">
            <h5>Demo Accounts</h5>
            <p className="text-muted">For testing, you can use any email/password combination</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage; 