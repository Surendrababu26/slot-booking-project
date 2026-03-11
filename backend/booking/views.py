from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SlotBooking
from .serializers import SlotBookingSerializer

# 1. View all slots
@api_view(['GET'])
def view_slots(request):
    """
    GET /api/slots/
    Returns all slots (booked and available)
    """
    slots = SlotBooking.objects.all()
    serializer = SlotBookingSerializer(slots, many=True)
    return Response(serializer.data)


# 2. Book a slot
@api_view(['POST'])
def book_slot(request):
    """
    POST /api/book-slot/
    Book a slot. Prevents double booking of the same date and time.
    """
    name = request.data.get("name")
    username = request.data.get("username")
    date = request.data.get("date")
    time_slot = request.data.get("time_slot")

    # ✅ Prevent double booking
    if SlotBooking.objects.filter(date=date, time_slot=time_slot).exists():
        return Response(
            {"error": "This slot is already booked."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Save the booking if available
    serializer = SlotBookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Slot booked successfully!", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )

    # Return validation errors if any
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 3. See booked slots
@api_view(['GET'])
def booked_slots(request):
    """
    GET /api/booked-slots/
    Returns all booked slots
    """
    booked = SlotBooking.objects.all()
    serializer = SlotBookingSerializer(booked, many=True)
    return Response(serializer.data)