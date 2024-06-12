from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask import Blueprint
import datetime
from flask_jwt_extended import JWTManager, jwt_required
from concurrent.futures import ThreadPoolExecutor
import time
import os
import requests



stockprice_bp = Blueprint('stockprice' , __name__)
def fetch_stock_price(ticker):
    start = time.time()

    stock = yf.Ticker(ticker)
    data = stock.history(period="1d")
    if not data.empty:
        end  = time.time()
        print(end-start)
        return data['Close'][0]
    else:
        return None

      


def get_prices_concurrently(tickers):
    current_time = datetime.datetime.now()
    print(current_time)
    prices = {}

   
    with ThreadPoolExecutor() as executor:
        
        results = executor.map(fetch_stock_price, tickers)

        
        for ticker, price in zip(tickers, results):
            if price is not None:
                prices[ticker] = {'price': price, 'current_time': current_time.strftime('%Y-%m-%d %H:%M:%S')}

    return prices



        






@stockprice_bp.route("/get_prices_wl2", methods=["POST"])
def get_prices_wl2():
    from demo import mysql
    from demo import ChangeinWL, cacheWL2
    data = request.get_json()
    userid = data.get("userid")
    print("stock flag-------------------------", ChangeinWL['value'])

    # Check if ChangeinWL['value'] is 1 or if the cache is empty
    if ChangeinWL['value'] == 1 or not cacheWL2:

        mycursor = mysql.connection.cursor()
        print("database operration -----------------------------------------------------------------------------------------------------")

        sql_query = "SELECT stock_name FROM wl2 WHERE userid = %s"

        try:
            # Execute the query with the userid as a parameter
            mycursor.execute(sql_query, (userid,))

            # Fetch all the rows
            result = mycursor.fetchall()

            # Check if result is not empty
            if not result:
                return jsonify({"error": "No stocks found for the given userid"}), 404

            # Extract the ticker symbols
            tickers = [row[0] for row in result]

     # Fetch the current prices for the tickers
            prices = get_prices_concurrently(tickers)

     # Store the fetched data in the cache, including the userid
            cacheWL2[userid] = {'userid': userid, 'prices': prices}
            ChangeinWL['value'] = 0

            return jsonify(prices)
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            mycursor.close()
    else:
        cached_data = cacheWL2.get(userid, {'userid': userid, 'prices': []})
        tickers = cached_data.get('prices', [])
        prices = get_prices_concurrently(tickers)

        return jsonify(prices)








@stockprice_bp.route("/get_prices_wl1", methods=["POST"])
def get_prices_wl1():
    from demo import mysql
    from demo import ChangeinWL, cacheWL1
    data = request.get_json()
    userid = data.get("userid")
    print("stock flag-------------------------", ChangeinWL['value'])

    # Check if ChangeinWL['value'] is 1 or if the cache is empty
    if ChangeinWL['value'] == 1 or not cacheWL1:
        # Create a cursor object
        mycursor = mysql.connection.cursor()
        print("database operration -----------------------------------------------------------------------------------------------------")
        # Define the SQL query to get tickers from WL1 for the given userid
        sql_query = "SELECT stock_name FROM wl1 WHERE userid = %s"

        try:
            # Execute the query with the userid as a parameter
            mycursor.execute(sql_query, (userid,))

            # Fetch all the rows
            result = mycursor.fetchall()

            # Check if result is not empty
            if not result:
                return jsonify({"error": "No stocks found for the given userid"}), 404

            tickers = [row[0] for row in result]

            # Fetch the current prices for the tickers
            prices = get_prices_concurrently(tickers)

            # Store the fetched data in the cache, including the userid
            cacheWL1[userid] = {'userid': userid, 'prices': prices}
            ChangeinWL['value'] = 0

            return jsonify(prices)
        
        except Exception as e:
            # Log the error or return a message
            return jsonify({"error": str(e)}), 500
        finally:
            # Close the cursor
            mycursor.close()
    else:
        # Return the cached data
        cached_data = cacheWL1.get(userid, {'userid': userid, 'prices': []})
        tickers = cached_data.get('prices', [])
        prices = get_prices_concurrently(tickers)

        return jsonify(prices)









 

  
# @stockprice_bp.route("/download_csv", methods=["GET"])
def download_csv():
    url = "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv"
    filename = os.path.join(os.getcwd(), "EQUITY_L.csv")
    download_csv_file(url, filename)
    return f"File downloaded successfully as '{filename}'."
 
def download_csv_file(url, filename):
    """
    Downloads a CSV file from the given URL and saves it with the specified filename.
   
    Args:
    - url (str): The URL of the CSV file to download.
    - filename (str): The name of the file to save the downloaded CSV data to.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
    }
    # Send a GET request to the URL with the specified headers
    response = requests.get(url, headers=headers)
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Open the file in binary write mode and write the content of the response
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"File '{filename}' downloaded successfully.")
    else:
        print("Failed to download the file.")
 
 
 
 
 
@stockprice_bp.route("/get_first_row", methods=["GET"])
def get_first_row():
    # Read the CSV file
    df = pd.read_csv("EQUITY_L.csv")
   
    # Convert the first row to a dictionary
    first_column = df.iloc[:, 0].tolist()
   
    # Convert the dictionary to JSON and return
    return jsonify(first_column)