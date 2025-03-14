import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
  });
  
  // Golf preferences data
  const [preferencesData, setPreferencesData] = useState({
    golfExperience: '',
    handicap: '',
    averageScore: '',
    paceOfPlay: '',
    preferredTees: [],
    preferredTime: [],
    maxPrice: ''
  });
  
  // User booking history (mock data)
  const [bookings, setBookings] = useState([]);
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Mock API call to fetch user data
    setTimeout(() => {
      // Get basic info from localStorage (this would come from API in real implementation)
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || '';
      const [firstName, lastName] = name.split(' ');
      
      // Mock data
      setProfileData({
        firstName: firstName || 'John',
        lastName: lastName || 'Doe',
        email: email || 'john.doe@example.com',
        zipCode: '90210',
      });
      
      setPreferencesData({
        golfExperience: 'intermediate',
        handicap: '15.4',
        averageScore: '85',
        paceOfPlay: 'moderate',
        preferredTees: ['white', 'blue'],
        preferredTime: ['morning', 'afternoon'],
        maxPrice: '100'
      });
      
      setBookings([
        {
          id: 'BK001',
          date: '2023-06-15',
          time: '8:00 AM',
          courseName: 'Pine Hills Golf Club',
          status: 'completed',
          players: 4,
          price: 75.00
        },
        {
          id: 'BK002',
          date: '2023-06-28',
          time: '9:30 AM',
          courseName: 'Oakwood Country Club',
          status: 'confirmed',
          players: 3,
          price: 95.00
        },
        {
          id: 'BK003',
          date: '2023-07-10',
          time: '2:00 PM',
          courseName: 'Lakeside Golf Course',
          status: 'pending',
          players: 2,
          price: 65.00
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [navigate]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle arrays for multi-select options
      const arrayField = name.split('-')[0]; // e.g., "preferredTees-white" -> "preferredTees"
      const arrayValue = name.split('-')[1]; // e.g., "preferredTees-white" -> "white"
      
      if (checked) {
        setPreferencesData({
          ...preferencesData,
          [arrayField]: [...preferencesData[arrayField], arrayValue]
        });
      } else {
        setPreferencesData({
          ...preferencesData,
          [arrayField]: preferencesData[arrayField].filter(item => item !== arrayValue)
        });
      }
    } else {
      setPreferencesData({
        ...preferencesData,
        [name]: value
      });
    }
  };
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    
    // Mock API call to save profile data
    setTimeout(() => {
      console.log('Saving profile data:', profileData);
      
      // Update localStorage with new name and email
      localStorage.setItem('userName', `${profileData.firstName} ${profileData.lastName}`);
      localStorage.setItem('userEmail', profileData.email);
      
      setSaveLoading(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    
    // Mock API call to save preferences data
    setTimeout(() => {
      console.log('Saving preferences data:', preferencesData);
      
      setSaveLoading(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const handleLogout = () => {
    // Clear local storage and navigate to home page
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile data...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">My Account</h1>
      
      <Tab.Container id="profile-tabs" activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="preferences">Golf Preferences</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bookings">Booking History</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <hr />
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-danger" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9}>
            {saveSuccess && (
              <Alert variant="success" className="mb-4">
                Your changes have been saved successfully!
              </Alert>
            )}
            
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            
            <Tab.Content>
              {/* Profile Tab */}
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Header>
                    <h3 className="h5 mb-0">Personal Information</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSaveProfile}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleProfileChange}
                          maxLength={5}
                        />
                        <Form.Text className="text-muted">
                          This helps us find golf courses near you.
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Preferences Tab */}
              <Tab.Pane eventKey="preferences">
                <Card>
                  <Card.Header>
                    <h3 className="h5 mb-0">Golf Preferences</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSavePreferences}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Experience Level</Form.Label>
                            <Form.Select
                              name="golfExperience"
                              value={preferencesData.golfExperience}
                              onChange={handlePreferencesChange}
                            >
                              <option value="">Select experience level</option>
                              <option value="beginner">Beginner (learning the game)</option>
                              <option value="intermediate">Intermediate (play occasionally)</option>
                              <option value="advanced">Advanced (play regularly)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pace of Play</Form.Label>
                            <Form.Select
                              name="paceOfPlay"
                              value={preferencesData.paceOfPlay}
                              onChange={handlePreferencesChange}
                            >
                              <option value="">Select preferred pace</option>
                              <option value="relaxed">Relaxed (enjoying the game)</option>
                              <option value="moderate">Moderate (keeping pace)</option>
                              <option value="quick">Quick (ready to play)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Handicap (optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="handicap"
                              value={preferencesData.handicap}
                              onChange={handlePreferencesChange}
                              placeholder="e.g., 15.4"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Average Score (optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="averageScore"
                              value={preferencesData.averageScore}
                              onChange={handlePreferencesChange}
                              placeholder="e.g., 85"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Tee Boxes</Form.Label>
                        <div>
                          {['red', 'gold', 'white', 'blue', 'black'].map(tee => (
                            <Form.Check
                              key={tee}
                              inline
                              type="checkbox"
                              id={`tee-${tee}`}
                              label={tee.charAt(0).toUpperCase() + tee.slice(1)}
                              name={`preferredTees-${tee}`}
                              checked={preferencesData.preferredTees.includes(tee)}
                              onChange={handlePreferencesChange}
                            />
                          ))}
                        </div>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Time of Day</Form.Label>
                        <div>
                          {[
                            { id: 'morning', label: 'Morning (before 12PM)' },
                            { id: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
                            { id: 'evening', label: 'Evening (after 5PM)' }
                          ].map(time => (
                            <Form.Check
                              key={time.id}
                              type="checkbox"
                              id={`time-${time.id}`}
                              label={time.label}
                              name={`preferredTime-${time.id}`}
                              checked={preferencesData.preferredTime.includes(time.id)}
                              onChange={handlePreferencesChange}
                            />
                          ))}
                        </div>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Maximum Price Per Round</Form.Label>
                        <Form.Select
                          name="maxPrice"
                          value={preferencesData.maxPrice}
                          onChange={handlePreferencesChange}
                        >
                          <option value="">No preference</option>
                          <option value="50">Under $50</option>
                          <option value="75">Under $75</option>
                          <option value="100">Under $100</option>
                          <option value="150">Under $150</option>
                          <option value="200">Under $200</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Saving...' : 'Save Preferences'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Bookings Tab */}
              <Tab.Pane eventKey="bookings">
                <Card>
                  <Card.Header>
                    <h3 className="h5 mb-0">Booking History</h3>
                  </Card.Header>
                  <Card.Body>
                    {bookings.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="mb-0">You don't have any bookings yet.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Course</th>
                              <th>Players</th>
                              <th>Price</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map(booking => (
                              <tr key={booking.id}>
                                <td>{booking.date}</td>
                                <td>{booking.time}</td>
                                <td>{booking.courseName}</td>
                                <td>{booking.players}</td>
                                <td>${booking.price.toFixed(2)}</td>
                                <td>
                                  <span className={`badge bg-${
                                    booking.status === 'completed' ? 'secondary' :
                                    booking.status === 'confirmed' ? 'success' :
                                    'warning'
                                  }`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default ProfilePage; 