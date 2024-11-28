import { Navbar } from "../loginComponent/login";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";
import customerData from "./Customer_Data.json";
import { toast } from "react-toastify";

export function AdminPage() {
  const location = useLocation();
  const [admin, setAdmin] = useState(false);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [newExecutive, setNewExecutive] = useState({
    email: "",
    sales_target: 0,
    total_sales: 0,
    currency: "INR",
    target_assigned_date: "",
    username: "",
    status: "Active",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [quotation, setQuotation] = useState([]);

  useEffect(() => {
    if (location.state && location.state.admin) {
      setAdmin(location.state.admin);
      setActiveSection("dashboard");
    }
  }, [location]);

  const fetchSalesExecutives = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/get_sales_executives"
      );
      setSalesExecutives(response.data);
      setActiveSection("salesExecutives");
    } catch (error) {
      console.error("Error fetching Sales Executives:", error);
    }
  };

  const handleCustomerInfoClick = () => {
    setActiveSection("customerInfo");
  };

  const handleDashboardClick = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/get_sales_executives"
      );
      setSalesExecutives(response.data);
      setActiveSection("dashboard");
    } catch (error) {
      console.error("Error fetching Sales Executives for Dashboard:", error);
    }
  };
  const handleRequestClick = async (e) => {
    setActiveSection("request")
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_quotation_data`);
      // console.log(response.data)
      setQuotation(response.data);
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      toast.error("Error fetching quotation data");
    }

  }
  const handleApprove = async (id)=>{
    try{
      await axios.put(
        `http://127.0.0.1:5000/update_quotation_status/${id}`,
        { status: 'Approved' }
      );
      toast.success("Request Approved");

      const executiveEmail = selectedExecutive.email; 
    await axios.post("http://127.0.0.1:5000/send_email", {
      email: executiveEmail,
      subject: "Quotation Request Approved",
      body: "Your quotation request has been approved. Please check the details."
    });
      } catch (error) {
        console.error("Error approving quotation:", error);
      }

  }

  const handleDecline = async (id) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/update_quotation_status/${id}`,
        { status: 'Declined' }
      )
      toast.warning("Request Declined");

      const executiveEmail = selectedExecutive.email; 
    await axios.post("http://127.0.0.1:5000/send_email", {
      email: executiveEmail,
      subject: "Quotation Request Declined",
      body: "Your quotation request has been declined. Please check the details."
    });

    } catch (error) {
        console.error("Error approving quotation:", error);
      }
  }
  const handleExecutiveClick = (executive) => {
    setSelectedExecutive(executive);
  };

  const closePopup = () => {
    setSelectedExecutive(null);
    setSelectedCustomer(null); 
  };

  const handleExecutiveChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive((prev) => ({ ...prev, [name]: value }));
  };

  const deleteSalesExecutive = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sales executive?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/delete_sales_executive/${id}`
        );
        fetchSalesExecutives();
        toast.success("Data Deleted Successfully");
      } catch (error) {
        console.error("Error deleting Sales Executive:", error);
        toast.error("Error deleting Sales Executive");
      }
    }
  };

  const editSalesExecutive = async (executive) => {
    const newTarget = prompt(
      `Enter new sales target for ${executive.username}:`,
      executive.sales_target
    );
    if (newTarget) {
      try {
        await axios.put(
          `http://127.0.0.1:5000/edit_sales_executive/${executive.id}`,
          {
            sales_target: newTarget,
          }
        );
        fetchSalesExecutives();
        toast.success("Sales target updated successfully!");
      } catch (error) {
        console.error("Error updating Sales Executive:", error);
        toast.error("Failed to update sales target.");
      }
    }
  };

  const handleEditCustomer = (customer) => {
    const newName = prompt(
      `Edit name for ${customer.contactPerson.name}:`,
      customer.contactPerson.name
    );
    const newEmail = prompt(
      `Edit email for ${customer.contactPerson.name}:`,
      customer.contactPerson.email
    );
    if (newName && newEmail) {
      toast.success("Customer info updated successfully!");
    }
  };

  const handleDeleteCustomer = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      toast.success("Customer deleted successfully!");
    }
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="admin-body">
      <Navbar showLogoutIcon={true} />
      <div className="sidebar-admin">
        Admin<h1>{admin}</h1>
        <hr />
        <div className="sidebar-options">
          <div
            className="admin-options"
            onClick={handleDashboardClick}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </div>
          <hr style={{ width: "80%", margin: "auto" }} />
          <div className="admin-options"
          onClick={handleRequestClick}
          style={{ cursor: "pointer" }}
          >
            Requests
          </div>       
          <hr style={{ width: "80%", margin: "auto" }} />
          <div
            className="admin-options"
            onClick={handleCustomerInfoClick}
            style={{ cursor: "pointer" }}
          >
            Customer Info
          </div>
          <hr style={{ width: "80%", margin: "auto" }} />
          <div
            className="admin-options"
            onClick={fetchSalesExecutives}
            style={{ cursor: "pointer" }}
          >
            Sales Executive
          </div>
          <hr style={{ width: "80%", margin: "auto" }} />
        </div>
      </div>

      {activeSection === "dashboard" && (
        <div className="dashboard-details">
          <h1>Dashboard</h1>
          <div className="dashboard-grid">
            {salesExecutives.map((executive) => (
              <div
                key={executive.id}
                className="dashboard-box"
                onClick={() => handleExecutiveClick(executive)} 
              >
                <h3>ID: {executive.id}</h3>
                <p>Username: {executive.username}</p>
                <p>Sales Target: {executive.sales_target}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "customerInfo" && (
        <div className="customer-details">
          <h2>Contact Person Information</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Contact Numbers</th>
                <th>Email</th>
                <th>Fax</th>
                <th>WhatsApp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((customer, index) => (
                <tr key={index}>
                  <td
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleCustomerClick(customer)} 
                  >
                    {customer.contactPerson.name}
                  </td>
                  <td>{customer.contactPerson.title}</td>
                  <td>{customer.contactPerson.contactNumbers}</td>
                  <td>{customer.contactPerson.email}</td>
                  <td>{customer.contactPerson.fax}</td>
                  <td>{customer.contactPerson.whatsapp}</td>
                  <td>
                    <button onClick={() => handleEditCustomer(customer)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCustomer(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "salesExecutives" && (
        <div className="executive-details">
          <h2>Sales Executives</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Sales Target</th>
                <th>Total Sales</th>
                <th>Currency</th>
                <th>Target Assigned Date</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesExecutives.map((executive) => (
                <tr key={executive.id}>
                  <td>{executive.id}</td>
                  <td>{executive.email}</td>
                  <td>{executive.sales_target}</td>
                  <td>{executive.total_sales}</td>
                  <td>{executive.currency}</td>
                  <td>{executive.target_assigned_date}</td>
                  <td>{executive.username}</td>
                  <td>{executive.status}</td>
                  <td>
                    <button onClick={() => editSalesExecutive(executive)}>
                      Edit
                    </button>
                    <button onClick={() => deleteSalesExecutive(executive.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeSection === 'request' && (
        <div className="request-detatils">
          <h1>Pending Requests</h1>
          {/* <div className="request-body"> */}
          {quotation.length === 0 ? (
                <p>No pending quotations</p>
              ) : (
                quotation.map((quote) => (
                  <div key={quote.id} className="request-body">
                    <h6 style={{marginLeft:'10px'}}>Service Name: {quote.service_name}</h6>
                    <p className="data-quotation">Quantity: {quote.quantity}</p>
                    <p className="data-quotation">Price: ₹{quote.price}</p>
                    <p className="data-quotation">GST: ₹{quote.gst}</p>
                    <p className="data-quotation">Total Amount: ₹{quote.total_amount}</p>
                    {quote.Status !== "Approved" && quote.Status !== "Declined" ? (
                      <div className="request-buttons">
                        <button className="approve-button" onClick={()=>handleApprove(quote.id)} >Approve</button>
                        <button className="decline-button" onClick={()=>handleDecline(quote.id)} >Decline</button>

                    </div>
                    ):(
                      <div className="request-buttons">
                        {quote.Status === "Approved" ? (
                          <button className="approve-button" onClick={()=>handleApprove(quote.id)} disabled >Approved</button>
                        ):(
                          <button className="decline-button" onClick={()=>handleDecline(quote.id)} disabled >Declined</button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )
          }
            
          {/* </div> */}
        </div>
      )}

      {selectedExecutive && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>
              &times;
            </button>
            <h3>Details of Sales Executive</h3>
            <p>
              <strong>ID:</strong> {selectedExecutive.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedExecutive.email}
            </p>
            <p>
              <strong>Sales Target:</strong> {selectedExecutive.sales_target}
            </p>
            <p>
              <strong>Total Sales:</strong> {selectedExecutive.total_sales}
            </p>
            <p>
              <strong>Currency:</strong> {selectedExecutive.currency}
            </p>
            <p>
              <strong>Target Assigned Date:</strong>{" "}
              {selectedExecutive.target_assigned_date}
            </p>
            <p>
              <strong>Username:</strong> {selectedExecutive.username}
            </p>
            <p>
              <strong>Status:</strong> {selectedExecutive.status}
            </p>
          </div>
        </div>
      )}

      {/* Customer Popup */}
      {selectedCustomer && (
        <div className="popup-overlay">
          <div className="popup-content">
          
           <div>
           <button className="close-btn" onClick={closePopup}>
              &times;
            </button>
            <h3>Customer Details</h3>
            <p><strong>Company Name:</strong> {selectedCustomer.companyName}</p>
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
            <p><strong>Contact Person:</strong> {selectedCustomer.contactPerson.name}</p>
            <p><strong>Title:</strong> {selectedCustomer.contactPerson.title}</p>
            <p><strong>Contact Numbers:</strong> {selectedCustomer.contactPerson.contactNumbers}</p>
            <p><strong>Email:</strong> {selectedCustomer.contactPerson.email}</p>
            <p><strong>Fax:</strong> {selectedCustomer.contactPerson.fax}</p>
            <p><strong>WhatsApp:</strong> {selectedCustomer.contactPerson.whatsapp}</p>
            <p><strong>Social Media:</strong> {selectedCustomer.socialMedia.join(", ")}</p>
            <p><strong>Date Contacted:</strong> {selectedCustomer.dateContacted}</p>
            <p><strong>Sales Cycle:</strong> {selectedCustomer.salesCycle.start} to {selectedCustomer.salesCycle.end}</p>
            <p><strong>Opportunity Details:</strong> {selectedCustomer.opportunity.details}</p>
            <p><strong>Opportunity Value:</strong> {selectedCustomer.opportunity.value}</p>
            <p><strong>Chance to Win:</strong> {selectedCustomer.opportunity.chanceToWin}%</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
