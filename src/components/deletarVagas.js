import React, { useState } from 'react';
import '../assets/styles/deletar-vagas.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação

const DeletarVagas = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoVaga: '', // Tipo da vaga (comum, preferencial, etc.)
    tipoVeiculo: '', // Tipo de veículo associado à vaga (carro ou moto)
    quantidade: 1, // Número de vagas a serem deletadas
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
      const response = await fetch('https://estacionamento-backend.vercel.app/vagas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Sucesso! ${formData.quantidade} vagas do tipo "${formData.tipoVaga}" para "${formData.tipoVeiculo}" foram deletadas.`);
        setFormData({ tipoVaga: '', tipoVeiculo: '', quantidade: 1 }); // Limpar o formulário
      } else {
        alert(`Erro: ${data.error}`); // Exibe o erro retornado pelo backend
      }
    } catch (error) {
      console.error('Erro ao deletar vagas:', error);
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className='deletar-vagas'>
      <h2>Estaciona <strong>Aqui</strong></h2>
      <p>Deletar Vagas - Preencha as informações abaixo para deletar vagas específicas no sistema.</p>
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
          {isLoading ? 'Deletando...' : 'Deletar Vagas'}
        </button>
      </form>
      <button onClick={() => navigate('/admin')} disabled={isLoading}>
        Voltar
      </button>
    </div>
  );
};

export default DeletarVagas;