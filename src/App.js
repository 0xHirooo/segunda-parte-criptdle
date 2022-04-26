import "./App.css";

import { ethers } from "ethers"; 
import { useState } from "react";

import Criptdle from "./contracts/Criptdle.json"; 

const criptdleAddress = "0xbA2fab7f9D1cb23F6f0A5B1b0CB4d9e6298EE44a"; 

function App() {
  const [words, setWords] = useState([]); 
  const [word, setWord] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [randomWord, setRandomWord] = useState();
  const [isUsed, setIsUsed] = useState();

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
      setWord("");
      setIsLoading(false);
    }
  }


  async function fetchWord() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        criptdleAddress,
        Criptdle.abi,
        provider
      );
      try {
        const data = await contract.getWord();
        setRandomWord(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    } else {
      alert("Tenés que tener Metamask instalada.");
    }
  }


  async function checkIfIsUsed() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        criptdleAddress,
        Criptdle.abi,
        provider
      );
      try {
        const data = await contract.isUsed(randomWord);
        
        if(data) {
          setIsUsed("La palabra ya fue usada");
        } else {
          setIsUsed("La palabra nos sirve");
        }


      } catch (err) {
        console.log("Error: ", err);
      }
    } else {
      alert("Tenés que tener Metamask instalada.");
    }
  }


  async function markAsUsed() {
    if (!randomWord) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        criptdleAddress,
        Criptdle.abi,
        signer
      );

      const transaction = await contract.useWord(randomWord);
      await transaction.wait();

    }
  }

  return (
    <div className="App">
      <button onClick={fetchWords}>Ver las palabras</button>
      <br />
      <br />
      <br />
      <input
        placeholder="Nueva palabra..."
        onChange={(e) => setWord(e.target.value)}
        value={word}
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


      <br />
      <br />
      
      <button onClick={fetchWord}>Traer una palabra al azar</button>
      <br />
      <br />
      <ul className="Words">
        <li>{randomWord}</li>
      </ul>


      <br />
      <br />
      
      <button onClick={checkIfIsUsed}>fue usada la palabra?</button>
      <br />
      <br />
      <ul className="Words2">
       <li>{isUsed}</li>
      </ul>
      <br />
      <br />
      
      <button onClick={markAsUsed}>Marcar la palabra como usada</button>
    </div>
  );
}

export default App;
