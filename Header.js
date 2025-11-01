import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              textDecoration: 'none',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}
          >
            <Calendar size={32} />
            Mini Event Finder
          </Link>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link 
              to="/" 
              className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Home size={16} />
              Events
            </Link>
            <Link 
              to="/create" 
              className={`btn ${location.pathname === '/create' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                backgroundColor: location.pathname === '/create' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;