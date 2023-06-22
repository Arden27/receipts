from rest_framework import serializers
from .models import ReceiptItem, Receipt, Category
from django.db.models import Count, Sum

class CategorySerializer(serializers.ModelSerializer):
    category_item_count = serializers.SerializerMethodField()
    total_category_price = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'category_item_count', 'total_category_price')

    def get_category_item_count(self, obj):
        return ReceiptItem.objects.filter(category=obj).count()

    def get_total_category_price(self, obj):
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