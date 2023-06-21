from rest_framework import serializers
from .models import ReceiptItem, Receipt, Category
from django.db.models import Count, Sum

class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'item_count', 'total_price')

    def get_item_count(self, obj):
        return ReceiptItem.objects.filter(category=obj).count()

    def get_total_price(self, obj):
        total = ReceiptItem.objects.filter(category=obj).aggregate(Sum('price'))['price__sum']
        return total if total is not None else 0

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('id', 'date', 'store', 'total')

class ReceiptItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = ReceiptItem
        fields = ('id', 'item_name', 'price', 'receipt', 'category')