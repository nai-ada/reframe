import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./components/Test";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import AllEntriesPage from "./pages/AllEntriesPage";
import NewEntryPage from "./pages/NewEntryPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/new-entry" element={<NewEntryPage />} />
        <Route path="/all-entries" element={<AllEntriesPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
