from django.shortcuts import render
from rest_framework import viewsets
from .models import ReceiptItem, Receipt
from .serializers import ReceiptItemSerializer, ReceiptSerializer

class ReceiptItemViewSet(viewsets.ModelViewSet):
    queryset = ReceiptItem.objects.all()
    serializer_class = ReceiptItemSerializer

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer