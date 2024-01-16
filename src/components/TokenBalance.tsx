import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './App.css';

export interface OwnedToken {
  contractAddress: string;
  rawBalance?: string;
  balance?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logo?: string;
  error?: string;
}

interface TokenBalanceProps {
  tokens: OwnedToken[];
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ tokens }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredAndSortedTokens = useMemo(() => {
    return tokens
      .filter((token) => token.balance && parseFloat(token.balance) > 0)
      .sort((a, b) => {
        const balanceA = parseFloat(a.balance || '0');
        const balanceB = parseFloat(b.balance || '0');
        return balanceB - balanceA;
      });
  }, [tokens]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="my-4 flex w-full flex-col gap-4 space-y-2 overflow-hidden rounded-xl bg-neutral-100/30 p-6 shadow-light">
      <div
        className={`grid-container grid grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2 2xl:grid-cols-3 ${isExpanded ? 'expanded' : 'collapsed'
          }`}
      >
        {filteredAndSortedTokens.map((token, index) => (
          <div
            key={index}
            className="flex h-auto w-full cursor-pointer flex-col rounded-xl border-2 border-neutral-600/30 bg-neutral-600/10 p-4 shadow-md hover:bg-neutral-600/50"
          >
            <div className="flex justify-between truncate">
              <div className="flex flex-col">
                <p className="font-mono text-lg">
                  {token.name || 'Unknown Token'}
                </p>
                <p className="text-sm">{token.symbol}</p>
              </div>
              {token.logo && (
                <img
                  src={token.logo}
                  alt={`${token.name} Logo`}
                  className="token-logo self-start"
                />
              )}
            </div>
            <div className="grow">
              <p className="truncate font-mono text-lg">
                {new Intl.NumberFormat().format(
                  parseFloat(token.balance ? token.balance : '')
                ) || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="flex cursor-pointer justify-center rounded-md bg-neutral-300/40 p-[8px] hover:bg-neutral-300/80"
        onClick={toggleExpand}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </button>
    </div>
  );
};

export default TokenBalance;
