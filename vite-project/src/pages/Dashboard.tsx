// /C:/Users/ESTOQUE/Desktop/portal-main/vite-project/src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
// SEPARAÇÃO DE IMPORTS:
import { checkPermission } from '../hooks/usePermissions'; 
import type { PermittedRouteProps } from '../types/Contele.d';
import UserAvatar from '../components/UserAvatar'; // 👈 1. IMPORT DO NOVO COMPONENTE
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // --- Checagem de Permissões ---
    const hasChecklistPermission = checkPermission('CKL' as PermittedRouteProps);
    const hasOrderPermission = checkPermission('PED' as PermittedRouteProps);
    const hasArmazemPermission = checkPermission('ARM' as PermittedRouteProps); 

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('user'); // É bom remover o objeto 'user' também
        navigate('/');
    };

    return (
     <div className="dashboard-container">
      <div className={`sidebar ${isMenuOpen ? '' : 'collapsed'}`}>
       <button onClick={toggleMenu} className="toggle-menu-button">
          <i className={`fas ${isMenuOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
       </button>
        
        {/* Bloco do Avatar e Nome - 2. INCLUSÃO DO AVATAR */}
        <div className="user-info-wrapper">
            <UserAvatar />
            {isMenuOpen && <h1 className="logo-text">MENU</h1>}
        </div>
        {/* FIM Bloco do Avatar e Nome */}

       <nav className="menu-nav">
          <ul>
            {/* ITEM FIXO: HOME */}
            <li data-tooltip="Home">
            <Link to="/dashboard" className="menu-item">
              <i className="fas fa-home"></i> <span>Home</span>
            </Link>
           </li>

            {/* ITEM CONDICIONAL: CONSULTAR CHECKLIST (Permissão CKL) */}
             {hasChecklistPermission && (
             <li data-tooltip="Consultar Checklist">
            <Link to="/dashboard/consultar-checklist" className="menu-item">
                <i className="fas fa-clipboard-list"></i> <span>Consultar Checklist</span>
            </Link>
             </li>
          )}

            {/* ITEM CONDICIONAL: CONSULTAR PEDIDO (Permissão PED) */}
             {hasOrderPermission && (
            <li data-tooltip="Consultar Pedido">
               <Link to="/dashboard/consultar-pedido" className="menu-item">
                 <i className="fas fa-search"></i> <span>Consultar Pedido</span>
               </Link>
           </li>
             )}

            {/* ITEM CONDICIONAL: CONSULTAR ARMAZÉM (Permissão ARM) */}
            {hasArmazemPermission && (
            <li data-tooltip="Consultar Armazém">
               <Link to="/dashboard/consultar-armazém" className="menu-item">
                 <i className="fas fa-warehouse"></i> <span>Consultar Armazém</span>
               </Link>
           </li>
             )}
           
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