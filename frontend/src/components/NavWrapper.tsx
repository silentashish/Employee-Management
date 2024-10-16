"use client";

import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "./Navbar";

const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Navbar />
      {children}
    </Box>
  );
};

export default NavWrapper;
