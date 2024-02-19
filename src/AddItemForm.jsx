import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function AddItemForm({ open, onClose, columns, onAdd }) {
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
  
    // Check if all fields are filled
    const allFieldsFilled = Object.values(newFormData).every(value => value !== "");
    setIsFormValid(allFieldsFilled);
  };
  
  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
      setFormData({});
      onClose();
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        {columns.map((column) => (
          <TextField
            key={column.field}
            label={column.headerName}
            name={column.field}
            value={formData[column.field] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
