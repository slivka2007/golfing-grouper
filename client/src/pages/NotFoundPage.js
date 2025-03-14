import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-5">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage; 