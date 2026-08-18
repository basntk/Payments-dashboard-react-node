const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Mock payment data
const payments = [
  { id: 1, amount: 120.5, status: 'Completed', date: '2026-08-18' },
  { id: 2, amount: 75.0, status: 'Pending', date: '2026-08-18' },
  { id: 3, amount: 200.0, status: 'Failed', date: '2026-08-17' },
];

// Mock transactions
const transactions = {
  'TXN-001': { id: 'TXN-001', status: 'Completed', amount: 150.0 },
  'TXN-002': { id: 'TXN-002', status: 'Pending', amount: 80.0 },
  'TXN-003': { id: 'TXN-003', status: 'Failed', amount: 200.0 },
};

// GET /payments
app.get('/payments', (req, res) => {
  res.json(payments);
});

// GET /summary
app.get('/summary', (req, res) => {
  const today = '2026-08-18';

  const totalToday = payments
    .filter(p => p.date === today)
    .reduce((sum, p) => sum + p.amount, 0);

  const statusCounts = payments.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalToday,
    statusCounts,
    count: payments.length,
  });
});

// GET /transaction/:id
app.get('/transaction/:id', (req, res) => {
  const id = req.params.id;
  const txn = transactions[id];

  if (!txn) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.json(txn);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
