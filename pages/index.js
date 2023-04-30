import Image from "next/image";
import { Inter } from "next/font/google";
import React from "react";
import { useState, useEffect } from "react";
import { ethers, toBigInt } from "ethers";
import { CM } from "../abis/abis";
import { cmAddress } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

function ContractManager() {
  const [abiInput, setAbiInput] = useState();
  const [response, setResponse] = useState();
  const [deployedContracts, setDeployedContracts] = useState();
  const [address, setAddress] = useState("");

  const [abi, setAbi] = useState();

  function handleAbiSelect(event) {
    setAbiInput(event.target.files[0]);
  }

  const setCMAddress = async (e) => {
    e.preventDefault();
    const input = e.target.value;
    if (input.length !== 42 && input !== "" && input !== undefined) {
      return alert("Please use a valid address");
    }

    if (input === undefined || input === "") {
      return;
    }

    setAddress(input);
  };

  const getInstanceAndFuncts = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, abi, signer);
      const functions = contract.interface.fragments;
      setResponse({ instance: contract, functions: functions });
    } catch (error) {
      console.log(error);
    }
  };

  function handleAbiChange() {
    try {
      console.log(abiInput);
      let reader = new FileReader();
      reader.readAsText(abiInput);
      reader.onload = () => {
        const abi = JSON.parse(reader.result);
        const input = abi.abi;
        setAbi(input);
      };
    } catch (error) {
      console.log({ "invalid json/abi": error });
    }
  }

  const setDefaults = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(cmAddress, CM, signer);
      const functions = contract.interface.fragments;
      setResponse({ instance: contract, functions: functions });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const submitContract = async (e, contractName, index) => {
    e.preventDefault();
    try {
      let params = [];
      const inputs = document.querySelectorAll(`#${contractName} input`);
      console.log(inputs);
      inputs.forEach((element) => {
        if (typeof element.value === "string") {
          params.push(element.value);
        }

        if (typeof element.value === "number") {
          params.push(toBigInt(element.value));
        }
        if (typeof element.value === "bytes32[]") {
          let input = element.value.split(",")
          params.push(input)

        }
        if (typeof element.value === "bytes[]") {
          let input = element.value.split(",")
          params.push(input)
          
          
        }
        if (typeof element.value === "string[]") {

          let input = element.value.split(",")
          params.push(input)
          
          
        }
        if (typeof element.value === "number[]") {
          
          let input = element.value.split(",")
          const valid = input.map((element) => {
            return toBigInt(element)
          })
          params.push(valid)
          
        } 
      });

      let callResult = await response["instance"]
        [contractName](...params)
        .catch((e) => {
          if (e.code === 4001) {
            console.log(e);
          }
        });

      if (contractName === "getDeployedContracts") {
        setDeployedContracts(callResult);
      }
      return console.log(callResult);
    } catch (error) {
      alert("error, please check that you are on the correct contract. ");

      console.log(error);
    }

    return;
  };

  useEffect(() => {
    try {
      setDefaults();
      return;
    } catch (error) {
      console.log(error);
    }
  },[]);
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto space-y-5 w-full ml-[20vw]">
      <span>
        <div className="flex flex-row justify-center items-start space-x-10 my-12">
          <h2 className={`${inter.className} mb-5 text-xl font-semibold`}>
            Contract Manager
          </h2>

          <form className="flex flex-row">
            <label htmlFor="ManagerAddress"> Contract Manager Address </label>
            <input
              onChange={(event) => setCMAddress(event)}
              className="ml-3"
              id="ManagerAddress"
              name="ManagerAddress "
            />
          </form>
        </div>

        <div className="flex flex-row items-center mb-5">
          <label className="mr-3" htmlFor="abi">
            Enter your own JSON ABI:
          </label>
          <input
            className=""
            id="abi"
            type="file"
            onChange={(e) => handleAbiSelect(e)}
          />

          <button
            onClick={() => handleAbiChange()}
            className="bg-black min-w-[5vw] p-2 text-white rounded-xl"
          >
            Upload
          </button>
        </div>
      </span>

      <span>
        <button
          onClick={(e) => getInstanceAndFuncts(e)}
          className="bg-black min-w-[5vw] p-2 text-white rounded-xl"
        >
          Get Functions
        </button>
      </span>

      <div className="space-y-5">
        {response?.functions?.map((contractFnct, index) => {
          let ind = contractFnct["inputs"]?.map((fnct, index) => {
            return (
              <>
                <span className="flex flex-row space-x-3" key={index}>
                  <label htmlFor={fnct?.name}>
                    {fnct?.name?.toUpperCase()}
                  </label>
                  <input
                    className="w-[10vw] "
                    id={fnct?.name}
                    name={fnct?.name}
                  />
                </span>
              </>
            );
          });

          return (
            <span key={index} className="flex flex-row items-center">
              <h2 className="font-bold mr-4">{contractFnct.name}</h2>
              <form
                id={contractFnct.name}
                className="flex flex-row w-fit space-x-5 items-center "
              >
                {ind}
                <button
                  key={response}
                  onClick={(e) => submitContract(e, contractFnct.name)}
                  className="bg-black min-w-[5vw] p-2 ml-2 text-white rounded-xl"
                >
                  Call
                </button>
              </form>
            </span>
          );
        })}
      </div>

      <div className="h-[30vh] overflow-y-auto flex flex-row space-x-5 mt-5">
        <span className="flex flex-col">
          <h2>Name</h2>
          {deployedContracts?.[0]?.map((contract, index) => {
            return <p key={index}>{contract}</p>;
          })}
        </span>
        <span className="flex flex-col">
          <h2>Address</h2>
          {deployedContracts?.[1]?.map((contract, index) => {
            return <p key={index}>{contract}</p>;
          })}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  // let deployedContracts = [{ address: "0x000", name: "test1" }];
  const [defaultComponent, setDefault] = useState(true);
  const [result, setCallResult] = useState({})

  const [connected, setConnected] = useState(false);
  const [response, setResponse] = useState({});
  const [address, setAddress] = useState("");
  const [contractAbi, setContractAbi] = useState({});
  const [abiInput, setAbiInput] = useState({});

  async function connectToMetamask() {
    // Check if the user has Metamask installed
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install Metamask to use this feature");
      }

      // Request access to the user's Metamask wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create an instance of the ethers.js provider using the user's Metamask wallet
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the user's address from the Metamask wallet
      const signer = await provider.getSigner();
      const address = signer.address;

      console.log(`Connected to Metamask wallet at address ${address}`);
      setConnected(true);
      // Return the provider and signer
      return { signer };
    } catch (error) {
      console.log(error);
    }
  }

  const getInstanceAndFuncts = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, contractAbi, signer);
      const functions = contract.interface.fragments;
      setResponse({ instance: contract, functions: functions });
    } catch (error) {
      console.log(error);
    }
  };

  async function checkIsConnected() {
    try {
      const getAccount = async () =>
        await window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts) => {
            if (accounts.length === 0) {
              console.log("Not Connected");
              setConnected(false);
              return;
            }
            setConnected(true);
          });
      await getAccount();
    } catch (error) {
      console.log(error);
    }
  }

  const submitContract = async (e, FunctName, index) => {
    e.preventDefault();
    try {
      let params = [];
      const inputs = document.querySelectorAll(`#${FunctName} input`);
      console.log(inputs);
      inputs.forEach((element) => {
        if (typeof element.value === "string") {
          params.push(element.value);
        }

        if (typeof element.value === "number") {
          params.push(toBigInt(element.value));
        }

        if (typeof element.value === "bytes32[]") {
          let input = element.value.split(",")
          params.push(input)

        }
        if (typeof element.value === "bytes[]") {
          let input = element.value.split(",")
          params.push(input)
          
          
        }
        if (typeof element.value === "string[]") {

          let input = element.value.split(",")
          params.push(input)
          
          
        }
        if (typeof element.value === "number[]") {
          
          let input = element.value.split(",")
          const valid = input.map((element) => {
            return toBigInt(element)
          })
          params.push(valid)
          
        }
      });

      let callResult = await response["instance"]
        [FunctName](...params)
        .catch((e) => {
          if (e.code === 4001) {
            console.log(e);
          }
        });
      if (typeof(callResult) === "bigint") {
        callResult = callResult.toString()
      }
      return setCallResult({"result":callResult, "function": FunctName});
    } catch (error) {
      alert("error, check that you are on the correct contract. ");
      console.log(error);
    }

    return;
  };

  function handleContractAbiSelect(event) {
    setAbiInput(event.target.files[0]);
  }

  function handleContractAbiChange() {
    try {
      let reader = new FileReader();
      reader.readAsText(abiInput);
      reader.onload = () => {
        const input = JSON.parse(reader.result);
        setContractAbi(input.abi);
      };
    } catch (error) {
      console.log({ "invalid json/abi": error });
    }
  }

  const setContractAddress = async (e) => {
    e.preventDefault();
    const input = e.target.value;
    if (input.length !== 42 && input !== "" && input !== undefined) {
      return alert("Please use a valid address");
    }

    if (input === undefined || input === "") {
      return;
    }

    setAddress(input);
  };

  useEffect(() => {
    let funct = checkIsConnected().then(() => {
      console.error();
    });
    funct;
  }, []);

  return (
    <main className="flex min-h-screen flex-row">
      <div className="bg-black w-[18vw] fixed">
        <span className="flex flex-col h-screen justify-around">
          <Image className="w-[50%] mx-auto" height={100} width={100} src='sparqLogo.svg'/>
          <span className="flex flex-col space-y-10  h-[30vh]">
            <button
              onClick={() => setDefault(true)}
              className="bg-white w-[60%] justify-center flex flex-row mx-auto rounded p-3 outline-none"
            >
              Contract Manager
            </button>
            <button
              onClick={() => setDefault(false)}
              className="bg-white w-[60%] justify-center flex flex-row mx-auto rounded p-3 outline-none"
            >
              Custom Contract
            </button>
          </span>

          {connected == false ? (
            <button
              onClick={() => connectToMetamask()}
              className="bg-white w-[60%] justify-center flex flex-row mx-auto rounded p-5 outline-none items-center"
            >
              Connect Metamask
              <img
                alt="Metamask"
                className="h-[100%] w-[24%] ml-3"
                src="https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png"
              />
            </button>
          ) : (
            <div className="bg-green-200 w-[60%] justify-center flex flex-row mx-auto rounded p-5 outline-none items-center">
              <p>Connected</p>
            </div>
          )}
        </span>
      </div>

      {defaultComponent ? (
        <ContractManager />
      ) : (
        <div
          key={connected}
          className="flex flex-col justify-center items-center w-full ml-[18vw] min-h-screen h-[100%] bg-cyan-200 px-10"
        >
          <div className="flex flex-row justify-center space-x-10 ">
            <h2 className={`${inter.className} mb-5 text-xl font-semibold`}>
              Custom Contract
            </h2>

            <form className="flex flex-row  mb-5">
              <label htmlFor="contractAddress">Contract Address</label>
              <input
                className="ml-3"
                id="contractAddress"
                name="contractAddress"
                onChange={(e) => setContractAddress(e)}
              />
            </form>
          </div>

          <div className="flex flex-row items-center mb-5">
            <label className="mr-3" htmlFor="abi">
              Load a new contract ABI:
            </label>
            <input
              className=""
              id="contractABi"
              type="file"
              onChange={(event) => handleContractAbiSelect(event)}
            />
            <button
              onClick={() => handleContractAbiChange()}
              className="bg-black min-w-[5vw] p-2 text-white rounded-xl"
            >
              Upload
            </button>
          </div>

          <span>
            <button
              onClick={(e) => getInstanceAndFuncts(e)}
              className="bg-black min-w-[5vw] p-2 text-white rounded-xl"
            >
              Get Functions
            </button>
          </span>

          <div className="space-y-5">
            {response?.functions?.map((contractFnct, index) => {
              let ind = contractFnct["inputs"]?.map((fnct, index) => {
                return (
                  <>
                    <span className="flex flex-row space-x-3" key={index}>
                      <label htmlFor={fnct?.name}>
                        {fnct?.name?.toUpperCase()}
                      </label>
                      <input
                        className="w-[10vw] "
                        id={fnct?.name}
                        name={fnct?.name}
                      />
                    </span>
                  </>
                );
              });

              return (
                <span key={index} className="flex flex-row items-center">
                  <h2 className="font-bold mr-4">{contractFnct.name}</h2>
                  <form
                    id={contractFnct.name}
                    className="flex flex-row w-fit space-x-5 items-center "
                  >
                    {ind}
                    <button
                      key={address}
                      onClick={(e) => submitContract(e, contractFnct.name)}
                      className="bg-black min-w-[5vw] p-2 ml-2 text-white rounded-xl"
                    >
                      Call
                    </button>
                  </form>
                  {result?.['function'] === contractFnct.name ? <p className="ml-5">{result?.['result']}</p> : null}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
