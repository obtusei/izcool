import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout.tsx";
import SignUpPage from "./pages/auth/signup.tsx";
import "@izcool/ui/globals.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
        </Route>
        <Route path="/auth/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
