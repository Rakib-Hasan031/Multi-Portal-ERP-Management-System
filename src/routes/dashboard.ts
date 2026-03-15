import { Hono } from 'hono'
import { adminLayout, pageHeader, statCard } from '../components/layout'

export const dashboardRoute = new Hono()

dashboardRoute.get('/', (c) => {
  const content = `
  ${pageHeader('Dashboard', 'Welcome back! Here is your property overview for today.', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <button onclick="openModal('transferRoomModal')" class="btn-secondary"><i class="fas fa-exchange-alt"></i>Transfer Room</button>
    <button onclick="openModal('recordPaymentModal')" class="btn-secondary"><i class="fas fa-credit-card"></i>Record Payment</button>
    <button onclick="openModal('promotionModal')" class="btn-secondary"><i class="fas fa-tag"></i>Create Promo</button>
  `)}

  <!-- Quick Stats Row -->
  <div class="stats-grid mb-6">
    ${statCard('fas fa-inbox', 'bg-blue-500', 'New Requests', '12', '+3 from yesterday', 'up')}
    ${statCard('fas fa-clock', 'bg-yellow-500', 'Pending Approval', '8', '2 urgent', 'up')}
    ${statCard('fas fa-calendar-check', 'bg-green-500', 'Assigned Today', '24', '+5 from last week', 'up')}
    ${statCard('fas fa-times-circle', 'bg-red-500', 'Cancelled', '3', '-1 from yesterday', 'down')}
    ${statCard('fas fa-bed', 'bg-teal-500', 'Available Rooms', '18', '18 of 45 total', 'down')}
    ${statCard('fas fa-sign-in-alt', 'bg-indigo-500', 'Check-In Today', '11', '3 pending', 'up')}
    ${statCard('fas fa-sign-out-alt', 'bg-orange-500', 'Check-Out Today', '9', '2 late', 'up')}
    ${statCard('fas fa-user-friends', 'bg-purple-500', 'In-House Guests', '63', 'Capacity: 90', 'up')}
  </div>

  <!-- Charts Row -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <!-- Booking Trends Chart -->
    <div class="lg:col-span-2 card p-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-gray-800">Booking Trends</h3>
          <p class="text-xs text-gray-500 mt-0.5">Monthly bookings by channel</p>
        </div>
        <div class="flex gap-2">
          <button class="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Monthly</button>
          <button class="text-xs px-3 py-1 text-gray-500 hover:bg-gray-50 rounded-full">Weekly</button>
        </div>
      </div>
      <canvas id="bookingTrendChart" height="180"></canvas>
    </div>

    <!-- Channel Distribution -->
    <div class="card p-4">
      <div class="mb-4">
        <h3 class="font-semibold text-gray-800">Channel Distribution</h3>
        <p class="text-xs text-gray-500 mt-0.5">Booking source breakdown</p>
      </div>
      <canvas id="channelChart" height="180"></canvas>
    </div>
  </div>

  <!-- Second Row -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <!-- Revenue Chart -->
    <div class="lg:col-span-2 card p-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-gray-800">Revenue Overview</h3>
          <p class="text-xs text-gray-500 mt-0.5">Weekly revenue by category</p>
        </div>
        <select class="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
          <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
        </select>
      </div>
      <canvas id="revenueChart" height="180"></canvas>
    </div>

    <!-- Occupancy -->
    <div class="card p-4">
      <div class="mb-4">
        <h3 class="font-semibold text-gray-800">Occupancy Rate</h3>
        <p class="text-xs text-gray-500 mt-0.5">Daily occupancy this week</p>
      </div>
      <canvas id="occupancyChart" height="180"></canvas>
    </div>
  </div>

  <!-- Bottom Row -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Today's Arrivals -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800"><i class="fas fa-sign-in-alt text-green-500 mr-2"></i>Today's Arrivals</h3>
        <a href="/booking/all" class="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {name:'James Wilson', room:'204', time:'2:00 PM', status:'confirmed'},
          {name:'Maria Santos', room:'301', time:'3:30 PM', status:'confirmed'},
          {name:'Ahmed Al-Rashid', room:'105', time:'4:00 PM', status:'pending'},
          {name:'Sophie Chen', room:'402', time:'5:00 PM', status:'confirmed'},
          {name:'Robert Miller', room:'112', time:'6:00 PM', status:'pending'},
        ].map(a => `
          <div class="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">${a.name.charAt(0)}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">${a.name}</div>
              <div class="text-xs text-gray-500">Room ${a.room} · ${a.time}</div>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full ${a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${a.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Today's Departures -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800"><i class="fas fa-sign-out-alt text-orange-500 mr-2"></i>Today's Departures</h3>
        <a href="/booking/all" class="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {name:'Emily Clark', room:'206', time:'10:00 AM', nights:3, amount:'$450'},
          {name:'David Lee', room:'318', time:'11:00 AM', nights:5, amount:'$750'},
          {name:'Fatima Nair', room:'101', time:'12:00 PM', nights:2, amount:'$280'},
          {name:'Carlos Rivera', room:'415', time:'1:00 PM', nights:7, amount:'$1,050'},
          {name:'Anna Schmidt', room:'209', time:'2:00 PM', nights:4, amount:'$600'},
        ].map(d => `
          <div class="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">${d.name.charAt(0)}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">${d.name}</div>
              <div class="text-xs text-gray-500">Room ${d.room} · ${d.nights} nights</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-semibold text-gray-700">${d.amount}</div>
              <div class="text-xs text-gray-400">${d.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recent Activity & Room Availability -->
    <div class="space-y-4">
      <!-- Room Availability Mini -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 text-sm"><i class="fas fa-calendar text-blue-500 mr-1"></i>Room Availability</h3>
          <div class="flex gap-2 text-xs">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Avail</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Occup</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>Resv</span>
          </div>
        </div>
        <div id="availabilityCalendar" class="text-xs"></div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div class="bg-green-50 rounded p-2"><div class="text-lg font-bold text-green-600">18</div><div class="text-xs text-gray-500">Available</div></div>
          <div class="bg-red-50 rounded p-2"><div class="text-lg font-bold text-red-600">27</div><div class="text-xs text-gray-500">Occupied</div></div>
          <div class="bg-yellow-50 rounded p-2"><div class="text-lg font-bold text-yellow-600">0</div><div class="text-xs text-gray-500">Reserved</div></div>
        </div>
      </div>

      <!-- Quick Actions Panel -->
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 text-sm mb-3"><i class="fas fa-bolt text-yellow-500 mr-1"></i>Quick Actions</h3>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="window.location='/booking/walk-in'" class="p-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 flex flex-col items-center gap-1">
            <i class="fas fa-walking text-base"></i>Walk-in
          </button>
          <button onclick="openModal('transferRoomModal')" class="p-2 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 flex flex-col items-center gap-1">
            <i class="fas fa-exchange-alt text-base"></i>Transfer
          </button>
          <button onclick="openModal('recordPaymentModal')" class="p-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 flex flex-col items-center gap-1">
            <i class="fas fa-credit-card text-base"></i>Payment
          </button>
          <button onclick="openModal('promotionModal')" class="p-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 flex flex-col items-center gap-1">
            <i class="fas fa-tag text-base"></i>Promotion
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Transfer Room Modal -->
  <div id="transferRoomModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-exchange-alt text-purple-500 mr-2"></i>Transfer Room</h3>
        <button onclick="closeModal('transferRoomModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Guest Name / Booking ID *</label>
          <input type="text" class="form-input" placeholder="Search by name or booking ID">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Current Room</label>
            <input type="text" class="form-input" placeholder="Auto-filled" readonly>
          </div>
          <div>
            <label class="form-label">Transfer To Room *</label>
            <select class="form-input">
              <option>Select available room</option>
              <option>101 - Standard</option>
              <option>205 - Deluxe</option>
              <option>301 - Suite</option>
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">Transfer Date</label>
          <input type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">Reason for Transfer</label>
          <textarea class="form-input" rows="2" placeholder="Optional reason..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('transferRoomModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Room transfer processed successfully!', 'success'); closeModal('transferRoomModal')">Confirm Transfer</button>
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
            <input type="text" class="form-input flex-1" placeholder="Enter phone number or booking ID">
            <button class="btn-secondary" onclick="showToast('Guest record fetched', 'info')"><i class="fas fa-search"></i></button>
          </div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-sm" id="guestInfo">
          <div class="font-medium text-gray-800">James Wilson</div>
          <div class="text-gray-500 text-xs">Room 204 · Check-in: Today · Balance: $450.00</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Amount *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input type="number" class="form-input pl-7" placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="form-label">Payment Method *</label>
            <select class="form-input">
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Online Payment</option>
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">Payment Type</label>
          <select class="form-input">
            <option>Room Charge</option>
            <option>Advance Deposit</option>
            <option>Full Settlement</option>
            <option>Service Charge</option>
          </select>
        </div>
        <div>
          <label class="form-label">Reference / Transaction ID</label>
          <input type="text" class="form-input" placeholder="Optional transaction reference">
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('recordPaymentModal')" class="btn-secondary">Cancel</button>
        <button class="btn-success" onclick="showToast('Payment recorded successfully!', 'success'); closeModal('recordPaymentModal')"><i class="fas fa-check mr-1"></i>Record Payment</button>
      </div>
    </div>
  </div>

  <!-- Create Promotion Modal -->
  <div id="promotionModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-tag text-orange-500 mr-2"></i>Create Promotion</h3>
        <button onclick="closeModal('promotionModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Promotion Name *</label>
          <input type="text" class="form-input" placeholder="e.g., Summer Special 2024">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Discount Type</label>
            <select class="form-input">
              <option>Percentage Off</option>
              <option>Fixed Amount Off</option>
              <option>Free Night</option>
              <option>Complimentary Service</option>
            </select>
          </div>
          <div>
            <label class="form-label">Discount Value *</label>
            <input type="number" class="form-input" placeholder="e.g., 20 (for 20%)">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Valid From *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Valid To *</label>
            <input type="date" class="form-input">
          </div>
        </div>
        <div>
          <label class="form-label">Apply To Channel</label>
          <div class="flex gap-2 flex-wrap">
            ${['B2C Website', 'B2B Agents', 'OTA', 'Walk-in', 'All Channels'].map(c => 
              `<label class="flex items-center gap-1 text-sm"><input type="checkbox"> ${c}</label>`
            ).join('')}
          </div>
        </div>
        <div>
          <label class="form-label">Promo Code (optional)</label>
          <input type="text" class="form-input" placeholder="e.g., SUMMER20">
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('promotionModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Promotion created successfully!', 'success'); closeModal('promotionModal')">Create Promotion</button>
      </div>
    </div>
  </div>

  <!-- Quick New Booking Modal — Category-Based -->
  <div id="quickBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl" style="max-height:90vh;overflow-y:auto;">
      <div class="modal-header sticky top-0 bg-white z-10 border-b">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center"><i class="fas fa-plus text-white text-xs"></i></div>
          <h3 class="text-lg font-semibold text-gray-800">Quick New Booking</h3>
        </div>
        <button onclick="closeModal('quickBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div>
          <label class="form-label">Guest Name *</label>
          <input type="text" id="db_qb_name" class="form-input" placeholder="Full name">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Phone Number *</label><input type="tel" class="form-input" placeholder="+880 1700-000000"></div>
          <div><label class="form-label">Email</label><input type="email" class="form-input" placeholder="guest@email.com"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Check-in Date *</label><input type="date" id="db_qb_checkin" class="form-input"></div>
          <div><label class="form-label">Check-out Date *</label><input type="date" id="db_qb_checkout" class="form-input"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Room Category *</label>
            <select id="db_qb_cat" class="form-input" onchange="dbUpdateSummary()">
              <option value="">Select Category</option>
              <option value="standard" data-rate="2000">Standard — ৳2,000/night</option>
              <option value="deluxe" data-rate="3500">Deluxe — ৳3,500/night</option>
              <option value="super_deluxe" data-rate="5000">Super Deluxe — ৳5,000/night</option>
              <option value="deluxe_couple" data-rate="4500">Deluxe Couple — ৳4,500/night</option>
              <option value="suite" data-rate="8000">Suite — ৳8,000/night</option>
            </select>
          </div>
          <div>
            <label class="form-label">Total Rooms</label>
            <input type="number" id="db_qb_rooms" class="form-input" value="1" min="1" onchange="dbUpdateSummary()">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Adults *</label><input type="number" class="form-input" value="2" min="1"></div>
          <div><label class="form-label">Children</label><input type="number" class="form-input" value="0" min="0"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Booking Source</label>
            <select class="form-input"><option>Walk-in</option><option>Phone</option><option>Website</option><option>B2B Agent</option><option>OTA</option></select>
          </div>
          <div><label class="form-label">Special Requests</label>
            <input type="text" class="form-input" placeholder="Any special requirements...">
          </div>
        </div>
        <!-- Payment Summary -->
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h4 class="text-xs font-bold text-orange-700 uppercase mb-3">Payment Summary</h4>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between text-gray-600"><span>Room fare</span><span id="db_ps_fare">৳ 0</span></div>
            <div class="flex justify-between text-gray-600"><span>VAT (7.5%)</span><span id="db_ps_vat">৳ 0</span></div>
            <div class="flex justify-between font-bold text-gray-800 border-t pt-2"><span>Total</span><span id="db_ps_total" class="text-blue-700">৳ 0</span></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Advance Paid</label><input type="number" id="db_paid" class="form-input" placeholder="0" oninput="dbCalcDue()"></div>
          <div><label class="form-label">Balance Due</label><input type="number" id="db_due" class="form-input bg-red-50 text-red-600 font-semibold" readonly placeholder="0"></div>
        </div>
        <div><label class="form-label">Payment Method</label>
          <select class="form-input"><option>Cash</option><option>bKash</option><option>Card</option><option>Bank Transfer</option></select>
        </div>
        <div class="bg-blue-50 rounded-xl p-3 text-xs text-blue-700"><i class="fas fa-info-circle mr-1"></i>Rate calculated automatically. Physical room assigned upon confirmation.</div>
      </div>
      <div class="sticky bottom-0 bg-white border-t px-5 py-3 flex gap-3 justify-end">
        <button onclick="closeModal('quickBookingModal')" class="btn-secondary">Cancel</button>
        <button onclick="dbSubmitBooking()" class="btn-primary">Create Booking</button>
      </div>
    </div>
  </div>

  <!-- Assign Rooms Modal -->
  <div id="assignRoomsModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Assign Rooms</h3>
        <button onclick="closeModal('assignRoomsModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="flex items-center justify-between bg-gray-50 rounded-xl p-3">
          <div>
            <p class="text-sm font-semibold text-gray-800">Guest: <span class="text-blue-600">New Guest</span></p>
            <p class="text-xs text-gray-500 mt-0.5">Request: <span class="font-semibold" id="assignCatLabel">1x Standard</span></p>
          </div>
          <button class="text-xs text-blue-600 underline">View details</button>
        </div>
        <div id="dbAssignInputs" class="space-y-3">
          <div><label class="form-label">Room 1</label><input type="text" class="form-input" placeholder="e.g. 101" list="dbRoomList"></div>
        </div>
        <datalist id="dbRoomList">
          <option value="101">101 — Standard</option>
          <option value="102">102 — Standard</option>
          <option value="202">202 — Deluxe</option>
          <option value="205">205 — Deluxe</option>
          <option value="401">401 — Deluxe Couple</option>
        </datalist>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
          <i class="fas fa-info-circle mr-1"></i>Assigning rooms will confirm the booking and notify the guest.
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('assignRoomsModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Rooms assigned! Status → Confirmed.','success'); closeModal('assignRoomsModal')" class="btn-primary">Confirm Assignment</button>
      </div>
    </div>
  </div>

  <script>
    let _dbTotal = 0;
    function dbUpdateSummary() {
      const catSel = document.getElementById('db_qb_cat');
      const cin = document.getElementById('db_qb_checkin')?.value;
      const cout = document.getElementById('db_qb_checkout')?.value;
      const rooms = parseInt(document.getElementById('db_qb_rooms')?.value) || 1;
      let rate = catSel?.selectedOptions[0]?.dataset?.rate ? parseInt(catSel.selectedOptions[0].dataset.rate) : 0;
      let nights = 0;
      if (cin && cout) { const d1=new Date(cin),d2=new Date(cout); nights=Math.max(0,Math.round((d2-d1)/86400000)); }
      const fare = rate * nights * rooms;
      const vat = Math.round(fare * 0.075);
      const total = fare + vat;
      _dbTotal = total;
      document.getElementById('db_ps_fare').textContent = '৳ ' + fare.toLocaleString();
      document.getElementById('db_ps_vat').textContent = '৳ ' + vat.toLocaleString();
      document.getElementById('db_ps_total').textContent = '৳ ' + total.toLocaleString();
      dbCalcDue();
    }
    function dbCalcDue() {
      const paid = parseFloat(document.getElementById('db_paid')?.value) || 0;
      const due = Math.max(0, _dbTotal - paid);
      const el = document.getElementById('db_due');
      if (el) el.value = due;
    }
    function dbSubmitBooking() {
      const name = document.getElementById('db_qb_name')?.value;
      const cat = document.getElementById('db_qb_cat')?.value;
      if (!name || !cat) { showToast('Please fill Guest Name and Category.','error'); return; }
      const paid = parseFloat(document.getElementById('db_paid')?.value) || 0;
      closeModal('quickBookingModal');
      if (paid >= _dbTotal && _dbTotal > 0) {
        showToast('Booking confirmed! Room auto-assigned (fully paid).','success');
      } else {
        showToast('Booking created! Pending room assignment.','success');
        setTimeout(() => { if(confirm('Assign room now?')) openModal('assignRoomsModal'); }, 500);
      }
    }
    // Set default dates
    (function(){
      const today = new Date(), tom = new Date(today); tom.setDate(tom.getDate()+1);
      const fmt = d => d.toISOString().split('T')[0];
      const ci = document.getElementById('db_qb_checkin'), co = document.getElementById('db_qb_checkout');
      if(ci) ci.value = fmt(today); if(co) co.value = fmt(tom);
    })();
  </script>
  `

  return c.html(adminLayout('Dashboard', content, 'dashboard'))
})
