# SparqNet Contract Testing Environment

Front-end site built for testing contract logic within OrbiterSDK.

## Setup
### Docker Setup

For running the project in a docker container, we need firstly to clone the repository:

```
git clone https://github.com/SparqNet/contract-tester.git
cd contract-tester
```

Then, install Docker on your system (if you don't have it installed already). Instructions for your system can be found on the links below:

* [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
* [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
* [Docker for Linux](https://docs.docker.com/desktop/install/linux-install/)


After installing Docker, we need to build the image:

```
docker build -t contract-tester .
```

And finally, run the container:

```
docker run -p 3000:3000 contract-tester
```

Also, we can use docker-compose to run the container (it will build the image if it doesn't exist already)

```
docker-compose up
```

The application will run on http://localhost:3000 unless you already have something running.


### Manual Setup

If you want to run the project manually, you will need to install the following dependencies:

```
sudo apt install npm
sudo npm install --global yarn
npm install next react@latest react-dom
```

Then, clone the repository:

```
git clone https://github.com/SparqNet/contract-tester.git
cd contract-tester
```

After that, you will need to install the dependencies:

```
yarn install
```

Finally, you can run the project:

```
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



//Factory
0xE2651E2409D8479572cd1D59eE2e6B9B751deF79
//Native
0x357872F740253583bAadBd7fAd7a192E0f3e22d9
//Router
0x1073652AA8272A19EBF70832d4E3861aC1664F1A
//Silver
0x6D48fDFE009E309DD5c4E69DeC87365BFA0c8119
//Gold
0x5b41CEf7F46A4a147e31150c3c5fFD077e54d0e1