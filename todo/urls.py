from django.urls import path,re_path
from django.views.generic import TemplateView
from .views import TodoView


urlpatterns = [
    path('todos',TodoView.as_view()),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
