import { useEffect } from 'react';
import React from 'react';
import '../assets/styles/ticket-info.css'; // Importa o CSS

import { useLocation, useNavigate } from 'react-router-dom';

const TicketInfo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketData = state?.ticketData;

   useEffect(() => {
      // Inicia o timer para redirecionar após 30 segundos
      const timer = setTimeout(() => {
        navigate('/');
      }, 30000); // 30 segundos
  
      // Limpa o timer caso o componente seja desmontado ou o usuário clique em um botão
      return () => clearTimeout(timer);
    }, [navigate]);
  

  // Verifica se os dados do ticket estão disponíveis
  if (!ticketData) {
    return (
      <div className='ticket-info'>
        <h2>Estaciona <strong>Aqui</strong></h2>
        <p>Ops! Não conseguimos encontrar as informações do ticket.</p>
        <button onClick={() => navigate('/registro-veiculo')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className='ticket-info'>
      <h2>Estaciona <strong>Aqui</strong></h2>
      <p>Boas vindas! Seu veículo foi registrado com sucesso.</p>
      <h4>Entrada Liberada</h4>
      <div className='info-container'>

        <p>{ticketData.veiculo.placa}</p>
        <div>
            <p>Veículo: {ticketData.veiculo.tipoVeiculo}</p>
            <p> Vaga: {ticketData.vaga.tipoVaga}</p>
        </div>
        
      </div>

      <p>Horário de Entrada: <strong>{new Date(ticketData.dataEntrada).toLocaleString()}</strong></p>
        <p>Número do Ticket:<strong> {ticketData.numero}</strong></p>
      <button className='navegacao' onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
};

export default TicketInfo;