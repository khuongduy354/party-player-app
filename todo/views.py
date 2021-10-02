
# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import TodoSerializer      # add this
from .models import Todo
from rest_framework.response import Response
from rest_framework import serializers, status                   # add this
from .serializers import *
class TodoView(APIView):   
    serializer_class=TodoSerializer
    def get(self,request,format=None):
        todo=Todo.objects.all()
        todo =TodoSerializer(todo,many=True)
        return Response(todo.data,status=status.HTTP_200_OK)

