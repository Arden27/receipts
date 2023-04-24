from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('harry-dumbledore-chat/', views.harry_dumbledore_chat, name='harry_dumbledore_chat'),
]