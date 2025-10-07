import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/Login.css';

// Importa todas as logos (Mantido)
import logoCasaFortaleza from '../assets/logo_casafortaleza.png';
import logoMacpiso from '../assets/logo_macpiso.png';
import logoFort from '../assets/logo_fort1.png';

// BASE URL da API TOTVS - ALTERADA PARA A URL COMPLETA
//const API_BASE_URL = 'https://totvs.casafortaleza.com.br:8139/portal'; 

// BASE URL da API TOTVS
const API_BASE_URL = '/portal'; ;

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

/*const toBase64 = (str: string): string => {
 return btoa(unescape(encodeURIComponent(str)));
};*/

// Componente principal da página de login
const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Função que é executada ao enviar o formulário
  /*const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    

    if (!username || !password) {
      alert('Por favor, preencha o usuário e a senha.');
      setIsLoading(false);
      return;
    }

    try {


      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      // 1. Codifica as credenciais (usuário:senha) para Base64
      const credentialsBase64 = toBase64(`${cleanUsername}:${cleanPassword}`); 

      // 2. Monta o header de autorização (HTTP Basic Auth)
      const credentials = credentialsBase64;
      const authorizationHeader = `Basic ${credentials}`;

      // O endpoint completo é a junção da base + /login
      const loginUrl = `${API_BASE_URL}/login`; // Isso resultará em 'https://totvs.casafortaleza.com.br:8139/portal/login'

      console.log('🔍 Enviando requisição para:', loginUrl);
      console.log('Authorization:', authorizationHeader);

      // 3. Faz a chamada GET para o endpoint /login
      
      const response = await axios.get(loginUrl, {
        headers: {
          // Envia o header com o valor gerado dinamicamente
          'Authorization': authorizationHeader,
          // 'Content-Type' não é essencial para o GET de Basic Auth
        }
      });
    // ... (Resto da lógica de sucesso permanece o mesmo) ...

      // Define userData a partir da resposta (response.data)
      const userData = response.data; 

      // Salva a string 'Basic...' como token para ser usada em chamadas futuras
      localStorage.setItem('userToken', authorizationHeader); 
      localStorage.setItem('userPermissions', JSON.stringify(userData.direitos));

        console.log('Autenticação bem-sucedida!');
        navigate('/dashboard');

      } catch (error) {
    // ... (Lógica de tratamento de erro permanece a mesma) ...

        let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';

        if (axios.isAxiosError(error) && error.response) {
         // O código de erro para login incorreto deve ser 403 (Forbidden)
         if (error.response.status === 403) { 
             errorMessage = 'Credenciais inválidas. Usuário ou senha incorretos (403 Forbidden).';
           } else {
             // Este ponto é CRÍTICO. Se o erro for **CORS**, a requisição será bloqueada pelo navegador
             // e o `error.response` será `undefined`. Se você estiver vendo um erro de CORS no console, 
             // a API **não está respondendo com os headers CORS apropriados**.
             errorMessage = `Erro ao conectar com o servidor: ${error.response.status} (${error.response.statusText})`;
           }
        } else {
        errorMessage = 'Ocorreu um erro de rede (ou CORS). Verifique a conexão e tente novamente.';
    }

      console.error('Erro na autenticação:', error);
        alert(errorMessage);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPermissions');
      } finally {
        setIsLoading(false);
    }
  };*/

   // Função que é executada ao enviar o formulário
   const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
   setIsLoading(true);

    if (!username || !password) {
      alert('Por favor, preencha o usuário e a senha.');
      setIsLoading(false);
     return;
  }

    // ==========================================================
    // INÍCIO DO CÓDIGO MOCK PARA TESTE DE PERMISSÕES
    // ==========================================================

    // 1. Defina um usuário "mestre" para login mock
    const MOCK_USERNAME = 'TESTE';
    const MOCK_PASSWORD = '123';
    
    // Simula a validação: se for o usuário mock, simula o sucesso
    if (username.toUpperCase() === MOCK_USERNAME && password === MOCK_PASSWORD) {
        
        // Simulação de delay de rede
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // 2. Dados Mock (Simulando o 200 OK do TOTVS)
        // Usamos as permissões 'CKL' (Checklist) e 'ARM' (Armazém) para o teste
        const MOCK_DATA = {
            "acoduser": "000001",
            "nome": "Jefferson da Silva",
            "email": "teste@email.com",
            "direitos": ["CKL", "ARM" , "PED"], // Permissões para o teste!
            "clientes": [],
            "fornecedores": []
        };
        
        // 3. Simula o armazenamento e navegação (Sucesso)
        const authorizationHeader = 'Basic MOCK_TOKEN'; 
        localStorage.setItem('userToken', authorizationHeader); 
        localStorage.setItem('userPermissions', JSON.stringify(MOCK_DATA.direitos));
        
        console.log('✅ Autenticação MOCK bem-sucedida! Direitos:', MOCK_DATA.direitos);
        navigate('/dashboard');
        
        setIsLoading(false);
        return; // Sai da função após o mock
    }

    // ==========================================================
    // FIM DO CÓDIGO MOCK / INÍCIO DO CÓDIGO REAL
    // ==========================================================

    // Se não for o usuário mock, tenta o login real (manter para quando resolver o proxy)
    try {
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();
        
        // Mantém a função toBase64 para o caso de o usuário não ser o mock
        const toBase64 = (str: string): string => btoa(unescape(encodeURIComponent(str)));
        const credentialsBase64 = toBase64(`${cleanUsername}:${cleanPassword}`); 
        const authorizationHeader = `Basic ${credentialsBase64}`;

        console.log('🔍 Tentando login real...');
        
        // Chamada real ao axios (Pode falhar com 403/500)
        const response = await axios.get(`${API_BASE_URL}/login`, {
            headers: {
                'Authorization': authorizationHeader,
            }
        });

        // Lógica de sucesso do login real
        const userData = response.data; 
        localStorage.setItem('userToken', authorizationHeader); 
        localStorage.setItem('userPermissions', JSON.stringify(userData.direitos));
        
        console.log('Autenticação real bem-sucedida!');
        navigate('/dashboard');

    } catch (error) {
        // ... (Seu código de erro existente)
        let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403 || error.response.status === 401) { 
                errorMessage = 'Credenciais inválidas. Usuário ou senha incorretos.';
            } else {
                errorMessage = `Erro ao conectar com o servidor: ${error.response.status}`;
            }
        } else {
            errorMessage = 'Ocorreu um erro na rede. Verifique a conexão e tente novamente.';
        }
        console.error('Erro na autenticação:', error);
        alert(errorMessage);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPermissions');
    } finally {
        setIsLoading(false);
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
             />
            </div>
           <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
               </button>
             <a href="#" className="forgot-password">Esqueci a senha?</a>
         </form>
        </div>
       </div>
     </div>
   );
};

export default Login;