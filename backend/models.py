from django.db import models

# Create your models here.
from django.db import models
import random
import string


def generateCode():
    length = 6
    code = ''.join(random.choices(string.ascii_uppercase, k=length))
    if Room.objects.filter(code=code):
        generateCode()
    else:
        return code

# Create your models here.


class Room(models.Model):
    code = models.CharField(max_length=50, unique=True, default=generateCode)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(default=False, null=False)
    votes_to_skip = models.IntegerField(default=1, null=False)
