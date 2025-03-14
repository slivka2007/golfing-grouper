import React from 'react';
import { Container, Row, Col, Card, Button, Form, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    const location = e.target.elements.location.value;
    const date = e.target.elements.date.value;
    
    navigate(`/search?location=${location}&date=${date}`);
  };
  
  return (
    <>
      <Container>
        {/* Hero Section */}
        <Row className="py-5 text-center">
          <Col>
            <h1 className="display-4 fw-bold">Find Golf Partners & Tee Times</h1>
            <p className="lead mb-4">
              Search across multiple booking platforms, match with compatible golfers, and book your perfect tee time.
            </p>
            
            <Card className="p-4 shadow mx-auto" style={{ maxWidth: '800px' }}>
              <Form onSubmit={handleSearch}>
                <Row className="g-3">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="location" 
                        placeholder="City, State or ZIP Code"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="success" 
                      type="submit" 
                      className="w-100"
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        
        {/* Features Section */}
        <Row className="py-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-search fa-3x text-primary"></i>
                </div>
                <Card.Title>Search Multiple Platforms</Card.Title>
                <Card.Text>
                  Find available tee times from various booking websites in one place.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-users fa-3x text-success"></i>
                </div>
                <Card.Title>Match With Golfers</Card.Title>
                <Card.Text>
                  Connect with compatible players based on preferences and experience.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-calendar-check fa-3x text-danger"></i>
                </div>
                <Card.Title>Book Automatically</Card.Title>
                <Card.Text>
                  Once matched, we'll handle the booking process for you.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* How It Works Section */}
        <Row className="py-5" id="how-it-works">
          <Col className="text-center mb-4">
            <h2 className="fw-bold">How It Works</h2>
            <p className="lead">Finding golf partners has never been easier</p>
          </Col>
        </Row>
        
        <Row className="mb-5">
          <Col md={3} className="mb-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: '80px', height: '80px'}}>
              <h3 className="m-0">1</h3>
            </div>
            <h4>Search for Tee Times</h4>
            <p>Enter your location and preferred date to see available tee times across multiple platforms.</p>
          </Col>
          
          <Col md={3} className="mb-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: '80px', height: '80px'}}>
              <h3 className="m-0">2</h3>
            </div>
            <h4>Create Your Profile</h4>
            <p>Set up your golfer profile with your handicap, playing style, and preferences.</p>
          </Col>
          
          <Col md={3} className="mb-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: '80px', height: '80px'}}>
              <h3 className="m-0">3</h3>
            </div>
            <h4>Join or Start a Group</h4>
            <p>Join an existing group with open spots or start your own to attract other golfers.</p>
          </Col>
          
          <Col md={3} className="mb-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: '80px', height: '80px'}}>
              <h3 className="m-0">4</h3>
            </div>
            <h4>Confirm & Play</h4>
            <p>Once your group is complete, we'll confirm the booking and you're ready to play!</p>
          </Col>
        </Row>
        
        {/* Testimonials Section */}
        <Row className="py-5 bg-light rounded">
          <Col className="text-center mb-4">
            <h2 className="fw-bold">What Golfers Say</h2>
            <p className="lead">Don't just take our word for it</p>
          </Col>
        </Row>
        
        <Row className="pb-5 bg-light rounded">
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-warning">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <Card.Text className="mb-3">
                  "I was new to the area and looking for golf partners. GolfingGrouper made it easy to meet other players and book tee times without any hassle."
                </Card.Text>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="fw-bold">JD</span>
                  </div>
                  <div>
                    <h5 className="mb-0">John D.</h5>
                    <small className="text-muted">15 handicap</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-warning">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <Card.Text className="mb-3">
                  "I've been using GolfingGrouper for 6 months and have met some great people to golf with. The platform is so intuitive and the matching system works perfectly."
                </Card.Text>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="fw-bold">SM</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Sarah M.</h5>
                    <small className="text-muted">22 handicap</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-3 text-warning">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <Card.Text className="mb-3">
                  "As a single player, I always struggled to book foursomes. GolfingGrouper solved that problem completely. Now I golf every weekend with new friends."
                </Card.Text>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="fw-bold">RT</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Robert T.</h5>
                    <small className="text-muted">8 handicap</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* FAQ Section */}
        <Row className="py-5" id="faq">
          <Col className="text-center mb-4">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
            <p className="lead">Get answers to common questions about GolfingGrouper</p>
          </Col>
          
          <Col lg={8} className="mx-auto">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>How does GolfingGrouper work?</Accordion.Header>
                <Accordion.Body>
                  GolfingGrouper works by aggregating tee times from multiple booking platforms and allowing users to create or join groups for these times. You can search for available tee times, create a profile with your preferences, and either join an existing group or create your own. Once a group is complete, we handle the booking process automatically.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
                <Accordion.Header>Is GolfingGrouper free to use?</Accordion.Header>
                <Accordion.Body>
                  Basic membership to GolfingGrouper is completely free. This allows you to search for tee times and join existing groups. We offer a premium tier that provides additional features like priority matching, advanced statistics, and exclusive discounts at partner courses.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2">
                <Accordion.Header>What happens if I need to cancel?</Accordion.Header>
                <Accordion.Body>
                  You can cancel your spot in a group up to 24 hours before the tee time without any penalty. Cancellations within 24 hours may be subject to the golf course's cancellation policy. We'll automatically notify other group members and try to fill your spot.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="3">
                <Accordion.Header>How does player matching work?</Accordion.Header>
                <Accordion.Body>
                  Our matching algorithm considers factors like playing ability (handicap), pace of play preferences, playing style, and social factors to suggest compatible golf partners. The more you use the platform, the better our recommendations become as we learn your preferences.
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="4">
                <Accordion.Header>Which golf booking platforms do you support?</Accordion.Header>
                <Accordion.Body>
                  We currently support major booking platforms including GolfNow, TeeOff, Supreme Golf, and many course-specific booking systems. We're constantly adding new platforms to provide you with the most comprehensive tee time availability.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        
        {/* Golf Tips Section */}
        <Row className="py-5 bg-light rounded" id="golf-tips">
          <Col className="text-center mb-4">
            <h2 className="fw-bold">Golf Tips & Resources</h2>
            <p className="lead">Improve your game with these helpful resources</p>
          </Col>
        </Row>
        
        <Row className="pb-5 bg-light rounded">
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://placehold.co/600x400?text=Golf+Swing+Tips" />
              <Card.Body>
                <Card.Title>Perfect Your Swing</Card.Title>
                <Card.Text>
                  Learn the fundamentals of a good golf swing and common mistakes to avoid.
                </Card.Text>
                <Button variant="outline-primary" size="sm">Read More</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://placehold.co/600x400?text=Course+Etiquette" />
              <Card.Body>
                <Card.Title>Golf Etiquette Guide</Card.Title>
                <Card.Text>
                  A comprehensive guide to golf course etiquette for players of all levels.
                </Card.Text>
                <Button variant="outline-primary" size="sm">Read More</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img variant="top" src="https://placehold.co/600x400?text=Equipment+Guide" />
              <Card.Body>
                <Card.Title>Choosing the Right Equipment</Card.Title>
                <Card.Text>
                  Tips for selecting clubs, balls, and accessories that match your playing style.
                </Card.Text>
                <Button variant="outline-primary" size="sm">Read More</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* CTA Section */}
        <Row className="py-5 text-center bg-primary text-white rounded my-5">
          <Col>
            <h2 className="fw-bold">Ready to find your next golf match?</h2>
            <p className="lead mb-4">
              Create an account to save your preferences and get matched with other golfers.
            </p>
            <Button 
              variant="light" 
              size="lg"
              className="me-2"
              onClick={() => navigate('/register')}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outline-light" 
              size="lg"
              onClick={() => navigate('/search')}
            >
              Browse Tee Times
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage; 