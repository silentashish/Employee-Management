from django.db import models
from django.contrib.auth.models import User

class People(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    photo = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    years_exp = models.IntegerField(blank=True, null=True)
    hobbies = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Projects(models.Model):
    name = models.CharField(max_length=255)
    PI = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    agency = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class Expertise(models.Model):
    skill = models.CharField(max_length=255)

    def __str__(self):
        return self.skill

class PeopleProjects(models.Model):
    person = models.ForeignKey(People, on_delete=models.CASCADE)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    years_exp = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.person.name} - {self.project.name}"

class PeopleExpertise(models.Model):
    person = models.ForeignKey(People, on_delete=models.CASCADE)
    expertise = models.ForeignKey(Expertise, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.person.name} - {self.expertise.skill}"