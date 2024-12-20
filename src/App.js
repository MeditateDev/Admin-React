import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { registerLicense } from '@syncfusion/ej2-base';
import Cookie from "js-cookie";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Auth from './pages/Auth';
import ThemeSettings from "./components/ThemeSettings";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";

import { useStateContext } from "./context/ContextProvider";
import "./App.css";
import RestaurantList from "./pages/Restaurant";
import DriverList from "./pages/Driver";

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFiWH1ccHJWTmJdUkRzWw==');

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const isAuthenticated = Cookie.get("accessToken");

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>

          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}

          <div className={`
            ${activeMenu 
              ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full" 
              : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2"
            }
          `}>
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            <div>{themeSettings && <ThemeSettings />}</div>

            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/products" /> : <Auth />} 
              />
              <Route 
                path="/products" 
                element={isAuthenticated ? <Product /> : <Navigate to="/login" />} 
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route 
                path="/restaurants" 
                element={isAuthenticated ? <RestaurantList /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/shippers" 
                element={isAuthenticated ? <DriverList /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/" 
                element={<Navigate to={isAuthenticated ? "/products" : "/login"} />} 
              />
            </Routes>

            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;