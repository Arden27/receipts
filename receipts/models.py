from django.db import models

class Receipt(models.Model):
    date = models.DateField()
    store = models.CharField(max_length=200)
    total = models.DecimalField(max_digits=10, decimal_places=2)

class ReceiptItem(models.Model):
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, null=True)

