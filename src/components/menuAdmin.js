import React from 'react';
import '../assets/styles/menu-admin.css';
import { Link, useNavigate } from 'react-router-dom'; // Importa o Link e useNavigate do react-router-dom para navegação
import ListarVagas from './listarVagas'; // Importa o componente ListarVagas

import { useAuth } from '../context/authContext'; // Importa o hook useAuth do contexto de autenticação


const MenuAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Utiliza o hook useAuth para acessar a função de login do contexto de autenticação

  return (
    <div className='menu-admin'>
      <h2>Estaciona <strong>Aqui</strong></h2>
      
      <ListarVagas /> {/* Renderiza o componente ListarVagas */}
      <div className='menu-options'>
        <button onClick={() => navigate('/admin/criar-vagas')}>Criar Vagas</button>
        <button onClick={() => navigate('/admin/deletar-vagas')}>Deletar Vagas</button>
        <button onClick={() => navigate('/register')}>Criar Administrador</button>
        
        <button className='return' onClick={() => {
          logout(); // Chama a função de logout
          navigate('/'); // Redireciona para a página inicial
        }}>Logout</button>
        
      </div>
    </div>
  )
}

export default MenuAdmin
