from flask import request, jsonify
from flask import Blueprint
from flask_jwt_extended import JWTManager, jwt_required
from MySQLdb import Error

withdrawfund_bp = Blueprint('withdrawfund' , __name__)

@withdrawfund_bp.route("/withdraw_fund_by_userid", methods=["POST"])
@jwt_required()
def withdraw_fund():
    from demo import mysql
    data = request.get_json()
    userid = data.get("userid")
    fund = data.get("fund")
    print(userid)
    print(fund)

    
    cursor = mysql.connection.cursor()
    try:
        cursor.callproc('WithdrawUserFund', [userid, fund])
        mysql.connection.commit()
    except Error as e:
        if e.args[0] ==  45000:
            return jsonify({"error": "User does not have enough funds to withdraw"}),  400
        else:
            return jsonify({"error": str(e)}),  500
    finally:
        cursor.close()

    return jsonify({"message": "Fund Withdrawn Successfully"})
