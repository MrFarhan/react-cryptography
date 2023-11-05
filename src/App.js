import CryptoJS from "crypto-js";
import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("encrypt");

  const [encrptedData, setEncrptedData] = useState("");
  const [decrptedData, setDecrptedData] = useState("");
  const [error, setError] = useState(null); // New state for error handling

  const secretPass = "XkhZG4fW2t2W";

  const encryptData = () => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      secretPass
    ).toString();

    setEncrptedData(data);
    setError(null);
  };

  const decryptData = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, secretPass);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecrptedData(data);
      setError(null);
    } catch (e) {
      setError("Decryption failed. Please check your decryption key.");
    }
  };

  const switchScreen = (type) => {
    setText("");
    setEncrptedData("");
    setDecrptedData("");
    setError(null);
    setScreen(type);
  };

  const handleClick = () => {
    if (!text) return;

    if (screen === "encrypt") encryptData();
    else decryptData();
  };

  return (
    <div className="container">
      <div>
        <button
          className="btn btn-left"
          style={{
            backgroundColor: screen === "encrypt" ? "#5e35b1" : "#5e35b130",
          }}
          onClick={() => {
            switchScreen("encrypt");
          }}
        >
          Encrypt
        </button>

        <button
          className="btn btn-right"
          style={{
            backgroundColor: screen === "decrypt" ? "#1e88e5" : "#1e88e530",
          }}
          onClick={() => {
            switchScreen("decrypt");
          }}
        >
          Decrypt
        </button>
      </div>

      <div className="card">
        <input
          value={text}
          onChange={({ target }) => {
            setText(target.value);
          }}
          name="text"
          type="text"
          placeholder={
            screen === "encrypt" ? "Enter Text" : "Enter Encrypted Data"
          }
        />

        <button className="btn submit-btn" onClick={handleClick}>
          {screen === "encrypt" ? "Encrypt" : "Decrypt"}
        </button>
      </div>

      {error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : null}

      {encrptedData || decrptedData ? (
        <div className="content">
          <label>{screen === "encrypt" ? "Encrypted" : "Decrypted"} Data</label>
          <p>{screen === "encrypt" ? encrptedData : decrptedData}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
