# SparqNet Contract Testing Environment

Front-end site built for testing contract logic within OrbiterSDK.

Clone this project, open up your IDE, navigate into its root folder and follow the steps below.

## Dependencies

```
sudo apt install npm
sudo npm install --global yarn
npm install next react@latest react-dom
```

## Deploying

```
yarn install
yarn build
yarn start
```

It should run on http://localhost:3000 unless you already have something running. The link also appears in the terminal as it is deployed.

## How to use

When you open the home page, it'll automatically ask for you to connect to MetaMask. You can also click on the "Connect MetaMask" button on the bottom of the left sidebar to do it manually.

You will also see two other tabs - "Contract Manager" (the one open by default) and "Custom Contract". The first one shows the function calls for the default Contract Manager protocol contract that we have supplied within the OrbiterSDK project, and the second one is where you will call your custom contracts.

### Contract Manager tab

If you want to use the default contract, just type the required parameters on the function you want to call, and call it by clicking the "Call" button beside it.

If you want to create a custom version of the Contract Manager, you will need to follow these steps:

1. Deploy the custom contract to the network
2. Take the custom contract address and put it at the top, in the “Contract Manager Address” field
3. Add the custom contract's ABI by clicking the button next to the "Enter your own JSON ABI" label, choosing your JSON ABI file, and then clicking "Upload"
4. Finally, click the “Get Functions” button to show the custom contract's functions and input fields

**NOTE:** We do not advise you remove the “getDeployedContracts” function on any custom contract implementations you create. We have a statically placed table at the end of the page for quick reference to all the contracts deployed on the network by the contract manager. Use this to quickly fetch the addresses of deployed contracts to be able to interact with them.

### Custom Contract tab

If you want to interact with a custom contract, make sure the type is defined and added to the Contract Manager so you can deploy an instance of the contract.

After deploying, grab the address from the “Deployed Contracts” list, click on the “Custom Contract” tab and repeat steps 1-4 as you did earlier with the Contract Manager.

Every time you want to change contracts, deploy a new one, change the address and ABI using the inputs, and get the functions.

**NOTE:** The ABI needs to be a valid JSON ABI as in an array. It should look something like this:

```
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

**NOTE:** If you are passing an array as input values, just separate them by commas, and the application will do all the necessary changes.

Thank you for using the SparqNet contract testing environment!


Future updates include:
  -- One-click address copy
  -- Toast notifications on contract execution
