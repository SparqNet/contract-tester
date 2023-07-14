import Image from "next/image";
import { Inter } from "next/font/google";
import React from "react";
import { useState, useEffect } from "react";
import { ethers, toBigInt } from "ethers";
import { CM } from "../abis/abis";
import { cmAddress } from "@/constants";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const inter = Inter({ subsets: ["latin"] });

function ContractManager() {
  const [abiInput, setAbiInput] = useState();
  const [response, setResponse] = useState();
  const [deployedContracts, setDeployedContracts] = useState();
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState([]);

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
      let reader = new FileReader();
      reader.readAsText(abiInput);
      reader.onload = () => {
        const input = JSON.parse(reader.result);
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
      inputs.forEach((element) => {
        if (typeof element.value === "string") {
          params.push(element.value);
        }

        if (typeof element.value === "number") {
          params.push(toBigInt(element.value));
        }
        if (typeof element.value === "bytes32[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "bytes[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "string[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "number[]") {
          let input = element.value.split(",");
          const valid = input.map((element) => {
            return toBigInt(element);
          });
          params.push(valid);
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

  const handleToggleForm = (index) => {
    let updatedShowForm = [...showForm];
    if (updatedShowForm[index] === undefined) {
      updatedShowForm[index] = true;
      setShowForm(updatedShowForm);
    } else {
      updatedShowForm[index] = !updatedShowForm[index];
      setShowForm(updatedShowForm);
    }
  };

  useEffect(() => {
    try {
      setDefaults();
      return;
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto space-y-5 w-full  ml-[18vw] p-10 text-white">
      <span>
        <div className="flex flex-row items-center space-x-10 mt-12 mb-[20vh]">
          <h2 className={`${inter.className} text-xl font-semibold`}>
            Contract Manager
          </h2>

          <form className="flex flex-row items-center h-[2.5rem]">
            <label
              htmlFor="ManagerAddress"
              className="bg-[#333333] rounded-tl-md rounded-bl-md p-2 h-full"
            >
              {" "}
              Contract Manager Address{" "}
            </label>
            <input
              onChange={(event) => setCMAddress(event)}
              id="ManagerAddress"
              name="ManagerAddress "
              className="p-2 h-[calc(100%-2px)] w-[20.5vw]"
            />
          </form>
        </div>

        <div className="flex flex-row items-center mb-5">
          <label className="mr-3" htmlFor="abi">
            Enter your own JSON ABI:
          </label>
          <input
            className="outline-none pl-2"
            id="abi"
            type="file"
            onChange={(e) => handleAbiSelect(e)}
          />

          <button
            onClick={() => handleAbiChange()}
            className="bg-[#333333] min-w-[5vw] p-2 text-white rounded-lg"
          >
            Upload
          </button>
        </div>
      </span>

      <span className="flex flex-row items-center space-x-5">
        <div>
          Press this button to retrieve the functions from your contract
          manager:
        </div>
        <button
          onClick={(e) => getInstanceAndFuncts(e)}
          className="bg-[#333333] min-w-[5vw] p-2 text-white rounded-lg"
        >
          Get Functions
        </button>
      </span>

      <div>
        {response?.functions?.map((contractFnct, index) => {
          let ind = contractFnct["inputs"]?.map((fnct, index) => {
            return (
              <>
                <span
                  className="flex flex-row items-center rounded-lg text-white box-border h-[2rem]"
                  key={index}
                >
                  <div
                    className="bg-[#333333] rounded-tl-md rounded-bl-md px-2 py-1 h-full"
                    htmlFor={fnct?.name}
                  >
                    {fnct?.name?.toUpperCase()}
                  </div>
                  <input
                    className="w-[10vw] text-white pl-2 py-1 h-[calc(100%-2px)]"
                    id={fnct?.name}
                    name={fnct?.name}
                  />
                </span>
              </>
            );
          });

          return (
            <>
              <span
                key={index}
                onClick={() => handleToggleForm(index)}
                className="flex flex-col rounded-lg p-4 shadow-md mr-10 cursor-pointer bg-[#333333] text-shadow"
              >
                <div
                  onClick={() => handleToggleForm(index)}
                  className="flex flex-row items-center justify-between cursor-pointer"
                >
                  <h2 className="font-bold ">{contractFnct.name}</h2>
                  <ChevronDownIcon
                    className={`h-3 w-3 ${
                      showForm[index]
                        ? "transition-all rotate-180 duration-500"
                        : "transition-all rotate-0 duration-500"
                    }`}
                  />
                </div>
              </span>

              <form
                id={contractFnct.name}
                className={`flex flex-col mr-10 space-y-5 ${
                  showForm[index] ? "form-visible" : "form-hidden"
                }`}
              >
                {ind}
                <button
                  key={response}
                  onClick={(e) => submitContract(e, contractFnct.name)}
                  className="bg-[#333333] w-[10vw] max-w-[10vw] p-2 text-white rounded-lg"
                >
                  Call
                </button>
              </form>
            </>
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
  const [result, setCallResult] = useState({});
  const [showForm, setShowForm] = useState([]);
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
      inputs.forEach((element) => {
        if (typeof element.value === "string") {
          params.push(element.value);
        }

        if (typeof element.value === "number") {
          params.push(toBigInt(element.value));
        }

        if (typeof element.value === "bytes32[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "bytes[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "string[]") {
          let input = element.value.split(",");
          params.push(input);
        }
        if (typeof element.value === "number[]") {
          let input = element.value.split(",");
          const valid = input.map((element) => {
            return toBigInt(element);
          });
          params.push(valid);
        }
      });

      let callResult = await response["instance"]
        [FunctName](...params)
        .catch((e) => {
          if (e.code === 4001) {
            console.log(e);
          }
        });
      if (typeof callResult === "bigint") {
        callResult = callResult.toString();
      }
      return setCallResult({ result: callResult, function: FunctName });
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
        setContractAbi(input);
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

  const handleToggleForm = (index) => {
    let updatedShowForm = [...showForm];
    if (updatedShowForm[index] === undefined) {
      updatedShowForm[index] = true;
      setShowForm(updatedShowForm);
    } else {
      updatedShowForm[index] = !updatedShowForm[index];
      setShowForm(updatedShowForm);
    }
  };

  useEffect(() => {
    let funct = checkIsConnected().then(() => {
      console.error();
    });
    funct;
  }, []);

  return (
    <main className="flex min-h-screen flex-row">
      <div className="bg-[#2c2c2c] w-[18vw] fixed rounded-tr-3xl rounded-br-3xl">
        <span className="flex flex-col h-screen justify-around">
          <Image
            className="w-[50%] mx-auto"
            height={100}
            width={100}
            src="sparqLogo.svg"
          />
          <span className="flex flex-col space-y-10  h-[30vh]">
            <button
              onClick={() => setDefault(true)}
              className="bg-[#414141] w-[70%] text-white justify-center flex flex-row mx-auto rounded p-3 outline-none"
            >
              Contract Manager
            </button>
            <button
              onClick={() => setDefault(false)}
              className="bg-[#414141] text-white w-[70%] justify-center flex flex-row mx-auto rounded p-3 outline-none"
            >
              Custom Contract
            </button>
          </span>

          {connected == false ? (
            <button
              onClick={() => connectToMetamask()}
              className="bg-white w-[70%] text-black justify-center flex flex-row mx-auto rounded p-5 outline-none items-center"
            >
              <p className="w-[50%]">Connect Metamask</p>
              <Image
                alt="Metamask"
                className="h-[100%] w-[50%] ml-4"
                width={100}
                height={100}
                src="/metamask.png"
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
          className="flex flex-col w-full ml-[18vw] min-h-screen h-[100%] px-10 text-white"
        >
          <div className="flex flex-row items-center space-x-10 mt-12 mb-[10vh] ">
            <h2 className={`${inter.className} text-xl font-semibold`}>
              Custom Contract
            </h2>

            <form className="flex flex-row items-center h-[2.5rem]">
              <label
                htmlFor="contractAddress"
                className="bg-[#333333] rounded-tl-md rounded-bl-md p-2 h-full"
              >
                {" "}
                Contract Address{" "}
              </label>
              <input
                onChange={(e) => setContractAddress(e)}
                id="contractAddress"
                name="contractAddress"
                className="p-2 h-[calc(100%-2px)] w-[20.5vw]"
              />
            </form>
          </div>

          <div className="flex flex-row items-center mb-5">
            <label className="mr-3" htmlFor="abi">
              Load a new contract ABI:
            </label>
            <input
              className="outline-none pl-2"
              id="contractABi"
              type="file"
              onChange={(event) => handleContractAbiSelect(event)}
            />
            <button
              onClick={() => handleContractAbiChange()}
              className="bg-[#333333] min-w-[5vw] p-2 text-white rounded-lg"
            >
              Upload
            </button>
          </div>
          <span className="flex flex-row items-center space-x-5 mb-[5vh] mt-[1vh]">
            <div>
              Press this button to retrieve the functions from your contract:
            </div>
            <button
              onClick={(e) => getInstanceAndFuncts(e)}
              className="bg-[#333333] min-w-[5vw] p-2 text-white rounded-lg"
            >
              Get Functions
            </button>
          </span>

          <div className="space-y-5 mb-12">
            {response?.functions?.map((contractFnct, index) => {
              let ind = contractFnct["inputs"]?.map((fnct, index) => {
                return (
                  <>
                    <span
                  className="flex flex-row items-center rounded-lg text-white box-border h-[2rem]"
                  key={index}
                >
                  <div
                    className="bg-[#333333] rounded-tl-md rounded-bl-md px-2 py-1 h-full"
                    htmlFor={fnct?.name}
                  >
                    {fnct?.name?.toUpperCase()}
                  </div>
                  <input
                    className="w-[10vw] text-white pl-2 py-1 h-[calc(100%-2px)]"
                    id={fnct?.name}
                    name={fnct?.name}
                  />
                </span>
                  </>
                );
              });

              return (
                <>
                  <span
                    key={index}
                    onClick={() => handleToggleForm(index)}
                    className="flex flex-col rounded-lg p-4 shadow-md mr-10 cursor-pointer bg-[#333333] text-shadow"
                  >
                    <div
                      onClick={() => handleToggleForm(index)}
                      className="flex flex-row items-center justify-between cursor-pointer"
                    >
                      <h2 className="font-bold ">{contractFnct.name}</h2>
                      <ChevronDownIcon
                        className={`h-3 w-3 ${
                          showForm[index]
                            ? "transition-all rotate-180 duration-500"
                            : "transition-all rotate-0 duration-500"
                        }`}
                      />
                    </div>
                  </span>

                  <form
                    id={contractFnct.name}
                    className={`flex flex-col mr-10 space-y-5 ${
                      showForm[index] ? "form-visible" : "form-hidden"
                    }`}
                  >
                    {ind}
                    <span className="flex flex-row text-white items-center space-x-12">
                      <button
                        key={response}
                        onClick={(e) => submitContract(e, contractFnct.name)}
                        className="bg-[#333333] w-[10vw] max-w-[10vw] p-2 text-white rounded-lg"
                      >
                        Call
                      </button>
                      {contractFnct.name === result.function ? (
                        <span>Result: {result.result}</span>
                      ) : null}
                    </span>
                  </form>
                </>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
