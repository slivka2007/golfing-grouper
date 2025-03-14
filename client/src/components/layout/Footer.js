import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <h5>GolfingGrouper</h5>
            <p className="text-muted">
              Find tee times and golf partners across multiple booking platforms.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light" title="Facebook">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="#" className="text-light" title="Twitter">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-light" title="Instagram">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-light" title="LinkedIn">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
            </div>
          </Col>
          
          <Col sm={6} lg={2} className="mb-4 mb-lg-0">
            <h5>Find Tee Times</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/search?location=California" className="text-decoration-none text-light">California</Link>
              </li>
              <li className="mb-2">
                <Link to="/search?location=Florida" className="text-decoration-none text-light">Florida</Link>
              </li>
              <li className="mb-2">
                <Link to="/search?location=Arizona" className="text-decoration-none text-light">Arizona</Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-decoration-none text-light">All Locations</Link>
              </li>
            </ul>
          </Col>
          
          <Col sm={6} lg={3} className="mb-4 mb-lg-0">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/#how-it-works" className="text-decoration-none text-light">How It Works</Link>
              </li>
              <li className="mb-2">
                <Link to="/#faq" className="text-decoration-none text-light">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/#golf-tips" className="text-decoration-none text-light">Golf Tips</Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-light">Blog</a>
              </li>
            </ul>
          </Col>
          
          <Col lg={3}>
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-light">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-light">Partner With Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-light">Terms of Service</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-light">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="mailto:support@golfinggrouper.com" className="text-decoration-none text-light">
                  <i className="fas fa-envelope me-2"></i>support@golfinggrouper.com
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} GolfingGrouper. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 