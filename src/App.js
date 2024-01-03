import CryptoJS from "crypto-js";
import { useState, useCallback } from "react";
import JSEncrypt from 'jsencrypt';
import "./App.css";

function sdesEncrypt(plaintext, key) {
  const ip = [2, 6, 3, 1, 4, 8, 5, 7];
  const permutedPlaintext = ip.map((bit) => plaintext[bit - 1]);

  const left = permutedPlaintext.slice(0, 4);
  const right = permutedPlaintext.slice(4);

  const key1 = key.slice(0, 1) + key.slice(1, 2) + key.slice(2, 3) + key.slice(3, 4) + key.slice(4, 5);
  const key2 = key.slice(5, 6) + key.slice(6, 7) + key.slice(7, 8) + key.slice(8, 9) + key.slice(9, 10);

  const expandedRight = [right[3], right[0], right[1], right[2], right[1], right[2], right[3], right[0]];
  const xorWithKey1 = expandedRight.map((bit, i) => bit ^ parseInt(key1[i]));

  const s0 = [
    [1, 0, 3, 2],
    [3, 2, 1, 0],
    [0, 2, 1, 3],
    [3, 1, 3, 2],
  ];

  const s1 = [
    [0, 1, 2, 3],
    [2, 0, 1, 3],
    [3, 0, 1, 0],
    [2, 1, 0, 3],
  ];

  const leftHalf = xorWithKey1.slice(0, 4);
  const rightHalf = xorWithKey1.slice(4);

  const row1 = parseInt(`${leftHalf[0]}${leftHalf[3]}`, 2);
  const col1 = parseInt(`${leftHalf[1]}${leftHalf[2]}`, 2);
  const row2 = parseInt(`${rightHalf[0]}${rightHalf[3]}`, 2);
  const col2 = parseInt(`${rightHalf[1]}${rightHalf[2]}`, 2);

  const sboxOutput1 = s0[row1][col1].toString(2).padStart(2, "0");
  const sboxOutput2 = s1[row2][col2].toString(2).padStart(2, "0");

  const round1Output = `${sboxOutput1}${sboxOutput2}`.split("").map((bit) => parseInt(bit));

  const swapped = round1Output.slice(2).concat(round1Output.slice(0, 2));
  const expandedSwapped = [swapped[3], swapped[0], swapped[1], swapped[2], swapped[1], swapped[2], swapped[3], swapped[0]];
  const xorWithKey2 = expandedSwapped.map((bit, i) => bit ^ parseInt(key2[i]));
  const leftPart = xorWithKey2.slice(0, 4);
  const rightPart = xorWithKey2.slice(4);
  console.log('Left Half:', leftHalf);
  console.log('Right Half:', rightHalf);

  const row3 = parseInt(`${leftPart[0]}${leftPart[3]}`, 2);
  const col3 = parseInt(`${leftPart[1]}${leftPart[2]}`, 2);
  const row4 = parseInt(`${rightPart[0]}${rightPart[3]}`, 2);
  const col4 = parseInt(`${rightPart[1]}${rightPart[2]}`, 2);
  console.log('Left Part:', leftPart);
  console.log('Right Part:', rightPart);
  console.log('S-box indices:', row3, col3, row4, col4);

  if (row3 < 0 || row3 > 3 || col3 < 0 || col3 > 3 || row4 < 0 || row4 > 3 || col4 < 0 || col4 > 3) {
    throw new Error("Invalid row or column values for S-box access");
  }

  console.log('S-box values:', s0[row3][col3], s1[row4][col4]);

  const sboxOutput3 = s0[row3][col3].toString(2).padStart(2, "0");
  const sboxOutput4 = s1[row4][col4].toString(2).padStart(2, "0");

  const round2Output = `${sboxOutput3}${sboxOutput4}`.split("").map((bit) => parseInt(bit));

  const cipherText = round2Output.concat(left).join("");

  return cipherText;
}


function sdesDecrypt(ciphertext, key) {
  // Decryption in S-DES is the same as encryption but with the subkeys used in reverse order
  // Implementing decryption using the same logic as encryption but with keys reversed
  // This is not the most optimized way and might require refactoring for better performance

  // Reverse key generation
  const key1 = key.slice(0, 1) + key.slice(2, 3) + key.slice(3, 4) + key.slice(4, 5) + key.slice(6, 7);
  const key2 = key.slice(1, 2) + key.slice(3, 4) + key.slice(4, 5) + key.slice(5, 6) + key.slice(7);

  // Decrypting using the same steps as encryption but with keys reversed
  const intermediate = sdesEncrypt(ciphertext, key2);
  const plaintext = sdesEncrypt(intermediate, key1);

  return plaintext;
}


