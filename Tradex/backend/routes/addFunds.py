from flask import request, jsonify
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required



addfund_bp = Blueprint('addfund' , __name__) 
@addfund_bp.route("/add_fund_by_userid", methods=["POST"])
@jwt_required()
def add_fund():
    from demo import mysql
    data = request.get_json()
    userid = data.get("userid")
    fund = data.get("fund")
    print(userid)
    print(fund)
 
    cursor = mysql.connection.cursor()
    cursor.callproc('AddUserFund', [userid, fund])
    mysql.connection.commit()
    cursor.close()
 
    return jsonify({"message": "Fund Added Successfully"})