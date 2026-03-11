import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const bookingRoute = new Hono()

const sampleBookings = [
  {id:'BK-2024-001', guest:'James Wilson', phone:'+1-305-555-0101', room:'204', category:'Deluxe Room', checkin:'Mar 11', checkout:'Mar 14', nights:3, adults:2, children:0, amount:387, paid:387, balance:0, source:'Website', status:'confirmed', createdAt:'Mar 10'},
  {id:'BK-2024-002', guest:'Maria Santos', phone:'+1-786-555-0202', room:'301', category:'Suite', checkin:'Mar 12', checkout:'Mar 16', nights:4, adults:2, children:1, amount:1036, paid:500, balance:536, source:'B2B Agent', status:'confirmed', createdAt:'Mar 10'},
  {id:'BK-2024-003', guest:'Ahmed Al-Rashid', phone:'+971-50-555-0303', room:'105', category:'Standard Room', checkin:'Mar 11', checkout:'Mar 13', nights:2, adults:1, children:0, amount:178, paid:0, balance:178, source:'OTA', status:'pending', createdAt:'Mar 11'},
  {id:'BK-2024-004', guest:'Sophie Chen', phone:'+1-415-555-0404', room:'402', category:'Junior Suite', checkin:'Mar 11', checkout:'Mar 15', nights:4, adults:2, children:2, amount:756, paid:756, balance:0, source:'Website', status:'confirmed', createdAt:'Mar 9'},
  {id:'BK-2024-005', guest:'Robert Miller', phone:'+1-212-555-0505', room:'Pending', category:'Presidential Suite', checkin:'Mar 15', checkout:'Mar 20', nights:5, adults:2, children:0, amount:2995, paid:1000, balance:1995, source:'Phone', status:'pending', createdAt:'Mar 11'},
  {id:'BK-2024-006', guest:'Emily Clark', phone:'+44-20-5550606', room:'206', category:'Deluxe Room', checkin:'Mar 8', checkout:'Mar 11', nights:3, adults:1, children:0, amount:387, paid:387, balance:0, source:'Website', status:'checked-out', createdAt:'Mar 7'},
  {id:'BK-2024-007', guest:'David Lee', phone:'+82-10-5550707', room:'318', category:'Executive Suite', checkin:'Mar 5', checkout:'Mar 11', nights:6, adults:2, children:0, amount:2334, paid:2334, balance:0, source:'B2B Agent', status:'checked-out', createdAt:'Mar 4'},
  {id:'BK-2024-008', guest:'Anna Schmidt', phone:'+49-30-5550808', room:'N/A', category:'Deluxe Room', checkin:'Mar 14', checkout:'Mar 16', nights:2, adults:2, children:0, amount:258, paid:0, balance:258, source:'Website', status:'cancelled', createdAt:'Mar 5'},
]

function bookingRow(b: typeof sampleBookings[0]): string {
  return `<tr class="table-row hover:bg-gray-50 cursor-pointer" onclick="openModal('viewBookingModal')">
    <td class="table-cell"><span class="font-mono text-xs text-blue-600 font-medium">${b.id}</span></td>
    <td class="table-cell">
      <div class="font-medium text-gray-800">${b.guest}</div>
      <div class="text-xs text-gray-400">${b.phone}</div>
    </td>
    <td class="table-cell">
      <div>${b.category}</div>
      <div class="text-xs text-gray-400">Room ${b.room}</div>
    </td>
    <td class="table-cell">
      <div class="text-xs">${b.checkin}</div>
      <div class="text-xs text-gray-400">to ${b.checkout}</div>
    </td>
    <td class="table-cell text-center">${b.nights}</td>
    <td class="table-cell">
      <div class="text-sm font-medium">$${b.amount}</div>
      ${b.balance > 0 ? `<div class="text-xs text-red-500">Balance: $${b.balance}</div>` : `<div class="text-xs text-green-600">Paid in full</div>`}
    </td>
    <td class="table-cell"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${b.source}</span></td>
    <td class="table-cell">${statusBadge(b.status)}</td>
    <td class="table-cell">
      <div class="flex gap-1">
        <button onclick="event.stopPropagation(); openModal('viewBookingModal')" class="text-blue-600 hover:text-blue-700 p-1" title="View"><i class="fas fa-eye text-xs"></i></button>
        <button onclick="event.stopPropagation(); openModal('editBookingModal')" class="text-gray-500 hover:text-gray-700 p-1" title="Edit"><i class="fas fa-edit text-xs"></i></button>
        <button onclick="event.stopPropagation()" class="text-red-400 hover:text-red-500 p-1" title="Cancel"><i class="fas fa-times text-xs"></i></button>
      </div>
    </td>
  </tr>`
}

