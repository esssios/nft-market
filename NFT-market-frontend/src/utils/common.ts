import { ethers } from "ethers";

export async function createContract(contractAddress: string, abi: ethers.InterfaceAbi): Promise<ethers.Contract | undefined> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // console.log(signer);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      return contract;
    } catch (error) {
      console.error("创建合约实例时发生错误:", error);
      throw error; // 抛出异常以便调用方处理
    }
  } else {
    console.error("请安装MetaMask或支持EIP-1193的浏览器扩展程序");
    return undefined;
  }
}