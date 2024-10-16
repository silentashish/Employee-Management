"use client";

import NavWrapper from "@/components/NavWrapper";
import useHandlePrivateRoute from "@/hooks/useHandlePrivateRoute";
import { Box } from "@chakra-ui/react";
import React from "react";

const Collaborate = () => {
  useHandlePrivateRoute();

  return (
    <NavWrapper>
      <Box style={{ width: "100%", height: "100vh" }}>
        <iframe
          src="http://localhost:3000/dashboards"
          width="100%"
          height="100%"
          title="Grafana Dashboard"
        />
      </Box>
    </NavWrapper>
  );
};

export default Collaborate;
