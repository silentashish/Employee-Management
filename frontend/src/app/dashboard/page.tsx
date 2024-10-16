"use client";

import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Tag,
  TagLabel,
  Flex,
  Wrap
} from "@chakra-ui/react";
import NavWrapper from "@/components/NavWrapper";
import useHandlePrivateRoute from "@/hooks/useHandlePrivateRoute";

interface DashboardProps {
  name: string;
  email: string;
  profileImage: string;
  expertise: { label: string; value: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({
  name,
  email,
  profileImage,
  expertise,
}) => {
  // Chakra UI dark mode compatible colors
  const bg = "gray.900";
  const textColor = "gray.200";
  const headingColor = "gray.100";
  const tagBg = "gray.700";
  const placeholderColor = "gray.500";

  useHandlePrivateRoute();

  return (
    <NavWrapper>
      <Box
        width="100%"
        maxWidth="800px"
        mx="auto"
        mt="100px"
        bg={bg}
        p="8"
        borderRadius="md"
        boxShadow="dark-lg"
      >
        <Heading mb="6" textAlign="center" color={headingColor}>
          Your Profile
        </Heading>
        <VStack spacing={4}>
          <Box
            // border="1px solid"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            bg={useColorModeValue("gray.100", "gray.800")}
            p={4}
            borderRadius="md"
            textAlign="center"
            width="100%"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile Image"
                borderRadius="full"
                objectFit="cover"
                width="150px"
                height="150px"
                mb={4}
                mx="auto" 
              />
            ) : (
              // <Text color={placeholderColor}>No profile image uploaded</Text>
              <Image
              src="/images/iksha-gurung.jpg"  // Path to your static fallback image
              alt="Default Profile Image"
              borderRadius="full"
              objectFit="cover"
              width="150px"
              height="150px"
              mb={4}
              mx="auto" 
            />
            )}
          </Box>

          <Heading size="md" color={headingColor}>
            {name}
          </Heading>
          <Text fontSize="sm" color={textColor}>
            {email}
          </Text>

          <Flex
            width="100%"
            alignItems="center"
            display="flex"
            direction="column"
          >
            <Heading size="sm" mb="2" color={headingColor}>
              Expertise
            </Heading>
            {expertise && expertise.length > 0 ? (
              <Wrap justify="center" spacing={4} width="100%">
                {expertise.map((item) => (
                  <Tag key={item.value} size="lg" bg={tagBg} color={textColor}>
                    <TagLabel>{item.label}</TagLabel>
                  </Tag>
                ))}
              </Wrap>
            ) : (
              <Text color={placeholderColor}>No expertise selected</Text>
            )}
          </Flex>
        </VStack>
      </Box>
    </NavWrapper>
  );
};

const DashboardDummy = () => {
  return (
    <Dashboard
      name="Iksha Gurung"
      profileImage=""
      email="iksha.gurung@uah.edu"
      expertise={[{ value: "web-development", label: "Web Development" },
        { value: "data-science", label: "Data Science" },
        { value: "ai", label: "Artificial Intelligence" },
        { value: "ml", label: "Machine Learning" },
        { value: "iksha", label: "Iksha" },
      ]}
    />
  );
};

export default DashboardDummy;
