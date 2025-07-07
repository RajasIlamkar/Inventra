import React, { useEffect, useState } from 'react';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [fetchingEmails, setFetchingEmails] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchEmails = async () => {
    setFetchingEmails(true);
    try {
      const res = await fetch('http://localhost:5000/api/gmail/fetch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await res.json();
      alert(result.message || 'Fetched new emails.');
      await fetchOrders(); // Refresh order list after fetch
    } catch (err) {
      alert('❌ Failed to fetch from Gmail.');
      console.error(err);
    } finally {
      setFetchingEmails(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      await fetchOrders(); // Refresh list
    } catch (err) {
      console.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="orders-loading">
      Loading orders...
    </div>
  );

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
        <button 
          className="fetch-orders-button" 
          onClick={handleFetchEmails}
          disabled={fetchingEmails}
        >
          {fetchingEmails ? 'Fetching...' : '📥 Fetch Orders'}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="orders-empty">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className={`order-card ${order.status.toLowerCase()}`}
            >
              <h2 className="order-customer">
                {order.customerName || 'Anonymous Customer'}
              </h2>
              <p className="order-status">
                Status: <strong>{order.status}</strong>
              </p>

              <ul className="order-items">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.product} × {item.quantity}</span>
                  </li>
                ))}
              </ul>

              <p className="order-date">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : 'No date available'}
              </p>

              {order.status !== 'fulfilled' && (
                <button
                  className="order-fulfill-button"
                  onClick={() => handleStatusChange(order._id, 'fulfilled')}
                  disabled={updatingId === order._id}
                >
                  {updatingId === order._id ? 'Updating...' : 'Mark as Fulfilled'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
