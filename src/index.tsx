import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";

import { queryClient } from "./config/queryClient";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </QueryClientProvider>,
  rootElement
);
