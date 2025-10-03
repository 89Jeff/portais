import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

// Importa todas as logos
import logoCasaFortaleza from '../assets/logo_casafortaleza.png';
import logoMacpiso from '../assets/logo_macpiso.png';
import logoFort from '../assets/logo_fort1.png';

export const getLogo = (): string => {
  const empresa = import.meta.env.VITE_EMPRESA;

  if (empresa === 'casafortaleza') {
    return logoCasaFortaleza;
  }
  if (empresa === 'macpiso') {
    return logoMacpiso;
  }
  return logoFort;
};

// Componente principal da página de login
const Login: React.FC = () => {
  // Estado para armazenar o valor dos inputs de usuário e senha
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Hook de navegação do React Router para redirecionar o usuário
  const navigate = useNavigate();

  // Função que é executada ao enviar o formulário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // --- Lógica Temporária: Login Mock (para desenvolvimento) ---
    // Credenciais fixas para simular um login bem-sucedido
    const mockUsername = 'admin';
    const mockPassword = 'admin';

    // Verifica se as credenciais de teste estão corretas
    if (username === mockUsername && password === mockPassword) {
      // Simula a resposta da API, salvando dados no localStorage
      const mockToken = 'mock-token-para-login-de-teste';
      const mockPermissions = ['consulta', 'chelist'];
      localStorage.setItem('userToken', mockToken);
      localStorage.setItem('userPermissions', JSON.stringify(mockPermissions));
      
      console.log('Login mock bem-sucedido!');
      navigate('/dashboard'); // Redireciona o usuário para a página de dashboard
    } else {
      // Se as credenciais estiverem erradas, mostra um alerta
      console.error('Falha na autenticação mock. Tente novamente.');
      alert('Usuário ou senha incorretos. Tente "admin" e "admin".');
    }

    // --- Lógica de Autenticação Real (Comentada) ---
    /*
    const apiEndpoint = 'URL_DO_ENDPOINT_TOTVS';
    const payload = {
      username: username,
      password: password,
    };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha na autenticação. Verifique suas credenciais.');
        }
        return response.json();
      })
      .then(data => {
        const { token, permissions } = data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
        
        console.log('Autenticação bem-sucedida!', data);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Erro:', error.message);
        alert(error.message);
      });
    */
  };

   return (
    <div className="login-page">
      <div className="login-page-image-container">
        <h2 className="title-overlay">
          
        </h2>
      </div>
      <div className="login-page-form-container">
        <div className="login-card">
          <img src={getLogo()} alt="Logo da Empresa" className="logo" />
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user">Usuário</label>
              <input 
                type="text" 
                id="user" 
                name="user" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Coloque o seu usuário"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">Entrar</button>
            <a href="#" className="forgot-password">Esqueci a senha?</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;