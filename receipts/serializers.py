from rest_framework import serializers
from .models import ReceiptItem, Receipt, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('id', 'date', 'store', 'total')

class ReceiptItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = ReceiptItem
        fields = ('id', 'item_name', 'price', 'receipt', 'category')