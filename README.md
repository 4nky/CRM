# CRM Project - README  

## Table of Contents  
1. [Project Overview]
2. [Features]
3. [Technologies Used]
4. [Database and Data Storage]
5. [API Endpoints]
6. [Project Structure] 
7. [License] 

---

## Project Overview
This CRM web application is designed to manage customer relationships, track sales targets, generate quotations, and streamline the invoice generation process. The system includes two primary user roles: **Admin** and **Sales Executive**, each with distinct access levels and functionalities.  

---

## Features  

### 1. User Management and Access Control  
#### Admin User:  
- Create, read, update, and delete sales executive accounts.  
- Assign and manage sales targets with currency flexibility (INR, USD, AED, Pound).  
- Approve or reject quotations and invoices submitted by sales executives.  
- Full access to all data, including customer and user information.  
- View dashboards and generate performance reports.  

#### Sales Executive User:  
- Secure login and personalized dashboard access.  
- View assigned annual sales targets.  
- Manage customer information, including:  
  - Company Name, Address, Contact Person Details (Name, Title, Numbers, Email, Fax, WhatsApp).  
  - Social Media Handles (up to 3).  
  - Date Contacted (calendar input).  
  - Sales Cycle (Planned Start and End Dates).  
  - Opportunity Details and Value.  
  - "Chance to Win" Scale (1-5).  

### 2. Quotation/Invoice Generation  
- Create quotations with multiple service lines.  
- Real-time calculation of totals, including:  
  - **Service Name**, **Quantity**, **Price**.  
  - GST and Tax (percentage or fixed amounts).  
  - Discounts (percentage or fixed amounts).  
- Built-in calculator for accurate quotes.  
- Submit quotations to Admin for approval.  
- Automatic PDF generation and email dispatch upon approval, including unique IDs for tracking.  

---

## Technologies Used  

**Frontend-**
React: For building the user interface.
React Router DOM: For routing between pages.
Material-UI: For UI components and styling.
Axios: For making API calls to the backend.
React Toastify: For notifications.

**Backend-**
Flask: A lightweight Python framework for API development.
Flask-Cors: For handling cross-origin requests.
Gunicorn: For deploying the Flask application.
Requests: For HTTP requests.
Python Dotenv: For environment variable management.

### Libraries - 

**Frontend -**
- React

**Backend -**

**1. Flask and Related Extensions:**
- Flask: Core web framework for building the API.
- Flask_SQLAlchemy: Integration of SQLAlchemy ORM with Flask.
- Flask_CORS: Enables Cross-Origin Resource Sharing (CORS) for handling requests from different domains.
- jsonify: Converts Python objects to JSON format for HTTP responses.
- request: Handles incoming HTTP requests (e.g., parsing JSON payloads).

**2. Database Management:**
- SQLAlchemy: ORM for interacting with the database.
- pymysql: MySQL driver used with SQLAlchemy to connect to MySQL databases.

**3. Enumerations and Utility Functions (SQLAlchemy-specific):**
- Enum: Defines enumerated data types for fields like currency and status.
- db.func.current_timestamp: Provides the current timestamp in SQL queries.
- These libraries together provide a robust framework for building, managing, and interacting with a RESTful API connected to a MySQL database.

## Database and Data Storage-
- Mysql and json
- Customer data is stored in a JSON file named Customer_Data.json, Sales Executive data is stored in salesExecutive Table in crm_db, admin and sales executive is stored in crom_employee Table in crm_db and the quotation requests are stored in quotation table in crm_db database and are managed via API endpoints.

### Table Schema - 

**crm_employee-**

- id	int	NO	PRI		auto_increment
- username	varchar(100)	NO			
- password	varchar(100)	NO	UNI		
- role	varchar(15)	YES			

**salesExecutive -**

- id	int	NO	PRI		
- email	varchar(255)	NO	UNI		
- sales_target	decimal(10,2)	YES			
- Total_Sales	decimal(10,2)	YES			
- currency	enum('INR','USD','AED','Pound')	YES		INR	
- target_assigned_date	timestamp	YES			
- username	varchar(100)	YES			
- status	enum('Active','Unactive')	YES		Active	

**quotation -**

- id	int	NO	PRI		auto_increment
- service_name	varchar(255)	NO			
- quantity	int	NO			
- price	decimal(10,2)	NO			
- gst	decimal(5,2)	NO			
- tax	decimal(5,2)	NO			
- total_amount	decimal(10,2)	NO			
- Status	varchar(255)	NO			

**Customer_Data.json example -**

[{
        "companyName": "Sharma Electronics",
        "address": "12, MG Road, Bengaluru, Karnataka",
        "contactPerson": {
            "name": "Ramesh Sharma",
            "title": "CEO",
            "contactNumbers": "9876543210",
            "email": "ramesh.sharma@sharmaelectronics.in",
            "fax": "080-1234567",
            "whatsapp": "9876543210"
        },
        "socialMedia": ["@sharmaelectronics", "facebook.com/sharmaelectronics"],
        "dateContacted": "2024-11-01",
        "salesCycle": {
            "start": "2024-11-05",
            "end": "2024-12-15"
        },
        "opportunity": {
            "details": "Opportunity for a large order of electronic components",
            "value": "₹1,500,000",
            "endDate": "2024-12-20",
            "chanceToWin": 4
        }
    }]
 

---

## API endpoints

**User Management Endpoints-**
- GET /get_customers/<username>: Retrieve user details by username.

**Sales Executive Management Endpoints-**
- GET /get_sales_executives: Retrieve all sales executive details.
- DELETE /delete_sales_executive/<int:id>: Delete a sales executive by their ID.
- PUT /edit_sales_executive/<int:id>: Update sales target and reset total sales to zero.

**Quotation Management Endpoints-**
- GET /get_quotation_data: Retrieve all quotations.
- POST /add_quotation: Add a new quotation with service and tax details.
- PUT /update_quotation_status/<int:id>: Update the status of a specific quotation to Approved or Declined.


---
## Project Structure
- CRM Project/
- ├── crm/
- │   ├── public/
- │   ├── node_modules/
- │   └── src/
- │       ├── employee/
- │       │   ├── admin.css
- │       │   ├── admin.jsx
- │       │   ├── anksu-high-resolution-logo.png
- │       │   ├── Customer_Data.json
- │       │   ├── salesExecutive.css
- │       │   └── salesExecutive.jsx
- │       └── loginComponent/
- │           ├── login.css
- │           └── login.jsx
- ├── crm-backend/
- │   ├── backend-db.py
- │   ├── my-venv/
- │   └── __pycache__/
- ├── README.md


---

## License  
This project is licensed under the MIT License.  