function bookingModals(): string {
  return `
  <!-- View Booking Modal -->
  <div id="viewBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-calendar-check text-blue-500 mr-2"></i>Booking Details — BK-2024-001</h3>
        <button onclick="closeModal('viewBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <!-- Status Bar -->
        <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
          <div class="flex items-center gap-2">
            ${statusBadge('confirmed')}
            <span class="text-sm font-medium text-gray-700">Booking Confirmed</span>
          </div>
          <div class="flex gap-2">
            <button class="btn-secondary btn-sm text-xs" onclick="showToast('Check-in recorded!','success')"><i class="fas fa-sign-in-alt mr-1"></i>Check-in</button>
            <button class="btn-secondary btn-sm text-xs"><i class="fas fa-print mr-1"></i>Print</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="space-y-3">
            <div><p class="text-xs text-gray-400 font-medium uppercase">Guest Name</p><p class="font-medium text-gray-800">James Wilson</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Phone</p><p class="text-gray-700">+1-305-555-0101</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Email</p><p class="text-gray-700">james.wilson@email.com</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Nationality</p><p class="text-gray-700">American</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">ID / Passport</p><p class="text-gray-700">P12345678</p></div>
          </div>
          <div class="space-y-3">
            <div><p class="text-xs text-gray-400 font-medium uppercase">Booking ID</p><p class="font-medium text-blue-600">BK-2024-001</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Room</p><p class="text-gray-700">Room 204 — Deluxe Room</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Check-in / Check-out</p><p class="text-gray-700">Mar 11 → Mar 14 (3 nights)</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Guests</p><p class="text-gray-700">2 Adults, 0 Children</p></div>
            <div><p class="text-xs text-gray-400 font-medium uppercase">Booking Source</p><p class="text-gray-700">Website (B2C)</p></div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="mt-4 bg-gray-50 rounded-xl p-3">
          <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Summary</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span class="text-gray-600">Room Charge (3 nights × $129)</span><span>$387.00</span></div>
            <div class="flex justify-between"><span class="text-gray-600">Service Tax (10%)</span><span>$38.70</span></div>
            <div class="flex justify-between"><span class="text-gray-600">City Tax</span><span>$9.30</span></div>
            <div class="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total</span><span>$435.00</span></div>
            <div class="flex justify-between text-green-600"><span>Paid</span><span>$435.00</span></div>
            <div class="flex justify-between font-bold text-green-600"><span>Balance Due</span><span>$0.00</span></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('viewBookingModal')" class="btn-secondary">Close</button>
        <button class="btn-primary" onclick="openModal('editBookingModal'); closeModal('viewBookingModal')"><i class="fas fa-edit mr-1"></i>Edit Booking</button>
      </div>
    </div>
  </div>

  <!-- Edit Booking Modal -->
  <div id="editBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-edit text-blue-500 mr-2"></i>Edit Booking — BK-2024-001</h3>
        <button onclick="closeModal('editBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Check-in Date</label>
            <input type="date" class="form-input" value="2024-03-11">
          </div>
          <div>
            <label class="form-label">Check-out Date</label>
            <input type="date" class="form-input" value="2024-03-14">
          </div>
          <div>
            <label class="form-label">Room</label>
            <select class="form-input"><option selected>204 - Deluxe Room</option><option>205 - Deluxe Room</option><option>301 - Suite</option></select>
          </div>
          <div>
            <label class="form-label">Booking Status</label>
            <select class="form-input"><option>Confirmed</option><option>Pending</option><option>Checked-in</option><option>Checked-out</option><option>Cancelled</option></select>
          </div>
          <div>
            <label class="form-label">Adults</label>
            <input type="number" class="form-input" value="2" min="1">
          </div>
          <div>
            <label class="form-label">Children</label>
            <input type="number" class="form-input" value="0" min="0">
          </div>
        </div>
        <div>
          <label class="form-label">Special Requests / Notes</label>
          <textarea class="form-input" rows="2" placeholder="Any special requests...">Late check-in requested, around 11 PM</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('editBookingModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Booking updated!', 'success'); closeModal('editBookingModal')"><i class="fas fa-save mr-1"></i>Save Changes</button>
      </div>
    </div>
  </div>
  `
}

