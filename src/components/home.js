import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../assets/styles/ticket-pagamento.css';




const Home = () => {
    const navigate = useNavigate(); // Hook para navegação entre páginas
   
   


  

    return (
        <div className='ticket-pagamento'>
            <h2>Estaciona <strong>Aqui</strong></h2>
            <p>Escolha abaixo a funcionalidade a ser utilizada.</p>
            
           
            <div className='menu'>
                <button onClick={() => navigate('/registro-veiculo')}>Entrada de Veículos</button>
                <button onClick={() => navigate('/ticket/pagamento')}>Pagamento de Tickets</button>
                <button onClick={() => navigate('/libera-veiculo')}>Saída de Veículos</button>
                <button onClick={() => navigate('/login')}>Login de Administrador</button>
            </div>

        </div>
    )
}

export default Home
