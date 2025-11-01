import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Search, MapPin, Calendar, Users, Filter } from 'lucide-react';

const EventList = () => {
  const { events, loading, error, loadEvents, filters, setFilters, clearError } = useEvents();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(localFilters);
    loadEvents(localFilters);
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const emptyFilters = { location: '', search: '' };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    loadEvents(emptyFilters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailabilityColor = (current, max) => {
    const ratio = current / max;
    if (ratio >= 0.9) return '#ef4444'; // Red - almost full
    if (ratio >= 0.7) return '#f59e0b'; // Orange - getting full
    return '#10b981'; // Green - available
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="loading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading events...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="card mb-6">
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={24} />
          Find Events
        </h2>
        
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '16px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Search size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Search Events
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title or description..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Location
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by location..."
                value={localFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Discover Events</h1>
        <span className="text-gray-500">
          {events.length} event{events.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Calendar size={48} style={{ margin: '0 auto 16px', color: '#9ca3af' }} />
          <h3 style={{ marginBottom: '8px', color: '#6b7280' }}>No events found</h3>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            {filters.search || filters.location 
              ? 'Try adjusting your search filters' 
              : 'Be the first to create an event!'
            }
          </p>
          <Link to="/create" className="btn btn-primary">
            <Plus size={16} />
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {events.map((event) => (
            <div key={event.id} className="card" style={{ position: 'relative' }}>
              {/* Availability indicator */}
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getAvailabilityColor(event.currentParticipants, event.maxParticipants)
                }}
                title={`${event.maxParticipants - event.currentParticipants} spots available`}
              />
              
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>
                <Link 
                  to={`/events/${event.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {event.title}
                </Link>
              </h3>
              
              <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                {event.description.length > 120 
                  ? `${event.description.substring(0, 120)}...` 
                  : event.description
                }
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Calendar size={16} />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <MapPin size={16} />
                  <span className="text-sm">{event.location}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <Users size={16} />
                  <span className="text-sm">
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={`/events/${event.id}`} className="btn btn-primary">
                  View Details
                </Link>
                
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: event.currentParticipants >= event.maxParticipants ? '#fef2f2' : '#f0fdf4',
                  color: event.currentParticipants >= event.maxParticipants ? '#dc2626' : '#16a34a'
                }}>
                  {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Available'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;