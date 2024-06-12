from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask import Blueprint
import bcrypt
from flask_jwt_extended import create_access_token
from mysql.connector import Error
from MySQLdb import IntegrityError
import re



def hash_password(password):
    password = password.encode('utf-8')  
    salt = bcrypt.gensalt()  
    hashed_password = bcrypt.hashpw(password, salt)  
    return hashed_password.decode('utf-8')  

def check_password(provided_password, stored_hashed_password):
    provided_password = provided_password.encode('utf-8')
    stored_hashed_password = stored_hashed_password.encode('utf-8')
    return bcrypt.checkpw(provided_password, stored_hashed_password)

auth_bp = Blueprint('auth' , __name__)
#to register user
@auth_bp.route("/register_user", methods=["POST"])
def register_user():
    from demo import mysql
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password_original = data.get("password")
    password = hash_password(password_original)
     # Check if name, email, or password is empty or contains only whitespace
    if not name.strip() or not email.strip() or not password_original.strip():
        return jsonify({"error": "Name, email, or password cannot be empty or only whitespace"}), 400


    if not re.search(r'\w', name) or not re.search(r'\w', email):
        return jsonify({"error": "Name and email must contain at least one alphanumeric character"}), 400

    # Validate email format and ensure it starts with a letter
    email_regex = r"^[A-Za-z][^@]*@[^@]+\.[^@]+"
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format or does not start with a letter"}), 400
        
    # Validate email format
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate password (example: at least 8 characters long, contains at least one letter and one number)
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
    if not re.match(password_regex, password_original):
        return jsonify({"error": "Password must be at least 8 characters long and contain at least special character  and one number"}), 400

    # Insert user data into the database
    cur = mysql.connection.cursor()
    try:
        print("try")
        cur.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
        print("try1")
        mysql.connection.commit()
        print("try2")
        return jsonify({"message": "User data saved successfully"})
    except IntegrityError as e:
        if e.args[0] == 1062:
            return jsonify({"error": "User Already Exist"}),  501
        else:
            return jsonify({"error1": str(e)}),  500
    except Error as e:
        return jsonify({"error2": str(e)}),  500
    finally:
        print("finally")
        cur.close()
    

    



#login 

@auth_bp.route("/login", methods=["POST"])
def login_user():
    from demo import mysql
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    cur = mysql.connection.cursor()
   
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user_record = cur.fetchone()

    if user_record:
        hash_password= user_record[3]
        print(hash_password)
    else:
        
        return jsonify({"error": "Invalid password"}), 401

    userPresent = check_password(password, hash_password)
    
    if userPresent:
        
        cur.execute("SELECT * FROM users WHERE email = %s AND password = %s" , (email,hash_password))
        user = cur.fetchone()
        user_info = {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            
        }
        access_token = create_access_token(identity=data["email"]) 
        return jsonify({"user": user_info, "access_token": access_token}),  200
    else:
        # User not found, return error message
        return jsonify({"error": "Invalid email"}), 401
    
