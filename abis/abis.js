export const CABI = [
  {
    inputs: [],
    name: "Default",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const CM = [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "supply",
            type: "uint256",
          },
        ],
        name: "createNewERC20Contract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
          },
        ],
        name: "createNewERC20NativeWrapperContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "createNewERC20WrapperContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getDeployedContracts",
        outputs: [
          {
            internalType: "string[]",
            name: "",
            type: "string[]",
          },
          {
            internalType: "address[]",
            name: "",
            type: "address[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
	]
