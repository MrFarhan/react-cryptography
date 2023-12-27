import CryptoJS from "crypto-js";
import { useState, useCallback } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("encrypt");
  const [algorithm, setAlgorithm] = useState("AES");
  const [result, setResult] = useState({ data: "", error: null });

  const secretPass = "XkhZG4fW2t2W";

  const resetStates = () => {
    setText("");
    setResult({ data: "", error: null });
  };

  const encryptData = () => {
    try {

      let data;
      switch (algorithm) {
        case "AES":
          data = CryptoJS.AES.encrypt(JSON.stringify(text), secretPass).toString();
          break;
        case "TripleDES":
          data = CryptoJS.TripleDES.encrypt(JSON.stringify(text), secretPass).toString();
          break;
        case "DES":
          data = CryptoJS.DES.encrypt(JSON.stringify(text), secretPass).toString();
          break;
        default:
          break;
      }
      setResult({ data, error: null });
    } catch (e) {
      setResult({ data: "", error: "Encryption failed. Please check your input." });
    }
  };

  const decryptData = () => {
    try {
      let bytes, data;
      switch (algorithm) {
        case "AES":
          bytes = CryptoJS.AES.decrypt(text, secretPass);
          break;
        case "TripleDES":
          bytes = CryptoJS.TripleDES.decrypt(text, secretPass);
          break;
        case "DES":
          bytes = CryptoJS.DES.decrypt(text, secretPass);
          break;
        default:
          break;
      }

      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setResult({ data, error: null });
    } catch (e) {
      setResult({ data: "", error: "Decryption failed. Please check your decryption key." });
    }
  };

  const handleButtonClick = useCallback(() => {
    if (!text) return setResult({ data: "", error: "Please type something that you want to encrypt." });;

    if (screen === "encrypt") encryptData();
    else decryptData();
  }, [text, screen, algorithm]);

  const switchScreen = useCallback((type) => {
    resetStates();
    setScreen(type);
  }, []);

  return (
    <div className="container">
      <h1>Cryptography Tool</h1>
      <div className="button-container">
        <button
          className={screen === "encrypt" ? "active" : ""}
          onClick={() => switchScreen("encrypt")}
        >
          Encrypt
        </button>
        <button
          className={screen === "decrypt" ? "active" : ""}
          onClick={() => switchScreen("decrypt")}
        >
          Decrypt
        </button>
      </div>

      <div className="select-wrapper">
        <select
          value={algorithm}
          onChange={({ target }) => setAlgorithm(target.value)}
        >
          <option value="AES">AES</option>
          <option value="TripleDES">Triple DES</option>
          <option value="DES">DES</option>
        </select>
      </div>

      <div className="input-container">
        <input
          value={text}
          onChange={({ target }) => setText(target.value)}
          name="text"
          type="text"
          placeholder={screen === "encrypt" ? "Enter Text" : "Enter Encrypted Data"}
        />
      </div>

      <button className="submit-btn" onClick={handleButtonClick}>
        {screen === "encrypt" ? "Encrypt" : "Decrypt"}
      </button>

      {result.error && <div className="error">{result.error}</div>}

      {result.data && (
        <div className="content">
          <label>{screen === "encrypt" ? "Encrypted" : "Decrypted"} Data</label>
          <p>{result.data}</p>
        </div>
      )}
    </div>
  );
}

export default App;
