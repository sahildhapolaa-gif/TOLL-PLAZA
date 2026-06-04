const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const FEE_TABLE = {
  Car: 5.0,
  Motorcycle: 2.0,
  Truck: 10.0,
};


function calculateFee(vehicleType, isOfficial = false) {
  if (isOfficial) return 0.0;
  return FEE_TABLE[vehicleType] ?? 5.0;
}


let logs = [
  {
    id: '1',
    licensePlate: 'MH12AB1234',
    vehicleType: 'Car',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    tollFee: 5.0,
    status: 'Paid',
    isOfficial: false,
  },
  {
    id: '2',
    licensePlate: 'DL8CAF7890',
    vehicleType: 'Truck',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tollFee: 10.0,
    status: 'Pending',
    isOfficial: false,
  },
  {
    id: '3',
    licensePlate: 'GJ5TC2222',
    vehicleType: 'Motorcycle',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    tollFee: 2.0,
    status: 'Paid',
    isOfficial: false,
  },
  {
    id: '4',
    licensePlate: 'GOV-001-XYZ',
    vehicleType: 'Car',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    tollFee: 0.0,
    status: 'Official',
    isOfficial: true,
  },
  {
    id: '5',
    licensePlate: 'KA09MN4567',
    vehicleType: 'Truck',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    tollFee: 10.0,
    status: 'Violation',
    isOfficial: false,
  },
  {
    id: '6',
    licensePlate: 'TN22QR8910',
    vehicleType: 'Car',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    tollFee: 5.0,
    status: 'Paid',
    isOfficial: false,
  },
];

let nextId = 7;

// GET /logs - fetch all toll records
app.get('/logs', (req, res) => {
  // Sort by newest first
  const sorted = [...logs].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  res.json(sorted);
});

// POST /logs - add a new vehicle entry
app.post('/logs', (req, res) => {
  const { licensePlate, vehicleType, isOfficial = false } = req.body;

  if (!licensePlate || !vehicleType) {
    return res
      .status(400)
      .json({ error: 'licensePlate and vehicleType are required.' });
  }

  if (!['Car', 'Motorcycle', 'Truck'].includes(vehicleType)) {
    return res
      .status(400)
      .json({ error: 'vehicleType must be Car, Motorcycle, or Truck.' });
  }

 const newLog = {
  id: String(nextId++),
  licensePlate: licensePlate.toUpperCase().trim(),
  vehicleType,
  timestamp: new Date().toISOString(),
  tollFee: calculateFee(vehicleType, isOfficial),
 status: isOfficial ? 'Official' : 'Pending',
  isOfficial,
};

  logs.unshift(newLog);
  res.status(201).json(newLog);
});

// PATCH /logs/:id/status - flag a vehicle status
app.patch('/logs/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Paid', 'Pending', 'Violation'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  const log = logs.find((l) => l.id === id);
if (!log) {
  return res.status(404).json({ error: 'Log entry not found.' });
}

if (log.isOfficial) {
  return res.status(400).json({
    error: 'Government vehicles always remain Paid.'
  });
}

log.status = status;
res.json(log);
});
// DELETE /logs/:id - remove a log entry
app.delete('/logs/:id', (req, res) => {
  const { id } = req.params;
  const index = logs.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Log entry not found.' });
  }
  logs.splice(index, 1);
  res.status(204).send();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Toll Plaza API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});