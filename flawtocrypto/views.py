from django.shortcuts import render
import requests
import datetime

def get_historical_bitcoin_price(days="max"):
    url = f"https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days={days}"
    response = requests.get(url)
    data = response.json()
    prices = data['prices']
    return prices

def home(request):
    prices = get_historical_bitcoin_price()
    context = {
        'prices': prices,
    }
    return render(request, 'flawtocrypto/index.html', context)