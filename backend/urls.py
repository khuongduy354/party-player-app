
from django.contrib import admin
from django.urls import path
from .views import *
urlpatterns = [ 
    path('create-room',CreateRoomView.as_view()),    
    path('list-rooms',RoomView.as_view()),
    path('get-room',getRoom.as_view())
]
