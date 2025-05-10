import React, { useState } from 'react';
import '../assets/styles/criar-vagas.css';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate do react-router-dom para navegação

const CriarVagas = () => {
  const navigate = useNavigate(); // Inicializa o hook useNavigate para navegação
  const [formData, setFormData] = useState({
    tipoVaga: '', // Tipo da vaga (comum, preferencial, etc.)
    tipoVeiculo: '', // Tipo de veículo associado à vaga (carro ou moto)
    quantidade: 1, // Número de vagas a serem criadas
  });
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Inicia o carregamento
    try {
      // Gerar as vagas com base na quantidade informada
      const vagas = Array.from({ length: formData.quantidade }, () => ({
        tipoVaga: formData.tipoVaga,
        tipoVeiculo: formData.tipoVeiculo,
        ocupada: false, // Sempre inicia como desocupada
      }));

      // Enviar as vagas para o backend
      const response = await fetch('https://estacionamento-backend.vercel.app/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vagas),
      });

      if (response.ok) {
        alert(`Sucesso! ${formData.quantidade} vagas do tipo "${formData.tipoVaga}" para "${formData.tipoVeiculo}" foram criadas.`);
        setFormData({ tipoVaga: '', tipoVeiculo: '', quantidade: 1 }); // Limpar o formulário
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar vagas:', error);
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className='criar-vagas'>
      <h2>Estaciona <strong>Aqui</strong></h2>
      <p>Criar Vagas - Preencha as informações abaixo para criar novas vagas no sistema de estacionamento.</p>
      <form onSubmit={handleSubmit}>
        <div className='grupo-input'>
          <label htmlFor='tipoVaga'>Tipo de Vaga:</label>
          <select
            id='tipoVaga'
            name='tipoVaga'
            value={formData.tipoVaga}
            onChange={handleChange}
            required
          >
            <option value=''>Selecione</option>
            <option value='comum'>Comum</option>
            <option value='preferencial'>Preferencial</option>
          </select>
        </div>

        <div className='grupo-input'>
          <label htmlFor='tipoVeiculo'>Tipo de Veículo:</label>
          <select
            id='tipoVeiculo'
            name='tipoVeiculo'
            value={formData.tipoVeiculo}
            onChange={handleChange}
            required
          >
            <option value=''>Selecione</option>
            <option value='carro'>Carro</option>
            <option value='moto'>Moto</option>
          </select>
        </div>

        <div className='grupo-input'>
          <label htmlFor='quantidade'>Quantidade:</label>
          <input
            type='number'
            id='quantidade'
            name='quantidade'
            value={formData.quantidade}
            onChange={handleChange}
            min='1'
            required
          />
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Vagas'}
        </button>
      </form>
      <button onClick={() => navigate('/admin')} disabled={isLoading}>
        Voltar
      </button>
    </div>
  );
};

export default CriarVagas;