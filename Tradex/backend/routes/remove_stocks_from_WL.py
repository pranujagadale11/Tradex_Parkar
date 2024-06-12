from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
import datetime
import os
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required
 
 
remove_from_WL_bp = Blueprint('removestock',__name__)
@remove_from_WL_bp.route("/remove_stock_WL",methods=["POST"])
@jwt_required()
def remove_stock():
    from demo import mysql
    from demo import ChangeinWL
    ChangeinWL['value'] = 1
    data = request.get_json()
    ticker_in = data.get("ticker")
    userid_in = data.get("userId")
    wl_no_in = data.get("WL_no")
    print("Inside remove Stock Function---->>>>>>>>>")
    print(ticker_in, userid_in, wl_no_in)
    print(type(ticker_in), type(userid_in), type(wl_no_in))
    cursor = mysql.connection.cursor()
 
    try:
 
        cursor.callproc("remove_stock",(ticker_in,userid_in,wl_no_in))
        mysql.connection.commit()
        cursor.close()
        mysql.connection.commit()
        return jsonify({"message":"Stock Entry removed from the Watchlist"})
       
    except Exception as e:
        mysql.connection.rollback()
        cursor.close()
        return jsonify({"error": str(e)}), 500