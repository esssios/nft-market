# nft-market
## description
bulid your own nft market(just for learning)


## environment
solidity | ether.js | hardhat | react | ts | node.js | ipfs | remix

## 1 deploy contracts
```bash
  cd ./NFT-market-contract

  yarn install

  # generate local eth blockchain
  npx hardhat node

  # remix connect local filesystem
  #(note: remember to change your own path)
  remixd -s /Users/wei/program/web/nft-market/NFT-market-contract -u https://remix.ethereum.org
```

  in remix, select the environment which is "Dev Hardhat Provider"

  compile & deploy the three contracts to your local eth blockchain 
  (note: you must deploy erc20-usdt.sol and erc721-nft.sol first, because the nft-market.sol need to use the address of them)

## 2 run backend server

## 3 run frontend

reference: https://www.bilibili.com/video/BV1by4y1A7M7/?spm_id_from=333.999.0.0&vd_source=e571088ad909ca40753c88b512657ce7