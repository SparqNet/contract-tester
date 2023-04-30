import { create} from "zustand";
import { CM, CABI } from "./abis/abis.js";
import { cmAddress } from "./constants.js";




export const useStore = create((set) => ({
  uploadedContracts: [],
  tab: "",
  abi: CM,
  contractAbi: [],
  contractAddress: "0x00",
  cmAddress: cmAddress,
  instance: undefined,
  contractInstance: [],
  allFunctions: [],
  allContractFunctions: [],
  deployedContracts: [],
  pageList: [],
  setPageList: (pages) => {
    set({pageList: pages});
  },
  changeContractAddress: (address) => {
    set({ contractAddress: address });
  },

  changeContractManagerAbi: (abi) => {
    set({ abi: abi });
  },

  changeContractAbi: (abi) => {
    set({ contractAbi: abi });
  },
  updateContractInstance: (instance) => {
    set({ contractInstance: instance });
  },
  updateContractAddress: (address) => {
    set({ contractAddress: address });
  },
  updateInstance: (instance) => {
    set({ instance: instance });
  },
  updateAllFunctions: (functions) => {
    set({ allFunctions: functions });
  },
  updateDeployedContracts: (contracts) => {
    set({ deployedContracts: [contracts] });
  },
  updateTab: (tab) => {
    set({ tab: tab });
  },
  updateAllContractFunctions: (functions) => {
    set({ allContractFunctions: functions });
  },
  updateContractManagerAddress: (address) => {
    set({ cmAddress: address });
  },

  updateUploadedContracts: (contract) => {
    set({ uploadedContracts: contract});
  },

  clearUploadedContracts: () => {
    set({uploadedContracts: defaultUploaded})
  }
}));

export const initialStore = () => {
        return create((set) => ({ 
            pageList: [],
            setPageList: (pages) => {
              set({pageList: pages});
            },
        }))
}