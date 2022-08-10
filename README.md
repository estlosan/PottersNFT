# Potters Smart Contract 🧙‍♂️

This is the official repository for Potters Smart Contracts using Truffle Framework. <br />
Potters contract allow generate random Harry Potter NFTs using [Chainlink VRF](https://docs.chain.link/docs/vrf/v2/introduction/)

<br />

To avoid `fulfillRandomWords()` revert, Potters Contract only store the random number by calling `reserveRandomNFT()`. Once the random number is generated `mint()` function may be called.

## Table of Contents

- [🛠️ Pre-requisites](#%EF%B8%8F-pre-requisites)
  - [Node.js](#1-nodejs)
  - [Truffle CLI](#2-truffle)
- [👨‍💻 Getting Started](#👨‍💻-getting-started)
  - [Install Dependencies](#-install-dependencies)
- [⚗️ Testing](#⚗️-testing)
- [⌨️ Playground](#⌨️-playground)


### 🛠️ Pre-requisites

#### 1. Node.js

To install the latest version of Node.js, click [here](https://nodejs.org/en/) and follow the steps.

#### 2. Truffle

To install truffle, run the following command:

```bash
npm i -g truffle
```

### 👨‍💻 Getting Started

#### Install Dependencies

```sh
npm i
```

### ⚗️ Testing

All the testing scripts are under the `test` folder. To run the test run the following commands:

```bash
$ truffle test
```

### ⌨️ Playground

#### Ethereum - Goerli testnet

I have already deployed a sample contract to [Goerli testnet](https://goerli.etherscan.io/) network. You can play with it. In this test version of the contract, anybody can `reserve a randomNFT` and `mint` it.

| Contract                                                     | Token address |
| ------------------------------------------------------------ | ------------- |
| [`Potters.sol`](contracts/Potters.sol)          | [0x96AEc092d389bEe607f0dB778998cc77A5Ec27aC](https://goerli.etherscan.io/address/0x96AEc092d389bEe607f0dB778998cc77A5Ec27aC)

Also you can check minted NFTs on: https://goerli.pixxiti.com/nfts/0x96aec092d389bee607f0db778998cc77a5ec27ac/${nftId} where `nftId` can be a value between 0 and 4.