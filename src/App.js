import "./App.css";
import { ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import myEpicNft from "./utils/MyEpicNFT.json";
import nft1 from "./assets/nft/nft1.svg";
import bgMusic from "./assets/bg-music.mp3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x464698959D05e1162e25d7E402F02e229C09BA58";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const audioRef = useRef();

  /**
   * Check if wallet is connected
   * @returns {Promise<void>}
   */
  const checkIfWalletIsConnected = async () => {
    console.log("This function is called!");

    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    const sepoliaChainId = "0xaa36a7"; // Sepolia Test network
    if (chainId !== sepoliaChainId) {
      toast.error("You are not connected to the Sepolia Test Network!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  /**
   * Connect wallet
   * @returns {Promise<void>}
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (error) {
      console.log(error);
    }

    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  /**
   * Setup event listener
   * @returns {Promise<void>}
   */
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Ask contract to mint NFT when button is clicked
   * @returns {Promise<void>}
   */
  const askContractToMintNft = async () => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        toast.promise(nftTxn, {
          loading: "Minting NFT...",
          success: (nftTxn) => {
            console.log(nftTxn);
            console.log(
              `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
            );
            return `NFT successfully minted! See transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`;
          },
          error: "Error minting NFT",
        });

        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("UseEffect is called!");
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="btn-style">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="btn-style">
      Mint NFT
    </button>
  );

  return (
    <section id="hero">
      <div className="container">
        <ToastContainer />
        <div className="row g-5 align-items-center justify-content-center">
          <div className="col-lg-7 col-md-7 col-sm-6 col- mb-5 col-11">
            <h1 className="neonText">
              CosmoPunk
              <br />
              Studio
            </h1>
            <p className="header gradient-text">Craft, Click, Crypto</p>

            {currentAccount === ""
              ? renderNotConnectedContainer()
              : renderMintUI()}
          </div>
          <div className="col-lg-4 col-md-5 col-sm-6 col-11 mb-5">
            <div className="p-3 bg-custom">
              <img src={nft1} alt="CosmoPunk" />
              <h2 className="mt-4">
                What you might <span className="color-black">create</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={bgMusic} autoPlay loop></audio>
    </section>
  );
};

export default App;
