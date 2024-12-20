"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Heading,
  useToast,
  Image,
} from "@chakra-ui/react";
import Select, { MultiValue } from "react-select"; // Import react-select
import NavWrapper from "@/components/NavWrapper";
import useHandlePrivateRoute from "@/hooks/useHandlePrivateRoute";
import { axiosClient } from "@/utils/axios";
import { useSession } from "@/context/SessionContext";

interface ProfileFormInputs {
  name: string;
  email: string;
  profileImage: FileList;
  expertise: { label: string; value: string }[];
}

const expertiseOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "cloud-computing", label: "Cloud Computing" },
];

const CompleteProfile: React.FC = () => {
  const { session } = useSession();
  const username = session.username;

  const mutation = useMutation(
    async (profileData: FormData | { name: string; email: string; expertise: string[] }) => {
      return await axiosClient.put(`/api/user/${username}/`, profileData, {
        headers: profileData instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Profile updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to update profile.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  useHandlePrivateRoute();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormInputs>();
  const toast = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<MultiValue<{ label: string; value: string }>>([]);
// ... existing code ...

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    const profileData = {
      name: data.name,
      email: data.email,
      expertise: selectedExpertise.map((exp) => exp.value),
    };

    if (data.profileImage.length > 0) {
      const file = data.profileImage[0];
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("expertise", JSON.stringify(selectedExpertise.map((exp) => exp.value)));

      mutation.mutate(formData);
    } else {
      mutation.mutate(profileData);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExpertiseChange = (selectedOptions: MultiValue<{ label: string; value: string }>) => {
    setSelectedExpertise(selectedOptions || []);
  };

  // Chakra UI dark mode compatible colors
  const bg = "gray.900";
  const inputBg = "gray.800";
  const inputBorder = "gray.600";
  const textColor = "gray.200";
  const headingColor = "gray.100";
  const placeholderColor = "gray.500";

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      background: inputBg,
      borderColor: inputBorder,
      color: textColor,
    }),
    menu: (base: any) => ({
      ...base,
      background: inputBg,
    }),
    option: (base: any, state: any) => ({
      ...base,
      background: state.isFocused ? "gray.700" : inputBg,
      color: textColor,
    }),
    multiValue: (base: any) => ({
      ...base,
      background: "gray.700",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: textColor,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: placeholderColor,
    }),
  };

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
          Update Profile
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={8}>
            <FormControl isInvalid={!!errors.profileImage}>
              <FormLabel color={textColor}>Profile Image</FormLabel>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="profileImage"
                {...register("profileImage", {
                  required: "Profile image is required",
                  onChange: handleImageChange,
                })}
              />
              <Box
                onClick={() => document.getElementById("profileImage")?.click()}
                border="1px solid"
                borderColor={inputBorder}
                bg={inputBg}
                p={4}
                borderRadius="md"
                textAlign="center"
                cursor="pointer"
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile preview"
                    borderRadius="md"
                    objectFit="cover"
                    width="100%"
                    height="auto"
                  />
                ) : (
                  <Box color={placeholderColor}>
                    Click to upload your profile image
                  </Box>
                )}
              </Box>
              <FormErrorMessage>
                {errors.profileImage && errors.profileImage.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel color={textColor}>Name</FormLabel>
              <input
                placeholder="Enter your name"
                style={{
                  background: inputBg,
                  color: textColor,
                  borderColor: inputBorder,
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                }}
                {...register("name", { required: "Name is required" })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel color={textColor}>Email</FormLabel>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  background: inputBg,
                  color: textColor,
                  borderColor: inputBorder,
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                }}
                {...register("email", { required: "Email is required" })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.expertise}>
              <FormLabel color={textColor}>Expertise</FormLabel>
              <Select
                isMulti
                options={expertiseOptions}
                styles={customSelectStyles}
                placeholder="Select your expertise"
                onChange={handleExpertiseChange}
              />
              <FormErrorMessage>
                {errors.expertise && errors.expertise.message}
              </FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Complete Profile
            </Button>
          </VStack>
        </form>
      </Box>
    </NavWrapper>
  );
};

export default CompleteProfile;