// All Bookings
bookingRoute.get('/all', (c) => {
  const content = `
  ${pageHeader('All Bookings', 'Complete record of all reservations', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}

  <!-- Filter Bar -->
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
    <div class="flex flex-wrap gap-3 items-center">
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search by name, booking ID..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <input type="date" class="form-input text-sm w-auto py-2" placeholder="From Date">
      <input type="date" class="form-input text-sm w-auto py-2" placeholder="To Date">
      <select class="form-input text-sm w-auto py-2">
        <option value="">All Status</option>
        <option>Confirmed</option><option>Pending</option><option>Checked-in</option><option>Checked-out</option><option>Cancelled</option>
      </select>
      <select class="form-input text-sm w-auto py-2">
        <option value="">All Sources</option>
        <option>Website</option><option>B2B Agent</option><option>Walk-in</option><option>OTA</option><option>Phone</option>
      </select>
      <button class="btn-primary btn-sm">Filter</button>
      <button class="btn-secondary btn-sm text-gray-500">Clear</button>
    </div>
  </div>

  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest</th>
            <th class="table-header">Room / Category</th>
            <th class="table-header">Dates</th>
            <th class="table-header">Nights</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Source</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${sampleBookings.map(bookingRow).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 1-8 of 247 bookings</span>
      <div class="flex gap-1">
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-left text-xs"></i></button>
        <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-right text-xs"></i></button>
      </div>
    </div>
  </div>
  ${bookingModals()}
  `
  return c.html(adminLayout('All Bookings', content, 'booking', 'all'))
})

