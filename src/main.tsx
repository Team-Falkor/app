import "./global.css";
import "./i18n";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageContextProvider } from "./contexts/I18N";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <LanguageContextProvider>
        <App />
      </LanguageContextProvider>
    </StrictMode>
  );
}
