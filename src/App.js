import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const App = () => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [formattedText, setFormattedText] = useState("");
  const editorRef = useRef();

  const calculateTextMetrics = () => {
    const text = editorRef.current.innerText || ""; // Get plain text from the editable div

    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    const visibleText = text.replace(/\s/g, ""); // Remove all spaces
    setCharCount(visibleText.length); // Set character count to the length of visible text

    const estimatedTime = words.length / 200;
    setReadingTime(estimatedTime.toFixed(2)); // Rounded to two decimal places
  };

  useEffect(() => {
    const editorElement = editorRef.current;
    const handleInput = () => calculateTextMetrics();
    editorElement.addEventListener("input", handleInput);

    return () => editorElement.removeEventListener("input", handleInput);
  }, []);

  const handleFormatting = (command) => {
    document.execCommand(command, false, null);
  };

  const clearContent = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      calculateTextMetrics(); // Reset metrics
    }
  };

  const toCamelCase = (text) => {
    return text
      .split(/\s+/)
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  };

  const toSnakeCase = (text) => {
    return text
      .split(/\s+/)
      .map(word => word.toLowerCase())
      .join('_');
  };

  const toPascalCase = (text) => {
    return text
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  const handleCaseConversion = (format) => {
    const text = editorRef.current.innerText || "";
    let convertedText = "";

    switch (format) {
      case "camelCase":
        convertedText = toCamelCase(text);
        break;
      case "snake_case":
        convertedText = toSnakeCase(text);
        break;
      case "PascalCase":
        convertedText = toPascalCase(text);
        break;
      default:
        break;
    }

    setFormattedText(convertedText);
    editorRef.current.innerText = convertedText;
  };

  const handleCopy = () => {
    const text = editorRef.current.innerText || "";
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="app">
      <header>
        <h1>Text Editor App</h1>
      </header>

      <div
        ref={editorRef}
        contentEditable
        className="editor"
        placeholder="Start typing here..."
      ></div>

      <div className="toolbar">
        <button onClick={() => handleFormatting("bold")} title="Bold">Bold</button>
        <button onClick={() => handleFormatting("italic")} title="Italic">Italic</button>
        <button onClick={() => handleFormatting("underline")} title="Underline">Underline</button>
        <button onClick={clearContent} title="Clear">Clear</button>
        <button onClick={handleCopy} title="Copy">Copy</button>
      </div>

      <div className="case-conversion">
        <button onClick={() => handleCaseConversion("camelCase")}>camelCase</button>
        <button onClick={() => handleCaseConversion("snake_case")}>snake_case</button>
        <button onClick={() => handleCaseConversion("PascalCase")}>PascalCase</button>
      </div>

      <div className="analysis">
        <p>Word Count: <strong>{wordCount}</strong></p>
        <p>Character Count: <strong>{charCount}</strong></p>
        <p>Estimated Reading Time: <strong>{readingTime} min</strong></p>
      </div>

      {formattedText && (
        <div className="formatted-text">
          <h2>Formatted Text:</h2>
          <p>{formattedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
