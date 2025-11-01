import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { eventAPI } from '../services/api';
import { Calendar, MapPin, Users, ArrowLeft, UserPlus, Trash2 } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { joinEvent, deleteEvent, clearError } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      setJoining(true);
      await joinEvent(id);
      // Reload event to get updated participant count
      await loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join event');
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteEvent(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventFull = event && event.currentParticipants >= event.maxParticipants;
  const isEventPast = event && new Date(event.date) < new Date();

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
            Loading event details...
          </div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
        <Link to="/" className="btn btn-secondary mt-4">
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Event not found</h3>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Events
          </Link>
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

      <div style={{ marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{event.title}</h1>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isEventPast && !isEventFull && (
              <button 
                onClick={handleJoinEvent}
                disabled={joining}
                className="btn btn-primary"
              >
                <UserPlus size={16} />
                {joining ? 'Joining...' : 'Join Event'}
              </button>
            )}
            
            <button 
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="btn btn-danger"
            >
              <Trash2 size={16} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Event Status */}
        <div style={{ marginBottom: '24px' }}>
          {isEventPast && (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              This event has already passed
            </div>
          )}
          
          {!isEventPast && isEventFull && (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontWeight: '500'
            }}>
              This event is full
            </div>
          )}
          
          {!isEventPast && !isEventFull && (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              fontWeight: '500'
            }}>
              {event.maxParticipants - event.currentParticipants} spots available
            </div>
          )}
        </div>

        {/* Event Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ marginBottom: '16px' }}>Event Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={20} style={{ color: '#6b7280' }} />
                <div>
                  <div style={{ fontWeight: '500' }}>Date & Time</div>
                  <div style={{ color: '#6b7280' }}>{formatDate(event.date)}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={20} style={{ color: '#6b7280' }} />
                <div>
                  <div style={{ fontWeight: '500' }}>Location</div>
                  <div style={{ color: '#6b7280' }}>{event.location}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={20} style={{ color: '#6b7280' }} />
                <div>
                  <div style={{ fontWeight: '500' }}>Participants</div>
                  <div style={{ color: '#6b7280' }}>
                    {event.currentParticipants} of {event.maxParticipants} joined
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '16px' }}>Participation</h3>
            
            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Capacity</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {Math.round((event.currentParticipants / event.maxParticipants) * 100)}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                  height: '100%',
                  backgroundColor: isEventFull ? '#ef4444' : '#10b981',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                Created on
              </div>
              <div style={{ fontWeight: '500' }}>
                {new Date(event.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Description</h3>
          <div style={{ 
            lineHeight: '1.6', 
            color: '#374151',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            {event.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;