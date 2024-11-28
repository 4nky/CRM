from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Coolcool%4078@localhost:3306/crm_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

class Customer(db.Model):
    __tablename__ = 'crm_employee'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(15), nullable=False)

class SalesExecutive(db.Model):
    __tablename__ = 'salesExecutive'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    sales_target = db.Column(db.Numeric(10, 2), nullable=True)
    total_sales = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.Enum('INR', 'USD', 'AED', 'Pound', name='currency_enum'), default='INR')
    target_assigned_date = db.Column(db.TIMESTAMP, nullable=True)
    username = db.Column(db.String(100), nullable=True)
    status = db.Column(db.Enum('Active', 'Unactive', name='status_enum'), default='Active')

class Quotation(db.Model):
    __tablename__ = 'quotation'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(255), nullable=False, unique=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    gst = db.Column(db.Numeric(5, 2), nullable=False)
    tax = db.Column(db.Numeric(5, 2), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    Status = db.Column(db.String(255), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'service_name': self.service_name,
            'quantity': self.quantity,
            'price': float(self.price),
            'gst': float(self.gst),
            'tax': float(self.tax),
            'total_amount': float(self.total_amount),
            'Status': str(self.Status)
        }

@app.route('/get_customers/<username>', methods=['GET'])
def get_customer_by_username(username):
    """
    Retrieve user details by username.
    """
    try:
        customer = Customer.query.filter_by(username=username).first()
        if not customer:
            return jsonify({"error": "User not found"}), 404
        return jsonify({
            "id": customer.id,
            "username": customer.username,
            "password": customer.password,
            "role": customer.role,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_sales_executives', methods=['GET'])
def get_sales_executives():
    try:
        sales_executives = SalesExecutive.query.all()
        executive_list = []
        for executive in sales_executives:
            executive_list.append({
                "id": executive.id,
                "email": executive.email,
                "sales_target": str(executive.sales_target),
                "total_sales": str(executive.total_sales),
                "currency": executive.currency,
                "target_assigned_date": executive.target_assigned_date,
                "username": executive.username,
                "status": executive.status,
            })
        return jsonify(executive_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/add_sales_executive', methods=['POST'])
# def add_sales_executive():
#     try:
#         data = request.json
#         new_executive = SalesExecutive(
#             email=data['email'],
#             sales_target=data['sales_target'],
#             total_sales=data['total_sales'],
#             currency=data['currency'],
#             target_assigned_date=data['target_assigned_date'],
#             username=data['username'],
#             status=data['status'],
#         )
#         db.session.add(new_executive)
#         db.session.commit()
#         return jsonify({"message": "Sales Executive added successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/delete_sales_executive/<int:id>', methods=['DELETE'])
def delete_sales_executive(id):
    try:
        executive = SalesExecutive.query.get(id)
        if not executive:
            return jsonify({"error": "Sales Executive not found"}), 404
        db.session.delete(executive)
        db.session.commit()
        return jsonify({"message": "Sales Executive deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/edit_sales_executive/<int:id>', methods=['PUT'])
def edit_sales_executive(id):
    """
    Update the sales target and reset total sales to zero, updating the target assigned date.
    """
    try:
        data = request.json
        executive = SalesExecutive.query.get(id)
        if not executive:
            return jsonify({"error": "Sales Executive not found"}), 404

        executive.sales_target = data.get('sales_target', executive.sales_target)
        executive.total_sales = 0
        executive.target_assigned_date = db.func.current_timestamp()

        db.session.commit()
        return jsonify({"message": "Sales Executive updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_quotation_data', methods=['GET'])
def get_quotation():
    try:
        quotation_data = Quotation.query.all()
        
        if not quotation_data:
            return jsonify({"error": "Quotation not found"}), 404 
        quotations = [quotation.to_dict() for quotation in quotation_data]

        return jsonify(quotations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/update_quotation_status/<int:id>', methods=['PUT'])
def update_quotation_status(id):
    try:
        quotation = Quotation.query.get(id)
        
        if not quotation:
            return jsonify({"error": "Quotation not found"}), 404
        new_status = request.json.get('status')
        
        if new_status not in ['Approved', 'Declined']:
            return jsonify({"error": "Invalid status"}), 400
        
        quotation.Status = new_status
        db.session.commit()

        return jsonify({"message": f"Quotation {id} status updated to {new_status}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/add_quotation', methods=['POST'])
def add_quotation():
    data = request.get_json()

    if not data.get('service_name') or not data.get('quantity') or not data.get('price') or not data.get('gst') or not data.get('tax') or not data.get('total_amount') or not data.get('Status'):
        return jsonify({"error": "Missing required fields"}), 400

    new_quotation = Quotation(
        service_name=data['service_name'],
        quantity=data['quantity'],
        price=float(data['price']),
        gst=float(data['gst']),
        tax=float(data['tax']),
        total_amount=float(data['total_amount']),
        Status=data['Status']
    )
    try:
        db.session.add(new_quotation)
        db.session.commit()
        return jsonify({"message": "Quotation added successfully", "quotation": new_quotation.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)