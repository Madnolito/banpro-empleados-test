import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

console.debug("Version: " + __PACKAGE_JSON_VERSION__); // version debug, para controlar versiones

//config global de react query
//guarda resultados en cache, maneja loading/error, reintentos etc
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
   //se inyecta queryclient (usequery, usemutation, usequeryclient)
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <App /> 
    </HashRouter>
  </QueryClientProvider>
);