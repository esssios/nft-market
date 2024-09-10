import { useState, useEffect } from 'react';
import NFTCard from './NFTCard';
import { nftOperationFunc } from '../utils/nft';
import { marketOperationFunc } from '../utils/market';
import { fustdOperationFunc } from '../utils/fustd';

import { useWallet } from '../state/walletContext';

const marketContractAddress: string = import.meta.env.VITE_MARKET_ADDRESS;

const Market = () => {
  // const { walletAddress } = useWallet();
  const walletData = useWallet();
  const walletAddress = walletData ? walletData.walletAddress : "";
  const [nfts, setNfts] = useState<number[]>([]);
  const [allowance, setAllowance] = useState(0);

  const handleBuyNft = async (tokenId: number) => {
    if (allowance === 0) {
      // 用户授权market合约可操作的fustd代币数量
      // 提示用户确认授权金额
      const amount = prompt("Please enter the amount you want to authorize:", "10000000000000000000000");
      if (amount) {
        const { approve } = await fustdOperationFunc();
        await approve(marketContractAddress, amount);
      }
    } else {
      const { buy } = await marketOperationFunc();
      await buy(Number(tokenId));
    }
  };

  useEffect(() => {
    async function fetchAllowance() {
      const { getAllowance } = await fustdOperationFunc();
      try {
        const allowance = await getAllowance(walletAddress, marketContractAddress);
        if (allowance !== undefined) {
          setAllowance(allowance);
        }
      } catch (error) {
        console.error('Failed to fetch allowance:', error);
        // 可以在这里添加其他错误处理逻辑，比如通知用户等
      }
    }
    // 只有当 walletAddress 存在且非空时才执行
    if (walletAddress) {
      fetchAllowance();
    }
  }, [walletAddress]);

  useEffect(() => {
    async function fetchNFTs() {
      console.log("fetchNFTs");
      const { balanceOf, tokenOfOwnerByIndex } = await nftOperationFunc();
      try {
        const length = await balanceOf(marketContractAddress); // 获取market合约下nft数量
        const tokenIds: number[] = [];

        for (let i = 0; i < length; i++) {
          const tokenId: number = await tokenOfOwnerByIndex(marketContractAddress, i); // 获取nft的tokenId
          tokenIds.push(tokenId);
        }

        // 使用Set去除重复值
        const uniqueTokenIds = Array.from(new Set(tokenIds));

        // 更新状态
        setNfts(uniqueTokenIds);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        // 可以在这里添加错误处理逻辑，例如通知用户
      }
    };
    fetchNFTs();
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(660px, 1fr))",
      gap: "1rem",
      padding: "1rem",
    }}>
      {nfts.map((nft, index) => (
        <NFTCard
          key={index}
          tokenId={nft}
          opButton={<button style={{ cursor: 'pointer' }} className="h-31px w-68px bg-#006dfe c-white btn-no-border rounded" onClick={() => handleBuyNft(nft)}>Buy</button>} />
      ))}
    </div >
  );
};

export default Market;