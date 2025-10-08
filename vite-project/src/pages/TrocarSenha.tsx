// src/pages/TrocarSenha.tsx (CÓDIGO COMPLETO E FINAL COM CORREÇÃO acoduser)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrocarSenha.css';

// Importações necessárias do Login.tsx e do AuthContext
import { getLogo } from './Login'; 
import { useAuth } from '../context/AuthContext';

const TrocarSenha: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // States
    const [senhaAntiga, setSenhaAntiga] = useState(''); // Estado para a SENHA ATUAL
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // 🚨 CORREÇÃO CRÍTICA AQUI: LENDO 'acoduser'
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const coduser = user.acoduser || ''; // <--- AGORA LÊ O CAMPO CORRETO DA RESPOSTA DA API

    // Função auxiliar para codificar em Base64 (necessária para Basic Auth)
    const encodeBase64 = (str: string): string => {
        if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
            return window.btoa(str);
        }
        // Fallback simples para Node/testes
        return new (TextEncoder as any)().encode(str).toString('base64');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        // --- VALIDAÇÕES ---
        if (!senhaAntiga || !novaSenha || !confirmaSenha) {
            setMessage({ type: 'error', text: 'Preencha todos os campos.' });
            setIsLoading(false);
            return;
        }
        if (novaSenha !== confirmaSenha) {
            setMessage({ type: 'error', text: 'A nova senha e a confirmação não conferem.' });
            setIsLoading(false);
            return;
        }
        if (novaSenha.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
            setIsLoading(false);
            return;
        }
        if (!coduser) {
            setMessage({ type: 'error', text: 'Código de usuário não encontrado. Redirecionando para login.' });
            setIsLoading(false);
            setTimeout(() => {
                navigate('/'); 
            }, 2000);
            return;
        }

        // 1. GERAÇÃO DO TOKEN COM A SENHA ANTIGA (para autorização)
        // A variável coduser agora contém '000001'
        const authString = `${coduser}:${senhaAntiga}`; 
        const newBasicToken = `Basic ${encodeBase64(authString)}`;

        try {
            const response = await axios.put(
                '/portal/login', // Endpoint /portal/login e método PUT
                { coduser: coduser, psw: novaSenha }, // Body: { "coduser": "000001", "psw": "novasenha" }
                { 
                    headers: { 
                        'Authorization': newBasicToken, // Header com SENHA ANTIGA
                        'Content-Type': 'application/json' 
                    } 
                }
            );

            // Validação de SUCESSO (Status 200, resposta com "succes": true)
            if (response.data?.succes) {
                setMessage({ type: 'success', text: 'Senha alterada com sucesso! Redirecionando para login...' });
                
                // Limpa tudo, inclusive o token antigo, e redireciona
                localStorage.clear(); 
                login(); 
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } else {
                // Falha na API (Ex: Senha antiga inválida ou regra do servidor)
                const apiMessage = response.data?.result?.message || 'Falha ao alterar a senha. Verifique a senha atual.';
                setMessage({ type: 'error', text: apiMessage });
            }
        } catch (error: any) {
            console.error('Erro de PUT /portal/login:', error);
            
            let errorText = 'Erro de comunicação com o servidor. Tente novamente.';
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    errorText = 'Senha Atual incorreta ou usuário não autorizado.';
                } else if (error.response.status === 404) {
                     errorText = 'Erro 404: Problema de Roteamento (Proxy/Vite). Reinicie o servidor.'; 
                }
            }
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    // ... (restante do JSX sem alterações)
    return (
        <div className="trocar-senha-page">
            <div className="trocar-senha-card">
                <img src={getLogo()} alt="Logo da Empresa" className="logo" />
                <h1>Troca de Senha Obrigatória</h1>
                <p>Para sua segurança, confirme a senha atual e defina uma nova.</p>
                
                <form onSubmit={handleSubmit} className="trocar-senha-form">
                    
                    {/* CAMPO CRÍTICO: Senha Atual */}
                    <div className="form-group">
                        <label htmlFor="senhaAntiga">Senha Atual</label>
                        <input
                            type="password"
                            id="senhaAntiga"
                            value={senhaAntiga}
                            onChange={(e) => setSenhaAntiga(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="novaSenha">Nova Senha</label>
                        <input
                            type="password"
                            id="novaSenha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            disabled={isLoading}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmaSenha">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmaSenha"
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                    
                    {message && (
                        <div className={`alert-message alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default TrocarSenha;