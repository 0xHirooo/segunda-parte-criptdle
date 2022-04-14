import "./App.css";

import { ethers } from "ethers"; 
import { useState } from "react";

import Criptdle from "./contracts/Criptdle.json"; 

const criptdleAddress = "0xB0aA6b71A262D279CeB9a8f26AcD0184A50014f7"; 

function App() {
  const [words, setWords] = useState([]); 
  const [word, setWord] = useState(); 
  const [isLoading, setIsLoading] = useState(false); 
  async function fetchWords() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        criptdleAddress,
        Criptdle.abi,
        provider
      );
      try {
        setIsLoading(true);
        const data = await contract.readWords();
        setWords(data);
        setIsLoading(false);
      } catch (err) {
        console.log("Error: ", err);
      }
    } else {
      alert("Tenés que tener Metamask instalada.");
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function newWord() {
    if (!word) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        criptdleAddress,
        Criptdle.abi,
        signer
      );

      setIsLoading(true);
      const transaction = await contract.createWord(word);
      await transaction.wait();
      fetchWords();
      setIsLoading(false);
    }
  }

  return (
    <div className="App">
      <button onClick={fetchWords}>Traer las palabras</button>
      <br />
      <br />
      <br />
      <input
        placeholder="Nueva palabra..."
        onChange={(e) => setWord(e.target.value)}
      />
      <br />
      <br />
      <button onClick={newWord}>Crear palabra</button>

      <br />
      <br />
      {isLoading && <div className="Loading"></div>}
      <ul className="Words">
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
