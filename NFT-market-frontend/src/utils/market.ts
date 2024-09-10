import ABI from '../abis/MARKET.json';
import { Order } from '../types/order';
import { createContract } from './common';

export async function marketOperationFunc() {
  // if(!walletAddress) return;
  // let contract: Contract | undefined;
  // window.ethereum.on("accountsChanged", async () => {
  //   contract = await createContract(import.meta.env.VITE_MARKET_ADDRESS, ABI);
  // });
  const contract = await createContract(import.meta.env.VITE_MARKET_ADDRESS, ABI);

  async function buy(tokenId: number) {
    if (!contract) return;
    const result = await contract.buy(tokenId);
    console.log('buy', result.hash);
  }

  async function changePrice(tokenId: number, price: number) {
    if (!contract) return;
    const result = await contract.changePrice(tokenId, price);
    console.log('change price', result.hash);
  }

  async function cancelOrder(tokenId: number) {
    if (!contract) return;
    const result = await contract.cancelOrder(tokenId);
    console.log('cancel order', result.hash);
  }

  async function getAllNFTs() {
    if (!contract) return;
    const result = await contract.getAllNFTs();
    console.log(result);
  }

  async function getMyNFTsInMarket(): Promise<Order[]> {
    if (!contract) return [];
    const result = (await contract.getMyNFTs()).filter(item => item[0].substring(0, 4) !== "0x00");
    return result.map(item => ({
      seller: item[0],
      tokenId: Number(item[1]),
      price: Number(item[2]) / 1e18,
    }));
  }

  async function getOrder(tokenId: number): Promise<Order> {
    const result = await contract.orderOfId(tokenId);
    return {
      seller: result[0],
      tokenId: Number(result[1]),
      price: Number(result[2]) / 1e18,
    }
  }

  return {
    buy,
    changePrice,
    cancelOrder,
    getAllNFTs,
    getMyNFTsInMarket,
    getOrder,
  }
}