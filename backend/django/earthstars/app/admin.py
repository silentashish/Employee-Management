from django.contrib import admin

# Register your models here.
from .models import People, Projects, Expertise, PeopleProjects, PeopleExpertise

admin.site.register(People)
admin.site.register(Projects)
admin.site.register(Expertise)
admin.site.register(PeopleProjects)
admin.site.register(PeopleExpertise)
