import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [txnId, setTxnId] = useState('');
  const [txnResult, setTxnResult] = useState(null);
  const [txnError, setTxnError] = useState(null);
  const [txnLoading, setTxnLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsRes, summaryRes] = await Promise.all([
          axios.get('http://localhost:4000/payments'),
          axios.get('http://localhost:4000/summary'),
        ]);

        setPayments(paymentsRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Error loading data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setTxnError(null);
    setTxnResult(null);
    setTxnLoading(true);

    try {
      const res = await axios.get(`http://localhost:4000/transaction/${txnId}`);
      setTxnResult(res.data);
    } catch (err) {
      setTxnError(err.response?.data?.message || 'Error checking transaction');
    } finally {
      setTxnLoading(false);
    }
  };

  if (loading) {
    return <div className="app"><h2>Loading dashboard...</h2></div>;
  }

  return (
    <div className="app">
      <h1>Payments Tools</h1>

      {summary && (
        <div className="cards">
          <div className="card">
            <h3>Total Today</h3>
            <p>${summary.totalToday.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Status Counts</h3>
            <ul>
              {Object.entries(summary.statusCounts).map(([status, count]) => (
                <li key={status}>{status}: {count}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Total Payments</h3>
            <p>{summary.count}</p>
          </div>
        </div>
      )}

      <h2>Recent Payments</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>${p.amount.toFixed(2)}</td>
              <td>{p.status}</td>
              <td>{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Transaction Status Checker</h2>
      <form onSubmit={handleCheckStatus} className="txn-form">
        <input
          type="text"
          placeholder="Enter Transaction ID (e.g., TXN-001)"
          value={txnId}
          onChange={e => setTxnId(e.target.value)}
        />
        <button type="submit" disabled={txnLoading || !txnId}>
          {txnLoading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {txnError && <p className="error">{txnError}</p>}

      {txnResult && (
        <div className="card">
          <h3>Transaction Details</h3>
          <p><strong>ID:</strong> {txnResult.id}</p>
          <p><strong>Status:</strong> {txnResult.status}</p>
          <p><strong>Amount:</strong> ${txnResult.amount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
