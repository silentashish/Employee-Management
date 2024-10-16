import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# If running as a standalone script, set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'earthstars.settings')  # Replace with your settings module
django.setup()

from django.contrib.auth.models import User
from earthstars.app.models import People, Projects, Expertise, PeopleProjects, PeopleExpertise  # Replace with your app name

# Import Faker library
from faker import Faker
fake = Faker()

# Clear existing data
User.objects.all().delete()
People.objects.all().delete()
Projects.objects.all().delete()
Expertise.objects.all().delete()
PeopleProjects.objects.all().delete()
PeopleExpertise.objects.all().delete()

# Create dummy users and people
users = []
people = []

for i in range(30):
    first_name = fake.first_name()
    last_name = fake.last_name()
    full_name = f'{first_name} {last_name}'
    username = f'{first_name.lower()}{last_name.lower()}{i}'
    email = f'{username}@example.com'
    password = 'password123'
    user = User.objects.create_user(username=username, email=email, password=password)
    users.append(user)
    
    person = People.objects.create(
        user=user,
        name=full_name,
        photo=fake.image_url(),
        github=f'https://github.com/{username}',
        linkedin=f'https://linkedin.com/in/{username}',
        years_exp=random.randint(1, 15),
        hobbies=', '.join(fake.words(nb=3))
    )
    people.append(person)

# Create dummy projects
projects = []

for i in range(3):
    start_date = timezone.now().date() - timedelta(days=random.randint(100, 1000))
    end_date = start_date + timedelta(days=random.randint(30, 365))
    project = Projects.objects.create(
        name=f'Project {i}',
        PI=f'Dr. {fake.last_name()}',
        start_date=start_date,
        end_date=end_date,
        description=fake.paragraph(),
        agency=f'Agency {i}'
    )
    projects.append(project)

# Create dummy expertise
expertise_list = []
skills = ['Python', 'Django', 'JavaScript', 'Machine Learning', 'Data Analysis', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes']

for skill in skills:
    expertise = Expertise.objects.create(skill=skill)
    expertise_list.append(expertise)

# Associate people with projects
for person in people:
    assigned_projects = random.sample(projects, random.randint(1, len(projects)))
    for project in assigned_projects:
        start_date = project.start_date
        end_date = project.end_date
        PeopleProjects.objects.create(
            person=person,
            project=project,
            start_date=start_date,
            end_date=end_date,
            years_exp=person.years_exp
        )

# Associate people with expertise
for person in people:
    assigned_skills = random.sample(expertise_list, random.randint(1, len(expertise_list)))
    for skill in assigned_skills:
        PeopleExpertise.objects.create(
            person=person,
            expertise=skill
        )

print("Dummy data populated successfully!")

