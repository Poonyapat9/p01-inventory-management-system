"use client";

import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} StockMe - Inventory Management
            System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
