import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Calendar, MapPin, Users, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { createEvent, error, clearError } = useEvents();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    maxParticipants: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Event title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Event description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Event location is required';
    }
    
    if (!formData.date) {
      errors.date = 'Event date is required';
    } else {
      const eventDate = new Date(formData.date);
      const now = new Date();
      if (eventDate <= now) {
        errors.date = 'Event date must be in the future';
      }
    }
    
    if (!formData.maxParticipants) {
      errors.maxParticipants = 'Maximum participants is required';
    } else {
      const maxParticipants = parseInt(formData.maxParticipants);
      if (isNaN(maxParticipants) || maxParticipants < 1) {
        errors.maxParticipants = 'Maximum participants must be at least 1';
      } else if (maxParticipants > 1000) {
        errors.maxParticipants = 'Maximum participants cannot exceed 1000';
      }
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      await createEvent({
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants)
      });
      
      // Success - redirect to events list
      navigate('/');
    } catch (err) {
      // Error is handled by context
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={28} />
          Create New Event
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Fill in the details below to create your event and start gathering participants.
        </p>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter a catchy title for your event"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
            />
            {formErrors.title && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                {formErrors.title}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {formData.title.length}/100 characters
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Description *
            </label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe your event in detail. What can participants expect?"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
            />
            {formErrors.description && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                {formErrors.description}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Location *
            </label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="Where will your event take place?"
              value={formData.location}
              onChange={handleInputChange}
              maxLength={100}
            />
            {formErrors.location && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                {formErrors.location}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleInputChange}
              min={getMinDateTime()}
            />
            {formErrors.date && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                {formErrors.date}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Maximum Participants *
            </label>
            <input
              type="number"
              name="maxParticipants"
              className="form-input"
              placeholder="How many people can join?"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              max="1000"
            />
            {formErrors.maxParticipants && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                {formErrors.maxParticipants}
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creating...
                </>
              ) : (
                <>
                  <Calendar size={16} />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Card */}
      {(formData.title || formData.description || formData.location || formData.date) && (
        <div className="card" style={{ maxWidth: '600px', margin: '24px auto 0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ marginBottom: '16px', color: '#6b7280' }}>Preview</h3>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '8px' }}>
              {formData.title || 'Event Title'}
            </h4>
            <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '14px' }}>
              {formData.description || 'Event description will appear here...'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
              {formData.date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} />
                  {new Date(formData.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
              {formData.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} />
                  {formData.location}
                </div>
              )}
              {formData.maxParticipants && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} />
                  0/{formData.maxParticipants} participants
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;