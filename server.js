const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let events = [
  {
    id: '1',
    title: 'Tech Meetup: AI & Machine Learning',
    description: 'Join us for an evening of AI discussions and networking with industry professionals.',
    date: '2026-02-20',
    time: '18:00',
    location: 'Tech Hub, Downtown',
    category: 'Technology',
    attendees: ['user1', 'user2'],
    maxAttendees: 50,
    organizer: 'John Doe',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Yoga in the Park',
    description: 'Free outdoor yoga session for all levels. Bring your own mat!',
    date: '2026-02-16',
    time: '08:00',
    location: 'Central Park',
    category: 'Health',
    attendees: ['user3'],
    maxAttendees: 30,
    organizer: 'Sarah Smith',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Local Art Exhibition',
    description: 'Showcase of local artists featuring paintings, sculptures, and mixed media.',
    date: '2026-02-25',
    time: '14:00',
    location: 'City Art Gallery',
    category: 'Arts',
    attendees: [],
    maxAttendees: 100,
    organizer: 'Art Community',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Coffee & Code',
    description: 'Casual coding session where developers meet to work on projects and share knowledge.',
    date: '2026-02-17',
    time: '10:00',
    location: 'The Coffee Lab',
    category: 'Technology',
    attendees: ['user1'],
    maxAttendees: 20,
    organizer: 'Dev Community',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Marathon Training Group',
    description: 'Weekly running group preparing for the spring marathon. All paces welcome!',
    date: '2026-02-15',
    time: '07:00',
    location: 'Riverside Trail',
    category: 'Sports',
    attendees: ['user2', 'user4', 'user5'],
    maxAttendees: 25,
    organizer: 'Runners Club',
    createdAt: new Date().toISOString()
  }
];

// GET all events with optional filters
app.get('/api/events', (req, res) => {
  let filteredEvents = [...events];
  
  const { category, search, date } = req.query;
  
  if (category && category !== 'all') {
    filteredEvents = filteredEvents.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  }
  
  if (date) {
    filteredEvents = filteredEvents.filter(event => event.date === date);
  }
  
  // Sort by date
  filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json(filteredEvents);
});

// GET single event
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// POST create new event
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, category, maxAttendees, organizer } = req.body;
  
  if (!title || !date || !time || !location || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newEvent = {
    id: Date.now().toString(),
    title,
    description: description || '',
    date,
    time,
    location,
    category,
    attendees: [],
    maxAttendees: maxAttendees || 50,
    organizer: organizer || 'Anonymous',
    createdAt: new Date().toISOString()
  };
  
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// POST join event
app.post('/api/events/:id/join', (req, res) => {
  const { userId } = req.body;
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.attendees.includes(userId)) {
    return res.status(400).json({ error: 'Already joined this event' });
  }
  
  if (event.attendees.length >= event.maxAttendees) {
    return res.status(400).json({ error: 'Event is full' });
  }
  
  event.attendees.push(userId);
  res.json(event);
});

// POST leave event
app.post('/api/events/:id/leave', (req, res) => {
  const { userId } = req.body;
  const event = events.find(e => e.id === req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const index = event.attendees.indexOf(userId);
  if (index === -1) {
    return res.status(400).json({ error: 'Not joined to this event' });
  }
  
  event.attendees.splice(index, 1);
  res.json(event);
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  events.splice(index, 1);
  res.json({ message: 'Event deleted successfully' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
