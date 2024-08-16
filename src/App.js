import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CodeEditor from "./pages/code-editor.page";
import NewEditorPage from "./pages/new-editor.page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/codeine" element={<NewEditorPage />} />
        <Route path="/codeine/:docId" element={<CodeEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
