import React from "react";
import Navbar from "./Navbar";
import { SearchProvider } from "./SearchContext";

const Layout = ({ children }) => (
  <SearchProvider>
    <Navbar />
    <div>{children}</div>
  </SearchProvider>
);

export default Layout;