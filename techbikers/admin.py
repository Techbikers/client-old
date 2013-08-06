from django.contrib import admin
from riders.models import RiderProfile
from rides.models import Ride, RideRiders
from chapters.models import Chapter
from sales.models import Sale

admin.site.register(RiderProfile)
admin.site.register(Ride)
admin.site.register(RideRiders)
admin.site.register(Chapter)
admin.site.register(Sale)