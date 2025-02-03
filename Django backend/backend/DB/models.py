from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    age = models.IntegerField()

    WORKING_CHOICES = [
        ('Yes', 'Yes'),
        ('No', 'No'),
    ]
    working = models.CharField(max_length=3, choices=WORKING_CHOICES)

    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    sex = models.CharField(max_length=6, choices=SEX_CHOICES)

    def __str__(self):
        return self.name
