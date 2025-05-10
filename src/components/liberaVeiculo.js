import React, { useState } from 'react';

import '../assets/styles/ticket-pagamento.css';




const LiberaVeiculo = () => {
   
    const [formData, setFormData] = React.useState({
        ticketId: '',
        numero: '',
        valor: '',
        veiculo: '',
        vaga: '',
        entrada: '',
        saida: '',

    });

    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar o envio do formulário
    

  

    const deletarVeiculo = async (veiculoId) => {
        try {
            const response = await fetch(`https://estacionamento-backend.vercel.app/veiculos/${veiculoId}`, {method: 'DELETE'}); // Endpoint para buscar o veículo
            const data = await response.json();
            if (response.ok) {
                console.log('Veículo deletado com sucesso:');
                
            } else {
                console.log(`Erro ao deletarr o veículo: ${data.error}`);
                return 'Desconhecido'; // Valor padrão em caso de erro
            }
        } catch (error) {
            console.error('Erro ao deletarr o veículo:', error);
            return 'Desconhecido'; // Valor padrão em caso de falha
        }
    };

    
    const liberarVaga = async (vaga) => {
        try {
            const response = await fetch(`https://estacionamento-backend.vercel.app/vagas/${vaga}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                
                ocupada: false // Define que o ticket foi encerrado
            })
        });
            const data = await response.json();
            if (response.ok) {
                console.log('Vaga liberada com sucesso:');
                
            } else {
                console.log(`Erro ao liberar a vaga: ${data.error}`);
                return 'Desconhecido'; // Valor padrão em caso de erro
            }
        } catch (error) {
            console.error('Erro ao liberar a vaga:', error);
            return 'Desconhecido'; // Valor padrão em caso de falha
        }
    };
   
    const pegarTicketPorNumero = async () => {
    try {
        const response = await fetch(`https://estacionamento-backend.vercel.app/tickets/${formData.numero}`, { method: 'GET' }); // Endpoint para buscar o ticket
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            if (data.status === "fechado") {
                await deletarVeiculo(data.veiculo);
                await liberarVaga(data.vaga);

                alert("Veículo liberado!");
                window.location.reload(); // Reinicia a página ao estado inicial
                return; // Sai da função
            }

        } else {
            alert(`Erro ao buscar o ticket: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
    }
    setIsLoading(false); // Finaliza o estado de carregamento
};


  


   





    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        await pegarTicketPorNumero();
        setIsSubmitted(true); // Define que o formulário foi enviado
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }


  

    return (
        <div className='ticket-pagamento'>
            <h2>Estaciona <strong>Aqui</strong></h2>
            <p>Preencha o campo abaixo para fazer a<br />liberação do veículo do estacionamento.</p>
            {isSubmitted === false && (
                <form onSubmit={handleSubmit}>
                <label htmlFor='ticketId'>ID do Ticket:</label>
                <input
                    type='text'
                    id='numero'
                    name='numero'
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder='Digite o número do ticket'
                    required
                />
                {isSubmitted === false && (
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Buscar Ticket'}
                    </button>
                )}


            </form>

            )}
           
            <p>Caso o ticket ainda esteja pendente, realize o<br />pagamento para retirar seu veículo do estacionamento.</p>

        </div>
    )
}

export default LiberaVeiculo
