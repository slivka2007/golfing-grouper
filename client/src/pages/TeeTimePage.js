import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const TeeTimePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [teeTime, setTeeTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    groupSize: 1,
    golfExperience: '',
    handicap: '',
    averageScore: '',
    paceOfPlay: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // If tee time was passed via location state
    if (location.state && location.state.teeTime) {
      setTeeTime(location.state.teeTime);
      setLoading(false);
    } else {
      // Otherwise fetch it by ID - mock implementation
      fetchTeeTimeById(id);
    }
  }, [id, location.state]);

  // Mock function to fetch tee time details
  const fetchTeeTimeById = (teeTimeId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for testing
      const mockTeeTime = {
        id: teeTimeId,
        platformId: '1',
        platformName: 'GolfNow',
        courseName: 'Pine Hills Golf Club',
        courseLocation: 'Los Angeles, CA',
        dateTime: '2023-06-15T08:00:00',
        formattedTime: '8:00 AM',
        formattedDate: 'June 15, 2023',
        holes: 18,
        price: 75.00,
        capacity: 4,
        bookingUrl: 'https://example.com/book/123',
        currentRequests: 2, // Mock data to show other interested golfers
      };
      
      setTeeTime(mockTeeTime);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit the request - would call API in real implementation
      console.log('Submitting join request:', { teeTimeId: id, ...formData });
      
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/search');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading tee time details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/search')}>
              Back to Search
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="text-center p-5">
            <div className="mb-4">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="mb-3">Request Submitted Successfully!</h2>
            <p className="lead mb-4">
              We'll notify you when we find compatible golfers for your tee time at {teeTime.courseName}.
            </p>
            <p className="mb-4">
              You'll receive an email notification when your group is formed.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <Row>
        <Col lg={7}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="mb-1">{teeTime.courseName}</h2>
                  <p className="text-muted mb-2">{teeTime.courseLocation}</p>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-secondary me-2">{teeTime.platformName}</span>
                    <span className="badge bg-info">{teeTime.holes} Holes</span>
                  </div>
                </div>
                <div className="text-end">
                  <h3 className="text-success mb-0">${teeTime.price.toFixed(2)}</h3>
                  <small className="text-muted">per player</small>
                </div>
              </div>
              
              <hr />
              
              <Row className="mb-3">
                <Col sm={6}>
                  <p className="mb-1"><strong>Date:</strong></p>
                  <p>{teeTime.formattedDate}</p>
                </Col>
                <Col sm={6}>
                  <p className="mb-1"><strong>Time:</strong></p>
                  <p>{teeTime.formattedTime}</p>
                </Col>
              </Row>
              
              <div className="mb-3">
                <p className="mb-1"><strong>Current Interest:</strong></p>
                <ProgressBar 
                  now={(teeTime.currentRequests / teeTime.capacity) * 100} 
                  variant="success" 
                  className="mb-2"
                />
                <small className="text-muted">
                  {teeTime.currentRequests} out of {teeTime.capacity} spots requested
                </small>
              </div>
              
              <div className="d-grid gap-2 d-md-flex mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/search')}
                >
                  Back to Search
                </Button>
                <Button 
                  variant="outline-primary" 
                  href={teeTime.bookingUrl} 
                  target="_blank"
                >
                  Book Directly
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h3 className="h5 mb-0">How It Works</h3>
            </Card.Header>
            <Card.Body>
              <ol className="mb-0">
                <li className="mb-2">Complete the form with your golf preferences</li>
                <li className="mb-2">Submit your request to join this tee time</li>
                <li className="mb-2">We'll match you with compatible golfers</li>
                <li className="mb-2">Once the group is formed, you'll receive a confirmation email</li>
                <li>Show up at the course and enjoy your round!</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header>
              <h3 className="h5 mb-0">Join This Tee Time</h3>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <ProgressBar now={(step / 3) * 100} variant="success" />
                <div className="d-flex justify-content-between mt-1">
                  <small>Group Info</small>
                  <small>Golf Experience</small>
                  <small>Confirm</small>
                </div>
              </div>
              
              <Form onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <h4 className="h6 mb-3">Step 1: Group Information</h4>
                    <Form.Group className="mb-3">
                      <Form.Label>How many players in your group?</Form.Label>
                      <Form.Select 
                        name="groupSize" 
                        value={formData.groupSize} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">1 player (just me)</option>
                        <option value="2">2 players</option>
                        <option value="3">3 players</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Maximum group size for this tee time is {teeTime.capacity}
                      </Form.Text>
                    </Form.Group>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <h4 className="h6 mb-3">Step 2: Golf Experience</h4>
                    <Form.Group className="mb-3">
                      <Form.Label>Experience Level</Form.Label>
                      <Form.Select 
                        name="golfExperience" 
                        value={formData.golfExperience} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select your experience level</option>
                        <option value="beginner">Beginner (learning the game)</option>
                        <option value="intermediate">Intermediate (play occasionally)</option>
                        <option value="advanced">Advanced (play regularly)</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Row>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Handicap (optional)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="handicap" 
                            value={formData.handicap} 
                            onChange={handleInputChange}
                            placeholder="e.g., 15.4"
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Average Score (optional)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="averageScore" 
                            value={formData.averageScore} 
                            onChange={handleInputChange}
                            placeholder="e.g., 85"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Pace of Play</Form.Label>
                      <Form.Select 
                        name="paceOfPlay" 
                        value={formData.paceOfPlay} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select your preferred pace</option>
                        <option value="relaxed">Relaxed (enjoying the game)</option>
                        <option value="moderate">Moderate (keeping pace)</option>
                        <option value="quick">Quick (ready to play)</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                )}
                
                {step === 3 && (
                  <>
                    <h4 className="h6 mb-3">Step 3: Confirm Request</h4>
                    <div className="mb-4">
                      <Card className="bg-light">
                        <Card.Body>
                          <h5 className="card-title">{teeTime.courseName}</h5>
                          <p className="mb-1">
                            <strong>Date/Time:</strong> {teeTime.formattedDate} at {teeTime.formattedTime}
                          </p>
                          <p className="mb-1">
                            <strong>Group Size:</strong> {formData.groupSize} player(s)
                          </p>
                          <p className="mb-1">
                            <strong>Experience Level:</strong> {formData.golfExperience}
                          </p>
                          <p className="mb-1">
                            <strong>Pace of Play:</strong> {formData.paceOfPlay}
                          </p>
                          <p className="mb-1">
                            <strong>Price:</strong> ${teeTime.price.toFixed(2)} per player
                          </p>
                        </Card.Body>
                      </Card>
                    </div>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Additional Notes (Optional)</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleInputChange}
                        placeholder="Anything else the other golfers should know?"
                      />
                    </Form.Group>
                    
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termsCheck"
                        required
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I understand that I'm requesting to join a group, and I'll be notified when matched with other golfers.
                      </label>
                    </div>
                  </>
                )}
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleBack}
                  >
                    {step === 1 ? 'Back to Details' : 'Back'}
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit"
                  >
                    {step < 3 ? 'Continue' : 'Submit Request'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeeTimePage; 