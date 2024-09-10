import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './state/walletContext';

import Navbar from './components/Navbar';
import Market from './components/Market';
import CreateNft from './components/CreateNft';
import MyNFT from './components/MyNFT';

function App() {
  return (
    <div className='p-2 relative text-align-left'>
      <Router>
        <WalletProvider>
          <Navbar />
          <Routes>
            <Route path="/create-nft" element={<CreateNft />} />
            <Route path="/" element={<Market />} />
            <Route path="/my-nft" element={<MyNFT />} />
          </Routes>
        </WalletProvider>
      </Router>
    </div>
  );
};

export default App;