# Generated by Django 4.2 on 2023-06-12 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('receipts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='receipt',
            name='store',
        ),
    ]
