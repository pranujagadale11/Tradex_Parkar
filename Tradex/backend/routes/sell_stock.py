from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required


sellstock_bp = Blueprint('sellstock' , __name__)
@sellstock_bp.route("/sell_stock", methods=["POST"])
@jwt_required()
def sell_stock():
    from demo import mysql
    data = request.get_json()
    ticker = data.get("ticker")
    userid = data.get("userid")
    price = data.get("price")
    quantity = data.get("quantity")
    cur = mysql.connection.cursor()
    try:
       
        cur.callproc('SellStock', (ticker, userid, price, quantity))
        
       
        if cur.rowcount ==  0: 
            return jsonify({"error": "Not enough stocks to sell."}),  422

        
        mysql.connection.commit()

        
        cur.close()

        return jsonify({"message": "Stock sold and transaction recorded."}),  200
    except mysql.connect.Error as err:
        # Rollback the transaction in case of error
        mysql.connection.rollback()

        
        cur.close()

        return jsonify({"error": str(err)}),  500