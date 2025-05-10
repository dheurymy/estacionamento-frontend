import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import RegistroVeiculo from './components/registroVeiculo';
import CriarVagas from './components/criarVagas';
import DeletarVagas from './components/deletarVagas';
import MenuAdmin from './components/menuAdmin';
import ListarVagas from './components/listarVagas';
import TicketInfo from './components/ticketInfo';
import TicketPagamento from './components/ticketPagamento';
import Login from './components/login';
import RegisterUser from './components/registerUser';
import LiberaVeiculo from './components/liberaVeiculo';
import Home from './components/home';


import { AuthProvider } from './context/authContext';
import RotaProtegida from './components/rotaProtegida'; // Importa o componente de proteção

import './assets/styles/global.css'; // Importa o arquivo CSS para estilização

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas (qualquer um pode acessar) */}
            <Route path="/" element={<Home />} />
            <Route path="/registro-veiculo" element={<RegistroVeiculo />} />
            <Route path="/ticket/info" element={<TicketInfo />} />
            <Route path="/ticket/pagamento" element={<TicketPagamento />} />
            <Route path="/libera-veiculo" element={<LiberaVeiculo />} />
            
            
            <Route path="/login" element={<Login />} />
            
            
            {/* Rotas protegidas (apenas usuários logados podem acessar) */}
            <Route path="/register" element={<RotaProtegida><RegisterUser/></RotaProtegida>} />
            <Route path="/admin" element={<RotaProtegida><MenuAdmin /></RotaProtegida>} />
            <Route path="/admin/criar-vagas" element={<RotaProtegida><CriarVagas /></RotaProtegida>} />
            <Route path="/admin/deletar-vagas" element={<RotaProtegida><DeletarVagas /></RotaProtegida>} />
            <Route path="/admin/listar-vagas" element={<RotaProtegida><ListarVagas /></RotaProtegida>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;