from django.db import models

class SlotBooking(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=50)
    date = models.DateField()
    time_slot = models.TimeField()

    class Meta:
        unique_together = ('date', 'time_slot')  # prevents double booking for same date/time

    def __str__(self):
        return f"{self.name} ({self.username}) - {self.date} {self.time_slot}"