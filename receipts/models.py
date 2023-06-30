from django.db import models
from django.contrib.auth.models import User

class Receipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    date = models.DateField()
    store = models.CharField(max_length=200)
    total = models.DecimalField(max_digits=20, decimal_places=2)

class Category(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class ReceiptItem(models.Model):
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, null=True)

