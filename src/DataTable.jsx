import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddItemForm from "./AddItemForm";
import "./datatable.css";

let columns = [
  { field: "id", headerName: "ID", width: 70, },
  { field: "date", headerName: "Date", width: 130,},
  { field: "status", headerName: "Status", width: 130, },
  {
    field: "customerName",
    headerName: "Customer Name",
    width: 200,
    hideMenu: true,
  },
  { field: "email", headerName: "Email", width: 200, },
  { field: "country", headerName: "Country", width: 130, },
  { field: "category", headerName: "Category", width: 150, },
  {
    field: "edit",
    headerName: "Edit",
    width: 100,
    renderCell: (params) => (
      <strong>
        <button onClick={() => handleEdit(params.row)}>Edit</button>
      </strong>
    ),
  },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("db.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.text();
        const jsonData = JSON.parse(data);
        setRows(jsonData.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSearch = () => {
    // Filter rows based on search input, selected category, and selected status
    const filteredRows = rows.filter((row) => {
      const matchesSearch = 
        row.customerName.toLowerCase().includes(searchInput.toLowerCase()) &&
        row.category.toLowerCase() === selectedCategory.toLowerCase() && row.status.toLowerCase() === selectedStatus.toLowerCase() 
        
      return matchesSearch 
    });
    setRows(filteredRows);
  };

  const handleAddItem = (newItem) => {
    // Adding logic to update rows with the new item
    setRows((prevRows) => [...prevRows, { id: prevRows.length + 1, ...newItem }]);
  };


  return (
    <div className="wrapper">
     <div className="first-div">
     <p className="headline">Orders</p>
     <button onClick={() => setIsModalOpen(true)}>Create</button>
     </div>
      
      <AddItemForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columns={columns}
        onAdd={handleAddItem}
      />
      <div className="Search-div">
        <div>
          <p>What are you looking for</p>
          <input
            type="text"
            placeholder="search for name, category"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
        <div>
          <p>Category</p>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            
          </select>
        </div>
        <div>
          <p>Status</p>
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="">All</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            
          </select>
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <p className="headline">Product Summary</p>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={3}
          checkboxSelection
        />
      </div>
    </div>
  );
}
