from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required
import json
from routes.stockprices import get_prices_concurrently


userStock_bp = Blueprint('userStock' , __name__)



@userStock_bp.route("/get_fund_by_userid", methods=["POST"])
@jwt_required()
def getFundByUserId():
    from demo import mysql
    data = request.get_json()
    userid = data.get("userid")
    
    
    mycursor = mysql.connection.cursor()

   
    sql_query = "SELECT id,name,email,fund FROM users WHERE id = %s"

    try:
        
        mycursor.execute(sql_query, (userid,))

        
        result = mycursor.fetchall()

       
        if not result:
            return jsonify({"error": "No stocks found for the given userid"}),  404

        
        column_names = ["id", "name", "email", "fund"]

      
        result1 = [dict(zip(column_names, row)) for row in result]
        return jsonify(result1)
    except Exception as e:
        
        return jsonify({"error": str(e)}),  500
    finally:
       
        mycursor.close()









@userStock_bp.route("/get_stock_by_userid", methods=["POST"])
@jwt_required()
def getStockByUserId():
    from demo import mysql
    data = request.get_json()
    userid = data.get("userid")
    
    mycursor = mysql.connection.cursor()

    sql_query = "SELECT * FROM stock_entry WHERE userid = %s"

    try:
        mycursor.execute(sql_query, (userid,))
        result = mycursor.fetchall()

        if not result:
            return jsonify({"error": "No stocks found for the given userid"}),  404

                # Extract the ticker symbols
        tickers = [row[0] for row in result]
        print(tickers)
        # Fetch the current prices for the tickers
        prices = get_prices_concurrently(tickers)
        print(prices)
        result_with_prices = []
        # Include the prices in the JSON response
        for row in result:
            ticker = row[0]
            if ticker in prices:
                updated_row = list(row) + [prices[ticker]['price'], prices[ticker]['current_time']]
                result_with_prices.append(updated_row) 
                
        print(result)
        column_names = ["ticker", "userid", "price", "quantity", "current_price", "current_time"]

        result1 = [dict(zip(column_names, row)) for row in result_with_prices]
        
        return jsonify(result1)
    
    except Exception as e:
        return jsonify({"error": str(e)}),  500
    finally:
        mycursor.close()





# get transaction history by userid
@userStock_bp.route("/get_history_by_userid", methods=["POST"])
@jwt_required()
def getHistroyByUserId():
    from demo import mysql
    data = request.get_json()
    userid = data.get("userid")
    
    mycursor = mysql.connection.cursor()

    sql_query = "SELECT * FROM transaction_history WHERE userid = %s"

    try:
        mycursor.execute(sql_query, (userid,))

        result = mycursor.fetchall()
        # Check if result is not empty
        if not result:
            return jsonify({"error": "No stocks found for the given userid"}),  404

        column_names = ["id", "userid" ,"ticker", "price", "action", "quantity" ,"date"]

    # Convert the list of lists into a list of dictionaries
        result1 = [dict(zip(column_names, row)) for row in result]
        return jsonify(result1)
    except Exception as e:
        # Log the error or return a message
        return jsonify({"error": str(e)}),  500
    finally:
        mycursor.close()



