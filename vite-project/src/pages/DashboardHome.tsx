import React from 'react';
import { getLogo } from './Login'; // Importamos a função que pega a logo
import '../styles/DashboardHome.css'; // O novo caminho do arquivo CSS

const DashboardHome: React.FC = () => {
  return (
    <div className="dashboard-home">
      <img src={getLogo()} alt="Logo da Empresa" className="dashboard-logo" />
    </div>
  );
};

export default DashboardHome;