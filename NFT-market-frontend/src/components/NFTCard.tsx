import { ReactNode, useEffect, useState } from 'react';
import { nftOperationFunc } from '../utils/nft';
import { marketOperationFunc } from '../utils/market';

import { Metadata } from '../types/metadata';
import { Order } from '../types/order';

type NFTCardProps = {
  tokenId: number;
  opButton: ReactNode;
};
const NFTCard = ({ tokenId, opButton }: NFTCardProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { getMetadata } = await nftOperationFunc();
      const {getOrder} = await marketOperationFunc();
      try {
        const fetchedMetadata = await getMetadata(tokenId);
        const fetchedOrder = await getOrder(tokenId);

        // 确保顺序正确
        setMetadata(fetchedMetadata);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchInfo();
  }, [tokenId]); // 添加 tokenId 到依赖数组

  if (!metadata || !order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex mt-25px p-20px card-shadow min-w-xl max-w-2xl rounded-xl">
      <div className="flex-1">
        <img className="w-100%" src={metadata.imageURL} alt={metadata.title} />
      </div>
      <div className="flex-1 text-align-left pl-20px">
        <p>title: {metadata.title}</p>
        <p>description: {metadata.description}</p>
        <p>Seller: {order.seller}</p>
        <p>Price: {order.price} FUSDT</p>
        <p>Token ID: {order.tokenId}</p>
        {opButton}
      </div>
    </div>
  );
};

export default NFTCard;