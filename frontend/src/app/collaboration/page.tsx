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
          src="http://157.245.212.110:3000/d/fe3zd0ekupzwgd/new-dashboard?from=now-6h&to=now&timezone=browser"
          width="100%"
          height="100%"
          title="Grafana Dashboard"
        />
      </Box>
    </NavWrapper>
  );
};

export default Collaborate;
