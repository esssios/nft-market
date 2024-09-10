import { useState, useEffect } from 'react';
import NFTCard from './NFTCard';
import { nftOperationFunc } from '../utils/nft';
import { marketOperationFunc } from '../utils/market';
import { Order } from '../types/order';

import { useWallet } from '../state/walletContext';

const MyNFT = () => {
  // const { walletAddress } = useWallet();
  const walletData = useWallet();
  const walletAddress = walletData ? walletData.walletAddress : "";

  const [nftsInMarket, setNftsInMarket] = useState<Order[]>([]);
  const [nftsNotInMarket, setNftsNotInMarket] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [nftId, setNftId] = useState<number>(NaN);
  const visibleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const showDialog = async (tokenId: number) => {
    visibleDialog();
    setNftId(tokenId);
  };

  const hideDialog = async () => {
    visibleDialog();
    setNftId(NaN);
    setPrice(0);
  };

  const handleSellNft = async () => {
    const { safeTransferFrom } = await nftOperationFunc();
    await safeTransferFrom(walletAddress, nftId, price);
    setIsDialogOpen(!isDialogOpen);
  };

  const handleUnSellNft = async (tokenId: number) => {
    const { cancelOrder } = await marketOperationFunc();
    await cancelOrder(tokenId);
  };

  useEffect(() => {
    const fetchUnSellNFTs = async () => {
      const { balanceOf } = await nftOperationFunc();
      const { tokenOfOwnerByIndex } = await nftOperationFunc();
      try {
        const length = await balanceOf(walletAddress); // 获取用户地址下nft数量
        const tokenIds: number[] = [];

        for (let i = 0; i < length; i++) {
          const tokenId: number = await tokenOfOwnerByIndex(walletAddress, i); // 获取nft的tokenId
          tokenIds.push(tokenId);
        }

        // 使用Set去除重复值
        const uniqueTokenIds = Array.from(new Set(tokenIds));

        // 更新状态
        setNftsNotInMarket(uniqueTokenIds);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        // 可以在这里添加错误处理逻辑，例如通知用户
      }
    };

    fetchUnSellNFTs();
  }, [walletAddress]);

  useEffect(() => {
    const fetchSelledNFTs = async () => {
      console.log("walletAddress change");

      if (walletAddress) {
        const { getMyNFTsInMarket } = await marketOperationFunc();
        const nfts = await getMyNFTsInMarket();
        setNftsInMarket(nfts);
      }
    };
    fetchSelledNFTs();
  }, [walletAddress]);

  return (
    <>
      <Dialog isOpen={isDialogOpen}>
        <div>
          <input
            className="h-30px w-300px"
            placeholder="Enter nft price"
            type="text"
            onChange={e => setPrice(Number(e.target.value))}
          />
          <div className="flex justify-between mt-25px">
            <button
              className="h-31px w-100px bg-#8f8f8f c-white btn-no-border rounded"
              onClick={hideDialog}
            >cancel</button>
            <button
              className="h-31px w-100px bg-#006dfe c-white btn-no-border rounded"
              onClick={handleSellNft}
            >confirm</button>
          </div>
        </div>
      </Dialog>
      <h3 className="mb-0">未上架</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(660px, 1fr))",
        gap: "1rem",
        padding: "0.5rem",
      }}>
        {nftsNotInMarket.map((nft, index) => (
          <NFTCard
            key={index}
            tokenId={nft}
            opButton={<button
              style={{ cursor: 'pointer' }}
              className="h-31px w-68px bg-#006dfe c-white btn-no-border rounded"
              onClick={() => showDialog(nft)}>Sell</button>} />
        ))}
      </div>
      <h3 className="mb-0">已上架</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(660px, 1fr))",
        gap: "1rem",
        padding: "0.5rem",
      }}>
        {nftsInMarket.map((item, index) => (
          <NFTCard
            key={index}
            tokenId={item.tokenId}
            opButton={
              <>
                <button
                  style={{ cursor: 'pointer' }}
                  className="h-31px w-68px bg-#006dfe c-white btn-no-border rounded mr-2.5"
                  onClick={() => handleUnSellNft(item.tokenId)}>UnSell</button>
                {/* <button
                  style={{ cursor: 'pointer' }}
                  className="h-31px w-100px bg-#006dfe c-white btn-no-border rounded"
                  onClick={() => handleUnSellNft(item.tokenId)}>changePrice</button> */}
              </>
            } />
        ))}
      </div>
    </>

  );
};

interface DialogProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-150px w-400px bg-#fff rounded-xl flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default MyNFT;