// Pending Bookings
bookingRoute.get('/pending', (c) => {
  const pending = sampleBookings.filter(b => b.status === 'pending')
  const content = `
  ${pageHeader('Pending Bookings', 'Bookings awaiting confirmation or payment', `
    <button class="btn-secondary"><i class="fas fa-envelope mr-1"></i>Send Reminders</button>
    <button class="btn-primary" onclick="showToast('All pending bookings approved!','success')"><i class="fas fa-check-double mr-1"></i>Approve All</button>
  `)}

  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="card p-4 text-center border-l-4 border-yellow-400">
      <div class="text-2xl font-bold text-gray-800">8</div>
      <div class="text-xs text-gray-500 mt-1">Total Pending</div>
    </div>
    <div class="card p-4 text-center border-l-4 border-red-400">
      <div class="text-2xl font-bold text-red-600">3</div>
      <div class="text-xs text-gray-500 mt-1">Urgent (>24h old)</div>
    </div>
    <div class="card p-4 text-center border-l-4 border-blue-400">
      <div class="text-2xl font-bold text-blue-600">$4,891</div>
      <div class="text-xs text-gray-500 mt-1">Pending Revenue</div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest</th>
            <th class="table-header">Room Category</th>
            <th class="table-header">Check-in</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Balance</th>
            <th class="table-header">Source</th>
            <th class="table-header">Waiting Since</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${pending.map(b => `
            <tr class="table-row hover:bg-yellow-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600 font-medium">${b.id}</span></td>
              <td class="table-cell">
                <div class="font-medium text-gray-800">${b.guest}</div>
                <div class="text-xs text-gray-400">${b.phone}</div>
              </td>
              <td class="table-cell">${b.category}</td>
              <td class="table-cell">${b.checkin}</td>
              <td class="table-cell font-semibold">$${b.amount}</td>
              <td class="table-cell text-red-500 font-medium">$${b.balance}</td>
              <td class="table-cell"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${b.source}</span></td>
              <td class="table-cell text-xs text-gray-500">${b.createdAt}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="btn-success btn-sm text-xs" onclick="showToast('Booking approved!','success')">Approve</button>
                  <button class="btn-secondary btn-sm text-xs" onclick="openModal('viewBookingModal')">View</button>
                  <button class="btn-danger btn-sm text-xs" onclick="showToast('Booking cancelled','error')">Cancel</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ${bookingModals()}
  `
  return c.html(adminLayout('Pending Bookings', content, 'booking', 'pending'))
})

// Cancelled Bookings
bookingRoute.get('/cancelled', (c) => {
  const cancelled = sampleBookings.filter(b => b.status === 'cancelled')
  const content = `
  ${pageHeader('Cancelled Bookings', 'View all cancelled reservations and lost revenue', `
    <button class="btn-secondary"><i class="fas fa-file-export mr-1"></i>Export Report</button>
  `)}

  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="card p-4 border-l-4 border-red-400">
      <div class="text-2xl font-bold text-gray-800">18</div>
      <div class="text-xs text-gray-500 mt-1">This Month</div>
    </div>
    <div class="card p-4 border-l-4 border-orange-400">
      <div class="text-2xl font-bold text-orange-600">$3,420</div>
      <div class="text-xs text-gray-500 mt-1">Lost Revenue (Month)</div>
    </div>
    <div class="card p-4 border-l-4 border-gray-400">
      <div class="text-2xl font-bold text-gray-600">7.2%</div>
      <div class="text-xs text-gray-500 mt-1">Cancellation Rate</div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Cancelled Bookings</h3>
      <div class="flex gap-2">
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Reasons</option><option>Guest Request</option><option>No Show</option><option>Overbooking</option></select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest</th>
            <th class="table-header">Room Type</th>
            <th class="table-header">Was Scheduled</th>
            <th class="table-header">Revenue Lost</th>
            <th class="table-header">Cancellation Reason</th>
            <th class="table-header">Refund Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${cancelled.concat([
            {...cancelled[0], id:'BK-2024-009', guest:'Tom Parker', checkin:'Mar 8', amount:516, status:'cancelled'},
            {...cancelled[0], id:'BK-2024-010', guest:'Lisa Wong', checkin:'Mar 6', amount:258, status:'cancelled'},
          ]).map(b => `
            <tr class="table-row hover:bg-red-50">
              <td class="table-cell"><span class="font-mono text-xs text-red-500 font-medium line-through">${b.id}</span></td>
              <td class="table-cell font-medium text-gray-600">${b.guest}</td>
              <td class="table-cell text-gray-500">${b.category}</td>
              <td class="table-cell text-gray-500 text-xs">${b.checkin} → ${b.checkout}</td>
              <td class="table-cell text-red-500 font-medium">$${b.amount}</td>
              <td class="table-cell text-xs text-gray-500">Guest Request</td>
              <td class="table-cell"><span class="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-600">Partial Refund</span></td>
              <td class="table-cell">
                <button class="text-blue-600 hover:text-blue-700 text-xs" onclick="openModal('viewBookingModal')">View Details</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ${bookingModals()}
  `
  return c.html(adminLayout('Cancelled Bookings', content, 'booking', 'cancelled'))
})

// Walk-in / Front Desk
bookingRoute.get('/walk-in', (c) => {
  const content = `
  ${pageHeader('Walk-in / Front Desk', 'Create instant bookings for walk-in guests', '')}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Walk-in Booking Form -->
    <div class="lg:col-span-2 card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800"><i class="fas fa-walking text-blue-500 mr-2"></i>New Walk-in Booking</h3>
        <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Front Desk Mode</div>
      </div>

      <form class="space-y-4">
        <!-- Guest Information -->
        <div class="border rounded-xl p-4 bg-gray-50">
          <h4 class="text-sm font-semibold text-gray-700 mb-3"><i class="fas fa-user mr-1 text-gray-400"></i>Guest Information</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="form-label">First Name *</label>
              <input type="text" class="form-input" placeholder="John">
            </div>
            <div>
              <label class="form-label">Last Name *</label>
              <input type="text" class="form-input" placeholder="Smith">
            </div>
            <div>
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" placeholder="+1 (000) 000-0000">
            </div>
            <div>
              <label class="form-label">Email</label>
              <input type="email" class="form-input" placeholder="Optional">
            </div>
            <div>
              <label class="form-label">Nationality</label>
              <select class="form-input"><option>United States</option><option>United Kingdom</option><option>UAE</option><option>Others</option></select>
            </div>
            <div>
              <label class="form-label">ID Type</label>
              <select class="form-input"><option>Passport</option><option>Driver's License</option><option>National ID</option></select>
            </div>
            <div class="col-span-2">
              <label class="form-label">ID Number *</label>
              <input type="text" class="form-input" placeholder="Document number">
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="border rounded-xl p-4 bg-gray-50">
          <h4 class="text-sm font-semibold text-gray-700 mb-3"><i class="fas fa-bed mr-1 text-gray-400"></i>Stay Details</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="form-label">Check-in Date *</label>
              <input type="date" id="checkIn" class="form-input" onchange="calculateNights()">
            </div>
            <div>
              <label class="form-label">Check-out Date *</label>
              <input type="date" id="checkOut" class="form-input" onchange="calculateNights()">
            </div>
            <div>
              <label class="form-label">Room Category *</label>
              <select class="form-input" onchange="updateRoomOptions()">
                <option value="">Select Category</option>
                <option value="standard">Standard Room — $89/night</option>
                <option value="deluxe">Deluxe Room — $129/night</option>
                <option value="suite">Suite — $259/night</option>
              </select>
            </div>
            <div>
              <label class="form-label">Room Number *</label>
              <select class="form-input" id="roomSelect">
                <option>Select category first</option>
              </select>
            </div>
            <div>
              <label class="form-label">Adults *</label>
              <input type="number" class="form-input" value="1" min="1" max="6">
            </div>
            <div>
              <label class="form-label">Children</label>
              <input type="number" class="form-input" value="0" min="0">
            </div>
            <div>
              <label class="form-label">Duration</label>
              <div class="form-input bg-blue-50 text-blue-600 font-medium" id="nights">Select dates to calculate</div>
            </div>
            <div>
              <label class="form-label">Meal Plan</label>
              <select class="form-input"><option>Room Only</option><option>Breakfast Included</option><option>Half Board</option><option>Full Board</option></select>
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="border rounded-xl p-4 bg-gray-50">
          <h4 class="text-sm font-semibold text-gray-700 mb-3"><i class="fas fa-credit-card mr-1 text-gray-400"></i>Payment</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="form-label">Payment Method *</label>
              <select class="form-input"><option>Cash</option><option>Credit Card</option><option>Debit Card</option><option>Bank Transfer</option></select>
            </div>
            <div>
              <label class="form-label">Amount Paid</label>
              <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" class="form-input pl-6" placeholder="0.00"></div>
            </div>
          </div>
          <div class="mt-3 p-3 bg-white rounded-lg border border-gray-200">
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">Room Rate</span><span class="font-medium">$0.00/night</span></div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">Total Nights</span><span class="font-medium">0</span></div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">Subtotal</span><span class="font-medium">$0.00</span></div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-500">Tax (10%)</span><span class="font-medium">$0.00</span></div>
            <div class="flex justify-between font-bold border-t pt-1 mt-1"><span>Total Due</span><span class="text-blue-600">$0.00</span></div>
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" class="btn-primary flex-1 justify-center" onclick="showToast('Walk-in booking created! Room 105 assigned.', 'success')">
            <i class="fas fa-check mr-1"></i>Create Walk-in Booking
          </button>
          <button type="reset" class="btn-secondary">Clear Form</button>
        </div>
      </form>
    </div>

    <!-- Right: Available Rooms -->
    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm"><i class="fas fa-door-open text-green-500 mr-1"></i>Available Rooms Now</h3>
        <div class="space-y-2">
          ${[
            {room:'101', cat:'Standard', floor:1, rate:89, view:'Garden'},
            {room:'103', cat:'Standard', floor:1, rate:89, view:'Pool'},
            {room:'204', cat:'Deluxe', floor:2, rate:129, view:'Ocean'},
            {room:'207', cat:'Deluxe', floor:2, rate:129, view:'Garden'},
            {room:'305', cat:'Suite', floor:3, rate:259, view:'Ocean'},
            {room:'308', cat:'Suite', floor:3, rate:259, view:'City'},
          ].map(r => `
            <div class="flex items-center justify-between p-2 border border-green-200 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 text-sm">
              <div>
                <span class="font-bold text-green-700">Rm ${r.room}</span>
                <span class="text-gray-500 text-xs ml-1">· ${r.cat} · Fl ${r.floor} · ${r.view} View</span>
              </div>
              <span class="font-medium text-gray-700">$${r.rate}</span>
            </div>
          `).join('')}
        </div>
        <div class="mt-3 text-xs text-gray-400 text-center">18 rooms available total</div>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">Recent Walk-ins Today</h3>
        <div class="space-y-2">
          ${[
            {name:'Carlos M.', room:'108', time:'9:15 AM'},
            {name:'Priya S.', room:'203', time:'10:42 AM'},
            {name:'Tom R.', room:'115', time:'11:30 AM'},
          ].map(w => `
            <div class="flex items-center justify-between text-xs text-gray-600 p-2 bg-gray-50 rounded">
              <span class="font-medium">${w.name}</span>
              <span>Rm ${w.room}</span>
              <span class="text-gray-400">${w.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Walk-in / Front Desk', content, 'booking', 'walk-in'))
})

// Group Reservations
bookingRoute.get('/group', (c) => {
  const content = `
  ${pageHeader('Group Reservations', 'Manage group bookings and block reservations', `
    <button onclick="openModal('createGroupModal')" class="btn-primary"><i class="fas fa-plus"></i>New Group Booking</button>
  `)}

  <!-- Group Summary Cards -->
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-gray-800">5</div>
      <div class="text-xs text-gray-500 mt-1">Active Groups</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">48</div>
      <div class="text-xs text-gray-500 mt-1">Rooms Blocked</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-green-600">$28,450</div>
      <div class="text-xs text-gray-500 mt-1">Group Revenue</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-orange-600">3</div>
      <div class="text-xs text-gray-500 mt-1">Upcoming This Week</div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex justify-between items-center">
      <h3 class="font-semibold text-gray-800">Group Reservations</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Group ID</th>
            <th class="table-header">Group Name</th>
            <th class="table-header">Organizer</th>
            <th class="table-header">Dates</th>
            <th class="table-header">Rooms</th>
            <th class="table-header">Total Guests</th>
            <th class="table-header">Total Amount</th>
            <th class="table-header">Deposit Paid</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'GRP-001', name:'Samsung Corporate Retreat', org:'John Davis', dates:'Mar 15-18', rooms:12, guests:24, total:7236, deposit:3618, status:'confirmed'},
            {id:'GRP-002', name:'Miami Wedding Block', org:'Sarah & Tom', dates:'Mar 20-22', rooms:20, guests:40, total:12000, deposit:6000, status:'confirmed'},
            {id:'GRP-003', name:'Medical Conference', org:'Dr. Lisa Park', dates:'Apr 5-8', rooms:8, guests:15, total:5600, deposit:2800, status:'pending'},
            {id:'GRP-004', name:'School Trip — Lincoln High', org:'Mrs. Clark', dates:'Apr 12-15', rooms:6, guests:30, total:3204, deposit:0, status:'pending'},
            {id:'GRP-005', name:'Corporate Team Building', org:'Nike Inc.', dates:'May 2-5', rooms:15, guests:30, total:9000, deposit:4500, status:'confirmed'},
          ].map(g => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600">${g.id}</span></td>
              <td class="table-cell font-medium text-gray-800">${g.name}</td>
              <td class="table-cell text-gray-600 text-sm">${g.org}</td>
              <td class="table-cell text-xs text-gray-500">${g.dates}</td>
              <td class="table-cell text-center font-medium">${g.rooms}</td>
              <td class="table-cell text-center">${g.guests}</td>
              <td class="table-cell font-semibold">$${g.total.toLocaleString()}</td>
              <td class="table-cell">
                <div class="text-sm ${g.deposit > 0 ? 'text-green-600' : 'text-red-500'}">$${g.deposit.toLocaleString()}</div>
                <div class="text-xs text-gray-400">${g.deposit === 0 ? 'No deposit' : g.deposit >= g.total/2 ? '50% paid' : 'Partial'}</div>
              </td>
              <td class="table-cell">${statusBadge(g.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 hover:text-blue-700 text-xs p-1"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-500 text-xs p-1"><i class="fas fa-edit"></i></button>
                  <button class="text-green-600 text-xs p-1" title="Rooming List"><i class="fas fa-list"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Group Modal -->
  <div id="createGroupModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-users text-blue-500 mr-2"></i>Create Group Reservation</h3>
        <button onclick="closeModal('createGroupModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="form-label">Group / Event Name *</label>
            <input type="text" class="form-input" placeholder="e.g., ABC Corp Retreat 2024">
          </div>
          <div>
            <label class="form-label">Organizer Name *</label>
            <input type="text" class="form-input" placeholder="Contact person">
          </div>
          <div>
            <label class="form-label">Organizer Phone *</label>
            <input type="tel" class="form-input" placeholder="+1 (000) 000-0000">
          </div>
          <div>
            <label class="form-label">Check-in Date *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Check-out Date *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Number of Rooms *</label>
            <input type="number" class="form-input" placeholder="e.g., 10" min="2">
          </div>
          <div>
            <label class="form-label">Total Guests</label>
            <input type="number" class="form-input" placeholder="e.g., 20" min="2">
          </div>
          <div>
            <label class="form-label">Room Category Required</label>
            <select class="form-input"><option>Mix of Categories</option><option>Standard Only</option><option>Deluxe Only</option><option>Suite Only</option></select>
          </div>
          <div>
            <label class="form-label">Group Rate (if special)</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" class="form-input pl-6" placeholder="Leave blank for standard rate"></div>
          </div>
          <div>
            <label class="form-label">Deposit Required</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">Deposit Deadline</label>
            <input type="date" class="form-input">
          </div>
        </div>
        <div>
          <label class="form-label">Special Requirements</label>
          <textarea class="form-input" rows="2" placeholder="Meeting rooms, catering, AV equipment, etc."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createGroupModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Group reservation created!', 'success'); closeModal('createGroupModal')"><i class="fas fa-check mr-1"></i>Create Group Booking</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Group Reservations', content, 'booking', 'group'))
})

// Calendar View
bookingRoute.get('/calendar', (c) => {
  const rooms = [
    {num:'101', cat:'Standard', floor:1},
    {num:'102', cat:'Standard', floor:1},
    {num:'103', cat:'Standard', floor:1},
    {num:'201', cat:'Deluxe', floor:2},
    {num:'202', cat:'Deluxe', floor:2},
    {num:'203', cat:'Deluxe', floor:2},
    {num:'301', cat:'Suite', floor:3},
    {num:'302', cat:'Suite', floor:3},
    {num:'401', cat:'Presidential', floor:4},
  ]

  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      date: d.getDate(),
      month: d.toLocaleDateString('en', {month:'short'}),
      day: d.toLocaleDateString('en', {weekday:'short'}),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }
  })

  const colorClasses = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400', 'bg-teal-400']

  const content = `
  ${pageHeader('Calendar View', 'Visual room booking calendar and availability', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <button class="btn-secondary"><i class="fas fa-chevron-left"></i></button>
    <span class="text-sm font-medium text-gray-700 px-2">${new Date().toLocaleDateString('en',{month:'long', year:'numeric'})}</span>
    <button class="btn-secondary"><i class="fas fa-chevron-right"></i></button>
  `)}

  <!-- Legend -->
  <div class="flex gap-4 mb-4 flex-wrap text-xs">
    ${['Available','Occupied','Partial','Check-in','Check-out','Maintenance'].map((l,i) => {
      const colors = ['bg-green-100 text-green-700','bg-blue-400 text-white','bg-yellow-100 text-yellow-700','bg-teal-100 text-teal-700','bg-orange-100 text-orange-700','bg-gray-100 text-gray-500']
      return `<span class="flex items-center gap-1"><span class="w-3 h-3 rounded ${colors[i].split(' ')[0]} inline-block"></span>${l}</span>`
    }).join('')}
  </div>

  <!-- Calendar Grid -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse" style="min-width:900px">
        <thead>
          <tr>
            <th class="table-header sticky left-0 bg-gray-50 z-10 w-24 border-r border-gray-200">Room</th>
            ${days.map(d => `
              <th class="table-header text-center border-r border-gray-200 min-w-[80px] ${d.isToday ? 'bg-blue-50' : d.isWeekend ? 'bg-orange-50' : ''}">
                <div class="${d.isToday ? 'text-blue-600 font-bold' : 'text-gray-600'}">${d.day}</div>
                <div class="text-xs ${d.isToday ? 'text-blue-600' : 'text-gray-400'}">${d.month} ${d.date}</div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rooms.map(room => `
            <tr class="border-b border-gray-100">
              <td class="table-cell sticky left-0 bg-white z-10 border-r border-gray-200">
                <div class="font-bold text-sm text-gray-800">Rm ${room.num}</div>
                <div class="text-xs text-gray-400">${room.cat}</div>
              </td>
              ${days.map((d, di) => {
                const rand = Math.random()
                let cellContent = ''
                let cellBg = ''
                if (di === 2 && room.num === '101') {
                  cellContent = `<div class="bg-blue-400 text-white text-xs rounded px-1 py-0.5 truncate cursor-pointer" onclick="openModal('viewBookingModal')">James W. (3)</div>`
                } else if (di === 3 && room.num === '101') {
                  cellBg = 'bg-blue-100'
                } else if (di === 4 && room.num === '101') {
                  cellBg = 'bg-blue-100'
                } else if (di === 0 && room.num === '201') {
                  cellContent = `<div class="bg-purple-400 text-white text-xs rounded px-1 py-0.5 truncate cursor-pointer">Maria S. (4)</div>`
                } else if ([1,2,3].includes(di) && room.num === '201') {
                  cellBg = 'bg-purple-100'
                } else if (di === 1 && room.num === '301') {
                  cellContent = `<div class="bg-green-400 text-white text-xs rounded px-1 py-0.5 truncate cursor-pointer">Group (5)</div>`
                } else if ([2,3,4,5].includes(di) && room.num === '301') {
                  cellBg = 'bg-green-100'
                } else if (rand > 0.75) {
                  cellBg = 'bg-red-50'
                  cellContent = `<div class="text-center text-red-400 text-xs">●</div>`
                }
                return `<td class="border-r border-gray-100 h-10 p-0.5 ${cellBg} ${d.isToday ? 'ring-inset ring-1 ring-blue-400' : ''}">${cellContent}</td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="mt-4 text-xs text-gray-400 text-center">Click on any booking block to view details · Drag to extend or move bookings</div>
  `
  return c.html(adminLayout('Calendar View', content, 'booking', 'calendar-view'))
})
