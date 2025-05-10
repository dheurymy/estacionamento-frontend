import React, { useState } from 'react';

import '../assets/styles/ticket-pagamento.css';

import card from '../assets/images/card.svg';
import pix from '../assets/images/pix.svg';
import qrcode from '../assets/images/qrcode.png';


const TicketPagamento = () => {

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
    const [pagamentoIniciado, setPagamentoIniciado] = useState(false); // Estado para controle de pagamento
    const [isPix, setIsPix] = useState(false); // Estado para controle de pagamento via Pix
    const [isCard, setIsCard] = useState(false); // Estado para controle de pagamento via crédito
    const [isPayed, setIsPayed] = useState(false); // Estado para controle de pagamento realizado

    const calcularValorTicket = (entrada, saida) => {
        const entradaDate = new Date(entrada); // Converte entrada para Date
        const saidaDate = new Date(saida); // Converte saída para Date

        const diffInMinutes = Math.abs(saidaDate - entradaDate) / 60000; // Diferença em minutos
        const valorPorHora = 10; // Valor por hora em reais
        const valorTotal = Math.ceil((diffInMinutes - 15) / 60) * valorPorHora; // Arredonda para cima
        return valorTotal > 0 ? valorTotal : 0; // Evita valores negativos
    };

    const pegarDadosVeiculo = async (veiculoId) => {
        try {
            const response = await fetch(`https://estacionamento-backend.vercel.app/veiculos/${veiculoId}`, {method: 'GET'}); // Endpoint para buscar o veículo
            const data = await response.json();
            if (response.ok) {
                return data.tipoVeiculo; // Retorna o tipo de veículo
                
            } else {
                alert(`Erro ao buscar o veículo: ${data.error}`);
                return 'Desconhecido'; // Valor padrão em caso de erro
            }
        } catch (error) {
            console.error('Erro ao buscar o veículo:', error);
            return 'Desconhecido'; // Valor padrão em caso de falha
        }
    };

    const pegarTicketPorNumero = async () => {
    try {
        const response = await fetch(`https://estacionamento-backend.vercel.app/tickets/${formData.numero}`, { method: 'GET' }); // Endpoint para buscar o ticket
        const data = await response.json();

        if (response.ok) {
            if (data.status === "fechado") {
                alert("Este ticket já está fechado.");
                window.location.reload(); // Reinicia a página ao estado inicial
                return; // Sai da função
            }

            const saidaAtual = new Date(); // Hora atual para saída
            const tipoVeiculo = await pegarDadosVeiculo(data.veiculo); // Busca o tipo de veículo usando o ID

            setFormData({
                ...formData,
                ticketId: data._id,
                veiculo: tipoVeiculo, // Atualiza com o tipo do veículo
                vaga: data.vaga,
                entrada: data.dataEntrada,
                saida: saidaAtual,
                valor: calcularValorTicket(data.dataEntrada, saidaAtual),
            });

            console.log('Ticket e veículo encontrados:', data, tipoVeiculo);
        } else {
            alert(`Erro ao buscar o ticket: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
    }
    setIsLoading(false); // Finaliza o estado de carregamento
};

     const atualizarTicketPorNumero = async () => {
    try {
        const response = await fetch(`https://estacionamento-backend.vercel.app/tickets/${formData.numero}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                valor: formData.valor, // Atualiza o valor do ticket
                dataSaida: formData.saida, // Atualiza a data de saída
                status: 'fechado' // Define que o ticket foi encerrado
            })
        });

        const data = await response.json();

        if (response.ok) {
            setFormData({ ...data }); // Atualiza o estado com todos os dados do ticket atualizado
            console.log('Ticket atualizado com sucesso:', data);
            setIsPayed(true); // Define que o pagamento foi realizado
            setIsPix(false); // Cancela o pagamento via Pix
            setIsCard(false); // Cancela o pagamento via cartão
            
            
        } else {
            alert(`Erro ao atualizar o ticket: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar o ticket:', error);
    }
};
    const handlePagamentoRealizado = async () => {
    if (!formData.numero) {
        alert("Número do ticket não encontrado!");
        return;
    }

    await atualizarTicketPorNumero(); // Chama a função para atualizar
    setFormData({ ...formData, status: 'fechado' }); // Atualiza o status localmente

    alert('Pagamento realizado com sucesso!'); // Exibe mensagem de sucesso
    
    // Aguarda o usuário clicar em "OK" e recarrega a página
    window.location.reload();
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

    const iniciarPagamento = (tipo) => {
        setPagamentoIniciado(true); // Define que o pagamento foi iniciado
        if (tipo === 'pix') {
            setIsPix(true); // Define que o pagamento é via Pix
        }
        if (tipo === 'card') {
            setIsCard(true); // Define que o pagamento é via cartão de crédito
        }   
    }

    const cancelarPagamento = () => {
        setPagamentoIniciado(false); // Cancela o pagamento
        setIsPix(false); // Cancela o pagamento via Pix
        setIsCard(false); // Cancela o pagamento via cartão
    }

  

    return (
        <div className='ticket-pagamento'>
            <h2>Estaciona <strong>Aqui</strong></h2>
            <p>Preencha o campo abaixo para fazer o<br />pagamento de seu ticket do estacionamento.</p>
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
            {isSubmitted && (
                <div className='ticket-pagamento-info'>
                    <div className='info'>
                        <h3>Ticket</h3>
                        <p><strong>ID:</strong> {formData.numero}</p>
                    </div>
                    <div className='info-data'>
                        <p><strong>Entrada:</strong> {new Date(formData.entrada).toLocaleString()}</p>
                        <p><strong>Saída:</strong>  {new Date(formData.saida).toLocaleString()}</p>
                    </div>
                    <div className='info-veiculo'>
                        <p><strong>Veículo:</strong> {formData.veiculo}</p>
                        <p><strong>Valor:</strong> R${formData.valor}</p>
                        <p><strong>Status:</strong> {isPayed ? ' pago' : ' pendente'}</p>
                    </div>
                    {pagamentoIniciado === false && (
                        <div className='info-pagamento'>
                        <button className='pagar-credito' onClick={() => iniciarPagamento('card')}>
                            <img src={card} alt="cartão" /> crédito
                        </button>
                        <button className='pagar-debito' onClick={() => iniciarPagamento('card')}><img src={card} alt="cartão" /> débito</button>
                        <button className='pagar-pix' onClick={() => iniciarPagamento('pix')}>
                            <img src={pix} alt="pix" /> pix
                        </button>
                    </div>
                    )}

                    {isPix === true && (
                        <div className='pagamento-pix'>
                        <h6>Escaneie o QR code a seguir e realize o pagamento do seu ticket.</h6>
                        <div>
                            <img src={qrcode} alt="QR Code" />
                            <div>
                                <button onClick={handlePagamentoRealizado}>pagamento realizado</button>
                                <button id='cancelar' onClick={() => cancelarPagamento()} >cancelar pagamento</button>
                            </div>
                        </div>
                    </div>
                    )}
                    {isCard === true && (
                        <div className='pagamento-pix'>
                        
                        <div>
                            
                            <div>
                                <button onClick={handlePagamentoRealizado}>pagamento realizado</button>
                                <button id='cancelar' onClick={() => cancelarPagamento()} >cancelar pagamento</button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            )}
            <p>Após o pagamento, o ticket será encerrado e<br />você poderá retirar seu veículo do estacionamento.</p>

        </div>
    )
}

export default TicketPagamento
