# CRM Project - README  

## Table of Contents  
1. [Project Description]
2. [Technologies Used] 
3. [Key Features]
4. [Installation and Setup]
5. [Usage Instructions]  
6. [Folder Structure] 
7. [Future Enhancements]
8. [License] 

---

## Project Description  
This CRM web application is designed to manage customer relationships, track sales targets, generate quotations, and streamline the invoice generation process. The system includes two primary user roles: **Admin** and **Sales Executive**, each with distinct access levels and functionalities.  

---

## Technologies Used  
- **Frontend**: React, CSS  
- **Backend**: Flask  
- **Database**: MySQL  

---

## Key Features  

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

## Installation and Setup  

### Prerequisites  
- Node.js and npm  
- Python (with Flask and MySQL packages installed)  
- MySQL server  

### Steps to Setup  
1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/your-repo/crm-project.git  
   cd crm-project  
   ```  

2. **Frontend Setup**:  
   ```bash  
   cd frontend  
   npm install  
   npm start  
   ```  

3. **Backend Setup**:  
   ```bash  
   cd backend  
   python -m venv venv  
   source venv/bin/activate  # For Linux/macOS  
   venv\Scripts\activate  # For Windows  
   pip install -r requirements.txt  
   python app.py  
   ```  

4. **Database Setup**:  
   - Create a MySQL database and update the `config.py` file with your credentials.  
   - Run migrations if applicable.  

---

## Usage Instructions  
1. **Admin Role**:  
   - Login through the admin portal.  
   - Manage users, set sales targets, and approve/reject quotations.  
   - View performance dashboards and generate reports.  

2. **Sales Executive Role**:  
   - Login through the sales portal.  
   - Manage customer data and create quotations.  
   - Submit quotations to the Admin for approval.  

---

## Folder Structure  
```plaintext  
crm-project/  
├── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   └── App.js  
├── backend/  
│   ├── app.py  
│   ├── models.py  
│   └── routes/  
├── database/  
│   └── schema.sql  
├── README.md  
```  

---

## Future Enhancements  
- Add role-based analytics for Sales Executives.  
- Integrate a notification system for approvals and updates.  
- Implement multi-language support.  

---

## License  
This project is licensed under the MIT License.  
