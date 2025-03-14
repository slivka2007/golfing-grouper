import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
  });
  const [filters, setFilters] = useState({
    holes: 'all',
    priceRange: 'all',
    timeOfDay: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teeTimes, setTeeTimes] = useState([]);

  // Parse query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const dateParam = params.get('date');

    if (locationParam && dateParam) {
      setSearchParams({
        location: locationParam,
        date: dateParam,
      });
      fetchTeeTimes(locationParam, dateParam);
    } else {
      setLoading(false);
      setError('Please provide a location and date to search for tee times.');
    }
  }, [location.search]);

  // Mock function to fetch tee times - in a real implementation, this would call your API
  const fetchTeeTimes = (location, date) => {
    setLoading(true);
    setError(null);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for testing
      const mockTeeTimes = [
        {
          id: '1',
          platformId: '1',
          platformName: 'GolfNow',
          courseName: 'Pine Hills Golf Club',
          courseLocation: 'Los Angeles, CA',
          dateTime: `${date}T08:00:00`,
          formattedTime: '8:00 AM',
          holes: 18,
          price: 75.00,
          capacity: 4,
          bookingUrl: 'https://example.com/book/123',
        },
        {
          id: '2',
          platformId: '1',
          platformName: 'GolfNow',
          courseName: 'Pine Hills Golf Club',
          courseLocation: 'Los Angeles, CA',
          dateTime: `${date}T09:30:00`,
          formattedTime: '9:30 AM',
          holes: 18,
          price: 85.00,
          capacity: 4,
          bookingUrl: 'https://example.com/book/124',
        },
        {
          id: '3',
          platformId: '2',
          platformName: 'TeeOff',
          courseName: 'Oakwood Country Club',
          courseLocation: 'Los Angeles, CA',
          dateTime: `${date}T10:00:00`,
          formattedTime: '10:00 AM',
          holes: 9,
          price: 45.00,
          capacity: 4,
          bookingUrl: 'https://example.com/book/125',
        },
        {
          id: '4',
          platformId: '2',
          platformName: 'TeeOff',
          courseName: 'Oakwood Country Club',
          courseLocation: 'Los Angeles, CA',
          dateTime: `${date}T11:30:00`,
          formattedTime: '11:30 AM',
          holes: 18,
          price: 95.00,
          capacity: 4,
          bookingUrl: 'https://example.com/book/126',
        },
        {
          id: '5',
          platformId: '3',
          platformName: 'Supreme Golf',
          courseName: 'Lakeside Golf Course',
          courseLocation: 'Los Angeles, CA',
          dateTime: `${date}T14:00:00`,
          formattedTime: '2:00 PM',
          holes: 18,
          price: 65.00,
          capacity: 4,
          bookingUrl: 'https://example.com/book/127',
        },
      ];

      setTeeTimes(mockTeeTimes);
      setLoading(false);
    }, 1500);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = (teeTimesList) => {
    return teeTimesList.filter(teeTime => {
      // Filter by holes
      if (filters.holes !== 'all' && teeTime.holes.toString() !== filters.holes) {
        return false;
      }

      // Filter by price range
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          if (teeTime.price < min || teeTime.price > max) {
            return false;
          }
        } else {
          // Handle "100+" case
          if (teeTime.price < min) {
            return false;
          }
        }
      }

      // Filter by time of day
      if (filters.timeOfDay !== 'all') {
        const hour = new Date(teeTime.dateTime).getHours();
        
        if (filters.timeOfDay === 'morning' && hour >= 12) {
          return false;
        } else if (filters.timeOfDay === 'afternoon' && (hour < 12 || hour >= 17)) {
          return false;
        } else if (filters.timeOfDay === 'evening' && hour < 17) {
          return false;
        }
      }

      return true;
    });
  };

  const handleGroupButton = (teeTime) => {
    navigate(`/tee-time/${teeTime.id}`, { state: { teeTime } });
  };

  // Apply filters to tee times
  const filteredTeeTimes = applyFilters(teeTimes);

  return (
    <Container>
      <h1 className="mb-4">Tee Time Search Results</h1>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>
              <strong>Search Criteria</strong>
            </Card.Header>
            <Card.Body>
              <p><strong>Location:</strong> {searchParams.location}</p>
              <p><strong>Date:</strong> {searchParams.date}</p>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
                onClick={() => navigate('/')}
              >
                New Search
              </Button>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <strong>Filter Results</strong>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Holes</Form.Label>
                  <Form.Select 
                    name="holes" 
                    value={filters.holes}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="9">9 Holes</option>
                    <option value="18">18 Holes</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Form.Select 
                    name="priceRange" 
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="0-50">Under $50</option>
                    <option value="50-75">$50 - $75</option>
                    <option value="75-100">$75 - $100</option>
                    <option value="100-">$100+</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Time of Day</Form.Label>
                  <Form.Select 
                    name="timeOfDay" 
                    value={filters.timeOfDay}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="morning">Morning (before 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (after 5PM)</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Searching multiple booking platforms...</p>
            </div>
          ) : error ? (
            <Alert variant="warning">{error}</Alert>
          ) : filteredTeeTimes.length === 0 ? (
            <Alert variant="info">
              No tee times found matching your search criteria. Try adjusting your filters or search for a different date/location.
            </Alert>
          ) : (
            <>
              <p className="mb-3">Found {filteredTeeTimes.length} tee times from {new Set(filteredTeeTimes.map(t => t.platformName)).size} platforms.</p>
              
              {filteredTeeTimes.map((teeTime) => (
                <Card key={teeTime.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-0">{teeTime.courseName}</h5>
                          <span className="badge bg-secondary ms-2">{teeTime.platformName}</span>
                        </div>
                        <p className="mb-1 text-muted">{teeTime.courseLocation}</p>
                        <div className="d-flex align-items-center mt-3">
                          <div className="me-4">
                            <strong>{teeTime.formattedTime}</strong>
                          </div>
                          <div className="me-4">
                            <span>{teeTime.holes} Holes</span>
                          </div>
                          <div>
                            <span className="text-success fw-bold">${teeTime.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="d-flex align-items-center justify-content-end">
                        <div className="d-grid gap-2 w-100">
                          <Button 
                            variant="success" 
                            onClick={() => handleGroupButton(teeTime)}
                          >
                            Find Group
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            href={teeTime.bookingUrl} 
                            target="_blank"
                          >
                            Book Directly
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage; 