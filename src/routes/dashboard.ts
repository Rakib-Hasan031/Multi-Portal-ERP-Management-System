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
    <a href="/property/room-availability" class="btn-secondary"><i class="fas fa-th-large"></i>Room Availability</a>
  `)}

  <!-- Quick Stats Row -->
  <div class="stats-grid mb-6">
    ${statCard('fas fa-inbox',        'bg-blue-500',   'New Requests',    '12', '+3 from yesterday',   'up')}
    ${statCard('fas fa-clock',        'bg-yellow-500', 'Pending Approval', '8', '2 urgent',            'up')}
    ${statCard('fas fa-calendar-check','bg-green-500', 'Assigned Today',  '24', '+5 from last week',   'up')}
    ${statCard('fas fa-times-circle', 'bg-red-500',    'Cancelled',        '3', '-1 from yesterday',  'down')}
    ${statCard('fas fa-bed',          'bg-teal-500',   'Available Rooms', '18', '18 of 45 total',     'down')}
    ${statCard('fas fa-sign-in-alt',  'bg-indigo-500', 'Check-In Today',  '11', '3 pending',           'up')}
    ${statCard('fas fa-sign-out-alt', 'bg-orange-500', 'Check-Out Today',  '9', '2 late',              'up')}
    ${statCard('fas fa-user-friends', 'bg-purple-500', 'In-House Guests', '63', 'Capacity: 90',        'up')}
  </div>

  <!-- Charts Row 1 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <!-- Booking Trends -->
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

  <!-- Charts Row 2 -->
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
          {name:'James Wilson',    room:'204', time:'2:00 PM',  status:'confirmed'},
          {name:'Maria Santos',    room:'301', time:'3:30 PM',  status:'confirmed'},
          {name:'Ahmed Al-Rashid', room:'105', time:'4:00 PM',  status:'pending'},
          {name:'Sophie Chen',     room:'402', time:'5:00 PM',  status:'confirmed'},
          {name:'Robert Miller',   room:'112', time:'6:00 PM',  status:'pending'},
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
          {name:'Emily Clark',   room:'206', nights:3, amount:'৳ 9,000',  time:'10:00 AM'},
          {name:'David Lee',     room:'318', nights:5, amount:'৳ 17,500', time:'11:00 AM'},
          {name:'Fatima Nair',   room:'101', nights:2, amount:'৳ 4,000',  time:'12:00 PM'},
          {name:'Carlos Rivera', room:'415', nights:7, amount:'৳ 24,500', time:'1:00 PM'},
          {name:'Anna Schmidt',  room:'209', nights:4, amount:'৳ 14,000', time:'2:00 PM'},
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

    <!-- Room Availability Mini + Quick Actions -->
    <div class="space-y-4">
      <!-- ✅ Room Availability Mini-Widget (fixed: 18/27/0) -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 text-sm"><i class="fas fa-th-large text-blue-500 mr-1"></i>Room Availability</h3>
          <a href="/property/room-availability" class="text-xs text-blue-600 hover:underline">Full Board →</a>
        </div>
        <!-- 7-day mini calendar dots -->
        <div class="grid grid-cols-7 gap-1 mb-3">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => `
            <div class="text-center">
              <div class="text-xs text-gray-400 mb-1">${d}</div>
              <div class="w-7 h-7 rounded-lg mx-auto flex items-center justify-center text-xs font-bold
                ${i===2 ? 'bg-blue-600 text-white' :
                  i===0||i===1 ? 'bg-green-100 text-green-700' :
                  i===3 ? 'bg-purple-100 text-purple-700' :
                  i===4 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}">${24+i}</div>
            </div>
          `).join('')}
        </div>
        <!-- Legend -->
        <div class="flex gap-3 text-xs mb-3 justify-center">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Avail</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Occup</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>Resv</span>
        </div>
        <!-- Stats: exactly 18 / 27 / 0 -->
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-green-50 rounded-lg p-2">
            <div class="text-xl font-bold text-green-600">18</div>
            <div class="text-xs text-gray-500">Available</div>
          </div>
          <div class="bg-red-50 rounded-lg p-2">
            <div class="text-xl font-bold text-red-600">27</div>
            <div class="text-xs text-gray-500">Occupied</div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-2">
            <div class="text-xl font-bold text-yellow-600">0</div>
            <div class="text-xs text-gray-500">Reserved</div>
          </div>
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

  <!-- ═══ MODALS ═══ -->

  <!-- Transfer Room Modal -->
  <div id="transferRoomModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-exchange-alt text-purple-500 mr-2"></i>Transfer Room</h3>
        <button onclick="closeModal('transferRoomModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div><label class="form-label">Guest Name / Booking ID *</label>
          <input type="text" class="form-input" placeholder="Search by name or booking ID"></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Current Room</label>
            <input type="text" class="form-input" placeholder="Auto-filled" readonly></div>
          <div><label class="form-label">Transfer To Room *</label>
            <select class="form-input">
              <option>Select available room</option>
              <option>101 - Standard</option><option>205 - Deluxe</option><option>301 - Suite</option>
            </select>
          </div>
        </div>
        <div><label class="form-label">Transfer Date</label><input type="date" class="form-input"></div>
        <div><label class="form-label">Reason for Transfer</label>
          <textarea class="form-input" rows="2" placeholder="Optional reason..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('transferRoomModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Room transfer processed!', 'success'); closeModal('transferRoomModal')">Confirm Transfer</button>
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
        <div><label class="form-label">Search Guest by Phone / Booking ID *</label>
          <div class="flex gap-2">
            <input type="text" class="form-input flex-1" placeholder="Enter phone number or booking ID">
            <button class="btn-secondary" onclick="showToast('Guest record fetched', 'info')"><i class="fas fa-search"></i></button>
          </div>
        </div>
        <div class="bg-blue-50 rounded-lg p-3 text-sm">
          <div class="font-medium text-gray-800">James Wilson</div>
          <div class="text-gray-500 text-xs">Room 204 · Check-in: Today · Balance: ৳ 13,500</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Amount *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">৳</span>
            <input type="number" class="form-input pl-7" placeholder="0.00"></div></div>
          <div><label class="form-label">Payment Method *</label>
            <select class="form-input"><option>Cash</option><option>Credit Card</option><option>bKash</option><option>Bank Transfer</option></select></div>
        </div>
        <div><label class="form-label">Payment Type</label>
          <select class="form-input"><option>Advance Deposit</option><option>Full Settlement</option><option>Room Charge</option><option>Service Charge</option></select></div>
        <div><label class="form-label">Reference / Transaction ID</label>
          <input type="text" class="form-input" placeholder="Optional transaction reference"></div>
        <div><label class="form-label">Received By (Staff)</label>
          <input type="text" class="form-input" value="Admin — Front Desk" readonly></div>
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
        <div><label class="form-label">Promotion Name *</label>
          <input type="text" class="form-input" placeholder="e.g., Summer Special 2026"></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Discount Type</label>
            <select class="form-input"><option>Percentage Off</option><option>Fixed Amount Off</option><option>Free Night</option><option>Complimentary Service</option></select></div>
          <div><label class="form-label">Discount Value *</label>
            <input type="number" class="form-input" placeholder="e.g., 20 (for 20%)"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Valid From *</label><input type="date" class="form-input"></div>
          <div><label class="form-label">Valid To *</label><input type="date" class="form-input"></div>
        </div>
        <div><label class="form-label">Apply To Channel</label>
          <div class="flex gap-3 flex-wrap">
            ${['B2C Website', 'B2B Agents', 'OTA', 'Walk-in', 'All Channels'].map(c =>
              `<label class="flex items-center gap-1 text-sm cursor-pointer"><input type="checkbox"> ${c}</label>`
            ).join('')}
          </div>
        </div>
        <div><label class="form-label">Promo Code (optional)</label>
          <input type="text" class="form-input" placeholder="e.g., SUMMER20"></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('promotionModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Promotion created!', 'success'); closeModal('promotionModal')">Create Promotion</button>
      </div>
    </div>
  </div>

  <!-- ═══ Charts Script ═══ -->
  <script>
    // Booking Trends Chart
    const btCtx = document.getElementById('bookingTrendChart');
    if (btCtx) new Chart(btCtx, {
      type: 'bar',
      data: {
        labels: ['Oct','Nov','Dec','Jan','Feb','Mar'],
        datasets: [
          { label:'Direct',   data:[45,52,48,65,58,72], backgroundColor:'rgba(59,130,246,0.8)', borderRadius:4 },
          { label:'B2B',      data:[28,35,30,40,38,45], backgroundColor:'rgba(16,185,129,0.8)', borderRadius:4 },
          { label:'OTA',      data:[20,25,22,30,28,35], backgroundColor:'rgba(245,158,11,0.8)', borderRadius:4 },
          { label:'Walk-in',  data:[12,15,18,20,15,22], backgroundColor:'rgba(139,92,246,0.8)', borderRadius:4 },
        ]
      },
      options: { responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{ size:10 } } } },
        scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{font:{size:10}} }, y:{ stacked:true, ticks:{font:{size:10}}, grid:{color:'rgba(0,0,0,0.05)'} } } }
    });

    // Channel Distribution Chart
    const cdCtx = document.getElementById('channelChart');
    if (cdCtx) new Chart(cdCtx, {
      type: 'doughnut',
      data: {
        labels: ['Direct','B2B','OTA','Walk-in','Phone'],
        datasets: [{ data:[38,22,18,14,8], backgroundColor:['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899'] }]
      },
      options: { responsive:true, cutout:'65%',
        plugins:{ legend:{ position:'bottom', labels:{ font:{ size:10 }, boxWidth:12 } } } }
    });

    // Revenue Chart
    const rvCtx = document.getElementById('revenueChart');
    if (rvCtx) new Chart(rvCtx, {
      type: 'line',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [
          { label:'Room Revenue', data:[45000,52000,48000,65000,78000,92000,87000],
            borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', fill:true, tension:0.4, pointRadius:3 },
          { label:'F&B Revenue', data:[12000,15000,11000,18000,22000,28000,24000],
            borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.1)', fill:true, tension:0.4, pointRadius:3 },
        ]
      },
      options: { responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{ size:10 } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{font:{size:10}} }, y:{ ticks:{font:{size:10}, callback: v => '৳'+Math.round(v/1000)+'K' }, grid:{color:'rgba(0,0,0,0.05)'} } } }
    });

    // Occupancy Chart
    const ocCtx = document.getElementById('occupancyChart');
    if (ocCtx) new Chart(ocCtx, {
      type: 'bar',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{ label:'Occupancy %', data:[62,58,71,75,88,95,82],
          backgroundColor: [62,58,71,75,88,95,82].map(v =>
            v >= 80 ? 'rgba(16,185,129,0.8)' : v >= 60 ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.8)'),
          borderRadius: 6 }]
      },
      options: { responsive:true, plugins:{ legend:{ display:false } },
        scales:{ x:{ grid:{display:false}, ticks:{font:{size:10}} },
          y:{ max:100, ticks:{font:{size:10}, callback: v => v+'%'}, grid:{color:'rgba(0,0,0,0.05)'} } } }
    });
  </script>
  `

  return c.html(adminLayout('Dashboard', content, 'dashboard'))
})
