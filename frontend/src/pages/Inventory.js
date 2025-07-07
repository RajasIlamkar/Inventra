import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Inventory.css';

function Inventory() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    threshold: '',
  });
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const normalize = (str) => str.trim().toLowerCase();

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert('Unauthorized. Please log in again.');
        return;
      }

      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 10000);
    return () => clearInterval(interval);
  }, [fetchInventory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/inventory/${editingId}`
      : 'http://localhost:5000/api/inventory';

    const normalizedFormData = {
      ...formData,
      name: normalize(formData.name),
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(normalizedFormData),
    });

    if (res.ok) {
      setFormData({ name: '', price: '', quantity: '', threshold: '' });
      setEditingId(null);
      fetchInventory();
    } else {
      const error = await res.json();
      alert(error.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      threshold: item.threshold || '',
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchInventory();
    } else {
      alert('Delete failed');
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-left">
        <h2>Inventory Management</h2>

        <form className="inventory-form" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Threshold"
            value={formData.threshold}
            onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
            required
          />
          <button type="submit">{editingId ? 'Update' : 'Add'} Item</button>
        </form>
      </div>

      <ul className="inventory-list">
        {inventory.map((item) => {
          const isLow = item.quantity < item.threshold;
          return (
            <li key={item._id} className="inventory-item">
              <div>
                <p><strong>Item:</strong> {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p>
                  <strong>Quantity:</strong>{' '}
                  <span style={{ color: item.quantity === 0 ? 'red' : 'inherit' }}>
                    {item.quantity}
                  </span>
                </p>
                <p><strong>Threshold:</strong> {item.threshold}</p>
                {isLow && (
                  <p className="low-stock-alert" style={{ color: 'red', fontWeight: 'bold' }}>
                    Alert: Stock is below threshold!
                  </p>
                )}
              </div>
              <div>
                <button className="edit-button" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Inventory;
