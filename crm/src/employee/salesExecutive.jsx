import { Navbar } from "../loginComponent/login";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./salesExecutive.css";
import customerData from "./Customer_Data.json";
import { toast } from "react-toastify";
import axios from "axios";

export function SalesExecutivePage() {
    const location = useLocation();
    const [salesExecutive, setSalesExecutive] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(false);
    const [activeTab, setActiveTab] = useState("customerInfo");
    const [annualSalesTarget, setAnnualSalesTarget] = useState(null); 
    const [invoice, setInvoice] = useState([]);
    const [formData, setFormData] = useState({
        service_name: '',
        quantity: '',
        price: '',
        gst: '',
        tax: '',
        total_amount: '',
        Status: 'Pending',
    });

    useEffect(() => {
        if (location.state && location.state.SalesExecutive) {
            setSalesExecutive(location.state.SalesExecutive);
        }
        setCustomers(customerData); 
    }, [location]);

    const handleAnnualTarget = async () => {
        setActiveTab("annualTarget");
        try {
            const response = await axios.get(`http://127.0.0.1:5000/get_sales_target?executive=${salesExecutive}`);
            if (response.status === 200) {
                setAnnualSalesTarget(response.data); 
            } else {
                toast.error("Unable to fetch sales target.");
            }
        } catch (error) {
            console.error("Error fetching sales target:", error);
            toast.error("Error fetching sales target");
        }
    };
    

    const handleCustomerinfo = () => {
        setActiveTab("customerInfo");
    };

    const handleInvoiceStatus = async () => {
        setActiveTab("invoiceStatus");
        try {
            const response = await axios.get(`http://127.0.0.1:5000/get_quotation_data`);
            // console.log(response.data)
            setInvoice(response.data);
        } catch (error) {
            console.error("Error fetching quotation data:", error);
            toast.error("Error fetching quotation data");
        }
    };
    const handleInvoiceRequest = ()=>{
        setActiveTab("invoiceRequest");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.service_name || !formData.quantity || !formData.price || !formData.gst || !formData.tax || !formData.total_amount) {
            toast.error("Please fill all the fields");
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/add_quotation', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 201) {
                toast.success('Quotation added successfully!');
                alert('Quotation added successfully!')
                setFormData({
                    service_name: '',
                    quantity: '',      
                    price: '',      
                    gst: '',         
                    tax: '',         
                    total_amount: '', 
                    Status: 'Pending', 
                });
            } else {
                toast.error(`Error: ${response.data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('There was an error submitting the form');
        }
    };
    
    const handleCalculate = () => {
        const { quantity, price, gst, tax } = formData;
        if (quantity && price && gst && tax) {
            const calculatedAmount =
                quantity * price + (quantity * price * (parseFloat(gst) / 100)) + (quantity * price * (parseFloat(tax) / 100));
            setFormData((prevState) => ({
                ...prevState,
                total_amount: calculatedAmount.toFixed(2),
            }));
        } else {
            toast.error("Please fill all fields to calculate the total.");
        }
    };

    const handleEditCustomer = (field, value) => {
        setSelectedCustomer((prev) => ({
            ...prev,
            contactPerson: { ...prev.contactPerson, [field]: value },
        }));
    };

    const handleSaveCustomer = () => {
        setCustomers((prev) =>
            prev.map((customer) =>
                customer.companyName === selectedCustomer.companyName ? selectedCustomer : customer
            )
        );
        setSelectedCustomer(null);
        setEditingCustomer(false);
    };

    const handleDeleteCustomer = (companyName) => {
        setCustomers((prev) => prev.filter((customer) => customer.companyName !== companyName));
    };

    return (
        <div className="sales-executive-body">
            <Navbar showLogoutIcon={true} />
            <div className="sidebar-sales-executive">
                Sales Executive <h1>{salesExecutive}</h1>
                <hr />
                <div className="sidebar-options">
                    <div className="sales-executive-options" onClick={handleCustomerinfo}>
                        Customer Information
                    </div>
                    <hr style={{ width: "80%", margin: "auto" }} />
                    <div className="sales-executive-options" onClick={handleAnnualTarget}>
                        Annual Sales Target
                    </div>
                    <hr style={{ width: "80%", margin: "auto" }} />
                    <div className="sales-executive-options" onClick={handleInvoiceStatus}>
                        Quotation/Invoice Status
                    </div>
                    <hr style={{ width: "80%", margin: "auto" }} />
                    <div className="sales-executive-options" onClick={handleInvoiceRequest}>
                        Quotation/Invoice Request
                    </div>
                </div>
            </div>

            {activeTab === "customerInfo" && (
                <div className="customer-info-container">
                    <h1>Contact Person Information</h1>
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Contact Person Name</th>
                                <th>Title</th>
                                <th>Contact Numbers</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers && customers.length > 0 ? (
                                customers.map((customer, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span
                                                className="clickable-name"
                                                onClick={() => setSelectedCustomer(customer)}
                                            >
                                                {customer.contactPerson.name || "N/A"}
                                            </span>
                                        </td>
                                        <td>{customer.contactPerson.title || "N/A"}</td>
                                        <td>{customer.contactPerson.contactNumbers || "N/A"}</td>
                                        <td>{customer.contactPerson.email || "N/A"}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setEditingCustomer(true);
                                                }}
                                                className="action-button edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer.companyName)}
                                                className="action-button delete-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No customer data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCustomer && !editingCustomer && (
                <div className="customer-modal">
                    <div className="modal-content">
                        <h3>Customer Information</h3>
                        <div className="customer-detail">
                            <strong>Company Name:</strong> {selectedCustomer.companyName}
                        </div>
                        <div className="customer-detail">
                            <strong>Address:</strong> {selectedCustomer.address}
                        </div>
                        <div className="customer-detail">
                            <strong>Contact Person Name:</strong> {selectedCustomer.contactPerson.name}
                        </div>
                        <div className="customer-detail">
                            <strong>Title:</strong> {selectedCustomer.contactPerson.title}
                        </div>
                        <div className="customer-detail">
                            <strong>Contact Numbers:</strong> {selectedCustomer.contactPerson.contactNumbers}
                        </div>
                        <div className="customer-detail">
                            <strong>Email:</strong> {selectedCustomer.contactPerson.email}
                        </div>
                        <div className="customer-detail">
                            <strong>Fax:</strong> {selectedCustomer.contactPerson.fax || "N/A"}
                        </div>
                        <div className="customer-detail">
                            <strong>Social Media:</strong>{" "}
                            {selectedCustomer.socialMedia?.join(", ") || "N/A"}
                        </div>
                        <div className="customer-detail">
                            <strong>Date Contacted:</strong> {selectedCustomer.dateContacted}
                        </div>
                        <div className="customer-detail">
                            <strong>Sales Cycle:</strong>{" "}
                            {`Start: ${selectedCustomer.salesCycle.start}, End: ${selectedCustomer.salesCycle.end}`}
                        </div>
                        <div className="customer-detail">
                            <strong>Opportunity Details:</strong>{" "}
                            {selectedCustomer.opportunity.details}
                        </div>
                        <div className="customer-detail">
                            <strong>Opportunity Value:</strong> {selectedCustomer.opportunity.value}
                        </div>
                        <div className="customer-detail">
                            <strong>Chance to Win:</strong> {selectedCustomer.opportunity.chanceToWin}/5
                        </div>
                        <button onClick={() => setSelectedCustomer(null)}>Close</button>
                    </div>
                </div>
            )}

            {selectedCustomer && editingCustomer && (
                <div className="customer-modal">
                    <div className="modal-content">
                        <h3>Edit Contact Person Information</h3>
                        <div className="customer-field">
                            <label>Contact Person Name</label>
                            <input
                                type="text"
                                value={selectedCustomer.contactPerson.name || ""}
                                onChange={(e) => handleEditCustomer("name", e.target.value)}
                            />
                        </div>
                        <div className="customer-field">
                            <label>Title</label>
                            <input
                                type="text"
                                value={selectedCustomer.contactPerson.title || ""}
                                onChange={(e) => handleEditCustomer("title", e.target.value)}
                            />
                        </div>
                        <div className="customer-field">
                            <label>Contact Numbers</label>
                            <input
                                type="text"
                                value={selectedCustomer.contactPerson.contactNumbers || ""}
                                onChange={(e) => handleEditCustomer("contactNumbers", e.target.value)}
                            />
                        </div>
                        <div className="customer-field">
                            <label>Email</label>
                            <input
                                type="text"
                                value={selectedCustomer.contactPerson.email || ""}
                                onChange={(e) => handleEditCustomer("email", e.target.value)}
                            />
                        </div>
                        <button onClick={handleSaveCustomer}>Save</button>
                        <button
                            onClick={() => {
                                setSelectedCustomer(null);
                                setEditingCustomer(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

{activeTab === "annualTarget" && (
    <div className="annual-target-modal">
        <h1>Annual Target</h1>
        {annualSalesTarget ? (
            <div>
                <p><strong>Sales Target for {salesExecutive}: </strong>₹{annualSalesTarget.target}</p>
                <p><strong>Achieved Sales: </strong>₹{annualSalesTarget.achieved}</p>
                <p><strong>Remaining Sales: </strong>₹{annualSalesTarget.remaining}</p>
            </div>
        ) : (
            <p>Loading your annual sales target...</p>
        )}
    </div>
)}


            {activeTab === "invoiceStatus" && (
                <div className="invoice-modal">
                    <h1>Invoice Status</h1>
                    {invoice.length === 0 ? (
                        <p>No pending quotations</p>
                    ) : (
                        invoice.map((quote) => (
                            <div key={quote.id} className="invoice-body">
                                <h6 style={{marginLeft:'10px'}}>Service Name: {quote.service_name}</h6>
                                <p className="data-quotation">Quantity: {quote.quantity}</p>
                                <p className="data-quotation">Price: ₹{quote.price}</p>
                                <p className="data-quotation">GST: ₹{quote.gst}</p>
                                <p className="data-quotation">Total Amount: ₹{quote.total_amount}</p>
                                <div className="invoice-status">
                                    {quote.Status === "Approved" ? (
                                        <button style={{backgroundColor:'rgb(91, 236, 118)'}} className="status-button" disabled>Approved</button>
                                    ) : quote.Status === "Declined" ? (
                                        <button style={{backgroundColor:'rgb(214, 79, 79)'}} className="status-button" disabled>Declined</button>
                                    ) : (
                                        <button style={{backgroundColor:'rgb(235, 129, 47)'}} className="status-button" disabled>Pending</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {activeTab === "invoiceRequest" && (
                <div className="annual-target-modal">
                    <h1>Request for Invoice</h1>
                    <div>
                        <form onSubmit={handleSubmit} className="quotation-form">
                            <div className="form-group">
                                <label>Service Name:</label>
                                <input
                                    type="text"
                                    name="service_name"
                                    value={formData.service_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="any"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>GST:</label>
                                <input
                                    type="number"
                                    name="gst"
                                    value={formData.gst}
                                    onChange={handleChange}
                                    step="any"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tax:</label>
                                <input
                                    type="number"
                                    name="tax"
                                    value={formData.tax}
                                    onChange={handleChange}
                                    step="any"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Total Amount:</label>
                                <input
                                    type="number"
                                    name="total_amount"
                                    value={formData.total_amount}
                                    onChange={handleChange}
                                    step="any"
                                    required
                                />
                                <button type="button" className="calculate-button" onClick={handleCalculate}>
                                Calculate
                                </button>
                            
                            </div>
                            
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
