import { Link } from 'react-router-dom';
import { useWallet } from '../state/walletContext';

const Navbar = () => {
  const { walletAddress, setWallet } = useWallet();

  const getWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]); // Set the first account as the connected account
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };
  return (
    <nav className="navbar flex items-center justify-between p-4 bg-#333 c-white">
      <div className="font-1000">NFT Marketplace</div>
      <Link style={{textDecoration: "none"}} className="c-white" to="/">Market</Link>
      <Link style={{ textDecoration: "none" }} className="c-white" to="/my-nft">MyNft</Link>
      <Link style={{ textDecoration: "none" }} className="c-white" to="/create-nft">Create NFT</Link>
      <div className="flex items-center">
        <button style={{ cursor: "pointer" }} className="px-4 py-2 bg-#007bff c-white border-0 rounded" onClick={getWalletAddress}>
          {walletAddress.slice(0, 6) || "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;