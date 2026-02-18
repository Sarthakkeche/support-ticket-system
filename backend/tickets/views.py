from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Ticket
from .serializers import TicketSerializer
from .services import classify_ticket


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']


@api_view(['POST'])
def classify_view(request):
    description = request.data.get("description")

    category, priority = classify_ticket(description)

    if category and priority:
        return Response({
            "suggested_category": category,
            "suggested_priority": priority
        })

    return Response({
        "suggested_category": None,
        "suggested_priority": None
    })


@api_view(['GET'])
def stats_view(request):
    total = Ticket.objects.count()
    open_count = Ticket.objects.filter(status="open").count()

    daily_counts = (
        Ticket.objects
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
    )

    avg_per_day = daily_counts.aggregate(avg=Avg("count"))["avg"] or 0

    priority_breakdown = dict(
        Ticket.objects.values("priority")
        .annotate(count=Count("id"))
        .values_list("priority", "count")
    )

    category_breakdown = dict(
        Ticket.objects.values("category")
        .annotate(count=Count("id"))
        .values_list("category", "count")
    )

    return Response({
        "total_tickets": total,
        "open_tickets": open_count,
        "avg_tickets_per_day": round(avg_per_day, 2),
        "priority_breakdown": priority_breakdown,
        "category_breakdown": category_breakdown,
    })
