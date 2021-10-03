from django.db import models
from rest_framework import serializers
from rest_framework.utils import field_mapping
from .models import Room
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('code','host','guest_can_pause','votes_to_skip')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room 
        fields=('guest_can_pause','votes_to_skip')