from django.utils import timezone
from django.db.models import Count, Sum
from ..models import Receipt


def get_aggregation(user, date=None):
    queryset = Receipt.objects.filter(user=user, status=Receipt.Status.DONE)

    if date:
        queryset = queryset.filter(created_at__date=date)

    result = queryset.aggregate(
        total_count=Count("id"),
        total_sum=Sum("total_amount"),
    )

    return {
        "user": user.username,
        "date": str(date) if date else "all_time",
        "total_amount": result["total_sum"] or 0,
        "receipt_count": result["total_count"] or 0,
    }