import json
from decimal import Decimal
from django.conf import settings
from google import genai
from ..models import Receipt
import re


class GeminiReceiptExtractor:
    """Handles all Gemini API interaction and response parsing."""

    MODEL = "gemini-3.5-flash-lite"

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def extract(self, image_bytes):
        raw_text = self._call_gemini(image_bytes)
        data = self._parse_json(raw_text)
        total_amount = self._extract_total(data)
        return data, total_amount

    def _call_gemini(self, image_bytes):
        response = self.client.models.generate_content(
            model=self.MODEL,
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"text": "Extract total_amount, merchant_name, date, and items list from this receipt."},
                        {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
                    ]
                }
            ],
            config={
                "response_mime_type": "application/json"
            }
        )
        return response.text

    def _parse_json(self, raw_text):
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if not match:
            raise ValueError("Gemini did not return valid JSON")

        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            raise ValueError("Gemini did not return valid JSON")

    def _extract_total(self, data):
        amount = data.get("total_amount")
        if amount is None:
            raise ValueError("Could not extract total amount from receipt")
        return Decimal(str(amount))



class ReceiptService:
    """Handles receipt DB orchestration, delegates extraction to GeminiReceiptExtractor."""

    def __init__(self, receipt_id):
        self.receipt_id = receipt_id
        self.extractor = GeminiReceiptExtractor()

    def process_receipt(self):
        receipt = Receipt.objects.get(id=self.receipt_id)
        receipt.status = Receipt.Status.PROCESSING
        receipt.save(update_fields=["status"])

        try:
            image_bytes = receipt.image.read()
            data, total_amount = self.extractor.extract(image_bytes)

            receipt.extracted_data = data
            receipt.total_amount = total_amount
            receipt.status = Receipt.Status.DONE
            receipt.save(update_fields=["extracted_data", "total_amount", "status"])

        except Exception as e:
            receipt.status = Receipt.Status.FAILED
            receipt.error_message = str(e)
            receipt.save(update_fields=["status", "error_message"])
            raise

        return receipt