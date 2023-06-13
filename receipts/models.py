from django.db import models

class Receipt(models.Model):
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    purchase_date = models.DateField()
    #store = models.CharField(max_length=200)
