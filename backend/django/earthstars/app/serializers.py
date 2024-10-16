from rest_framework import serializers
from django.contrib.auth.models import User
from .models import People, Projects, Expertise, PeopleExpertise, PeopleProjects

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ['id', 'name', 'description', 'start_date', 'end_date']

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = ['id', 'skill']


class PeopleProjectsSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = PeopleProjects
        fields = ['project', 'start_date', 'end_date', 'years_exp']


class PeopleExpertiseSerializer(serializers.ModelSerializer):
    expertise = ExpertiseSerializer(read_only=True)

    class Meta:
        model = PeopleExpertise
        fields = ['expertise']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PeopleSerializer(serializers.ModelSerializer):

    projects = PeopleProjectsSerializer(source='peopleprojects_set', many=True, read_only=True)
    expertise = PeopleExpertiseSerializer(source='peopleexpertise_set', many=True, read_only=True)

    projects_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    expertise_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = People
        fields = ['id', 'name', 'photo', 'email', 'password', 'projects', 'expertise', 'projects_ids', 'expertise_ids', 'github', 'linkedin', 'years_exp', 'hobbies']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        projects_data = validated_data.pop('projects_ids', [])
        expertise_data = validated_data.pop('expertise_ids', [])
        print(projects_data)
        print(expertise_data)

        # Create the user with the provided email and password
        user = User.objects.create_user(username=email, email=email, password=password)

        # Create the People object and associate it with the user
        person = People.objects.create(user=user, **validated_data)

        for project_id in projects_data:
            project = Projects.objects.get(pk=project_id)
            PeopleProjects.objects.create(person=person, project=project)
        
        
        for expertise_id in expertise_data:
            expertise = Expertise.objects.get(pk=expertise_id)
            PeopleExpertise.objects.create(person=person, expertise=expertise)
        
        return person

    def update(self, instance, validated_data):
        user = validated_data.pop('user', None)
        if user:
            instance.user = user
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
