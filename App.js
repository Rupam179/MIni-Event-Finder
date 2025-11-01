import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import CreateEvent from './components/CreateEvent';
import { EventProvider } from './context/EventContext';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/create" element={<CreateEvent />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;