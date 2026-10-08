import React from "react";
import ReactDOM from "react-dom/client";

import App from "src/App";
import { AuthProvider } from "src/context/AuthContext";
import { WatchModalProvider } from "src/context/WatchModalContext";
import { AddModalProvider } from "src/context/AddModalContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <WatchModalProvider>
        <AddModalProvider>
          <App />
        </AddModalProvider>
      </WatchModalProvider>
    </AuthProvider>
  </React.StrictMode>,
);
