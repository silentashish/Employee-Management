"use client";

import NavWrapper from "@/components/NavWrapper";
import { useSession } from "@/context/SessionContext";
import { axiosClient } from "@/utils/axios";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

interface LoginFormInputs {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  message?: string; // Optional if your API provides a message
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormInputs>();
  const toast = useToast();

  const { isLoggedIn, setSession } = useSession();
  const router = useRouter();

  const mutation = useMutation(
    (credentials: LoginFormInputs) => {
      return axiosClient.post("/api/login/", credentials);
    },
    {
      onSuccess: (data: any) => {
        const { access, refresh, message } = data;

        setSession({
          username: getValues("username"),
          accessToken: access,
          refreshToken: refresh,
        });

        toast({
          title: "Login successful.",
          description: message || "You have successfully logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error: any) => {
        // Adjusted error handling based on your API's error response
        const description =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Server Error. Please try again.";
        toast({
          title: "Login failed.",
          description,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const onSubmit: SubmitHandler<LoginFormInputs> = (data: LoginFormInputs) => {
    mutation.mutate(data);
  };

  // Move redirection logic inside useEffect
  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  // Chakra UI dark mode colors (no light variant)
  const bg = "gray.900";
  const inputBg = "gray.800";
  const inputBorder = "gray.600";
  const textColor = "gray.200";
  const headingColor = "gray.100";
  const placeholderColor = "gray.500";

  return (
    <NavWrapper>
      <Box
        width="100%"
        maxWidth="800px"
        mx="auto"
        mt="100px"
        bg={bg}
        p="16"
        borderRadius="md"
        boxShadow="dark-lg"
      >
        <Heading mb="6" textAlign="center" color={headingColor}>
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={8}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel color={textColor}>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter your username"
                bg={inputBg}
                borderColor={inputBorder}
                color={textColor}
                _placeholder={{ color: placeholderColor }}
                {...register("username", { required: "Username is required" })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel color={textColor}>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                bg={inputBg}
                borderColor={inputBorder}
                color={textColor}
                _placeholder={{ color: placeholderColor }}
                {...register("password", { required: "Password is required" })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={mutation.isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </NavWrapper>
  );
};

export default Login;
