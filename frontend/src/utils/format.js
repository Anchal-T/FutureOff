export const formatNumber = (value, decimals = 2) =>
  Number(value).toFixed(decimals);

export const formatPercent = (value) => `${formatNumber(value)}%`;

export const formatAddress = (address) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;