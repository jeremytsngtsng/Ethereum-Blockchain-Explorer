import React, { useState, useEffect } from 'react';
import './App.css';
import { AssetTransfersResponse, AssetTransfersResult } from 'alchemy-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { truncateAddress } from 'utils';
import _ from 'lodash';
import { useAddress } from 'context/AddressContext';
import { Fade } from 'react-awesome-reveal';

interface TransactionsListProps {
  transactions: AssetTransfersResponse;
  getNextPage: () => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  getNextPage
}) => {
  const { gotAddressInfo } = useAddress();
  const [items, setItems] = useState<AssetTransfersResult[]>([]);
  const [pageKey, setPageKey] = useState<string | undefined>(
    transactions.pageKey
  );
  const [loading, setLoading] = useState(false);
  const [copiedHashes, setCopiedHashes] = useState<{ [key: string]: boolean; }>(
    {}
  );

  useEffect(() => {
    const container = document.getElementById('scroll-container');

    const handleScroll = () => {
      if (container) {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && pageKey) {
          loadMoreItems();
        }
      }
    };

    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [pageKey, loading]);

  useEffect(() => {
    setPageKey(transactions.pageKey);
  }, [transactions.pageKey]);

  useEffect(() => {
    if (!_.isEqual(items, transactions.transfers)) {
      setItems((prevItems) => [...prevItems, ...transactions.transfers]);
    }
  }, [transactions.transfers]);

  useEffect(() => {
    if (!gotAddressInfo) setItems([]);
  }, [gotAddressInfo]);

  const loadMoreItems = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await getNextPage();
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string | null, hash: string) => {
    text &&
      navigator.clipboard.writeText(text).then(() => {
        setCopiedHashes((prev) => ({
          ...prev,
          [hash]: true
        }));
        setTimeout(() => {
          setCopiedHashes((prev) => ({
            ...prev,
            [hash]: false
          }));
        }, 2000);
      });
  };

  return (
    <div
      id="scroll-container"
      className="scroll-container my-4 flex h-[500px] w-full flex-col gap-4 overflow-auto rounded-xl bg-neutral-100/30 p-6 shadow-light"
    >
      {items.map((transaction) => {
        const isCopiedFrom =
          copiedHashes[`${transaction.hash}-${transaction.from}`];
        const isCopiedTo = copiedHashes[`${transaction.hash}-${transaction.to}`];
        return (
          <Fade
            triggerOnce
            direction="up"
            duration={850}
            cascade
            damping={0.1}
            key={transaction.hash}
            className="flex h-auto w-full cursor-pointer flex-col rounded-xl border-2 border-neutral-600/30 bg-neutral-600/10 p-4 shadow-md hover:bg-neutral-600/50"
          >
            <div>
              <div className="flex flex-col justify-between gap-6 md:flex-row">
                <p className="truncate text-sm font-semibold">
                  Transaction Hash: {transaction.hash}
                </p>
                <p className="text-sm font-semibold">
                  Block: {transaction.blockNum}
                </p>
              </div>
              <div className="mt-2 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-10">
                <div className="flex w-full flex-col items-center md:flex-row justify-center">
                  <div className="flex">
                    <p className="truncate text-sm font-semibold">
                      From: {truncateAddress(transaction.from)}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          transaction.from,
                          `${transaction.hash}-${transaction.from}`
                        )
                      }
                      className="ml-2 text-sm font-semibold underline"
                    >
                      <FontAwesomeIcon
                        icon={isCopiedFrom ? faCheck : faCopy}
                        className={`copy-icon text-sm text-neutral-800/60 hover:text-neutral-800 ${isCopiedFrom ? 'icon-animate' : ''
                          }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="mx-2 rotate-90 text-xl md:rotate-0">→</p>
                <div className="flex w-full flex-col items-center md:flex-row justify-center">
                  <div className="flex">
                    <p className="truncate text-sm font-semibold">
                      To: {truncateAddress(transaction.to)}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          transaction.to,
                          `${transaction.hash}-${transaction.to}`
                        )
                      }
                      className="ml-2 text-sm font-semibold underline"
                    >
                      <FontAwesomeIcon
                        icon={isCopiedTo ? faCheck : faCopy}
                        className={`copy-icon text-sm text-neutral-800/60 hover:text-neutral-800 ${isCopiedTo ? 'icon-animate' : ''
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        );
      })}
      {loading && <p className="text-center">Loading more transactions...</p>}
    </div>
  );
};

export default TransactionsList;
