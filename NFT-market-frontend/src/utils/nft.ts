import ABI from '../abis/NFT.json';
import axios from 'axios';
import { createContract } from './common';
import { ethers } from "ethers";
import { Metadata } from '../types/metadata';

export async function nftOperationFunc() {
  // let contract: Contract | undefined;
  const contract = await createContract(import.meta.env.VITE_NFT_ADDRESS, ABI);
  // window.ethereum.on("accountsChanged", async () => {
  //   contract = await createContract(import.meta.env.VITE_NFT_ADDRESS, ABI);
  // });

  async function balanceOf(address: string) {
    const result = await contract?.balanceOf(address);
    return Number(result);
  }

  async function tokenOfOwnerByIndex(owner: string, index: number) {
    const result = await contract?.tokenOfOwnerByIndex(owner, index);
    return Number(result);
  }

  async function tokenURI(tokenId: number) {
    if (!contract) return;
    const result = await contract.tokenURI(tokenId);
    console.log(result);
  }

  async function getMetadata(tokenId: number): Promise<Metadata> {
    const result = await contract?.tokenURI(tokenId);
    const response = await axios.get(result);
    return {
      title: response.data.title,
      description: response.data.description,
      imageURL: response.data.image,
    }
  }

  async function safeTransferFrom(from: string, tokenId: number, price: number) {
    // 将数字转换为十六进制字符串
    const hexString = ethers.toBeHex(BigInt(price * 1e18));
    // 去除前缀 "0x"（可选）
    const hexWithoutPrefix = hexString.substring(2);
    // 填充左侧直到长度为 64 位
    const paddedHex = hexWithoutPrefix.padStart(64, '0');

    if (!contract) return;
    const result = await contract["safeTransferFrom(address,address,uint256,bytes)"](from, import.meta.env.VITE_MARKET_ADDRESS, tokenId, `0x${paddedHex}`);
    console.log(result);
  }

  return {
    balanceOf,
    tokenOfOwnerByIndex,
    tokenURI,
    getMetadata,
    safeTransferFrom,
  }
}