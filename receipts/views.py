from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ReceiptItem, Receipt, Category
from .serializers import ReceiptItemSerializer, ReceiptSerializer, CategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models.functions import ExtractMonth, ExtractYear

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

class TotalPricesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Current date and year
        today = datetime.now()
        current_year = today.year
        current_month = today.month

        # Dates for the previous month
        last_month_date = today - relativedelta(months=1)
        last_month = last_month_date.month
        last_year = last_month_date.year

        # Dates for the last 30 days
        same_day_last_month = today - relativedelta(months=1)
        first_day_last_month = same_day_last_month.replace(day=1)

        # Query the database for all totals
        total_price = ReceiptItem.objects.filter(receipt__user=request.user).aggregate(Sum('price'))['price__sum'] or 0
        total_price_current_month = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__year=current_year, 
            receipt__date__month=current_month
        ).aggregate(Sum('price'))['price__sum'] or 0
        total_price_last_month = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__year=last_year, 
            receipt__date__month=last_month
        ).aggregate(Sum('price'))['price__sum'] or 0
        total_price_for_one_month = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__range=[same_day_last_month, today]
        ).aggregate(Sum('price'))['price__sum'] or 0
        total_price_same_day_last_month = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__range=[first_day_last_month, same_day_last_month]
        ).aggregate(Sum('price'))['price__sum'] or 0

        # Construct the response
        response = {
            'total_price': total_price,
            'total_price_current_month': total_price_current_month,
            'total_price_last_month': total_price_last_month,
            'total_price_for_one_month': total_price_for_one_month,
            'total_price_same_day_last_month': total_price_same_day_last_month,
        }

        return Response(response)
