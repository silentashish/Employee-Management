import os
from django.conf import settings
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import LoginSerializer, UserSerializer, PeopleSerializer
from .models import People


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)
            if user is not None:
                # Generate token if needed or return user info
                return Response(
                    {"id": user.id, "username": user.username, "email": user.email}
                )
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id=None):
        if user_id:
            # Retrieve a specific user by ID
            try:
                user = User.objects.get(id=user_id)
                serializer = UserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            # List all users
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, user_id=None):
        # Update a specific user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id=None):
        # Delete a specific user
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PeopleListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        people = People.objects.all()
        serializer = PeopleSerializer(people, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PeopleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PeopleDetailView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        try:
            person = People.objects.get(user__username=username)
        except People.DoesNotExist:
            return Response(
                {
                    "data": {
                        "error": f"No People matches the given query for username: {username}"
                    }
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PeopleSerializer(person)
        # Construct the full URL for the photo
        backend_host = os.getenv("BACKEND_HOST", "http://localhost:8000")
        photo_url = f"{backend_host}/media/{person.photo}" if person.photo else None
        # Update the serialized data with the photo URL
        data = serializer.data
        data["photo"] = photo_url
        return Response({"data": data})

    def put(self, request, username):
        person = get_object_or_404(People, user__username=username)
        data = request.data.copy()

        # Check if a new profile image is provided
        if "profileImage" in request.FILES:
            image_file = request.FILES["profileImage"]
            # Generate new filename
            timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
            new_filename = (
                f"{username}_{timestamp}{os.path.splitext(image_file.name)[1]}"
            )
            # Save the file with the new name in the media directory
            saved_path = default_storage.save(
                new_filename, ContentFile(image_file.read())
            )
            # Update the photo field with the relative path
            person.photo = saved_path

        serializer = PeopleSerializer(person, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data})
        return Response({"data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username):
        person = get_object_or_404(People, user__username=username)
        person.delete()
        return Response({"data": None}, status=status.HTTP_204_NO_CONTENT)
