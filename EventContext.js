import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eventAPI } from '../services/api';

const EventContext = createContext();

const initialState = {
  events: [],
  loading: false,
  error: null,
  filters: {
    location: '',
    search: ''
  }
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false, error: null };
    
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Load events
  const loadEvents = async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await eventAPI.getEvents(filters);
      dispatch({ type: 'SET_EVENTS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to load events' });
    }
  };

  // Create event
  const createEvent = async (eventData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await eventAPI.createEvent(eventData);
      dispatch({ type: 'ADD_EVENT', payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create event' });
      throw error;
    }
  };

  // Join event
  const joinEvent = async (eventId) => {
    try {
      const response = await eventAPI.joinEvent(eventId);
      dispatch({ type: 'UPDATE_EVENT', payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to join event' });
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await eventAPI.deleteEvent(eventId);
      dispatch({ type: 'DELETE_EVENT', payload: eventId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete event' });
      throw error;
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const value = {
    ...state,
    loadEvents,
    createEvent,
    joinEvent,
    deleteEvent,
    setFilters,
    clearError
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};