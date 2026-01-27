import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import { AppContextProvider } from "./contexts/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import axios from "axios";

/* ---------------- AXIOS CONFIG ---------------- */
axios.defaults.baseURL = "http://localhost:7000/api";
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
