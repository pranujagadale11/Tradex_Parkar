from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask import Flask
from flask import Blueprint
import MySQLdb
import datetime
from flask_jwt_extended import JWTManager, jwt_required
from concurrent.futures import ThreadPoolExecutor
from routes.stockprices import fetch_stock_price
import time
import asyncio
import os
 
bidstock_bp = Blueprint('bidstock' , __name__)
 
 
def fetch_stocks_from_db():
    # Create a new connection
    db = MySQLdb.connect(host=os.getenv('HOST'),
                         user=os.getenv('DATABASE_USER'),
                         passwd=os.getenv('DATABASE_PASSWORD'),
                         db=os.getenv('DATABASE_NAME'))
    cur = db.cursor()
    cur.execute("SELECT * FROM stock_bid")
    result = cur.fetchall()
    column_names = ["id", "userid", "ticker", "price", "quantity", "action"]
    stocks = [dict(zip(column_names, row)) for row in result]
    cur.close()
    db.close()
    return stocks
 
 
 
 
# Placeholder functions for buy and sell operations
def buy_stock(mysql,ticker, userid, price,quantity, threshold_price, action):
    cursor = mysql.connection.cursor()
    print("inside buy method ========================")
    print(ticker, userid, price,quantity, threshold_price)
    try:
       
        cursor.callproc('UpdateStockAndTransactionHistory', (ticker, userid, price, quantity))
        cursor.execute("Delete from stock_bid where userid = %s and ticker_symbol = %s and price = %s and actions = %s",(userid, ticker, threshold_price, action))
       
        mysql.connection.commit()
 
       
        cursor.close()
        return jsonify({"message": "Stock and transaction updated successfully."}),  200
    except Exception as e:
       
        mysql.connection.rollback()
        cursor.close()
        return
        return jsonify({"error": str(e)}),  500
 
def sell_stock(mysql, ticker, userid, price,quantity, threshold_price, action):
 
 
    cur = mysql.connection.cursor()
    try:
       
        cur.callproc('SellStock', (ticker, userid, price, quantity))
       
       
        if cur.rowcount ==  0:
            return jsonify({"error": "Not enough stocks to sell."}),  422
 
        cur.execute("Delete from stock_bid where userid = %s and ticker_symbol = %s and price = %s and actions = %s",(userid, ticker, threshold_price, action))
        mysql.connection.commit()
 
       
        cur.close()
        return jsonify({"message": "Stock sold and transaction recorded."}),  200
    except mysql.connect.Error as err:
        # Rollback the transaction in case of error
        mysql.connection.rollback()
 
       
        cur.close()
        return
        return jsonify({"error": str(err)}),  500
# Function to check if the stock price has fallen below the threshold
def check_price_below_threshold(mysql,app):
    print("check stock bid ====")
    with app.app_context():
        while True:
            # print("background")
            # stocks = fetch_stocks_from_db(mysql)
            stocks = fetch_stocks_from_db()
            print("stock from database///////////////////",stocks)
            for stock in stocks:
                stock_price = fetch_stock_price(stock["ticker"])  # Simulated function
                threshold_price = stock["price"]
                action = stock["action"]
                print(stock)
                print(action)
                print("stock price ",stock_price)
                print(".......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                if stock_price <= threshold_price and action == "buy":
                    print("inside buy if condition")
                    # Call buy and sell functions
                    buy_stock(mysql,stock["ticker"],stock["userid"],stock_price,stock["quantity"], threshold_price, action)
                if stock_price >= threshold_price and action == "sell":
                    print("sold")
                    sell_stock(mysql,stock["ticker"],stock["userid"],stock_price,stock["quantity"], threshold_price, action)
            time.sleep(15)
 
 
 
 
 
 
 
@bidstock_bp.route("/bid_on_stock", methods=["POST"])
@jwt_required()
def place_bid():
    data = request.get_json()
    print(data)
    # Validate input data
    if not all(key in data for key in ['userid', 'quantity', 'ticker', 'price', 'action']):
        return jsonify({"error": "Missing required fields"}),   400
 
    # Prepare the data for the SQL query
    userid = data['userid']
    quantity = data['quantity']
    ticker_name = data['ticker']
    price = data['price']
    action = data['action']
 
 
    print(userid,quantity,ticker_name,price,action);
    # Connect to the database
    from demo import mysql
    cursor = mysql.connection.cursor()
 
    # Prepare the SQL query
    sql_query = """
    INSERT INTO stock_bid (userid, ticker_symbol, price, quantity, actions)
    VALUES (%s, %s, %s, %s, %s)
    """
 
    # Execute the SQL query
    try:
        cursor.execute(sql_query, (userid, ticker_name, price, quantity, action))
        mysql.connection.commit()
        return jsonify({"message": "Bid placed successfully"}),   200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}),   500
    finally:
        cursor.close()
        # mysql.connection.close()
 
 
 
 
@bidstock_bp.route("/openorders", methods=["POST"])
@jwt_required()
def get_orders():
    from demo import mysql
    data = request.get_json()
   
    userid = data['userid']
    print(userid)
   
    cursor = mysql.connection.cursor()
    sql_query ="SELECT * FROM stock_bid WHERE userid = %s"
    try:
        cursor.execute(sql_query, (userid,))
        result = cursor.fetchall()
        column_names = ["id", "userid" ,"ticker", "price", "quantity", "action"]
        openstocks = [dict(zip(column_names, row)) for row in result]
        return jsonify(openstocks)
    except Exception as e:
        return jsonify({"error": str(e)}),   500
    finally:
        cursor.close()
 
 
 
@bidstock_bp.route("/removeorders", methods=["POST"])
@jwt_required()
def remove_orders():
    data = request.get_json()
   
    iD = data['id']
    userid = data['userId']
    ticker_name = data['ticker']
    price = data['price']
    action = data['action']
    print(userid,ticker_name,price,action)
    # Connect to the database
    from demo import mysql
    cursor = mysql.connection.cursor()
 
    try:
        cursor.execute("DELETE FROM stock_bid WHERE userid = %s and ticker_symbol = %s and price = %s and actions = %s and id=%s", (userid, ticker_name, price, action,iD))
        mysql.connection.commit()
        return jsonify({"message": "Order removed Sucessfully"}),   200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}),   500
    finally:
        cursor.close()
       
 