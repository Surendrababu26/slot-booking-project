from django.urls import path
from . import views

urlpatterns = [
    path('slots/', views.view_slots, name='view_slots'),        # GET all slots
    path('book-slot/', views.book_slot, name='book_slot'),      # POST to book slot
    path('booked-slots/', views.booked_slots, name='booked_slots'),  # GET booked slots
]