function App() {
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("encrypt");
  const [algorithm, setAlgorithm] = useState("AES");
  const [result, setResult] = useState({ data: "", error: null });
  const [randomKeys, setRandomKeys] = useState(true); // State to track randomization toggle

  const toggleRandomKeys = () => {
    setRandomKeys(!randomKeys);
    setText("");
  };

  const secretPass = "XkhZG4fW2t2W";

  const privateKey = "-----BEGIN RSA PRIVATE KEY-----MIIBPAIBAAJBAONf07ppv9h2c5HhP7ZloMHCE86ctuxLipL7M9hPqnGGK6SR+zPQzfRL6KoH/uzcRC14KkixJYS/5kHSKflLmu8CAwEAAQJBAMn6cRGyKMp4Bpe6+SbkxlX4OjIagmALhtCkN1za//SQ5017aeJlgwKO0KVM++g+mZMCTXhPolq8B8qzNXhidbECIQD5LOMV1fKKjn/eDitjHfpE7Q1eWMjm8L/kbZrnCtujyQIhAOmaFJd21sb3PWdsSd5SQWpwQ+MInqtrY45lQxyNnfT3AiEAu/o6AoIZ7J9eJYYpAyhdYtw2xqNSRK8BBPIO9xgA5MkCIBYsnxnFmRun6nc/yz9EVZtR7s/FSLKC7h9dM2Kper3/AiEA7Nkx0HbJwng9+/2CRNShNRqc3ASWiMnvR4UdpGQrpJI=-----END RSA PRIVATE KEY-----";
  const publicKey = "-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAONf07ppv9h2c5HhP7ZloMHCE86ctuxLipL7M9hPqnGGK6SR+zPQzfRL6KoH/uzcRC14KkixJYS/5kHSKflLmu8CAwEAAQ==-----END PUBLIC KEY-----";

  const resetStates = () => {
    setText("");
    setResult({ data: "", error: null });
  };

  const encryptData = () => {
    try {
      let data;
      switch (algorithm) {
        case "AES":
          if (!randomKeys) {
            data = CryptoJS.AES.encrypt(
              JSON.stringify(text),
              secretPass
            ).toString();
          } else {
            let key = CryptoJS.enc.Utf8.parse(secretPass.substr(0, 32));
            let iv = CryptoJS.enc.Utf8.parse("123456");
            data = CryptoJS.AES.encrypt(JSON.stringify(text), key, {
              iv: iv,
            }).toString();
          }
          break;
          // data = CryptoJS.AES.encrypt(JSON.stringify(text), secretPass).toString();
          // break;
        case "TripleDES":
          data = CryptoJS.TripleDES.encrypt(JSON.stringify(text), secretPass).toString();
          break;
        case "DES":
          data = CryptoJS.DES.encrypt(JSON.stringify(text), secretPass).toString();
          break;
        case "SDES":
          data = sdesEncrypt(text, secretPass); // Using SDES encryption
          break;
        case "RSA":
          const encrypt = new JSEncrypt();
          encrypt.setPublicKey(publicKey);
          data = encrypt.encrypt(text);
        default:
          break;
      }
      setResult({ data, error: null });
    } catch (e) {
      console.log("error is ", e);
      setResult({ data: "", error: "Encryption failed. Please check your input." });
    }
  };

  const decryptData = () => {
    try {
      let bytes, data;
      switch (algorithm) {
        case "AES":
          if (!randomKeys) {
            console.log("hello world")
          //   data = CryptoJS.AES.decrypt(text, secretPass);
          } else {
            console.log("new world")
            let key = CryptoJS.enc.Utf8.parse(secretPass.substr(0, 32));
            console.log(key, "key")
            // let decrypted = CryptoJS.AES.decrypt(text, key, {
            //   iv: CryptoJS.enc.Utf8.parse("123456"),
            // });
            // console.log(decrypted, "decrypted")
            data = "a"
            // data = decrypted.toString(CryptoJS.enc.Utf8);
          }
          break;
          // bytes = CryptoJS.AES.decrypt(text, secretPass);
          // data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          // break;
        case "TripleDES":
          bytes = CryptoJS.TripleDES.decrypt(text, secretPass);
          data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          break;
        case "DES":
          bytes = CryptoJS.DES.decrypt(text, secretPass);
          data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          break;
        case "SDES":
          data = sdesDecrypt(text, secretPass); // Using SDES decryption
          break;
        case "RSA":
          const encrypt = new JSEncrypt();
          encrypt.setPrivateKey(privateKey);
          data = encrypt.decrypt(text);
          break;
        default:
          break;
      }

      // data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setResult({ data, error: null });
    } catch (e) {
      setResult({ data: "", error: "Decryption failed. Please check your decryption key." });
    }
  };

  const handleButtonClick = useCallback(() => {
    if (!text) return setResult({ data: "", error: "Please type something that you want to encrypt." });

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
          onClick={toggleRandomKeys}
          className={randomKeys ? "active" : ""}
        >
          {!randomKeys ? "Remove Extra Security" : "Add Extra Security"}
        </button>{" "}
      </div>

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
          <option value="SDES">SDES</option>
          <option value="RSA">RSA</option>
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
