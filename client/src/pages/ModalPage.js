import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const ModalPage = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    groupSize: 1,
    preferences: {}
  });
  const [teeTimeData, setTeeTimeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teeTimeInfo = {
      platformId: params.get('platformId'),
      courseName: params.get('courseName'),
      teeTime: params.get('teeTime'),
      holes: params.get('holes'),
      capacity: params.get('capacity'),
      cost: params.get('cost'),
      bookingUrl: params.get('bookingUrl')
    };
    
    if (!teeTimeInfo.platformId || !teeTimeInfo.teeTime) {
      setError('Invalid tee time information');
    } else {
      setTeeTimeData(teeTimeInfo);
    }
    
    setLoading(false);
  }, [location]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: value
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Move to next step or submit
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the request
      console.log('Submitting request:', { ...formData, teeTimeData });
      // API call would go here
      setStep(5); // Success step
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Contact Information</h4>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Next
              </Button>
            </div>
          </Form>
        );
        
      case 2:
        return (
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Golf Preferences</h4>
            <Form.Group className="mb-3">
              <Form.Label>Experience Level</Form.Label>
              <Form.Select
                name="golfExperience"
                value={formData.preferences.golfExperience || ''}
                onChange={handlePreferenceChange}
                required
              >
                <option value="">Select Experience Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pace of Play</Form.Label>
              <Form.Select
                name="paceOfPlay"
                value={formData.preferences.paceOfPlay || ''}
                onChange={handlePreferenceChange}
                required
              >
                <option value="">Select Pace</option>
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="quick">Quick</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </div>
          </Form>
        );
        
      case 3:
        return (
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Group Size</h4>
            <Form.Group className="mb-3">
              <Form.Label>How many players in your group?</Form.Label>
              <Form.Select
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 player</option>
                <option value="2">2 players</option>
                <option value="3">3 players</option>
                <option value="4">4 players</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </div>
          </Form>
        );
        
      case 4:
        return (
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Review & Confirm</h4>
            <Card className="mb-3">
              <Card.Body>
                <h5>{teeTimeData?.courseName}</h5>
                <p className="mb-1">Date/Time: {teeTimeData?.teeTime}</p>
                <p className="mb-1">Holes: {teeTimeData?.holes}</p>
                <p className="mb-1">Price: ${teeTimeData?.cost}</p>
                <p className="mb-1">Group Size: {formData.groupSize} player(s)</p>
              </Card.Body>
            </Card>
            <p className="mb-3">
              By clicking "Submit Request", you agree to be matched with other golfers
              for this tee time. You'll be notified when a match is found.
            </p>
            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button variant="success" type="submit">
                Submit Request
              </Button>
            </div>
          </Form>
        );
        
      case 5:
        return (
          <div className="text-center py-4">
            <div className="mb-3">
              <i className="fas fa-check-circle text-success fa-4x"></i>
            </div>
            <h4>Request Submitted!</h4>
            <p>
              We'll notify you when we find compatible golfers for your tee time.
              Check your email for confirmation.
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.parent.postMessage('close-modal', '*')}
            >
              Close
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Find Golf Partners</h3>
            </Card.Header>
            <Card.Body>
              <ProgressBar 
                now={(step / 5) * 100} 
                className="mb-4" 
                variant="success"
              />
              
              {renderStepContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModalPage; 