from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptItemViewSet, ReceiptViewSet, CategoryViewSet, TotalPricesView

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet)
router.register(r'receiptitems', ReceiptItemViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('totalprices/', TotalPricesView.as_view(), name='totalprices'),
]