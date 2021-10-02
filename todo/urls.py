from django.urls import path,re_path
from django.views.generic import TemplateView
from .views import TodoView


urlpatterns = [
    path('todos',TodoView.as_view()),
]
