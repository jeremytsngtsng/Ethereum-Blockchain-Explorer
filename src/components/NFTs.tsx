import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import SwiperCore from 'swiper';
import NFTCard from './NFTCard';
import './App.css';
import { OwnedNft, OwnedNftsResponse } from 'alchemy-sdk';
import { Pagination } from 'swiper/modules';
import _ from 'lodash';

interface NFTsParams {
  nfts: OwnedNftsResponse;
  getNextPage: () => void;
}

const NFTs = ({ nfts, getNextPage }: NFTsParams) => {
  const [items, setItems] = useState<OwnedNft[]>([]);

  SwiperCore.use([Pagination]);

  useEffect(() => {
    if (!_.isEqual(items, nfts.ownedNfts)) {
      setItems((prevItems) => [...prevItems, ...nfts.ownedNfts]);
    }
  }, [nfts.ownedNfts]);

  return (
    <div className="my-4 gap-4 space-y-2 overflow-hidden rounded-xl bg-neutral-100/30 p-6 shadow-light md:grid-cols-3">
      <Swiper
        breakpoints={{
          768: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          1080: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          2500: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
        pagination={{
          clickable: true
        }}
        onClick={(e) => {
          console.log(e);
        }}
        modules={[Pagination]}
        onReachEnd={() => {
          getNextPage();
        }}
        className="mySwiper"
      >
        {items.map((nft, index) => (
          <SwiperSlide key={nft.tokenId || index}>
            <NFTCard nft={nft} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NFTs;
