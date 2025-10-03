import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userPermissions');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isMenuOpen ? '' : 'collapsed'}`}>
        <button onClick={toggleMenu} className="toggle-menu-button">
          <i className={`fas ${isMenuOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
        </button>
        
        {isMenuOpen && <h1 className="logo-text">Dashboard</h1>}

        <nav className="menu-nav">
          <ul>
            <li data-tooltip="Home">
              <Link to="/dashboard" className="menu-item">
                <i className="fas fa-home"></i> <span>Home</span>
              </Link>
            </li>
            
            {/* O NOVO ITEM DE MENU QUE PRECISA SER ADICIONADO */}
            <li data-tooltip="Consultar Checklist">
              <Link to="/dashboard/consultar-checklist" className="menu-item">
                <i className="fas fa-clipboard-list"></i> <span>Consultar Checklist</span>
              </Link>
            </li>

            <li data-tooltip="Consultar Pedido">
              <Link to="/dashboard/consultar-pedido" className="menu-item">
                <i className="fas fa-search"></i> <span>Consultar Pedido</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="logout-button-wrapper" data-tooltip="Sair da conta">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Sair da conta</span>
          </button>
        </div>
      </div>

      <div className={`main-content ${isMenuOpen ? '' : 'menu-closed'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;