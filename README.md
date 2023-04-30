## How to use the SparqNet contract testing environment:

Open up your IDE and navigate into the contract-tester folder. Run the following commands in the terminal:

```
yarn install
```

then

```
yarn start
```

It should run on localhost:3000 unless you already have something running. Follow the link that is shown in your terminal for where it was deployed.

When you land on the home page you will see the function calls for the default Contract Manager protocol contract we have supplied. If you want to use the default contract just put in the necessary parameters and call your desired function.

If you want to create a custom version of the Contract Manager you will need to follow these steps:

1. Deploy the contract to the network
2. Take the address from the deployment and input it at the top where it says “Contract Manager Address”
3. Add the contract abi by clicking the icon next to the label that says “Upload your own JSON abi”
4. Click “Upload”
5. Finally, click the “Get Functions” button under it to showcase the functions and inputs for the contract you entered.

NOTE: We do not advise you remove the “getDeployedContracts” function on any custom contract implementations you create. We have a statically placed a table at the end of the page for quick reference to all the contracts deployed on the network by the contract manager. Use this to quickly fetch the addresses of deployed contracts to be able to interact with them.

If you want to interact with a custom contract, make sure the type is defined and added to the Contract Manager so you can deploy an instance of the contract.

After deploying, grab the address from the “Deployed Contracts” list and click on the “Custom Contract” tab and repeat steps 1-5 as you did earlier with the Contract Manager.

Every time you want to change contracts, deploy a new one, change the address in the input, change the abi using the input and click get functions.

**NOTE:** The abi will need to be valid json abi not just an array as you might be used to seeing. Make sure the key holding the abi is labeled "abi".It should look something like this:

{
 "abi": [
  {
   inputs: [],
   stateMutability: non-payable,
   outputs: [],
  }
        ]
}

**ANOTHER NOTE:** If you are passing an array as input values, just seperate them by commas, and the application will do all the necessary changes.


Thank you for using the SparqNet contract testing environment!