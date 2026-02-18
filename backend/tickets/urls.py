from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, stats_view, classify_view

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename="tickets")

urlpatterns = [
    # Put custom routes BEFORE router include
    path('tickets/stats/', stats_view),
    path('tickets/classify/', classify_view),

    path('', include(router.urls)),
]
