import React, { useState } from 'react';
import '../assets/styles/registro-veiculo.css';
import { useNavigate } from 'react-router-dom';

const RegistroVeiculo = () => {
  const navigate = useNavigate(); // Hook para navegação entre páginas
  const [formData, setFormData] = useState({
    placa: '',
    tipoVeiculo: '',
    preferencial: false, // Indica se a vaga precisa ser preferencial
  });
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlacaChange = (e) => {
    let value = e.target.value.toUpperCase(); // Transforma em maiúsculas
    value = value.replace(/[^A-Z0-9]/g, ''); // Remove caracteres inválidos
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3); // Adiciona o hífen
    }
    setFormData({ ...formData, placa: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, preferencial: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('https://estacionamento-backend.vercel.app/veiculos/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        
        navigate('/ticket/info', { state: { ticketData: {
          ...data.ticket,
          veiculo: {
            placa: formData.placa,
            tipoVeiculo: formData.tipoVeiculo,
          },
          vaga: {
            tipoVaga: formData.preferencial? 'preferencial' : 'comum',
          },
        }, } });
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao registrar veículo:', error);
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='registro-veiculo'>
      <h2>Estaciona <strong>Aqui</strong></h2>
      <p>Preencha os campos abaixo para registrar<br />seu veículo no sistema de estacionamento.</p>
      <form onSubmit={handleSubmit}>
        <div className='grupo-input'>
          <label htmlFor='placa'>Placa do Veículo:</label>
          <input
            type='text'
            id='placa'
            name='placa'
            value={formData.placa}
            onChange={handlePlacaChange}
            placeholder='Digite a placa'
            required
          />
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

        <div className='grupo-checkbox'>
          <label>Precisa de Vagas Preferenciais?</label>
          <input
            type='checkbox'
            name='preferencial'
            id='preferencial'
            checked={formData.preferencial}
            onChange={handleCheckboxChange}
          />
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Veículo'}
        </button>
      </form>
     
    </div>
  );
};

export default RegistroVeiculo;