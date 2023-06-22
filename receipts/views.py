from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ReceiptItem, Receipt, Category
from .serializers import ReceiptItemSerializer, ReceiptSerializer, CategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReceiptItemViewSet(viewsets.ModelViewSet):
    serializer_class = ReceiptItemSerializer
    permission_classes = [IsAuthenticated] 
    filterset_fields = ['receipt', 'category']
    queryset = ReceiptItem.objects.all()

    def get_queryset(self):
        return ReceiptItem.objects.filter(receipt__user=self.request.user)


class ReceiptViewSet(viewsets.ModelViewSet):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated]
    queryset = Receipt.objects.all()

    def get_queryset(self):
        return Receipt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReceiptItemTotalPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_price = ReceiptItem.objects.filter(receipt__user=request.user).aggregate(Sum('price'))['price__sum']
        return Response({'total_price': total_price if total_price is not None else 0})