import React from 'react';
import './App.css';
import { truncateAddress } from 'utils';
import { OwnedNft } from 'alchemy-sdk';

const NFTCard = ({ nft }: { nft: OwnedNft; }) => {
  return (
    <div className="m-1 h-auto overflow-hidden rounded-xl bg-neutral-200/90 shadow-xl ">
      {nft.image && (
        <div
          className="h-[300px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${nft.image.cachedUrl})` }}
        />
      )}
      <div className="relative h-[200px] bg-neutral-200/90 p-5 text-left ">
        <h3 className="font-mono font-black">
          {nft.collection?.name || 'Unknown Collection'}
        </h3>
        <p className="font-mono font-light text-neutral-800">
          {truncateAddress(nft.contract?.address)}
        </p>
        <p className="absolute bottom-8 right-4 w-48 truncate text-right font-mono ">
          {nft.tokenId}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;
