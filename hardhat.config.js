require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
 
const NEXT_PUBLIC_RPC_URL = "https://rpc-amoy.polygon.technology/";   
const NEXT_PUBLIC_PRIVATE_KEY = "a8809b40c030628ad29be1febd1bc3b29a2298837699837d8bb9e97004a93b17f";
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "Polygon Amoy",
  networks: {
    hardhat: {},
    polygon_amoy: {
      url: NEXT_PUBLIC_RPC_URL,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
      chainId: 80002,
    },
  },
};


//staking new: 0x650071AcDF7a313C2D415E473CB3b908118c0038