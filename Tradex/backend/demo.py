from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os
from flask import Blueprint
from routes.auth import auth_bp
from routes.stockprices import stockprice_bp, download_csv
from routes.sell_stock import sellstock_bp
from routes.buy_stock import buystock_bp
from routes.addFunds import addfund_bp
from routes.getStockByUserID import userStock_bp
from routes.withdrawFunds import withdrawfund_bp
from routes.stocksBidding import check_price_below_threshold, bidstock_bp
from routes.remove_stocks_from_WL import remove_from_WL_bp
from routes.add_stocks_to_WL import add_to_WL_bp
from threading import Thread
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler


load_dotenv()

app = Flask(__name__)


# MySQL configurations
CORS(app)
app.config['MYSQL_HOST'] = os.getenv('HOST')
app.config['MYSQL_PORT'] = int(os.getenv('DATABASE_PORT'))  # Default MySQL port
app.config['MYSQL_USER'] = os.getenv('DATABASE_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DATABASE_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('DATABASE_NAME')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  7 *  24 *  60 *  60

jwt = JWTManager(app)

mysql = MySQL(app)

@app.route("/")
def home():
    user_data = {
        "name": "ashutosh",
        "age":  23
    }
    return user_data




def schedule_weekly_task():
    scheduler = BackgroundScheduler()
    scheduler.add_job(download_csv, 'cron', day_of_week='thu')
    scheduler.start()


ChangeinWL = {'value': 0}
cacheWL1 = {}
cacheWL2 = {}
app.register_blueprint(auth_bp)
app.register_blueprint(stockprice_bp)
app.register_blueprint(buystock_bp)
app.register_blueprint(sellstock_bp)
app.register_blueprint(addfund_bp)
app.register_blueprint(userStock_bp)
app.register_blueprint(withdrawfund_bp)
app.register_blueprint(remove_from_WL_bp)
app.register_blueprint(add_to_WL_bp)
app.register_blueprint(bidstock_bp)

if __name__ == "__main__":
    background_thread = Thread(target=check_price_below_threshold, args=(mysql, app))
    background_thread.start()
    schedule_weekly_task()
    app.run(host='0.0.0.0', debug=True)
    # app.run(debug=True)
