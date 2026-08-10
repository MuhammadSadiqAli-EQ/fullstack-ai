from django.utils import timezone
from django.db.models import Count, Sum
from ..models import Receipt


class ReceiptAggregationService:
    def __init__(self, user, date=None):
        self.user = user
        self.date = date

    def get_queryset(self):
        queryset = Receipt.objects.filter(user=self.user, status=Receipt.Status.DONE)
        if self.date:
            queryset = queryset.filter(created_at__date=self.date)
        return queryset

    def get_aggregation(self):
        result = self.get_queryset().aggregate(
            total_count=Count("id"),
            total_sum=Sum("total_amount"),
        )
        return {
            "user": self.user.username,
            "date": str(self.date) if self.date else "all_time",
            "total_amount": result["total_sum"] or 0,
            "receipt_count": result["total_count"] or 0,
        }