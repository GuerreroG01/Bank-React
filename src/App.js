import React from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Components/Drawer';
function App() {
  return (
    <div>
      <Drawer />
      <Outlet />
    </div>
  );
}

export default App;
