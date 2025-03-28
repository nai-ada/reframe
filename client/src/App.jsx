import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import AllEntriesPage from "./pages/AllEntriesPage";
import NewEntryPage from "./pages/NewEntryPage";
import Navigation from "./components/Navigation";
import Layout from "./components/Layout";
import EntryProcessingPage from "./pages/EntryProcessingPage";
import SubmittedEntryPage from "./pages/SubmittedEntryPage";
import SuccessAnimation from "./pages/SuccessAnimation";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/new-entry" element={<NewEntryPage />} />
        <Route path="/all-entries" element={<AllEntriesPage />} />
        <Route path="/entry-processing" element={<EntryProcessingPage />} />
        <Route path="/success" element={<SuccessAnimation />} />
        <Route path="/submitted-entry" element={<SubmittedEntryPage />} />
        <Route path="/submitted-entry/:id" element={<SubmittedEntryPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div
      style={{ maxWidth: "400px", margin: "0 auto" }}
      className="main-gradient"
    >
      <BrowserRouter>
        <Layout>
          <Navigation />
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
