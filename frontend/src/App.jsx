import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainRoutes from './components/routing/MainRoutes';
import { LoginContext } from './components/context/Context';

function App() {

  const [isLogin, setIsLogin] = useState(false);

  return (
    <LoginContext.Provider value={{isLogin, setIsLogin}}>
        <BrowserRouter>
          <MainRoutes />
        </BrowserRouter>
    </LoginContext.Provider>
  );
}

export default App;