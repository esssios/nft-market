import { ethers, JsonRpcProvider } from "ethers";
import fs from "fs";
import "dotenv/config";
export async function mint(to: string, uri: string) {
  const provider = new JsonRpcProvider(process.env.RPC);

  const nftAbi = JSON.parse(fs.readFileSync('src/abis/NFT.json'));
  const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, nftAbi, await provider.getSigner());

  const res = await nftContract.safeMint(to, uri);
  console.log(res.hash);
  
}