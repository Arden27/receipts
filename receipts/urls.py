from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptItemViewSet, ReceiptViewSet, CategoryViewSet, ReceiptItemTotalPriceView, ReceiptItemTotalPriceCurrentMonthView, ReceiptItemTotalPriceLastMonthView, ReceiptItemTotalPriceForOneMonthView, ReceiptItemTotalPriceSameDayLastMonthView

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet)
router.register(r'receiptitems', ReceiptItemViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('receiptitemstotalprice/', ReceiptItemTotalPriceView.as_view(), name='receiptitemstotalprice'),
    path('receiptitemstotalpricecurrentmonth/', ReceiptItemTotalPriceCurrentMonthView.as_view(), name='receiptitemstotalpricecurrentmonth'),
    path('receiptitemstotalpricelastmonth/', ReceiptItemTotalPriceLastMonthView.as_view(), name='receiptitemstotalpricelastmonth'),
    path('receiptitemstotalpriceforonemonth/', ReceiptItemTotalPriceForOneMonthView.as_view(), name='receiptitemstotalpriceforonemonth'),
    path('receiptitemstotalpricesamedaylastmonth/', ReceiptItemTotalPriceSameDayLastMonthView.as_view(), name='receiptitemstotalpricesamedaylastmonth'),
]