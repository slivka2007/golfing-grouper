/**
 * GolfingGrouper Button Script
 * 
 * This script creates and manages the GolfingGrouper integration button on partner golf course websites.
 * It allows golfers to find playing partners for tee times displayed on booking platforms.
 * 
 * Usage:
 * 1. Add a div with class "golfing-grouper-button" to your tee time listings
 * 2. Add data attributes with tee time details:
 *    - data-platform-id: Your booking platform ID
 *    - data-course-name: Name of the golf course
 *    - data-tee-time: ISO datetime of the tee time
 *    - data-holes: Number of holes (9 or 18)
 *    - data-capacity: Maximum number of players
 *    - data-cost: Total cost for the tee time
 *    - data-booking-url: Direct URL to book this tee time
 * 
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Configuration constants with environment variable fallbacks
  const CONFIG = {
    // URLs will be dynamically replaced during build process
    API_URL: window.GG_API_URL || '{{API_URL}}' || 'https://api.golfinggrouper.com',
    MODAL_URL: window.GG_MODAL_URL || '{{MODAL_URL}}' || 'https://app.golfinggrouper.com/modal',
    BUTTON_TEXT: window.GG_BUTTON_TEXT || 'Find Golf Partners',
    DEBUG: window.GG_DEBUG === 'true' || '{{BUTTON_DEBUG_MODE}}' === 'true' || false
  };
  
  /**
   * Logger utility for debugging
   */
  const logger = {
    log: (message, ...args) => {
      if (CONFIG.DEBUG) console.log(`[GolfingGrouper] ${message}`, ...args);
    },
    error: (message, ...args) => {
      if (CONFIG.DEBUG) console.error(`[GolfingGrouper] Error: ${message}`, ...args);
    }
  };
  
  /**
   * Creates and injects the CSS styles for the button and modal
   * @returns {void}
   */
  const createStyles = () => {
    // Check if styles are already added
    if (document.getElementById('golfing-grouper-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'golfing-grouper-styles';
    style.textContent = `
      .golfing-grouper-button {
        display: inline-block;
        position: relative;
      }
      
      .golfing-grouper-btn {
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .golfing-grouper-btn:hover {
        background-color: #45a049;
      }
      
      .golfing-grouper-icon {
        margin-right: 8px;
        width: 20px;
        height: 20px;
      }
      
      .golfing-grouper-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      
      .golfing-grouper-modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 800px;
        height: 80%;
        position: relative;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .golfing-grouper-modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 10000;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #f1f1f1;
        transition: background-color 0.2s;
      }
      
      .golfing-grouper-modal-close:hover {
        background-color: #e1e1e1;
      }
      
      .golfing-grouper-iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
    logger.log('Styles injected');
  };
  
  /**
   * Creates and adds the button to a container element
   * @param {HTMLElement} container - The container element
   * @returns {void}
   */
  const createButton = (container) => {
    // Prevent duplicate buttons
    if (container.querySelector('.golfing-grouper-btn')) return;
    
    try {
      const button = document.createElement('button');
      button.className = 'golfing-grouper-btn';
      
      // Create icon
      const icon = document.createElement('span');
      icon.className = 'golfing-grouper-icon';
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>';
      
      // Add text
      const text = document.createTextNode(CONFIG.BUTTON_TEXT);
      
      button.appendChild(icon);
      button.appendChild(text);
      
      // Add click event
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(container);
      });
      
      container.appendChild(button);
      logger.log('Button created in container', container);
    } catch (error) {
      logger.error('Failed to create button', error);
    }
  };
  
  /**
   * Creates and opens the modal with tee time information
   * @param {HTMLElement} container - The container with data attributes
   * @returns {void}
   */
  const openModal = (container) => {
    try {
      // Validate required data attributes
      const requiredAttrs = ['data-platform-id', 'data-course-name', 'data-tee-time'];
      const missingAttrs = requiredAttrs.filter(attr => !container.hasAttribute(attr));
      
      if (missingAttrs.length > 0) {
        logger.error(`Missing required attributes: ${missingAttrs.join(', ')}`);
        return;
      }
      
      // Create modal container
      const modal = document.createElement('div');
      modal.className = 'golfing-grouper-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'golfing-grouper-modal-content';
      
      // Create close button
      const closeButton = document.createElement('div');
      closeButton.className = 'golfing-grouper-modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.className = 'golfing-grouper-iframe';
      
      // Get data attributes from container
      const platformId = container.getAttribute('data-platform-id');
      const courseName = container.getAttribute('data-course-name');
      const teeTime = container.getAttribute('data-tee-time');
      const holes = container.getAttribute('data-holes');
      const capacity = container.getAttribute('data-capacity');
      const cost = container.getAttribute('data-cost');
      const bookingUrl = container.getAttribute('data-booking-url');
      
      // Build iframe URL with query parameters
      const params = new URLSearchParams({
        platformId,
        courseName,
        teeTime,
        holes: holes || '18',
        capacity: capacity || '4',
        cost: cost || '0',
        bookingUrl: bookingUrl || '',
        timestamp: new Date().getTime() // Cache buster
      });
      
      iframe.src = `${CONFIG.MODAL_URL}?${params.toString()}`;
      
      // Set loading attributes
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('importance', 'high');
      
      // Add loading state
      iframe.onload = () => {
        logger.log('Modal iframe loaded');
      };
      
      // Assemble modal
      modalContent.appendChild(closeButton);
      modalContent.appendChild(iframe);
      modal.appendChild(modalContent);
      
      // Add modal to body
      document.body.appendChild(modal);
      logger.log('Modal opened', { platformId, courseName, teeTime });
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
      
      // Add keyboard event listener to close modal with Escape key
      const escapeHandler = (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    } catch (error) {
      logger.error('Failed to open modal', error);
    }
  };
  
  /**
   * Initializes the GolfingGrouper button integration
   * @returns {void}
   */
  const init = () => {
    try {
      // Log configuration on startup
      logger.log('Initializing with configuration', CONFIG);
      
      // Add styles
      createStyles();
      
      // Find all button containers
      const containers = document.querySelectorAll('.golfing-grouper-button');
      
      // Create buttons in each container
      containers.forEach(container => {
        createButton(container);
      });
      
      // Create a MutationObserver to watch for new button containers
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.nodeType === 1) { // Element node
                // Look for new containers within added nodes
                const containers = node.querySelectorAll('.golfing-grouper-button');
                containers.forEach(container => {
                  if (!container.querySelector('.golfing-grouper-btn')) {
                    createButton(container);
                  }
                });
                
                // Check if the node itself is a container
                if (node.matches && node.matches('.golfing-grouper-button') && !node.querySelector('.golfing-grouper-btn')) {
                  createButton(node);
                }
              }
            }
          }
        });
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      logger.log('GolfingGrouper button initialized');
    } catch (error) {
      logger.error('Initialization failed', error);
    }
  };
  
  // Run initialization when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose API for potential external use
  window.GolfingGrouper = {
    refresh: init,
    version: '1.0.0',
    config: {
      // Provide getters for configuration without exposing internal CONFIG object
      getApiUrl: () => CONFIG.API_URL,
      getModalUrl: () => CONFIG.MODAL_URL
    }
  };
})(); 