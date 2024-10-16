"use client";

import { useSession } from "@/context/SessionContext";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false); // For ensuring client-side rendering consistency
  const { isLoggedIn, clearSession } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  // Ensure the color mode and mounting only on the client side
  useEffect(() => {
    setIsMounted(true);
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  if (!isMounted) return null; // Prevent rendering during SSR

  const loggedIn = isLoggedIn();

  return (
    <Box as="nav" px={4} py={2} color="gray.100">
      <Flex alignItems="center">
        <Brand />
        <Spacer />
        {loggedIn ? (
          <>
            <Link href="/editprofile" passHref>
              <Button as="a" variant="ghost">
                Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button as="a" variant="ghost">
                Dashboard
              </Button>
            </Link>
            <Link href="/collaboration" passHref>
              <Button as="a" variant="ghost">
                Collaboration
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                clearSession();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => window.open("/login")}>
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

// Component for the Brand/Logo
const Brand = () => (
  <Link href="/" passHref>
    <Heading fontSize="larger">EarthStars</Heading>
  </Link>
);

export default Navbar;
