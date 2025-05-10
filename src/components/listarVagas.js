import React, { useState, useEffect } from 'react';
import '../assets/styles/listar-vagas.css';


const ListarVagas = () => {
  const [vagas, setVagas] = useState([]); // Estado para armazenar as vagas
  const [isLoading, setIsLoading] = useState(false); // Estado para controle do carregamento

  // Buscar vagas do backend
  useEffect(() => {
    const fetchVagas = async () => {
      setIsLoading(true); // Inicia carregamento
      try {
        const response = await fetch('https://estacionamento-backend.vercel.app/vagas');
        const data = await response.json();
        setVagas(data); // Armazena as vagas recebidas no estado
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        alert('Erro ao buscar vagas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false); // Finaliza carregamento
      }
    };

    fetchVagas();
  }, []);

  // Função para agrupar e contar vagas por tipoVaga e tipoVeiculo
  const contarVagasPorTipo = () => {
    return vagas.reduce((agrupadas, vaga) => {
      const key = `${vaga.tipoVaga} - ${vaga.tipoVeiculo}`; // Chave única combinando tipoVaga e tipoVeiculo
      if (!agrupadas[key]) {
        agrupadas[key] = { ocupadas: 0, livres: 0 }; // Inicializa o contador
      }
      if (vaga.ocupada) {
        agrupadas[key].ocupadas += 1; // Incrementa o contador de ocupadas
      } else {
        agrupadas[key].livres += 1; // Incrementa o contador de livres
      }
      return agrupadas;
    }, {});
  };

  // Função para calcular o total geral de vagas
  const calcularResumoGeral = () => {
    return vagas.reduce(
      (resumo, vaga) => {
        if (vaga.ocupada) {
          resumo.ocupadas += 1;
        } else {
          resumo.livres += 1;
        }
        resumo.total += 1;
        return resumo;
      },
      { ocupadas: 0, livres: 0, total: 0 }
    );
  };

  const resumoGeral = calcularResumoGeral();

  return (
    <div className='listar-vagas'>
      <h2>Status do Estacionamento</h2>

      {/* Carregamento */}
      {isLoading ? (
        <p>Carregando vagas...</p>
      ) : (
        <div className='resumo-vagas'>
          {vagas.length === 0 ? (
            <p>Nenhuma vaga encontrada.</p>
          ) : (
            // Renderiza as quantidades agrupadas por tipoVaga e tipoVeiculo
            Object.entries(contarVagasPorTipo()).map(([key, contagem]) => (
              <div key={key} className='tipo-vaga'>
                <h3>{key}</h3>
                <p><strong>Ocupadas:</strong> {contagem.ocupadas}</p>
                <p><strong>Livres:</strong> {contagem.livres}</p>
                <p><strong>Total:</strong> {contagem.ocupadas + contagem.livres}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Resumo Geral */}
      <div className='resumo-geral'>
        <h3>Resumo Geral do Estacionamento</h3>
        <p><strong>Ocupadas:</strong> <span>{resumoGeral.ocupadas}</span></p>
        <p><strong>Livres:</strong> <span>{resumoGeral.livres}</span></p>
        <p><strong>Total:</strong> <span>{resumoGeral.total}</span></p>
      </div>
    </div>
  );
};

export default ListarVagas;