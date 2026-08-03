from celery import shared_task
from .services.receipt_services import ReceiptService
from django.contrib.auth import get_user_model
from .services.aggregation_service import get_aggregation
from django.utils import timezone
import logging


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def process_receipt_task(self, receipt_id):
    try:
        service = ReceiptService(receipt_id=receipt_id)
        service.process_receipt()
    except Exception as exc:
        raise self.retry(exc=exc)

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def daily_receipt_aggregation(self):

    today = timezone.now().date()

    try:
        users = User.objects.all()
        
        for user in users:
            try:
                result = get_aggregation(user, date=today)
                print(
                    f"[{result['date']}] User: {result['user']} | "
                    f"Total Spent: {result['total_amount']} | "
                    f"Receipts Analyzed: {result['receipt_count']}"
                )
            except Exception as e:
                logger.error(f"Aggregation failed for user {user.username}: {e}")
    except Exception as ex:
        logger.error(f"Daily aggregation task failed entirely: {ex}")
        raise self.retry(exc=ex)