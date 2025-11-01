const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for events
let events = [
  {
    id: uuidv4(),
    title: "Tech Meetup Mumbai",
    description: "Join us for an exciting tech meetup discussing the latest in AI and web development",
    location: "Mumbai, Maharashtra",
    date: "2024-01-15T18:00:00Z",
    maxParticipants: 50,
    currentParticipants: 23,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors",
    location: "Bangalore, Karnataka",
    date: "2024-01-20T19:30:00Z",
    maxParticipants: 100,
    currentParticipants: 67,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: "Photography Workshop",
    description: "Learn professional photography techniques from industry experts",
    location: "Delhi, India",
    date: "2024-01-25T10:00:00Z",
    maxParticipants: 30,
    currentParticipants: 15,
    createdAt: new Date().toISOString()
  }
];

// Helper function to validate event data
const validateEvent = (eventData) => {
  const { title, description, location, date, maxParticipants } = eventData;
  
  if (!title || !description || !location || !date || !maxParticipants) {
    return { isValid: false, message: 'All fields are required' };
  }
  
  if (maxParticipants < 1) {
    return { isValid: false, message: 'Max participants must be at least 1' };
  }
  
  if (new Date(date) < new Date()) {
    return { isValid: false, message: 'Event date must be in the future' };
  }
  
  return { isValid: true };
};

// Routes

// GET /api/events - List all events with optional location filter
app.get('/api/events', (req, res) => {
  try {
    const { location, search } = req.query;
    let filteredEvents = [...events];
    
    // Filter by location if provided
    if (location) {
      filteredEvents = filteredEvents.filter(event => 
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Search in title and description if provided
    if (search) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      count: filteredEvents.length,
      data: filteredEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message
    });
  }
});

// GET /api/events/:id - Get event details
app.get('/api/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const event = events.find(e => e.id === id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event',
      error: error.message
    });
  }
});

// POST /api/events - Create an event
app.post('/api/events', (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate event data
    const validation = validateEvent(eventData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Create new event
    const newEvent = {
      id: uuidv4(),
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      location: eventData.location.trim(),
      date: eventData.date,
      maxParticipants: parseInt(eventData.maxParticipants),
      currentParticipants: 0,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating event',
      error: error.message
    });
  }
});

// PUT /api/events/:id/join - Join an event
app.put('/api/events/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const event = events.find(e => e.id === id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    event.currentParticipants += 1;
    
    res.json({
      success: true,
      message: 'Successfully joined the event',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while joining event',
      error: error.message
    });
  }
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const deletedEvent = events.splice(eventIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Event Finder API is running',
    timestamp: new Date().toISOString(),
    eventsCount: events.length
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Event Finder API running on port ${PORT}`);
  console.log(`📊 Currently managing ${events.length} events`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});