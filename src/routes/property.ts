import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const propertyRoute = new Hono()

// ─── Shared Data ───────────────────────────────────────────────────────────────
const roomCategories = [
  {
    name: 'Standard',
    count: 5,
    rooms: [
      { num: '101', status: 'available', guest: null,     dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '102', status: 'available', guest: null,     dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '103', status: 'booked',    guest: 'Sarah Khan',  dep: 'Tmrw', features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '104', status: 'dirty',     guest: null,     dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','AC'] },
      { num: '105', status: 'available', guest: null,     dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
    ]
  },
  {
    name: 'Deluxe',
    count: 5,
    rooms: [
      { num: '201', status: 'booked',    guest: 'Rakib Hasan',  dep: 'Tmrw', features: ['King','City'],   amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '202', status: 'available', guest: null,     dep: null,      features: ['King','City'],   amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '203', status: 'booked',    guest: 'Absar Uddin', dep: 'Tmrw', features: ['King','City'],   amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '204', status: 'checkin',   guest: 'Sarah Khan',  dep: '2 PM', features: ['King','City'],   amenities: ['King Bed','320 sqft','City View','AC'] },
      { num: '205', status: 'available', guest: null,     dep: null,      features: ['King','City'],   amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
    ]
  },
  {
    name: 'Super Deluxe',
    count: 4,
    rooms: [
      { num: '301', status: 'booked',    guest: 'Rakib Hasan',  dep: 'Tmrw', features: ['King','Pool'],  amenities: ['King Bed','400 sqft','Pool View','Free Wifi'] },
      { num: '302', status: 'dirty',     guest: null,     dep: null,      features: ['King','Pool'],  amenities: ['King Bed','400 sqft','Pool View','AC'] },
      { num: '303', status: 'checkin',   guest: 'John Doe',    dep: '2 PM', features: ['King','Pool'],  amenities: ['King Bed','400 sqft','Pool View','Free Wifi'] },
      { num: '304', status: 'dirty',     guest: null,     dep: null,      features: ['King','Pool'],  amenities: ['King Bed','400 sqft','Pool View','AC'] },
    ]
  },
  {
    name: 'Deluxe Couple',
    count: 4,
    rooms: [
      { num: '401', status: 'available', guest: null,          dep: null,   features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
      { num: '402', status: 'booked',    guest: 'Tanvir Ahmed', dep: 'Tmrw', features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
      { num: '403', status: 'booked',    guest: 'Rakib Hasan',  dep: 'Tmrw', features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','AC'] },
      { num: '404', status: 'available', guest: null,          dep: null,   features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
    ]
  },
]

// Status config: card border/bg, action button style & label, icon
function roomCardConfig(status: string) {
  const map: Record<string, {border:string, bg:string, badge:string, badgeText:string, action:string, actionClass:string, icon:string}> = {
    available: { border:'border-gray-200', bg:'bg-white',       badge:'bg-green-50 border-green-200',  badgeText:'',           action:'+ BOOK',    actionClass:'text-green-500 hover:text-green-700', icon:'fa-check text-green-400' },
    booked:    { border:'border-purple-200', bg:'bg-purple-50', badge:'bg-purple-50 border-purple-200',badgeText:'Occupied',   action:'MANAGE',    actionClass:'text-purple-600 hover:text-purple-800', icon:'fa-user text-purple-400' },
    dirty:     { border:'border-red-200',  bg:'bg-red-50',      badge:'bg-red-50 border-red-200',      badgeText:'Dirty',      action:'CLEAN',     actionClass:'text-red-500 hover:text-red-700', icon:'fa-broom text-red-400' },
    checkin:   { border:'border-blue-200', bg:'bg-blue-50',     badge:'bg-blue-50 border-blue-200',    badgeText:'Due In',     action:'CHECK IN',  actionClass:'text-blue-500 hover:text-blue-700', icon:'fa-sign-in-alt text-blue-400' },
    checkout:  { border:'border-orange-200',bg:'bg-orange-50',  badge:'bg-orange-50 border-orange-200',badgeText:'Due Out',    action:'CHECK OUT', actionClass:'text-orange-500 hover:text-orange-700', icon:'fa-sign-out-alt text-orange-400' },
    maintenance:{ border:'border-gray-300',bg:'bg-gray-100',    badge:'bg-gray-100 border-gray-300',   badgeText:'Maint',      action:'SCHEDULE',  actionClass:'text-gray-500 hover:text-gray-700', icon:'fa-wrench text-gray-400' },
    hold:      { border:'border-yellow-200',bg:'bg-yellow-50',  badge:'bg-yellow-50 border-yellow-200',badgeText:'On Hold',    action:'RELEASE',   actionClass:'text-yellow-600 hover:text-yellow-700', icon:'fa-pause text-yellow-400' },
  }
  return map[status] || map['available']
}

function roomCard(room: typeof roomCategories[0]['rooms'][0]): string {
  const cfg = roomCardConfig(room.status)
  const featTags = room.features.map(f => `<span class="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 bg-white leading-none">${f}</span>`).join('')
  const guestLine = room.guest ? `<div class="text-sm font-semibold text-gray-800 leading-tight">${room.guest}</div>` : `<div class="text-xs text-gray-400 mt-1">Empty</div>`
  const depLine = room.dep ? `<div class="text-xs text-gray-500">Dep: ${room.dep}</div>` : ''
  return `
  <div class="rounded-xl border ${cfg.border} ${cfg.bg} p-3 cursor-pointer hover:shadow-md transition-shadow min-h-[110px] flex flex-col justify-between"
       onclick="openRoomModal('${room.num}','${room.status}')">
    <div>
      <div class="flex items-start justify-between mb-1">
        <span class="font-bold text-gray-800 text-base">${room.num}</span>
        <i class="fas ${cfg.icon} text-sm mt-0.5"></i>
      </div>
      ${guestLine}${depLine}
      <div class="flex flex-wrap gap-1 mt-2">${featTags}</div>
    </div>
    <div class="mt-2 pt-1.5 border-t border-gray-200 text-right">
      <button class="text-xs font-semibold ${cfg.actionClass}" onclick="event.stopPropagation(); openRoomModal('${room.num}','${room.status}')">${cfg.action}</button>
    </div>
  </div>`
}

// ─── Room Availability Dashboard (Property Overview) ─────────────────────────
propertyRoute.get('/overview', (c) => {
  const categoryGrid = roomCategories.map(cat => `
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-3">
      <h3 class="text-base font-bold text-gray-800">${cat.name}</h3>
      <span class="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">${cat.count} Units</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      ${cat.rooms.map(r => roomCard(r)).join('')}
    </div>
  </div>
  `).join('')

  const content = `
  ${pageHeader('Room Availability', 'Live room status — click any card to manage', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <a href="/property/create-room" class="btn-secondary"><i class="fas fa-bed"></i>Add Room</a>
    <a href="/calendar" class="btn-secondary"><i class="fas fa-calendar"></i>Calendar</a>
  `)}

  <!-- Legend + Stats Bar -->
  <div class="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
    <div class="flex flex-wrap gap-3 text-xs">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-green-400 inline-block"></span>Available</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-purple-400 inline-block"></span>Occupied</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-blue-400 inline-block"></span>Check-In Today</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-orange-400 inline-block"></span>Check-Out Today</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-red-400 inline-block"></span>Dirty/Clean</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-yellow-400 inline-block"></span>Hold</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-gray-400 inline-block"></span>Maintenance</span>
    </div>
    <div class="flex gap-4 text-xs font-semibold">
      <span class="text-green-600">18 Available</span>
      <span class="text-purple-600">12 Occupied</span>
      <span class="text-red-500">4 Dirty</span>
      <span class="text-blue-500">3 Due In</span>
    </div>
  </div>

  <!-- Category-Grouped Room Cards -->
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    ${categoryGrid}
  </div>

  <!-- ═══════════════════ MODALS ═══════════════════ -->

  <!-- 1. Available Room Modal -->
  <div id="modalAvailable" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Manage Room <span id="modalAvailRoomNum" class="text-green-600">101</span></h3>
        </div>
        <button onclick="closeModal('modalAvailable')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <!-- Room Features -->
        <div class="bg-green-50 border border-green-200 rounded-xl p-4">
          <p class="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Room Features</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <span><i class="fas fa-bed text-green-600 mr-2"></i>Double Bed</span>
            <span><i class="fas fa-mountain text-green-600 mr-2"></i>Garden View</span>
            <span><i class="fas fa-ruler-combined text-green-600 mr-2"></i>250 sqft</span>
            <span><i class="fas fa-wifi text-green-600 mr-2"></i>Free Wifi</span>
          </div>
        </div>
        <!-- Status Pills -->
        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Update Room Status</p>
          <div class="flex flex-wrap gap-2" id="availStatusPills">
            ${['Available','Booked','Confirmed','Checked In','Hold','Pending','Checked Out','Dirty'].map((s,i) =>
              `<button onclick="selectStatusPill(this,'availStatusPills')" class="status-pill ${i===0?'status-pill-active':''} px-3 py-1.5 rounded-full border text-sm transition">${s}</button>`
            ).join('')}
          </div>
        </div>
        <!-- Update Btn -->
        <button onclick="showToast('Room status updated!','success'); closeModal('modalAvailable')"
          class="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl text-sm transition">
          Update to: Available
        </button>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('modalAvailable'); openModal('quickBookingModal')"
          class="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition">
          <i class="fas fa-plus mr-1"></i>+ New Booking
        </button>
        <button onclick="closeModal('modalAvailable'); openModal('blockHoldModal')"
          class="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition">
          Block / Hold
        </button>
      </div>
    </div>
  </div>

  <!-- 2. Occupied/Booked Room Modal -->
  <div id="modalOccupied" class="modal-overlay hidden">
    <div class="modal-container max-w-lg">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Room <span id="modalOccRoomNum" class="text-purple-600">102</span> Details</h3>
          <p class="text-xs text-gray-500">Booking Info &amp; Operations</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="closeModal('modalOccupied'); openModal('quickBookingModal')"
            class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + New Booking
          </button>
          <button onclick="closeModal('modalOccupied')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <!-- 1. Guest Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-blue-700 uppercase tracking-wide">1. Guest Information</p>
            <div class="flex gap-2">
              <button onclick="openModal('assignRoomsModal')" class="text-xs border border-dashed border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition">
                <i class="fas fa-layer-group mr-1"></i>Assign (2)
              </button>
              <button class="text-xs border border-dashed border-gray-300 text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition">
                View details
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><p class="text-xs text-gray-500">Guest Name</p><p class="font-semibold text-gray-800">Rakib Hasan</p></div>
            <div><p class="text-xs text-gray-500">Contact</p><p class="font-semibold text-gray-800">01711-000000</p></div>
            <div><p class="text-xs text-gray-500">Check-in</p><p class="font-semibold text-gray-800">04/10/2026</p></div>
            <div><p class="text-xs text-gray-500">Check-out</p><p class="font-semibold text-gray-800">06/10/2026</p></div>
            <div><p class="text-xs text-gray-500">Pax</p><p class="font-semibold text-gray-800">2 Adults</p></div>
            <div><p class="text-xs text-gray-500">Source</p><p class="font-semibold text-gray-800">Walk-in</p></div>
          </div>
        </div>

        <!-- 2. Payment Info -->
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p class="text-xs font-bold text-orange-700 uppercase tracking-wide mb-3">2. Payment Information</p>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-500 mb-1">Room Rent</p>
              <p class="text-lg font-bold text-orange-700">৳ 2,000</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Advance</p>
              <p class="text-lg font-bold text-orange-700">৳ 500</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Due</p>
              <p class="text-lg font-bold text-red-600">৳ 1,500</p>
            </div>
          </div>
        </div>

        <!-- 3. Status Update -->
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-gray-600 uppercase mb-2">3. Update Room Status</p>
          <div class="flex flex-wrap gap-2 mb-3" id="occStatusPills">
            ${['Available','Booked','Confirmed','Checked In','Hold','Pending','Checked Out','Dirty'].map((s,i) =>
              `<button onclick="selectStatusPill(this,'occStatusPills')" class="status-pill ${i===2?'status-pill-active':''} px-3 py-1.5 rounded-full border text-sm transition">${s}</button>`
            ).join('')}
          </div>
          <button onclick="showToast('Status updated!','success')"
            class="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
            Update to: Confirmed
          </button>
        </div>

        <!-- 4. Quick Actions -->
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-gray-500 uppercase text-center mb-3">4. Quick Actions</p>
          <div class="flex justify-center gap-6">
            <button onclick="openModal('recordPaymentModal')" class="w-10 h-10 rounded-full border border-gray-200 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center transition" title="Payment"><i class="fas fa-credit-card text-gray-500"></i></button>
            <button class="w-10 h-10 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-300 flex items-center justify-center transition" title="Edit"><i class="fas fa-pen text-gray-500"></i></button>
            <button class="w-10 h-10 rounded-full border border-gray-200 hover:bg-purple-50 hover:border-purple-300 flex items-center justify-center transition" title="View"><i class="fas fa-eye text-gray-500"></i></button>
            <button onclick="showToast('Booking deleted','error')" class="w-10 h-10 rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition" title="Delete"><i class="fas fa-trash text-gray-500"></i></button>
          </div>
        </div>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('modalOccupied')"
          class="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition">
          Close
        </button>
        <button onclick="openModal('transferRoomModal'); closeModal('modalOccupied')"
          class="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition">
          <i class="fas fa-exchange-alt mr-1"></i>Transfer Room
        </button>
      </div>
    </div>
  </div>

  <!-- 3. Dirty / Maintenance Modal -->
  <div id="modalDirty" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Manage <span id="modalDirtyRoomNum" class="text-blue-600">104</span></h3>
          <p class="text-xs text-gray-500">Standard Room</p>
        </div>
        <button onclick="closeModal('modalDirty')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <!-- Features -->
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Room Features</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <span><i class="fas fa-bed text-blue-500 mr-2"></i>Double Bed</span>
            <span><i class="fas fa-mountain text-blue-500 mr-2"></i>Garden</span>
            <span><i class="fas fa-ruler-combined text-blue-500 mr-2"></i>250 sqft</span>
            <span><i class="fas fa-users text-blue-500 mr-2"></i>Max 2 Pax</span>
            <span><i class="fas fa-wifi text-blue-500 mr-2"></i>Free Wifi</span>
            <span><i class="fas fa-snowflake text-blue-500 mr-2"></i>AC</span>
          </div>
        </div>
        <!-- Status Warning -->
        <div class="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
          <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
          <p class="text-sm text-gray-700">Status: <strong>Dirty</strong>. Housekeeping required.</p>
        </div>
        <!-- Actions -->
        <div class="grid grid-cols-2 gap-3">
          <button onclick="showToast('Room marked as Ready!','success'); closeModal('modalDirty')"
            class="py-3 border border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-sm text-gray-700 transition">
            Mark Ready
          </button>
          <button onclick="openModal('maintenanceModal'); closeModal('modalDirty')"
            class="py-3 border border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-sm text-gray-700 transition flex items-center justify-center gap-2">
            <i class="fas fa-wrench text-gray-500"></i>Maintenance
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Check-In Due Modal -->
  <div id="modalCheckIn" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Check-In Room <span id="modalCIRoomNum" class="text-blue-600">204</span></h3>
          <p class="text-xs text-gray-500">Guest due for check-in today</p>
        </div>
        <button onclick="closeModal('modalCheckIn')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><p class="text-xs text-gray-500">Guest</p><p class="font-semibold">Sarah Khan</p></div>
            <div><p class="text-xs text-gray-500">Check-in Time</p><p class="font-semibold text-blue-600">2:00 PM</p></div>
            <div><p class="text-xs text-gray-500">Category</p><p class="font-semibold">Deluxe Room</p></div>
            <div><p class="text-xs text-gray-500">Pax</p><p class="font-semibold">2 Adults</p></div>
            <div><p class="text-xs text-gray-500">Booking ID</p><p class="font-mono text-xs text-purple-600 font-bold">BK-2026-014</p></div>
            <div><p class="text-xs text-gray-500">Payment</p><p class="font-semibold text-green-600">Paid in Full</p></div>
          </div>
        </div>
        <button onclick="showToast('Guest checked in successfully!','success'); closeModal('modalCheckIn')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition">
          <i class="fas fa-sign-in-alt mr-2"></i>Confirm Check-In
        </button>
        <button onclick="closeModal('modalCheckIn')" class="w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
      </div>
    </div>
  </div>

  <!-- 5. Block/Hold Modal -->
  <div id="blockHoldModal" class="modal-overlay hidden">
    <div class="modal-container max-w-sm">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Block / Hold Room</h3>
        <button onclick="closeModal('blockHoldModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Reason *</label>
          <select class="form-input">
            <option>Maintenance</option><option>Staff Use</option><option>Owner Block</option><option>Deep Cleaning</option><option>Other</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">From Date</label><input type="date" class="form-input"></div>
          <div><label class="form-label">To Date</label><input type="date" class="form-input"></div>
        </div>
        <div>
          <label class="form-label">Notes</label>
          <textarea class="form-input" rows="2" placeholder="Additional notes..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('blockHoldModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Room blocked/held!','success'); closeModal('blockHoldModal')" class="btn-primary">Confirm Block</button>
      </div>
    </div>
  </div>

  <!-- 6. Maintenance Modal -->
  <div id="maintenanceModal" class="modal-overlay hidden">
    <div class="modal-container max-w-sm">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Raise Maintenance Request</h3>
        <button onclick="closeModal('maintenanceModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Issue Type *</label>
          <select class="form-input">
            <option>Plumbing</option><option>Electrical</option><option>AC / HVAC</option><option>Furniture</option><option>Deep Cleaning</option><option>Other</option>
          </select>
        </div>
        <div><label class="form-label">Priority</label>
          <select class="form-input"><option>Normal</option><option>Urgent</option><option>Critical</option></select>
        </div>
        <div><label class="form-label">Description *</label>
          <textarea class="form-input" rows="3" placeholder="Describe the issue..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('maintenanceModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Maintenance request raised!','success'); closeModal('maintenanceModal')" class="btn-primary"><i class="fas fa-wrench mr-1"></i>Submit Request</button>
      </div>
    </div>
  </div>

  <!-- 7. Transfer Room Modal -->
  <div id="transferRoomModal" class="modal-overlay hidden">
    <div class="modal-container max-w-sm">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-exchange-alt text-purple-500 mr-2"></i>Transfer Room</h3>
        <button onclick="closeModal('transferRoomModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="bg-purple-50 rounded-xl p-3 text-sm text-gray-700">
          <strong>Current:</strong> Room 201 — Rakib Hasan (Deluxe)
        </div>
        <div>
          <label class="form-label">Transfer to Room *</label>
          <select class="form-input">
            <option>Select available room</option>
            <option>202 — Deluxe (Available)</option>
            <option>205 — Deluxe (Available)</option>
            <option>101 — Standard (Available)</option>
          </select>
        </div>
        <div><label class="form-label">Reason for Transfer</label>
          <select class="form-input"><option>Guest Request</option><option>Maintenance Issue</option><option>Upgrade</option><option>Downgrade</option></select>
        </div>
        <div><label class="form-label">Notes</label><textarea class="form-input" rows="2" placeholder="Notes..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('transferRoomModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Room transferred!','success'); closeModal('transferRoomModal')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Confirm Transfer</button>
      </div>
    </div>
  </div>

  <!-- 8. Assign Rooms Modal (Category-Based Booking Assignment) -->
  <div id="assignRoomsModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Assign Rooms</h3>
        <button onclick="closeModal('assignRoomsModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <!-- Booking Summary -->
        <div class="flex items-center justify-between bg-gray-50 rounded-xl p-3">
          <div>
            <p class="text-sm font-semibold text-gray-800">Guest: <span class="text-blue-600">Absar Uddin</span></p>
            <p class="text-xs text-gray-500 mt-0.5">Request: <span class="font-semibold">2x Deluxe</span></p>
          </div>
          <button class="text-xs text-blue-600 underline hover:text-blue-700">View details</button>
        </div>

        <!-- Room Assignment Inputs -->
        <div id="roomAssignmentInputs" class="space-y-3">
          <div>
            <label class="form-label">Room 1</label>
            <input type="text" class="form-input" placeholder="e.g. 301" list="availableRoomsList">
          </div>
          <div>
            <label class="form-label">Room 2</label>
            <input type="text" class="form-input" placeholder="e.g. 302" list="availableRoomsList">
          </div>
        </div>

        <datalist id="availableRoomsList">
          <option value="202">202 — Deluxe (Available)</option>
          <option value="205">205 — Deluxe (Available)</option>
          <option value="101">101 — Standard (Available)</option>
          <option value="102">102 — Standard (Available)</option>
          <option value="401">401 — Deluxe Couple (Available)</option>
        </datalist>

        <!-- Info Note -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
          <i class="fas fa-info-circle mr-1"></i>
          Assigning rooms will update the booking status to <strong>Confirmed</strong> and notify the guest.
        </div>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('assignRoomsModal')" class="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
        <button onclick="confirmRoomAssignment()"
          class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition">
          Confirm Assignment
        </button>
      </div>
    </div>
  </div>

  <!-- 9. Quick / New Booking Modal — CATEGORY-BASED -->
  <div id="quickBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl" style="max-height:90vh;overflow-y:auto;">
      <div class="modal-header sticky top-0 bg-white z-10 border-b">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-plus text-white text-xs"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Quick New Booking</h3>
        </div>
        <button onclick="closeModal('quickBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-5">

        <!-- Guest Info -->
        <div>
          <div>
            <label class="form-label">Guest Name *</label>
            <div class="relative">
              <input type="text" id="qb_name" class="form-input pr-10" placeholder="Full name">
              <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"><i class="fas fa-ellipsis-h"></i></button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Phone Number *</label>
              <input type="tel" id="qb_phone" class="form-input" placeholder="+1 000 000 0000">
            </div>
            <div>
              <label class="form-label">Email</label>
              <input type="email" id="qb_email" class="form-input" placeholder="guest@email.com">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="form-label">Address</label>
              <input type="text" id="qb_address" class="form-input" placeholder="Enter address">
            </div>
            <div>
              <label class="form-label">Date of Birth</label>
              <input type="date" id="qb_dob" class="form-input">
            </div>
          </div>
        </div>

        <hr class="border-gray-100">

        <!-- Stay Info -->
        <div class="space-y-4">
          <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Stay Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Location *</label>
              <select id="qb_location" class="form-input">
                <option>Cox's Bazar</option><option>Dhaka</option><option>Sylhet</option><option>Chittagong</option>
              </select>
            </div>
            <div>
              <label class="form-label">Property *</label>
              <select id="qb_property" class="form-input">
                <option>Select property</option>
                <option>Grand Palace Hotel</option><option>Ocean View Resort</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Room Category / Type *</label>
              <select id="qb_category" class="form-input" onchange="updateBookingSummary()">
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
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <input type="number" id="qb_rooms" class="flex-1 px-3 py-2 text-sm focus:outline-none" value="1" min="1" max="10" onchange="updateBookingSummary()">
                <button class="px-3 py-2 bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg font-bold leading-none" onclick="document.getElementById('qb_rooms').stepUp(); updateBookingSummary()">+</button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Adults *</label>
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <input type="number" id="qb_adults" class="flex-1 px-3 py-2 text-sm focus:outline-none" value="2" min="1">
                <button class="px-3 py-2 bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg font-bold leading-none" onclick="document.getElementById('qb_adults').stepUp()">+</button>
              </div>
            </div>
            <div>
              <label class="form-label">Child</label>
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <input type="number" id="qb_children" class="flex-1 px-3 py-2 text-sm focus:outline-none" value="0" min="0">
                <button class="px-3 py-2 bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg font-bold leading-none" onclick="document.getElementById('qb_children').stepUp()">+</button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Check-in Date *</label>
              <input type="date" id="qb_checkin" class="form-input" onchange="updateBookingSummary()">
            </div>
            <div>
              <label class="form-label">Check-out Date *</label>
              <input type="date" id="qb_checkout" class="form-input" onchange="updateBookingSummary()">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Reference Code</label>
              <input type="text" id="qb_ref" class="form-input bg-gray-50 text-gray-400" value="AG-98922" readonly>
            </div>
            <div>
              <label class="form-label">Active Promo</label>
              <div class="flex gap-2 flex-wrap">
                <button onclick="togglePromo(this,'PROMO-1',858)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition">PROMO-1</button>
                <button onclick="togglePromo(this,'PROMO-2',0)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition">PROMO-2</button>
                <button onclick="togglePromo(this,'PROMO-3',0)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition">PROMO-3</button>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100">

        <!-- Payment Summary + Method -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Payment Summary -->
          <div>
            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Payment Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-600"><span>Room fare</span><span id="ps_fare">BDT 0</span></div>
              <div class="flex justify-between text-gray-600"><span>Applied promo discount</span><span id="ps_discount" class="text-red-500">- BDT 0</span></div>
              <div class="flex justify-between text-gray-600"><span>VAT (7.5%)</span><span id="ps_vat">BDT 0</span></div>
              <div class="flex justify-between font-bold text-gray-800 border-t pt-2 mt-2"><span>Total payable amount</span><span id="ps_total">BDT 0</span></div>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Booking Summary</h4>
            <!-- Tabs -->
            <div class="flex mb-4 border-b border-gray-200">
              <button onclick="switchPayTab('bkash')" id="tab_bkash" class="pay-tab active-pay-tab flex-1 py-2 text-sm font-semibold text-white bg-pink-500 rounded-tl-xl rounded-tr-none rounded-b-none">bKash transfer</button>
              <button onclick="switchPayTab('bank')" id="tab_bank" class="pay-tab flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-tr-xl rounded-tl-none rounded-b-none">Bank transfer</button>
            </div>

            <!-- bKash Panel -->
            <div id="panel_bkash" class="space-y-3">
              <div class="border border-pink-200 rounded-xl p-3 bg-pink-50">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
                    <i class="fas fa-mobile-alt text-white text-xs"></i>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-pink-700">bKash payment</p>
                    <p class="text-xs text-gray-500">Fast, Secure mobile payments</p>
                  </div>
                  <i class="fas fa-check-circle text-green-500 ml-auto"></i>
                </div>
                <div class="flex items-start gap-3">
                  <div class="text-xs text-gray-600 flex-1">
                    <p class="font-semibold mb-1">Payment Instructions:</p>
                    <p>1. Open your bKash app</p>
                    <p>2. Send Money to: xxxxxxxxxx</p>
                    <p>3. Amount: BDT 5,000</p>
                    <p>4. Enter the Transaction ID below after payment</p>
                  </div>
                  <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 text-xs text-gray-400">QR</div>
                </div>
              </div>
              <div>
                <label class="form-label">Sender bKash number *</label>
                <input type="text" class="form-input" placeholder="Enter bkash number">
              </div>
              <div>
                <label class="form-label">bKash transaction ID *</label>
                <input type="text" class="form-input" placeholder="Enter transaction ID">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="form-label">Paid amount</label>
                  <input type="number" id="qb_paid" class="form-input" placeholder="0" oninput="updateDue()">
                </div>
                <div>
                  <label class="form-label">Due</label>
                  <input type="number" id="qb_due" class="form-input bg-red-50 text-red-600 font-semibold" placeholder="0" readonly>
                </div>
              </div>
            </div>

            <!-- Bank Panel (hidden) -->
            <div id="panel_bank" class="hidden space-y-3">
              <div class="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                <p class="font-semibold">Bank Transfer Details:</p>
                <p>Bank: BRAC Bank Ltd</p>
                <p>Account: 1234567890</p>
                <p>Routing: 070274782</p>
              </div>
              <div><label class="form-label">Transaction / Ref No. *</label><input type="text" class="form-input" placeholder="Enter reference number"></div>
              <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Paid amount</label><input type="number" class="form-input" placeholder="0"></div>
                <div><label class="form-label">Due</label><input type="number" class="form-input bg-red-50 text-red-600" placeholder="0" readonly></div>
              </div>
            </div>

            <!-- Terms -->
            <div class="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p class="text-xs font-bold text-yellow-800 mb-1">TERMS &amp; CONDITIONS</p>
              <ol class="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                <li>All bookings must be confirmed with advance payment via our official bKash number.</li>
                <li>Cancellations made 72 hours before check-in are fully refundable; later cancellations may be partially or non-refundable.</li>
                <li>By completing payment, you agree to our booking terms...</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white border-t px-5 py-4 flex items-center justify-between gap-3">
        <p class="text-xs text-gray-500"><i class="fas fa-info-circle text-blue-400 mr-1"></i>Rate will be calculated automatically</p>
        <div class="flex gap-3">
          <button onclick="closeModal('quickBookingModal')" class="btn-secondary">Cancel</button>
          <button onclick="submitNewBooking()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition">
            Create Booking
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 10. Record Payment Modal -->
  <div id="recordPaymentModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-credit-card text-blue-500 mr-2"></i>Record Payment</h3>
        <button onclick="closeModal('recordPaymentModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Booking ID</label><input class="form-input" value="BK-2026-001" readonly></div>
          <div><label class="form-label">Guest Name</label><input class="form-input" value="Rakib Hasan" readonly></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Amount *</label><input type="number" class="form-input" placeholder="0.00"></div>
          <div><label class="form-label">Payment Method *</label>
            <select class="form-input"><option>Cash</option><option>bKash</option><option>Card</option><option>Bank Transfer</option></select>
          </div>
        </div>
        <div><label class="form-label">Transaction ID</label><input type="text" class="form-input" placeholder="Optional"></div>
        <div><label class="form-label">Notes</label><textarea class="form-input" rows="2" placeholder="Any notes..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('recordPaymentModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Payment recorded!','success'); closeModal('recordPaymentModal')" class="btn-primary">Record Payment</button>
      </div>
    </div>
  </div>

  <!-- ═══ JavaScript ═══ -->
  <style>
    .status-pill { cursor:pointer; font-size:0.8rem; }
    .status-pill-active { background:#111827; color:#fff; border-color:#111827 !important; }
    .active-pay-tab { background:#ec4899; color:#fff; }
  </style>

  <script>
    // Open correct modal based on room status
    function openRoomModal(roomNum, status) {
      const statusMap = {
        available: 'modalAvailable',
        booked: 'modalOccupied',
        dirty: 'modalDirty',
        checkin: 'modalCheckIn',
        checkout: 'modalOccupied',
        maintenance: 'modalDirty',
      };
      const modalId = statusMap[status] || 'modalAvailable';
      // Update room number in modal title
      const numEls = {
        modalAvailable: 'modalAvailRoomNum',
        modalOccupied: 'modalOccRoomNum',
        modalDirty: 'modalDirtyRoomNum',
        modalCheckIn: 'modalCIRoomNum',
      };
      if (numEls[modalId]) {
        const el = document.getElementById(numEls[modalId]);
        if (el) el.textContent = roomNum;
      }
      openModal(modalId);
    }

    // Status pill selector
    function selectStatusPill(btn, groupId) {
      const container = document.getElementById(groupId);
      if (!container) return;
      container.querySelectorAll('.status-pill').forEach(p => p.classList.remove('status-pill-active'));
      btn.classList.add('status-pill-active');
      const updateBtn = container.closest('.modal-container')?.querySelector('button[onclick*="Update to"]');
      // Update the "Update to:" button text
      const statusBtns = container.closest('.space-y-3, .space-y-4')?.querySelectorAll('button[onclick*="Update to"]') || [];
      document.querySelectorAll('[onclick*="Update to:"]').forEach(b => {
        if (b.closest('.modal-container') === btn.closest('.modal-container')) {
          b.textContent = 'Update to: ' + btn.textContent;
        }
      });
    }

    // Payment tab switcher
    function switchPayTab(tab) {
      const tabs = ['bkash','bank'];
      tabs.forEach(t => {
        const tabEl = document.getElementById('tab_'+t);
        const panelEl = document.getElementById('panel_'+t);
        if (t === tab) {
          tabEl.classList.add('active-pay-tab');
          tabEl.classList.remove('text-gray-600','bg-gray-100');
          tabEl.classList.add('text-white','bg-pink-500');
          panelEl.classList.remove('hidden');
        } else {
          tabEl.classList.remove('active-pay-tab','text-white','bg-pink-500');
          tabEl.classList.add('text-gray-600','bg-gray-100');
          panelEl.classList.add('hidden');
        }
      });
    }

    // Toggle promo
    let activePromoDiscount = 858;
    function togglePromo(btn, code, discount) {
      const isActive = btn.classList.contains('bg-green-500');
      if (isActive) {
        btn.classList.remove('bg-green-500','text-white');
        btn.classList.add('bg-gray-200','text-gray-600');
        activePromoDiscount = 0;
      } else {
        document.querySelectorAll('.promo-tag').forEach(b => {
          b.classList.remove('bg-green-500','text-white');
          b.classList.add('bg-gray-200','text-gray-600');
        });
        btn.classList.remove('bg-gray-200','text-gray-600');
        btn.classList.add('bg-green-500','text-white');
        activePromoDiscount = discount;
      }
      updateBookingSummary();
    }

    // Booking summary calculator
    function updateBookingSummary() {
      const catSel = document.getElementById('qb_category');
      const cin = document.getElementById('qb_checkin')?.value;
      const cout = document.getElementById('qb_checkout')?.value;
      const rooms = parseInt(document.getElementById('qb_rooms')?.value) || 1;

      let rate = 0;
      if (catSel?.selectedOptions[0]) rate = parseInt(catSel.selectedOptions[0].dataset.rate) || 0;

      let nights = 0;
      if (cin && cout) {
        const d1 = new Date(cin), d2 = new Date(cout);
        nights = Math.max(0, Math.round((d2-d1)/(1000*60*60*24)));
      }

      const fare = rate * nights * rooms;
      const discount = Math.min(activePromoDiscount, fare);
      const vat = Math.round((fare - discount) * 0.075);
      const total = fare - discount + vat;

      document.getElementById('ps_fare').textContent = 'BDT ' + fare.toLocaleString();
      document.getElementById('ps_discount').textContent = '- BDT ' + discount.toLocaleString();
      document.getElementById('ps_vat').textContent = 'BDT ' + vat.toLocaleString();
      document.getElementById('ps_total').textContent = 'BDT ' + total.toLocaleString();

      // Store total for due calc
      window._bookingTotal = total;
      updateDue();
    }

    function updateDue() {
      const paid = parseFloat(document.getElementById('qb_paid')?.value) || 0;
      const total = window._bookingTotal || 0;
      const due = Math.max(0, total - paid);
      const dueEl = document.getElementById('qb_due');
      if (dueEl) dueEl.value = due;
    }

    // Submit booking — auto-assign if fully paid
    function submitNewBooking() {
      const name = document.getElementById('qb_name')?.value;
      const phone = document.getElementById('qb_phone')?.value;
      const cat = document.getElementById('qb_category')?.value;
      const cin = document.getElementById('qb_checkin')?.value;
      const cout = document.getElementById('qb_checkout')?.value;
      const total = window._bookingTotal || 0;
      const paid = parseFloat(document.getElementById('qb_paid')?.value) || 0;

      if (!name || !phone || !cat || !cin || !cout) {
        showToast('Please fill all required fields.', 'error'); return;
      }

      if (paid >= total && total > 0) {
        // Fully paid — auto-assign
        closeModal('quickBookingModal');
        showToast('Booking confirmed! Room auto-assigned (fully paid).', 'success');
      } else {
        // Partially paid — queue for manual assignment
        closeModal('quickBookingModal');
        showToast('Booking created! Pending room assignment by staff.', 'success');
        // After a delay, offer to open assignment modal
        setTimeout(() => {
          if (confirm('This booking is awaiting room assignment. Assign room now?')) {
            openModal('assignRoomsModal');
          }
        }, 600);
      }
    }

    // Confirm assignment
    function confirmRoomAssignment() {
      const inputs = document.querySelectorAll('#roomAssignmentInputs input');
      let allFilled = true;
      inputs.forEach(i => { if (!i.value.trim()) allFilled = false; });
      if (!allFilled) { showToast('Please assign all rooms.','error'); return; }
      closeModal('assignRoomsModal');
      showToast('Rooms assigned! Booking status → Confirmed.','success');
    }

    // Set default dates
    (function() {
      const today = new Date();
      const tom = new Date(today); tom.setDate(tom.getDate()+1);
      const fmt = d => d.toISOString().split('T')[0];
      const ci = document.getElementById('qb_checkin');
      const co = document.getElementById('qb_checkout');
      if (ci) ci.value = fmt(today);
      if (co) co.value = fmt(tom);
    })();
  </script>
  `
  return c.html(adminLayout('Room Availability', content, 'property', 'overview'))
})

// ─── Create Room ──────────────────────────────────────────────────────────────
propertyRoute.get('/create-room', (c) => {
  const content = `
  ${pageHeader('Create Room', 'Add a new room to your property inventory', `
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Room Information</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Room Number *</label>
            <input type="text" class="form-input" placeholder="e.g., 101">
          </div>
          <div>
            <label class="form-label">Room Category *</label>
            <select class="form-input">
              <option>Select category</option>
              <option>Standard</option><option>Deluxe</option><option>Super Deluxe</option>
              <option>Deluxe Couple</option><option>Suite</option><option>Presidential Suite</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Floor Number</label>
            <input type="number" class="form-input" placeholder="1">
          </div>
          <div>
            <label class="form-label">Room Size (sq ft)</label>
            <input type="number" class="form-input" placeholder="250">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">Max Adults *</label>
            <input type="number" class="form-input" value="2" min="1">
          </div>
          <div>
            <label class="form-label">Max Children</label>
            <input type="number" class="form-input" value="1" min="0">
          </div>
          <div>
            <label class="form-label">Bed Type *</label>
            <select class="form-input">
              <option>King Bed</option><option>Queen Bed</option><option>Double Bed</option>
              <option>Twin Beds</option><option>Single Bed</option>
            </select>
          </div>
        </div>

        <h4 class="font-medium text-gray-700 mt-4 border-t pt-4">Pricing</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Base Rate / Night *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">Weekend Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">B2B Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">OTA Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
        </div>

        <h4 class="font-medium text-gray-700 mt-2 border-t pt-4">Amenities</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${['Air Conditioning','WiFi','Flat Screen TV','Mini Bar','Safe','Bathtub','Balcony','Ocean View','Garden View','City View','Pool View','Coffee Maker','Hair Dryer','Iron & Board','Room Service'].map(a =>
            `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" class="rounded border-gray-300 text-blue-600"> ${a}</label>`
          ).join('')}
        </div>

        <div>
          <label class="form-label">Room Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe the room..."></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Room Status</label>
            <select class="form-input">
              <option>Available</option><option>Under Maintenance</option><option>Inactive</option>
            </select>
          </div>
          <div>
            <label class="form-label">Smoking Policy</label>
            <select class="form-input">
              <option>Non-Smoking</option><option>Smoking Allowed</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button type="submit" class="btn-primary" onclick="showToast('Room created successfully!', 'success'); return false;">
            <i class="fas fa-save"></i>Save Room
          </button>
          <button type="button" class="btn-secondary">Save & Add Another</button>
          <button type="reset" class="btn-secondary text-red-500">Reset</button>
        </div>
      </form>
    </div>

    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Room Images</h3>
        <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
          <p class="text-sm text-gray-500">Drop images here or click to upload</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
          <button type="button" class="btn-secondary btn-sm mt-3">Browse Files</button>
        </div>
      </div>
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Quick Guidelines</h3>
        <ul class="text-xs text-gray-500 space-y-1.5">
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Room number must be unique</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Set competitive base rates</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Add clear room description</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Upload high-quality images</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>B2B rate usually lower than base</li>
        </ul>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create Room', content, 'property', 'create-room'))
})

// ─── Create Category ──────────────────────────────────────────────────────────
propertyRoute.get('/create-category', (c) => {
  const content = `
  ${pageHeader('Create Category', 'Manage room types and categories', `
    <button onclick="openModal('createCategoryModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Category</button>
  `)}

  <div class="card mb-4">
    <div class="card-header">
      <h3 class="font-semibold text-gray-800">Room Categories</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Category Name</th>
            <th class="table-header">Rooms</th>
            <th class="table-header">Base Rate</th>
            <th class="table-header">Min Stay</th>
            <th class="table-header">Max Guests</th>
            <th class="table-header">Breakfast</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {name:'Standard', rooms:5, rate:'৳2,000', minStay:1, guests:2, breakfast:'Optional', status:'active'},
            {name:'Deluxe', rooms:5, rate:'৳3,500', minStay:1, guests:2, breakfast:'Included', status:'active'},
            {name:'Super Deluxe', rooms:4, rate:'৳5,000', minStay:2, guests:3, breakfast:'Included', status:'active'},
            {name:'Deluxe Couple', rooms:4, rate:'৳4,500', minStay:1, guests:2, breakfast:'Included', status:'active'},
            {name:'Suite', rooms:3, rate:'৳8,000', minStay:2, guests:4, breakfast:'Included', status:'active'},
          ].map(cat => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-medium text-gray-800">${cat.name}</td>
              <td class="table-cell">${cat.rooms}</td>
              <td class="table-cell font-semibold">${cat.rate}/night</td>
              <td class="table-cell">${cat.minStay} night${cat.minStay > 1 ? 's' : ''}</td>
              <td class="table-cell">${cat.guests} guests</td>
              <td class="table-cell"><span class="text-xs px-2 py-0.5 rounded ${cat.breakfast === 'Included' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${cat.breakfast}</span></td>
              <td class="table-cell">${statusBadge(cat.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 hover:text-blue-700 p-1" title="Edit"><i class="fas fa-edit text-xs"></i></button>
                  <button class="text-red-500 hover:text-red-600 p-1" title="Delete"><i class="fas fa-trash text-xs"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div id="createCategoryModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Create Room Category</h3>
        <button onclick="closeModal('createCategoryModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div><label class="form-label">Category Name *</label><input type="text" class="form-input" placeholder="e.g., Deluxe Ocean View"></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Base Rate / Night *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div><label class="form-label">Minimum Stay (nights)</label><input type="number" class="form-input" value="1" min="1"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Max Adults</label><input type="number" class="form-input" value="2" min="1"></div>
          <div><label class="form-label">Max Children</label><input type="number" class="form-input" value="1" min="0"></div>
        </div>
        <div><label class="form-label">Breakfast Policy</label>
          <select class="form-input"><option>Not Included</option><option>Included in Rate</option><option>Optional Add-on</option></select>
        </div>
        <div><label class="form-label">Category Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe this room category..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createCategoryModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Category created!','success'); closeModal('createCategoryModal')">Create Category</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create Category', content, 'property', 'create-category'))
})

// ─── Manage Website ───────────────────────────────────────────────────────────
propertyRoute.get('/manage-website', (c) => {
  const content = `
  ${pageHeader('Manage Website', 'Configure your public-facing hotel website', `
    <a href="/website" target="_blank" class="btn-secondary"><i class="fas fa-external-link-alt"></i>Preview Website</a>
    <button class="btn-primary" onclick="showToast('Changes saved!', 'success')"><i class="fas fa-save"></i>Save Changes</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
    <div class="lg:col-span-3 card p-5">
      <div class="tab-nav mb-5 overflow-x-auto">
        ${['General Info', 'Homepage', 'Rooms Page', 'Gallery', 'About Us', 'Contact & Map', 'SEO Settings', 'Booking Widget'].map((t, i) =>
          `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab-group="website" data-tab-id="website-tab-${i}" onclick="switchTab('website', 'website-tab-${i}')">${t}</button>`
        ).join('')}
      </div>
      <div id="website-tab-0" data-tab-content="website" class="tab-content active space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="form-label">Hotel/Property Name *</label><input type="text" class="form-input" value="Grand Palace Hotel"></div>
          <div><label class="form-label">Tagline</label><input type="text" class="form-input" value="Your Luxury Escape Awaits"></div>
          <div><label class="form-label">Primary Language</label><select class="form-input"><option>English</option><option>Bengali</option></select></div>
          <div><label class="form-label">Currency Display</label><select class="form-input"><option>BDT (৳)</option><option>USD ($)</option></select></div>
          <div><label class="form-label">Timezone</label><select class="form-input"><option>Asia/Dhaka</option><option>America/New_York</option></select></div>
        </div>
        <div><label class="form-label">Short Description</label><textarea class="form-input" rows="3">Experience unparalleled luxury at Grand Palace Hotel.</textarea></div>
      </div>
      ${[1,2,3,4,5,6,7].map(i => `<div id="website-tab-${i}" data-tab-content="website" class="tab-content"><p class="text-gray-500 text-sm p-4 text-center">Select this tab to configure settings</p></div>`).join('')}
    </div>
    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Website Status</h3>
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">Online Status</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
        <a href="/website" target="_blank" class="btn-primary w-full justify-center mt-3 text-sm"><i class="fas fa-globe"></i>Visit Website</a>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Manage Website', content, 'property', 'manage-website'))
})

// ─── Reviews ──────────────────────────────────────────────────────────────────
propertyRoute.get('/reviews', (c) => {
  const reviews = [
    {guest:'Sarah Johnson', room:'Deluxe', rating:5, date:'Mar 10, 2026', comment:'Absolutely amazing stay! The staff was incredibly welcoming and the room was spotless.', source:'TripAdvisor', replied:true},
    {guest:'Michael Brown', room:'Super Deluxe', rating:4, date:'Mar 8, 2026', comment:'Great location and lovely amenities. The breakfast was excellent.', source:'Booking.com', replied:true},
    {guest:'Emma Wilson', room:'Standard', rating:3, date:'Mar 5, 2026', comment:'Good value for money. AC was a bit noisy at night.', source:'Website', replied:false},
    {guest:'James Lee', room:'Suite', rating:5, date:'Mar 3, 2026', comment:'Exceptional experience! Will definitely return.', source:'Expedia', replied:true},
  ]
  const content = `
  ${pageHeader('Guest Reviews', 'Monitor and respond to guest reviews', `
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="card p-4 text-center"><div class="text-3xl font-bold text-gray-800">4.7</div><div class="text-yellow-400 my-1">★★★★★</div><div class="text-xs text-gray-500">Overall Rating</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800 mb-1">1,248</div><div class="text-xs text-gray-500">Total Reviews</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">87%</div><div class="text-xs text-gray-500 mt-1">Positive</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">76%</div><div class="text-xs text-gray-500 mt-1">Response Rate</div></div>
  </div>
  <div class="card">
    <div class="card-header"><h3 class="font-semibold text-gray-800">All Reviews</h3></div>
    <div class="divide-y divide-gray-50">
      ${reviews.map(r => `
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex gap-3 flex-1">
              <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">${r.guest.charAt(0)}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-medium text-gray-800 text-sm">${r.guest}</span>
                  <span class="text-gray-400 text-xs">· ${r.room} · ${r.date}</span>
                  <span class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">${r.source}</span>
                </div>
                <div class="text-yellow-400 text-xs my-1">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <p class="text-sm text-gray-600">${r.comment}</p>
                ${r.replied ? `<div class="mt-1 text-xs text-green-600"><i class="fas fa-reply"></i> Replied</div>` : ''}
              </div>
            </div>
            ${!r.replied ? `<button onclick="openModal('replyReviewModal')" class="btn-primary btn-sm text-xs"><i class="fas fa-reply mr-1"></i>Reply</button>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  <div id="replyReviewModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Reply to Review</h3>
        <button onclick="closeModal('replyReviewModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="bg-gray-50 rounded-lg p-3"><p class="text-sm text-gray-600 italic">"Good value for money. AC was a bit noisy at night."</p><div class="text-xs text-gray-400 mt-1">— Emma Wilson, Mar 5, 2026</div></div>
        <div><label class="form-label">Your Response *</label><textarea class="form-input" rows="4" placeholder="Write a professional response..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('replyReviewModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Reply posted!','success'); closeModal('replyReviewModal')">Post Reply</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Reviews', content, 'property', 'reviews'))
})

// ─── Create My Property ───────────────────────────────────────────────────────
propertyRoute.get('/create-property', (c) => {
  const content = `
  ${pageHeader('Create My Property', 'Set up a new property in the system', `
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Basic Property Information</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="form-label">Property Name *</label><input type="text" class="form-input" placeholder="e.g., Grand Palace Hotel & Resort"></div>
          <div><label class="form-label">Property Type *</label>
            <select class="form-input"><option>Hotel</option><option>Resort</option><option>Boutique Hotel</option><option>Guest House</option></select>
          </div>
          <div><label class="form-label">Star Rating</label>
            <select class="form-input"><option>Unrated</option>${[1,2,3,4,5].map(s => `<option>${s} Star</option>`).join('')}</select>
          </div>
          <div><label class="form-label">Phone Number *</label><input type="tel" class="form-input" placeholder="+880 1700-000000"></div>
          <div><label class="form-label">Email Address *</label><input type="email" class="form-input" placeholder="hotel@example.com"></div>
          <div class="col-span-2"><label class="form-label">Property Description *</label><textarea class="form-input" rows="4" placeholder="Describe your property..."></textarea></div>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" class="btn-primary" onclick="showToast('Basic info saved!','success')">Save & Next <i class="fas fa-arrow-right ml-1"></i></button>
          <button type="button" class="btn-secondary">Save Draft</button>
        </div>
      </form>
    </div>
    <div class="space-y-4">
      <div class="card p-4 bg-blue-50 border-blue-100">
        <div class="flex gap-2">
          <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <p class="text-xs text-blue-700">Complete all steps to activate your property. You can save as draft and complete later.</p>
        </div>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create My Property', content, 'property', 'create-property'))
})
