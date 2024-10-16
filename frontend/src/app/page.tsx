"use client";

import NavWrapper from "@/components/NavWrapper";
import { Box, Text, Image, Heading } from "@chakra-ui/react";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-bubble-ui/dist/index.css";

// Dynamically import BubbleUI with SSR disabled
const BubbleUI = dynamic(() => import("react-bubble-ui"), { ssr: false });

const Dashboard: React.FC = () => {
  const options = {
    size: 220,
    minSize: 120,
    gutter: 8,
    provideProps: true,
    numCols: 6,
    fringeWidth: 160,
    yRadius: 130,
    xRadius: 220,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 5,
  };

  // Arrays of first and last names for team members
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Fiona",
    "George",
    "Hannah",
    "Ian",
    "Jenna",
    "Kevin",
    "Laura",
    "Mike",
    "Nina",
    "Oscar",
    "Paula",
    "Quinn",
    "Rachel",
    "Steve",
    "Tina",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];

  // Generate random team data
  const teamData = useMemo(() => {
    // Shuffle the names to create random combinations
    const shuffledFirstNames = [...firstNames].sort(() => 0.5 - Math.random());
    const shuffledLastNames = [...lastNames].sort(() => 0.5 - Math.random());

    // Combine first and last names
    const fullNames = shuffledFirstNames.map(
      (firstName, index) => `${firstName} ${shuffledLastNames[index]}`
    );

    // Create data array
    return fullNames.map((name) => {
      // Generate random color
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      // Generate random years of experience between 1 and 20
      const yearsOfExperience = Math.floor(Math.random() * 20) + 1;

      // Generate random image URL (using placeholder images)
      const imageUrl = `https://i.pravatar.cc/150?img=${Math.floor(
        Math.random() * 70
      )}`;

      return { name, color, yearsOfExperience, imageUrl };
    });
  }, []);

  // Generate dummy project data
  const projectData = useMemo(() => {
    const projectNames = [
      "Project Alpha",
      "Project Beta",
      "Project Gamma",
      "Project Delta",
      "Project Epsilon",
      "Project Zeta",
      "Project Eta",
      "Project Theta",
      "Project Iota",
      "Project Kappa",
      "Project Lambda",
      "Project Mu",
      "Project Nu",
      "Project Xi",
      "Project Omicron",
      "Project Pi",
      "Project Rho",
      "Project Sigma",
      "Project Tau",
      "Project Upsilon",
    ];

    return projectNames.map((projectName) => {
      // Generate random color
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      // Generate random project duration between 1 and 24 months
      const durationMonths = Math.floor(Math.random() * 24) + 1;

      // Generate random image URL (using placeholder images)
      const imageUrl = `https://picsum.photos/seed/${Math.floor(
        Math.random() * 1000
      )}/150`;

      return { projectName, color, durationMonths, imageUrl };
    });
  }, []);

  return (
    <NavWrapper>
      {/* Teams Section */}
      <Box width="100%" height="100%" mx="auto" mt="10px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Heading alignSelf="center">Our Teams</Heading>
        </Box>
        <BubbleUI options={options} style={{ height: 1000 }}>
          {teamData.map(({ name, color, yearsOfExperience, imageUrl }) => (
            <Box
              key={name}
              height="100%"
              width="100%"
              borderRadius="50%"
              backgroundColor={color}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              position="relative"
              p={2}
            >
              <Image
                src={imageUrl}
                alt={name}
                borderRadius="full"
                boxSize="80px"
                objectFit="cover"
                mb={2}
              />
              <Text color="white" fontWeight="bold" textAlign="center">
                {name}
              </Text>
              <Text color="white" fontSize="sm" textAlign="center">
                {yearsOfExperience} years experience
              </Text>
            </Box>
          ))}
        </BubbleUI>
      </Box>

      {/* Projects Section */}
      <Box width="100%" height="100%" mx="auto" mt="10px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Heading alignSelf="center">Our Projects</Heading>
        </Box>
        <BubbleUI options={options} style={{ height: 1000 }}>
          {projectData.map(
            ({ projectName, color, durationMonths, imageUrl }) => (
              <Box
                key={projectName}
                height="100%"
                width="100%"
                borderRadius="50%"
                backgroundColor={color}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                position="relative"
                p={2}
              >
                <Image
                  src={imageUrl}
                  alt={projectName}
                  borderRadius="full"
                  boxSize="80px"
                  objectFit="cover"
                  mb={2}
                />
                <Text color="white" fontWeight="bold" textAlign="center">
                  {projectName}
                </Text>
                <Text color="white" fontSize="sm" textAlign="center">
                  {durationMonths} months duration
                </Text>
              </Box>
            )
          )}
        </BubbleUI>
      </Box>
    </NavWrapper>
  );
};

export default Dashboard;
