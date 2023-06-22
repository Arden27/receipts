from rest_framework import serializers
from .models import ReceiptItem, Receipt

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('id', 'date', 'store', 'total')

class ReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptItem
        fields = ('id', 'item_name', 'price', 'receipt')