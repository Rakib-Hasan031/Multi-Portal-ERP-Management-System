import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const paymentRoute = new Hono()

paymentRoute.get('/', (c) => {
  const transactions = [
    {id:'TXN-2024-001', bookingId:'BK-2024-001', guest:'James Wilson', type:'Room Charge', method:'Credit Card', amount:435, status:'completed', date:'Mar 11, 2024', time:'2:15 PM'},
    {id:'TXN-2024-002', bookingId:'BK-2024-002', guest:'Maria Santos', type:'Advance Deposit', method:'Bank Transfer', amount:500, status:'completed', date:'Mar 10, 2024', time:'10:30 AM'},
    {id:'TXN-2024-003', bookingId:'BK-2024-003', guest:'Ahmed Al-Rashid', type:'Room Charge', method:'Cash', amount:178, status:'pending', date:'Mar 11, 2024', time:'3:45 PM'},
    {id:'TXN-2024-004', bookingId:'BK-2024-004', guest:'Sophie Chen', type:'Full Settlement', method:'Credit Card', amount:756, status:'completed', date:'Mar 9, 2024', time:'9:00 AM'},
    {id:'TXN-2024-005', bookingId:'BK-2024-001', guest:'James Wilson', type:'Service Charge', method:'Cash', amount:45, status:'completed', date:'Mar 12, 2024', time:'8:00 AM'},
    {id:'TXN-2024-006', bookingId:'BK-2024-005', guest:'Robert Miller', type:'Advance Deposit', method:'Online Payment', amount:1000, status:'completed', date:'Mar 11, 2024', time:'5:20 PM'},
    {id:'TXN-2024-007', bookingId:'BK-2024-006', guest:'Emily Clark', type:'Full Settlement', method:'Credit Card', amount:387, status:'refunded', date:'Mar 7, 2024', time:'11:00 AM'},
  ]

  const content = `
  ${pageHeader('Payment Management', 'Track all transactions, receipts, and payment records', `
    <button onclick="openModal('recordPaymentModal')" class="btn-primary"><i class="fas fa-plus mr-1"></i>Record Payment</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}

  <!-- Payment Stats -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="card p-4 text-center border-t-4 border-green-400">
      <div class="text-2xl font-bold text-green-600">$48,234</div>
      <div class="text-xs text-gray-500 mt-1">Collected Today</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-blue-400">
      <div class="text-2xl font-bold text-blue-600">$312,500</div>
      <div class="text-xs text-gray-500 mt-1">Monthly Total</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-orange-400">
      <div class="text-2xl font-bold text-orange-600">$12,890</div>
      <div class="text-xs text-gray-500 mt-1">Outstanding Balance</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-red-400">
      <div class="text-2xl font-bold text-red-600">$2,340</div>
      <div class="text-xs text-gray-500 mt-1">Pending Refunds</div>
    </div>
  </div>

  <!-- Charts Row -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <div class="lg:col-span-2 card p-4">
      <h3 class="font-semibold text-gray-800 mb-3">Revenue Overview — This Month</h3>
      <canvas id="revenueChart" height="200"></canvas>
    </div>
    <div class="card p-4">
      <h3 class="font-semibold text-gray-800 mb-3">Payment Methods</h3>
      <canvas id="channelChart" height="200"></canvas>
    </div>
  </div>

  <!-- Filter -->
  <div class="bg-white rounded-xl border border-gray-100 p-3 mb-4 flex gap-3 flex-wrap items-center">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
      <input type="text" placeholder="Search by guest, booking ID, transaction ID..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <input type="date" class="form-input text-sm w-auto py-2">
    <input type="date" class="form-input text-sm w-auto py-2">
    <select class="form-input text-sm w-auto py-2"><option>All Methods</option><option>Cash</option><option>Credit Card</option><option>Bank Transfer</option><option>Online</option></select>
    <select class="form-input text-sm w-auto py-2"><option>All Status</option><option>Completed</option><option>Pending</option><option>Refunded</option></select>
    <button class="btn-primary btn-sm">Apply Filter</button>
  </div>

  <!-- Transactions Table -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Transaction ID</th>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest</th>
            <th class="table-header">Payment Type</th>
            <th class="table-header">Method</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Status</th>
            <th class="table-header">Date & Time</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${transactions.map(t => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-gray-600">${t.id}</span></td>
              <td class="table-cell"><span class="font-mono text-xs text-blue-600">${t.bookingId}</span></td>
              <td class="table-cell font-medium text-gray-800">${t.guest}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">${t.type}</span>
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <i class="fas ${t.method === 'Cash' ? 'fa-money-bill-wave text-green-500' : t.method === 'Credit Card' ? 'fa-credit-card text-blue-500' : t.method === 'Bank Transfer' ? 'fa-university text-purple-500' : 'fa-globe text-teal-500'} text-xs"></i>
                  ${t.method}
                </div>
              </td>
              <td class="table-cell font-semibold ${t.status === 'refunded' ? 'text-red-500' : 'text-gray-800'}">
                ${t.status === 'refunded' ? '-' : ''}$${t.amount}
              </td>
              <td class="table-cell">${statusBadge(t.status)}</td>
              <td class="table-cell text-xs text-gray-500">
                <div>${t.date}</div>
                <div class="text-gray-400">${t.time}</div>
              </td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button onclick="openModal('receiptModal')" class="text-blue-600 hover:text-blue-700 p-1 text-xs" title="View Receipt"><i class="fas fa-receipt"></i></button>
                  ${t.status === 'completed' ? `<button class="text-orange-400 hover:text-orange-500 p-1 text-xs" title="Refund"><i class="fas fa-undo"></i></button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 1-7 of 347 transactions</span>
      <div class="flex gap-1">
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-left text-xs"></i></button>
        <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-right text-xs"></i></button>
      </div>
    </div>
  </div>

  <!-- Record Payment Modal -->
  <div id="recordPaymentModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-credit-card text-green-500 mr-2"></i>Record Payment</h3>
        <button onclick="closeModal('recordPaymentModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Search Guest by Phone / Booking ID *</label>
          <div class="flex gap-2">
            <input type="text" class="form-input flex-1" placeholder="Enter phone or booking ID" id="guestSearch">
            <button class="btn-secondary" onclick="showToast('Guest record loaded','info')"><i class="fas fa-search"></i></button>
          </div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-sm">
          <div class="font-medium text-gray-800">James Wilson</div>
          <div class="text-gray-500 text-xs">Room 204 · Booking BK-2024-001 · Balance: $0.00</div>
          <div class="text-green-600 text-xs mt-0.5">✓ Guest found</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Amount *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">Currency</label>
            <select class="form-input"><option>USD</option><option>EUR</option><option>GBP</option></select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Payment Method *</label>
            <select class="form-input">
              <option>Cash</option><option>Credit Card</option><option>Debit Card</option>
              <option>Bank Transfer</option><option>Online Payment</option><option>Check</option>
            </select>
          </div>
          <div>
            <label class="form-label">Payment Type *</label>
            <select class="form-input">
              <option>Room Charge</option><option>Advance Deposit</option><option>Full Settlement</option>
              <option>Service Charge</option><option>F&B Charge</option><option>Others</option>
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">Transaction Reference</label>
          <input type="text" class="form-input" placeholder="Card last 4 digits, bank ref, etc.">
        </div>
        <div>
          <label class="form-label">Notes</label>
          <textarea class="form-input" rows="2" placeholder="Optional payment notes..."></textarea>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="sendReceipt" class="rounded border-gray-300 text-blue-600">
          <label for="sendReceipt" class="text-sm text-gray-600">Send email receipt to guest</label>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('recordPaymentModal')" class="btn-secondary">Cancel</button>
        <button class="btn-success" onclick="showToast('Payment recorded successfully!','success'); closeModal('recordPaymentModal')">
          <i class="fas fa-check mr-1"></i>Record Payment
        </button>
      </div>
    </div>
  </div>

  <!-- Receipt Modal -->
  <div id="receiptModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-receipt text-blue-500 mr-2"></i>Payment Receipt</h3>
        <button onclick="closeModal('receiptModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-6">
        <div class="text-center mb-4">
          <div class="text-lg font-bold text-gray-800">Grand Palace Hotel</div>
          <div class="text-sm text-gray-500">123 Beach Road, Miami, FL</div>
          <div class="text-xs text-gray-400 mt-0.5">Tel: +1 (305) 555-0100</div>
        </div>
        <div class="border-t border-dashed my-3"></div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Receipt No.:</span><span class="font-medium">TXN-2024-001</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Date:</span><span>Mar 11, 2024, 2:15 PM</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Guest:</span><span>James Wilson</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Booking ID:</span><span>BK-2024-001</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Room:</span><span>204 — Deluxe Room</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Payment Type:</span><span>Room Charge</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Method:</span><span>Credit Card (***4242)</span></div>
        </div>
        <div class="border-t border-dashed my-3"></div>
        <div class="flex justify-between font-bold text-base">
          <span>Amount Paid:</span>
          <span class="text-green-600">$435.00</span>
        </div>
        <div class="border-t border-dashed my-3"></div>
        <div class="text-center text-xs text-gray-400">Thank you for your stay!<br>This is a computer-generated receipt.</div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('receiptModal')" class="btn-secondary">Close</button>
        <button class="btn-secondary" onclick="printPage()"><i class="fas fa-print mr-1"></i>Print</button>
        <button class="btn-primary"><i class="fas fa-envelope mr-1"></i>Email Receipt</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Payment Management', content, 'payment'))
})
