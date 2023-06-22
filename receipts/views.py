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

class ReceiptItemTotalPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_price = ReceiptItem.objects.filter(receipt__user=request.user).aggregate(Sum('price'))['price__sum']
        return Response({'total_price': total_price if total_price is not None else 0})
    
class ReceiptItemTotalPriceCurrentMonthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = datetime.now().year
        current_month = datetime.now().month

        total_price = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__year=current_year, 
            receipt__date__month=current_month
        ).aggregate(Sum('price'))['price__sum']

        return Response({'total_price': total_price if total_price is not None else 0})
    
class ReceiptItemTotalPriceLastMonthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        last_month_date = datetime.now() - relativedelta(months=1)
        last_month = last_month_date.month
        last_year = last_month_date.year

        total_price = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__year=last_year, 
            receipt__date__month=last_month
        ).aggregate(Sum('price'))['price__sum']

        return Response({'total_price': total_price if total_price is not None else 0})

class ReceiptItemTotalPriceForOneMonthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = datetime.now()
        same_day_last_month = today - relativedelta(months=1)

        total_price = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__range=[same_day_last_month, today]
        ).aggregate(Sum('price'))['price__sum']

        return Response({'total_price': total_price if total_price is not None else 0})
    
class ReceiptItemTotalPriceSameDayLastMonthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = datetime.now()
        first_day_last_month = (today - relativedelta(months=1)).replace(day=1)
        same_day_last_month = today.replace(month=first_day_last_month.month, year=first_day_last_month.year)

        total_price = ReceiptItem.objects.filter(
            receipt__user=request.user, 
            receipt__date__range=[first_day_last_month, same_day_last_month]
        ).aggregate(Sum('price'))['price__sum']

        return Response({'total_price': total_price if total_price is not None else 0})