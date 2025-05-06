// src/pages/NotFound.js
import React from 'react';
import { CloudOff } from 'lucide-react';
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen  text-red-300">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <CloudOff className="w-12 h-12 " />
    </div>
  );
};

export default NotFound;
