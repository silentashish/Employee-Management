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
  Wrap,
  Spinner,
  Center,
} from "@chakra-ui/react";
import NavWrapper from "@/components/NavWrapper";
import useHandlePrivateRoute from "@/hooks/useHandlePrivateRoute";
import { useQuery } from "react-query";
import { axiosClient } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

interface DashboardProps {}

interface ExpertiseData {
  id: number;
  skill: string;
}

interface ProjectData {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface UserProjectData {
  project: ProjectData;
  start_date: string;
  end_date: string;
  years_exp: number;
}

interface UserData {
  id: number;
  name: string;
  photo: string;
  projects: UserProjectData[];
  expertise: ExpertiseData[];
  github: string | null;
  linkedin: string | null;
  years_exp: number;
  hobbies: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  // Chakra UI dark mode compatible colors
  const bg = "gray.900";
  const textColor = "gray.200";
  const headingColor = "gray.100";
  const tagBg = "gray.700";
  const placeholderColor = "gray.500";

  // Move useColorModeValue hooks to the top level
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const boxBg = useColorModeValue("gray.100", "gray.800");

  useHandlePrivateRoute();
  const { session } = useSession();
  const router = useRouter();

  // Fetch user data using react-query
  const { data, isLoading, isError } = useQuery<UserData>(
    ["userDetail"],
    async () => {
      const username = session.username;
      const response = await axiosClient.get(`/api/user/${username}/`);
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center height="100vh">
        <Text color="red.500">Failed to load user data. Please try again later.</Text>
      </Center>
    );
  }

  const { name, photo, projects, expertise, github, linkedin, years_exp, hobbies } = data!;

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
            borderColor={borderColor}
            bg={boxBg}
            p={4}
            borderRadius="md"
            textAlign="center"
            width="100%"
          >
            <Image
              src={photo || "/images/iksha-gurung.jpg"}
              alt="Profile Image"
              borderRadius="full"
              objectFit="cover"
              width="150px"
              height="150px"
              mb={4}
              mx="auto"
            />
          </Box>

          <Heading size="md" color={headingColor}>
            {name}
          </Heading>
          <Text fontSize="sm" color={textColor}>
            LinkedIn: {linkedin || "Not provided"}
          </Text>
          <Text fontSize="sm" color={textColor}>
            GitHub: {github || "Not provided"}
          </Text>
          <Text fontSize="sm" color={textColor}>
            Years of Experience: {years_exp}
          </Text>
          <Text fontSize="sm" color={textColor}>
            Hobbies: {hobbies || "Not provided"}
          </Text>

          <Flex
            width="100%"
            alignItems="center"
            display="flex"
            direction="column"
          >
            <Heading size="sm" mb="2" color={headingColor}>
              Projects
            </Heading>
            {projects && projects.length > 0 ? (
              <Wrap justify="center" spacing={4} width="100%">
                {projects.map((item) => (
                  <Box key={item.project.id} p={4} bg={tagBg} borderRadius="md" width="100%" mb={2}>
                    <Heading size="xs" color={headingColor} mb={1}>{item.project.name}</Heading>
                    <Text fontSize="xs" color={textColor}>Description: {item.project.description}</Text>
                    <Text fontSize="xs" color={textColor}>Project Duration: {item.start_date} to {item.end_date}</Text>
                    <Text fontSize="xs" color={textColor}>Years of Experience: {item.years_exp}</Text>
                  </Box>
                ))}
              </Wrap>
            ) : (
              <Text color={placeholderColor}>No projects available</Text>
            )}
          </Flex>
          <Heading size="sm" mb="2" color={headingColor}>
            Expertise
          </Heading>
          {expertise && expertise.length > 0 ? (
            <Wrap justify="center" spacing={4} width="100%">
              {expertise.map((item) => (
                <Tag key={item.id} size="lg" bg={tagBg} color={textColor}>
                  <TagLabel>{item.skill}</TagLabel>
                </Tag>
              ))}
            </Wrap>
          ) : (
            <Text color={placeholderColor}>No expertise selected</Text>
          )}
        </VStack>
      </Box>
    </NavWrapper>
  );
};

const DashboardDummy: React.FC = () => {
  return <Dashboard />;
};

export default DashboardDummy;