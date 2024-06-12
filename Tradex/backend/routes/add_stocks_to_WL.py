# Endpoint for adding the data to watch list
from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
import datetime
import os
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required
 
 
add_to_WL_bp = Blueprint('addstock',__name__)
@add_to_WL_bp.route("/add_stock_WL",methods=["POST"])
@jwt_required()
def add_stock():
        from demo import mysql
        from demo import ChangeinWL,cacheWL1,cacheWL2
        ChangeinWL['value'] = 1
        
        data = request.get_json()
        ticker_in = data.get("ticker")
        userid_in = data.get("userId")
        wl_no_in = data.get("WL_no")
        # print(ticker_in)
        # print(userid_in)
        # print(wl_no_in)
        
        # ticker_with_ns = ticker_in + '.NS'
        # if ticker_with_in in cache:
        #     return jsonify({"error": str(e)}), 500
        ticker_with_ns = ticker_in + '.NS'

    # Check if the ticker name exists in the cache for any user ID
        


        print(wl_no_in)
        print(ticker_with_ns)
        print(cacheWL1)

        # if wl_no_in == '1':
        #     for stocks in cacheWL1.values():
        #         if ticker_with_ns in stocks:
        #             print("exist in wl1")
        #             return jsonify({"error": "Ticker already exists in the cache."}), 500
        # elif wl_no_in == '2':
        #     for stocks in cacheWL2.values():
        #         if ticker_with_ns in stocks:
        #             print("exist in wl2")
        #             return jsonify({"error": "Ticker already exists in the cache."}), 500

        if wl_no_in == '1':
            user_data = cacheWL1.get(userid_in, {})
            user_prices = user_data.get('prices', {})
            if ticker_with_ns in user_prices:
                print("exist in wl1")
                return jsonify({"error": "Ticker already exists in the cache."}), 500
        elif wl_no_in == '2':
            user_data = cacheWL2.get(userid_in, {})
            user_prices = user_data.get('prices', {})
            if ticker_with_ns in user_prices:
                print("exist in wl2")
                return jsonify({"error": "Ticker already exists in the cache."}), 500



        
        cursor = mysql.connection.cursor()
 
        try:
 
            cursor.callproc("add_stock",(ticker_in,userid_in,wl_no_in))
            mysql.connection.commit()
            cursor.close()
            mysql.connection.commit()
            return jsonify({"message":"Stock and userid updated successfully."})
           
        except Exception as e:
            mysql.connection.rollback()
            cursor.close()
            return jsonify({"error": str(e)}), 500  