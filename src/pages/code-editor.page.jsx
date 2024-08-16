import MonacoEditor from "@monaco-editor/react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

const CodeEditor = () => {
  const { docId } = useParams();
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState("// Write your code here");
  const [notification, setNotification] = useState("");
  const editorRef = useRef(null);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (docId) {
      setDoc(doc(db, "sessions", docId), {
        code: value,
        language: language,
      }).catch((error) => console.error("Error updating document: ", error));
    }
  };

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") {
      event.preventDefault(); // Prevent default save action
      console.log("Cmd+S pressed."); // Perform custom action here
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "/") {
      event.preventDefault();
      const editor = editorRef.current;

      if (editor) {
        const model = editor.getModel();
        const selection = editor.getSelection();
        const lines = model.getLinesContent();
        const startLineNumber = selection.selectionStartLineNumber;
        const endLineNumber = selection.selectionEndLineNumber;

        const newLines = [...lines];

        for (let i = startLineNumber - 1; i < endLineNumber; i++) {
          const line = lines[i];
          if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
            newLines[i] = line.replace(/^(\s*\/\*?\s*\/?|\s*\/\/\s*)/, "");
          } else {
            newLines[i] = `// ${line}`;
          }
        }

        model.setValue(newLines.join("\n"));
        setCode(newLines.join("\n"));
        if (docId) {
          setDoc(doc(db, "sessions", docId), {
            code: newLines.join("\n"),
            language: language,
          }).catch((error) =>
            console.error("Error updating document: ", error)
          );
        }
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Check out this coding session!",
      text: "I’m coding with Codeine, a live coding pad. Join me in this session!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Share successful");
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      // Fallback to clipboard and notification
      try {
        await navigator.clipboard.writeText(window.location.href);
        setNotification("Link copied to clipboard!");
        setTimeout(() => {
          setNotification();
        }, 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard", err);
      }
    }
  };

  useEffect(() => {
    if (docId) {
      const docRef = doc(db, "sessions", docId);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setCode(data.code || "");
            setLanguage(data.language || "c");
          }
        },
        (error) => console.error("Error fetching document: ", error)
      );

      return () => unsubscribe();
    }
  }, [docId]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [language]);

  return (
    <div className="container">
      <div className="editor">
        <label htmlFor="language">Selected Language: </label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="kotlin">Kotlin</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="php">PHP</option>
          <option value="objective-c">Objective-C</option>
          <option value="shell">Shell Script</option>
          <option value="perl">Perl</option>
          <option value="r">R</option>
          <option value="sql">SQL</option>
          <option value="dart">Dart</option>
          <option value="markdown">Markdown</option>
          <option value="yaml">YAML</option>
          <option value="dockerfile">Dockerfile</option>
          <option value="hcl">HCL</option>
        </select>
        <button className="share-button" onClick={handleShare}>
          Share
        </button>
        {notification && <div className="notification">{notification}</div>}
      </div>

      <MonacoEditor
        height="80vh" // Adjusted height for better view
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        editorDidMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default CodeEditor;
