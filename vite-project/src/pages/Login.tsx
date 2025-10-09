// src/pages/Login.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useAuth } from '../context/AuthContext';
import type { LoginResponse } from '../types/Contele.d'; 

// Logos
import logoCasaFortaleza from '../assets/logo_casafortaleza.png';
import logoMacpiso from '../assets/logo_casafortaleza.png';
import logoFort from '../assets/logo_macpiso.jpg'; 

// BASE URL da API TOTVS
const API_BASE_URL = '/portal';

export const getLogo = (): string => {
    const empresa = import.meta.env.VITE_EMPRESA;
    if (empresa === 'casafortaleza') return logoCasaFortaleza;
    if (empresa === 'macpiso') return logoMacpiso;
    return logoFort;
};

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
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

            const credentialsBase64 = btoa(unescape(encodeURIComponent(`${cleanUsername}:${cleanPassword}`)));
            const authorizationHeader = `Basic ${credentialsBase64}`;

            const loginUrl = `${API_BASE_URL}/login`;

            const response = await axios.get<LoginResponse>(loginUrl, {
                headers: { Authorization: authorizationHeader },
            });

            const userData = response.data;

            // 1️⃣ Usuário bloqueado
            if (userData.bloqueado === 'S') {
                alert('Seu usuário está bloqueado. Contate o administrador.');
                setIsLoading(false);
                return;
            }

            // 2️⃣ Troca de senha obrigatória
            if (userData.trocar_senha === 'S') {
                localStorage.setItem('userToken', authorizationHeader);
                localStorage.setItem('user', JSON.stringify(userData)); 
                
                localStorage.setItem('username', cleanUsername); // 👈 ADICIONE AQUI
                
                login(); 
                navigate('/trocar-senha');
                setIsLoading(false);
                return;
            }

            // 3️⃣ Validade do usuário
            const hoje = new Date();
            const validadeStr = userData.validade;
            const ano = parseInt(validadeStr.substring(0, 4));
            const mes = parseInt(validadeStr.substring(4, 6)) - 1; 
            const dia = parseInt(validadeStr.substring(6, 8));
            const validade = new Date(ano, mes, dia);

            if (hoje > validade) {
                alert('Usuário expirado. Contate o administrador.');
                setIsLoading(false);
                return;
            }

            // --- LOGIN VÁLIDO ---
            localStorage.setItem('userToken', authorizationHeader);
            
            // 🚨 CORREÇÃO 2: Salva o objeto do usuário para ser usado no TrocarSenha.tsx
            localStorage.setItem('user', JSON.stringify(userData)); 
            
            localStorage.setItem('userPermissions', JSON.stringify(userData.direitos));
            localStorage.setItem('usuarioBloqueado', userData.bloqueado);
            localStorage.setItem('senhaTrocar', userData.trocar_senha);
            localStorage.setItem('usuarioValidade', userData.validade);
            
            login(); 
            navigate('/dashboard');

        } catch (error: any) {
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
            localStorage.clear();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-page-image-container">
                <h2 className="title-overlay"></h2>
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
                        <a href="#" className="forgot-password">
                            Esqueci a senha?
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;