import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrocarSenha.css';

// Importações necessárias do Login.tsx e do AuthContext
import { getLogo } from './Login'; 
import { useAuth } from '../context/AuthContext';

// Função auxiliar para codificar em Base64 (necessária para Basic Auth)
const encodeBase64 = (str: string): string => {
    // btoa é a função padrão do navegador para Base64
    return window.btoa(unescape(encodeURIComponent(str)));
};

const TrocarSenha: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Usado para forçar o recarregamento do AuthContext
    
    // States
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // RECUPERANDO AS CREDENCIAIS (agora sem o useEffect)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const coduser = user.acoduser || '';        // Código numérico (USADO NO BODY)
    const username = localStorage.getItem('username') || ''; // Login textual (USADO NO HEADER)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        // --- VALIDAÇÕES CLIENT-SIDE ---
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
        
        // **VERIFICAÇÃO DE DADOS CRÍTICOS** (para evitar o erro que você viu)
        if (!coduser || !username) {
            setMessage({ type: 'error', text: 'Dados de usuário ausentes. Redirecionando para login...' });
            setIsLoading(false);
            setTimeout(() => { navigate('/'); }, 2000);
            return;
        }

        // 1. GERAÇÃO DO TOKEN COM A SENHA ANTIGA (para autorização)
        // ESSENCIAL: Usando o username (login) para Basic Auth.
        const authString = `${username}:${senhaAntiga}`; 
        const newBasicToken = `Basic ${encodeBase64(authString)}`;

        try {
            const response = await axios.put(
                '/portal/login', // Endpoint /portal/login e método PUT
                { coduser: coduser, psw: novaSenha }, // Body: { "coduser": "000001", "psw": "novasenha" }
                { 
                    headers: { 
                        'Authorization': newBasicToken, // Header: username:senhaAntiga (Basic Auth)
                        'Content-Type': 'application/json' 
                    } 
                }
            );

            // Validação de SUCESSO
            if (response.data?.succes) {
                
                // 1. Exibe a mensagem de sucesso
                setMessage({ type: 'success', text: 'Senha alterada com sucesso! Redirecionando para login...' });
                
                // 2. Limpa o localStorage e redireciona (melhor ordem para evitar o erro)
                localStorage.clear(); 
                login(); 
                
                setTimeout(() => {
                    navigate('/'); // Redireciona para a página de Login
                }, 5000); // 1,5s para o usuário ler o sucesso

            } else {
                // Caso o servidor retorne 200, mas com uma mensagem de erro no Body
                const apiMessage = response.data?.result?.message || 'Falha ao alterar a senha. Verifique a senha atual.';
                setMessage({ type: 'error', text: apiMessage });
            }
        } catch (error: any) {
            console.error('Erro de PUT /portal/login:', error);
            
            let errorText = 'Erro de comunicação com o servidor. Tente novamente.';
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    errorText = 'Senha Atual incorreta ou usuário não autorizado.'; // Mensagem de erro que estava aparecendo
                } else if (error.response.status === 404) {
                    errorText = 'Erro 404: Endpoint /portal/login não encontrado.'; 
                }
            }
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="trocar-senha-page">
            <div className="trocar-senha-card">
                <img src={getLogo()} alt="Logo da Empresa" className="logo" />
                <h1>Troca de Senha Obrigatória</h1>
                <p>Para sua segurança, confirme a senha atual e defina uma nova.</p>
                
                {/* Exibição da mensagem de erro/sucesso */}
                {message && (
                    <div className={`alert-message alert-${message.type}`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="trocar-senha-form">
                    
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
                    
                </form>
            </div>
        </div>
    );
};

export default TrocarSenha;