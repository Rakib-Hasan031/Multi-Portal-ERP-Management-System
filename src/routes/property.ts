import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const propertyRoute = new Hono()

// ─── Shared Room Data ─────────────────────────────────────────────────────────
const roomCategories = [
  {
    name: 'Standard', color: 'blue', count: 5, available: 3, rate: 2000,
    rooms: [
      { num: '101', status: 'available', guest: null,          dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '102', status: 'available', guest: null,          dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '103', status: 'booked',    guest: 'Sarah Khan',  dep: 'Tmrw',   features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
      { num: '104', status: 'dirty',     guest: null,          dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','AC'] },
      { num: '105', status: 'available', guest: null,          dep: null,      features: ['Double','Garden'],  amenities: ['Double Bed','250 sqft','Garden View','Free Wifi'] },
    ]
  },
  {
    name: 'Deluxe', color: 'purple', count: 5, available: 2, rate: 3500,
    rooms: [
      { num: '201', status: 'booked',    guest: 'Rakib Hasan',  dep: 'Tmrw',  features: ['King','City'],    amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '202', status: 'available', guest: null,            dep: null,    features: ['King','City'],    amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '203', status: 'booked',    guest: 'Absar Uddin',  dep: 'Tmrw',  features: ['King','City'],    amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
      { num: '204', status: 'checkin',   guest: 'Sarah Khan',   dep: '2 PM',  features: ['King','City'],    amenities: ['King Bed','320 sqft','City View','AC'] },
      { num: '205', status: 'available', guest: null,            dep: null,    features: ['King','City'],    amenities: ['King Bed','320 sqft','City View','Free Wifi'] },
    ]
  },
  {
    name: 'Super Deluxe', color: 'teal', count: 4, available: 1, rate: 5000,
    rooms: [
      { num: '301', status: 'booked',    guest: 'Tanvir Ahmed', dep: 'Tmrw',  features: ['King','Pool'],   amenities: ['King Bed','400 sqft','Pool View','Free Wifi'] },
      { num: '302', status: 'dirty',     guest: null,            dep: null,   features: ['King','Pool'],   amenities: ['King Bed','400 sqft','Pool View','AC'] },
      { num: '303', status: 'checkin',   guest: 'John Doe',     dep: '2 PM',  features: ['King','Pool'],   amenities: ['King Bed','400 sqft','Pool View','Free Wifi'] },
      { num: '304', status: 'available', guest: null,            dep: null,   features: ['King','Pool'],   amenities: ['King Bed','400 sqft','Pool View','AC'] },
    ]
  },
  {
    name: 'Deluxe Couple', color: 'pink', count: 4, available: 2, rate: 4500,
    rooms: [
      { num: '401', status: 'available', guest: null,           dep: null,    features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
      { num: '402', status: 'booked',    guest: 'Tanvir Ahmed', dep: 'Tmrw', features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
      { num: '403', status: 'booked',    guest: 'Rakib Hasan',  dep: 'Tmrw', features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','AC'] },
      { num: '404', status: 'available', guest: null,           dep: null,    features: ['Queen','Garden'], amenities: ['Queen Bed','350 sqft','Garden View','Free Wifi'] },
    ]
  },
]

function roomCardConfig(status: string) {
  const map: Record<string, {border:string,bg:string,badgeText:string,action:string,actionClass:string,icon:string}> = {
    available:   { border:'border-green-200',  bg:'bg-white',        badgeText:'',         action:'+ BOOK',    actionClass:'text-green-600 hover:text-green-800',   icon:'fa-check-circle text-green-400' },
    booked:      { border:'border-purple-300', bg:'bg-purple-50',    badgeText:'Occupied', action:'MANAGE',    actionClass:'text-purple-700 hover:text-purple-900', icon:'fa-user text-purple-400' },
    dirty:       { border:'border-red-300',    bg:'bg-red-50',       badgeText:'Dirty',    action:'CLEAN',     actionClass:'text-red-600 hover:text-red-800',       icon:'fa-broom text-red-400' },
    checkin:     { border:'border-blue-300',   bg:'bg-blue-50',      badgeText:'Due In',   action:'CHECK IN',  actionClass:'text-blue-600 hover:text-blue-800',     icon:'fa-sign-in-alt text-blue-400' },
    checkout:    { border:'border-orange-300', bg:'bg-orange-50',    badgeText:'Due Out',  action:'CHECK OUT', actionClass:'text-orange-600 hover:text-orange-800', icon:'fa-sign-out-alt text-orange-400' },
    maintenance: { border:'border-gray-400',   bg:'bg-gray-100',     badgeText:'Maint.',   action:'SCHEDULE',  actionClass:'text-gray-600 hover:text-gray-800',     icon:'fa-wrench text-gray-400' },
    hold:        { border:'border-yellow-300', bg:'bg-yellow-50',    badgeText:'On Hold',  action:'RELEASE',   actionClass:'text-yellow-700 hover:text-yellow-800', icon:'fa-pause-circle text-yellow-400' },
  }
  return map[status] || map['available']
}

function roomCard(room: typeof roomCategories[0]['rooms'][0]): string {
  const cfg = roomCardConfig(room.status)
  const featTags = room.features.map(f =>
    `<span class="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 bg-white leading-none">${f}</span>`
  ).join('')
  const guestLine = room.guest
    ? `<div class="text-sm font-semibold text-gray-800 leading-tight truncate">${room.guest}</div>`
    : `<div class="text-xs text-gray-400 italic mt-0.5">Empty</div>`
  const depLine = room.dep ? `<div class="text-xs text-gray-500">Dep: ${room.dep}</div>` : ''
  const badge = cfg.badgeText ? `<span class="text-xs font-bold px-1.5 py-0.5 rounded bg-white border ${cfg.border} text-gray-600">${cfg.badgeText}</span>` : ''
  return `
  <div class="rounded-xl border-2 ${cfg.border} ${cfg.bg} p-3 cursor-pointer hover:shadow-md transition-all min-h-[115px] flex flex-col justify-between"
       onclick="openRoomModal('${room.num}','${room.status}')">
    <div>
      <div class="flex items-start justify-between mb-1">
        <span class="font-bold text-gray-800 text-base">${room.num}</span>
        <i class="fas ${cfg.icon} text-sm mt-0.5"></i>
      </div>
      ${badge}
      ${guestLine}${depLine}
      <div class="flex flex-wrap gap-1 mt-2">${featTags}</div>
    </div>
    <div class="mt-2 pt-1.5 border-t border-gray-200 text-right">
      <button class="text-xs font-bold ${cfg.actionClass}" onclick="event.stopPropagation(); openRoomModal('${room.num}','${room.status}')">${cfg.action}</button>
    </div>
  </div>`
}

// Shared Room Availability Modals HTML (used on both /overview and /room-availability)
function roomModalsHTML(): string {
  return `
  <!-- 1. Available Room Modal -->
  <div id="modalAvailable" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Room <span id="modalAvailRoomNum" class="text-green-600">101</span> — Available</h3>
          <p class="text-xs text-gray-500">Standard Room · 250 sqft</p>
        </div>
        <button onclick="closeModal('modalAvailable')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-xl p-4">
          <p class="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Room Features</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <span><i class="fas fa-bed text-green-600 mr-2"></i>Double Bed</span>
            <span><i class="fas fa-mountain text-green-600 mr-2"></i>Garden View</span>
            <span><i class="fas fa-ruler-combined text-green-600 mr-2"></i>250 sqft</span>
            <span><i class="fas fa-wifi text-green-600 mr-2"></i>Free Wifi</span>
            <span><i class="fas fa-snowflake text-green-600 mr-2"></i>AC</span>
            <span><i class="fas fa-users text-green-600 mr-2"></i>Max 2 Pax</span>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Update Room Status</p>
          <div class="flex flex-wrap gap-2" id="availStatusPills">
            ${['Available','Booked','Confirmed','Checked In','Hold','Pending','Dirty','Maintenance'].map((s,i) =>
              `<button onclick="selectStatusPill(this,'availStatusPills')" class="status-pill ${i===0?'status-pill-active':''} px-3 py-1.5 rounded-full border text-xs transition">${s}</button>`
            ).join('')}
          </div>
        </div>
        <button onclick="showToast('Room status updated!','success'); closeModal('modalAvailable')"
          class="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
          Update Status
        </button>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('modalAvailable'); openModal('globalBookingModal')"
          class="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition">
          <i class="fas fa-plus mr-1"></i>New Booking
        </button>
        <button onclick="closeModal('modalAvailable'); openModal('blockHoldModal')"
          class="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition">
          Block / Hold
        </button>
      </div>
    </div>
  </div>

  <!-- 2. Occupied / Booked Room Modal -->
  <div id="modalOccupied" class="modal-overlay hidden">
    <div class="modal-container max-w-lg">
      <div class="modal-header">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Room <span id="modalOccRoomNum" class="text-purple-600">201</span> Details</h3>
          <p class="text-xs text-gray-500">Booking Info &amp; Operations</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="closeModal('modalOccupied'); openModal('globalBookingModal')"
            class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            <i class="fas fa-plus mr-1"></i>New Booking
          </button>
          <button onclick="closeModal('modalOccupied')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
        </div>
      </div>
      <div class="p-4 space-y-3">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-blue-700 uppercase">1. Guest Information</p>
            <div class="flex gap-2">
              <button onclick="openModal('assignRoomsModal')" class="text-xs border border-dashed border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                <i class="fas fa-layer-group mr-1"></i>Assign (2)
              </button>
              <button class="text-xs border border-dashed border-gray-300 text-gray-500 px-2 py-1 rounded hover:bg-gray-100">View details</button>
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
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p class="text-xs font-bold text-orange-700 uppercase mb-3">2. Payment Information</p>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div><p class="text-xs text-gray-500 mb-1">Room Rent</p><p class="text-lg font-bold text-orange-700">৳ 3,500</p></div>
            <div><p class="text-xs text-gray-500 mb-1">Advance</p><p class="text-lg font-bold text-orange-700">৳ 1,000</p></div>
            <div><p class="text-xs text-gray-500 mb-1">Due</p><p class="text-lg font-bold text-red-600">৳ 2,500</p></div>
          </div>
        </div>
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-gray-600 uppercase mb-2">3. Update Room Status</p>
          <div class="flex flex-wrap gap-2 mb-3" id="occStatusPills">
            ${['Available','Booked','Confirmed','Checked In','Hold','Pending','Checked Out','Dirty'].map((s,i) =>
              `<button onclick="selectStatusPill(this,'occStatusPills')" class="status-pill ${i===2?'status-pill-active':''} px-3 py-1.5 rounded-full border text-xs transition">${s}</button>`
            ).join('')}
          </div>
          <button onclick="showToast('Status updated!','success')"
            class="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 rounded-xl text-sm">Update Status</button>
        </div>
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-gray-500 uppercase text-center mb-3">4. Quick Actions</p>
          <div class="flex justify-center gap-4">
            <button onclick="openModal('recordPaymentModal')" class="w-10 h-10 rounded-full border hover:bg-blue-50 flex items-center justify-center" title="Payment"><i class="fas fa-credit-card text-gray-500"></i></button>
            <button class="w-10 h-10 rounded-full border hover:bg-green-50 flex items-center justify-center" title="Edit"><i class="fas fa-pen text-gray-500"></i></button>
            <button class="w-10 h-10 rounded-full border hover:bg-purple-50 flex items-center justify-center" title="View"><i class="fas fa-eye text-gray-500"></i></button>
            <button onclick="showToast('Booking deleted','error')" class="w-10 h-10 rounded-full border hover:bg-red-50 flex items-center justify-center" title="Delete"><i class="fas fa-trash text-gray-500"></i></button>
          </div>
        </div>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('modalOccupied')" class="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm">Close</button>
        <button onclick="openModal('transferRoomModal'); closeModal('modalOccupied')"
          class="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm">
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
          <h3 class="text-lg font-semibold text-gray-800">Manage Room <span id="modalDirtyRoomNum" class="text-red-500">104</span></h3>
          <p class="text-xs text-gray-500">Standard Room</p>
        </div>
        <button onclick="closeModal('modalDirty')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="border border-gray-200 rounded-xl p-4">
          <p class="text-xs font-bold text-gray-600 uppercase mb-3">Room Features</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <span><i class="fas fa-bed text-blue-500 mr-2"></i>Double Bed</span>
            <span><i class="fas fa-mountain text-blue-500 mr-2"></i>Garden View</span>
            <span><i class="fas fa-ruler-combined text-blue-500 mr-2"></i>250 sqft</span>
            <span><i class="fas fa-users text-blue-500 mr-2"></i>Max 2 Pax</span>
            <span><i class="fas fa-wifi text-blue-500 mr-2"></i>Free Wifi</span>
            <span><i class="fas fa-snowflake text-blue-500 mr-2"></i>AC</span>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
          <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
          <div>
            <p class="text-sm font-semibold text-red-700">Room Needs Attention</p>
            <p class="text-xs text-gray-600 mt-0.5">Status: <strong>Dirty</strong>. Housekeeping required before next check-in.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button onclick="showToast('Room marked as Ready!','success'); closeModal('modalDirty')"
            class="py-3 border-2 border-green-400 bg-green-50 hover:bg-green-100 rounded-xl font-semibold text-sm text-green-700 transition flex items-center justify-center gap-2">
            <i class="fas fa-check-circle"></i>Mark Ready
          </button>
          <button onclick="openModal('maintenanceModal'); closeModal('modalDirty')"
            class="py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-sm text-gray-700 transition flex items-center justify-center gap-2">
            <i class="fas fa-wrench"></i>Maintenance
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
        <button onclick="closeModal('modalCheckIn')" class="w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  </div>

  <!-- 5. Block / Hold Modal -->
  <div id="blockHoldModal" class="modal-overlay hidden">
    <div class="modal-container max-w-sm">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Block / Hold Room</h3>
        <button onclick="closeModal('blockHoldModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div><label class="form-label">Reason *</label>
          <select class="form-input"><option>Maintenance</option><option>Staff Use</option><option>Owner Block</option><option>Deep Cleaning</option><option>Other</option></select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">From Date</label><input type="date" class="form-input"></div>
          <div><label class="form-label">To Date</label><input type="date" class="form-input"></div>
        </div>
        <div><label class="form-label">Notes</label><textarea class="form-input" rows="2" placeholder="Additional notes..."></textarea></div>
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
        <div><label class="form-label">Issue Type *</label>
          <select class="form-input"><option>Plumbing</option><option>Electrical</option><option>AC / HVAC</option><option>Furniture</option><option>Deep Cleaning</option><option>Other</option></select>
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
        <button onclick="showToast('Maintenance request raised!','success'); closeModal('maintenanceModal')" class="btn-primary"><i class="fas fa-wrench mr-1"></i>Submit</button>
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
        <div class="bg-purple-50 rounded-xl p-3 text-sm">
          <strong>Current:</strong> Room 201 — Rakib Hasan (Deluxe)
        </div>
        <div><label class="form-label">Transfer to Room *</label>
          <select class="form-input">
            <option>Select available room</option>
            <option>202 — Deluxe (Available)</option>
            <option>205 — Deluxe (Available)</option>
            <option>101 — Standard (Available)</option>
          </select>
        </div>
        <div><label class="form-label">Reason</label>
          <select class="form-input"><option>Guest Request</option><option>Maintenance Issue</option><option>Upgrade</option><option>Downgrade</option></select>
        </div>
        <div><label class="form-label">Notes</label><textarea class="form-input" rows="2"></textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('transferRoomModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Room transferred!','success'); closeModal('transferRoomModal')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Confirm</button>
      </div>
    </div>
  </div>

  <!-- 8. Assign Rooms Modal -->
  <div id="assignRoomsModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-layer-group text-blue-500 mr-2"></i>Assign Rooms</h3>
        <button onclick="closeModal('assignRoomsModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-5 space-y-4">
        <div class="flex items-center justify-between bg-gray-50 rounded-xl p-3">
          <div>
            <p class="text-sm font-semibold text-gray-800">Guest: <span class="text-blue-600">Absar Uddin</span></p>
            <p class="text-xs text-gray-500 mt-0.5">Request: <span class="font-semibold">2 × Deluxe</span></p>
            <p class="text-xs text-gray-500">Check-in: Mar 15 → Mar 18 (3 nights)</p>
          </div>
          <button class="text-xs text-blue-600 underline hover:text-blue-700">View details</button>
        </div>
        <div id="roomAssignmentInputs" class="space-y-3">
          <div><label class="form-label">Room 1</label>
            <input type="text" class="form-input" placeholder="e.g. 202" list="availRoomsList"></div>
          <div><label class="form-label">Room 2</label>
            <input type="text" class="form-input" placeholder="e.g. 205" list="availRoomsList"></div>
        </div>
        <datalist id="availRoomsList">
          <option value="202">202 — Deluxe (Available)</option>
          <option value="205">205 — Deluxe (Available)</option>
          <option value="101">101 — Standard (Available)</option>
          <option value="102">102 — Standard (Available)</option>
          <option value="401">401 — Deluxe Couple (Available)</option>
        </datalist>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
          <i class="fas fa-info-circle mr-1"></i>Assigning rooms will update status to <strong>Confirmed</strong> and notify the guest.
        </div>
      </div>
      <div class="modal-footer border-t">
        <button onclick="closeModal('assignRoomsModal')" class="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        <button onclick="confirmRoomAssignment()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm">Confirm Assignment</button>
      </div>
    </div>
  </div>

  <!-- 9. Record Payment Modal (local) -->
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
          <div><label class="form-label">Method *</label>
            <select class="form-input"><option>Cash</option><option>bKash</option><option>Card</option><option>Bank Transfer</option></select>
          </div>
        </div>
        <div><label class="form-label">Transaction ID</label><input type="text" class="form-input" placeholder="Optional"></div>
        <div><label class="form-label">Received By</label><input type="text" class="form-input" value="Staff: Admin" readonly></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('recordPaymentModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Payment recorded!','success'); closeModal('recordPaymentModal')" class="btn-primary">Record Payment</button>
      </div>
    </div>
  </div>

  <style>
    .status-pill { cursor:pointer; font-size:0.75rem; }
    .status-pill-active { background:#111827 !important; color:#fff !important; border-color:#111827 !important; }
  </style>
  <script>
    function openRoomModal(roomNum, status) {
      const map = { available:'modalAvailable', booked:'modalOccupied', dirty:'modalDirty',
                    checkin:'modalCheckIn', checkout:'modalOccupied', maintenance:'modalDirty', hold:'blockHoldModal' };
      const modalId = map[status] || 'modalAvailable';
      const numMap = { modalAvailable:'modalAvailRoomNum', modalOccupied:'modalOccRoomNum',
                       modalDirty:'modalDirtyRoomNum', modalCheckIn:'modalCIRoomNum' };
      if (numMap[modalId]) {
        const el = document.getElementById(numMap[modalId]);
        if (el) el.textContent = roomNum;
      }
      openModal(modalId);
    }
    function selectStatusPill(btn, groupId) {
      const container = document.getElementById(groupId);
      if (!container) return;
      container.querySelectorAll('.status-pill').forEach(p => p.classList.remove('status-pill-active'));
      btn.classList.add('status-pill-active');
    }
    function confirmRoomAssignment() {
      const inputs = document.querySelectorAll('#roomAssignmentInputs input');
      let allFilled = true;
      inputs.forEach(i => { if (!i.value.trim()) allFilled = false; });
      if (!allFilled) { showToast('Please assign all required rooms.','error'); return; }
      closeModal('assignRoomsModal');
      showToast('Rooms assigned! Booking status → Confirmed.','success');
    }
  </script>
  `
}

// ─── Property Overview (Original Stats Dashboard) ─────────────────────────────
propertyRoute.get('/overview', (c) => {
  const content = `
  ${pageHeader('Property Overview', 'Grand Palace Hotel — live operational summary', `
    <a href="/property/room-availability" class="btn-secondary"><i class="fas fa-th-large"></i>Room Availability</a>
    <button onclick="openModal('globalBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
  `)}

  <!-- Quick Stats Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase">Total Rooms</p>
          <p class="text-2xl font-bold text-gray-800 mt-1">45</p>
          <p class="text-xs text-gray-500 mt-1">Across 4 categories</p>
        </div>
        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center"><i class="fas fa-hotel text-white text-sm"></i></div>
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase">Available</p>
          <p class="text-2xl font-bold text-green-600 mt-1">18</p>
          <p class="text-xs text-green-500 mt-1">40% occupancy rate</p>
        </div>
        <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center"><i class="fas fa-bed text-white text-sm"></i></div>
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase">Occupied</p>
          <p class="text-2xl font-bold text-purple-600 mt-1">27</p>
          <p class="text-xs text-gray-500 mt-1">63 in-house guests</p>
        </div>
        <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center"><i class="fas fa-user-check text-white text-sm"></i></div>
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-gray-500 font-medium uppercase">Revenue Today</p>
          <p class="text-2xl font-bold text-teal-600 mt-1">৳ 87K</p>
          <p class="text-xs text-green-500 mt-1">↑ +12% vs yesterday</p>
        </div>
        <div class="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center"><i class="fas fa-coins text-white text-sm"></i></div>
      </div>
    </div>
  </div>

  <!-- Second Stats Row -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p class="text-xs text-gray-500 uppercase">Check-In Today</p>
      <p class="text-2xl font-bold text-indigo-600 mt-1">11</p>
      <p class="text-xs text-gray-500 mt-1">3 pending check-in</p>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p class="text-xs text-gray-500 uppercase">Check-Out Today</p>
      <p class="text-2xl font-bold text-orange-600 mt-1">9</p>
      <p class="text-xs text-gray-500 mt-1">2 late check-outs</p>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p class="text-xs text-gray-500 uppercase">Dirty Rooms</p>
      <p class="text-2xl font-bold text-red-500 mt-1">4</p>
      <p class="text-xs text-gray-500 mt-1">Housekeeping needed</p>
    </div>
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <p class="text-xs text-gray-500 uppercase">Pending Bookings</p>
      <p class="text-2xl font-bold text-yellow-600 mt-1">8</p>
      <p class="text-xs text-gray-500 mt-1">2 need assignment</p>
    </div>
  </div>

  <!-- Room Inventory Table + Quick Status -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <div class="lg:col-span-2 card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800"><i class="fas fa-table text-blue-500 mr-2"></i>Room Inventory by Category</h3>
        <a href="/property/room-availability" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
          <i class="fas fa-th-large text-xs"></i>View Full Board
        </a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Category</th>
              <th class="table-header text-center">Total</th>
              <th class="table-header text-center">Available</th>
              <th class="table-header text-center">Occupied</th>
              <th class="table-header text-center">Dirty</th>
              <th class="table-header text-right">Rate/Night</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${roomCategories.map(cat => {
              const avail = cat.rooms.filter(r => r.status === 'available').length
              const occ   = cat.rooms.filter(r => r.status === 'booked' || r.status === 'checkin' || r.status === 'checkout').length
              const dirty = cat.rooms.filter(r => r.status === 'dirty').length
              return `
              <tr class="hover:bg-gray-50">
                <td class="table-cell font-semibold text-gray-800">${cat.name}</td>
                <td class="table-cell text-center">${cat.count}</td>
                <td class="table-cell text-center"><span class="text-green-600 font-bold">${avail}</span></td>
                <td class="table-cell text-center"><span class="text-purple-600 font-bold">${occ}</span></td>
                <td class="table-cell text-center"><span class="text-red-500 font-bold">${dirty}</span></td>
                <td class="table-cell text-right font-semibold text-gray-700">৳${cat.rate.toLocaleString()}</td>
              </tr>`
            }).join('')}
          </tbody>
          <tfoot>
            <tr class="bg-gray-50 font-bold">
              <td class="table-cell text-gray-700">TOTAL</td>
              <td class="table-cell text-center">18</td>
              <td class="table-cell text-center text-green-600">8</td>
              <td class="table-cell text-center text-purple-600">8</td>
              <td class="table-cell text-center text-red-500">2</td>
              <td class="table-cell text-right text-gray-700">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Room Status Board -->
    <div class="card p-4">
      <h3 class="font-semibold text-gray-800 mb-4"><i class="fas fa-circle-notch text-teal-500 mr-2"></i>Live Status Board</h3>
      <div class="space-y-3">
        ${[
          {label:'Available', count:18, color:'bg-green-500', pct:40},
          {label:'Occupied', count:23, color:'bg-purple-500', pct:51},
          {label:'Dirty/Clean', count:4, color:'bg-red-400', pct:9},
          {label:'Maintenance', count:0, color:'bg-gray-400', pct:0},
          {label:'On Hold', count:0, color:'bg-yellow-400', pct:0},
          {label:'Due Check-In', count:3, color:'bg-blue-400', pct:7},
          {label:'Due Check-Out', count:2, color:'bg-orange-400', pct:4},
        ].map(s => `
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">${s.label}</span>
              <span class="font-bold text-gray-800">${s.count}</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="${s.color} h-2 rounded-full transition-all" style="width:${s.pct}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="mt-4 pt-3 border-t text-center">
        <a href="/property/room-availability" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          <i class="fas fa-th-large"></i>View Room Availability Board
        </a>
      </div>
    </div>
  </div>

  <!-- Today's Arrivals & Departures -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800"><i class="fas fa-sign-in-alt text-green-500 mr-2"></i>Today's Arrivals</h3>
        <a href="/booking/all" class="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {name:'James Wilson', room:'204', time:'2:00 PM', status:'confirmed', cat:'Deluxe'},
          {name:'Maria Santos', room:'301', time:'3:30 PM', status:'confirmed', cat:'Super Deluxe'},
          {name:'Ahmed Al-Rashid', room:'TBD', time:'4:00 PM', status:'pending', cat:'Standard'},
          {name:'Sophie Chen', room:'402', time:'5:00 PM', status:'confirmed', cat:'Deluxe Couple'},
          {name:'Robert Miller', room:'TBD', time:'6:00 PM', status:'pending', cat:'Standard'},
        ].map(a => `
          <div class="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">${a.name.charAt(0)}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">${a.name}</div>
              <div class="text-xs text-gray-500">Room ${a.room} · ${a.cat} · ${a.time}</div>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full ${a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${a.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
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
  </div>

  <!-- Recent Bookings Table -->
  <div class="card">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800"><i class="fas fa-clipboard-list text-blue-500 mr-2"></i>Recent Bookings</h3>
      <a href="/booking/all" class="text-xs text-blue-600 hover:underline">View All Bookings</a>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest</th>
            <th class="table-header">Category</th>
            <th class="table-header">Dates</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Source</th>
            <th class="table-header">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'BK-2026-018', guest:'Rakib Hasan',  cat:'Deluxe',       dates:'Mar 15→18', amt:'৳10,500', src:'Walk-in', status:'confirmed'},
            {id:'BK-2026-017', guest:'Sarah Khan',   cat:'Standard',     dates:'Mar 14→16', amt:'৳4,000',  src:'Website', status:'checked-in'},
            {id:'BK-2026-016', guest:'Absar Uddin',  cat:'Super Deluxe', dates:'Mar 13→17', amt:'৳20,000', src:'B2B',     status:'pending'},
            {id:'BK-2026-015', guest:'Tanvir Ahmed', cat:'Deluxe Couple',dates:'Mar 12→14', amt:'৳9,000',  src:'OTA',     status:'confirmed'},
            {id:'BK-2026-014', guest:'John Doe',     cat:'Standard',     dates:'Mar 10→12', amt:'৳4,000',  src:'Phone',   status:'checked-out'},
          ].map(b => `
            <tr class="hover:bg-gray-50 cursor-pointer">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600 font-semibold">${b.id}</span></td>
              <td class="table-cell font-medium text-gray-800">${b.guest}</td>
              <td class="table-cell text-xs text-gray-600">${b.cat}</td>
              <td class="table-cell text-xs text-gray-600">${b.dates}</td>
              <td class="table-cell font-semibold text-gray-800">${b.amt}</td>
              <td class="table-cell"><span class="text-xs bg-gray-100 px-2 py-0.5 rounded">${b.src}</span></td>
              <td class="table-cell">${statusBadge(b.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(adminLayout('Property Overview', content, 'property', 'overview'))
})

// ─── Room Availability (Full Page Board — separate route) ─────────────────────
propertyRoute.get('/room-availability', (c) => {
  const allRooms = roomCategories.flatMap(c => c.rooms)
  const totalAvail = allRooms.filter(r => r.status === 'available').length
  const totalOcc   = allRooms.filter(r => r.status === 'booked' || r.status === 'checkin' || r.status === 'checkout').length
  const totalDirty = allRooms.filter(r => r.status === 'dirty').length

  const categoryGrid = roomCategories.map(cat => `
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-3">
      <h3 class="text-base font-bold text-gray-800">${cat.name}</h3>
      <span class="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">${cat.count} Units</span>
      <span class="text-xs text-green-600 font-semibold">${cat.rooms.filter(r=>r.status==='available').length} Available</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      ${cat.rooms.map(r => roomCard(r)).join('')}
    </div>
  </div>
  `).join('')

  const content = `
  ${pageHeader('Room Availability', 'Live room status board — click any card to manage', `
    <button onclick="openModal('globalBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Overview</a>
    <a href="/calendar" class="btn-secondary"><i class="fas fa-calendar"></i>Calendar</a>
  `)}

  <!-- Legend + Live Stats Bar -->
  <div class="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
    <div class="flex flex-wrap gap-4 text-xs">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-green-400 inline-block"></span>Available</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-purple-400 inline-block bg-purple-50"></span>Occupied</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-blue-400 inline-block bg-blue-50"></span>Check-In Today</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-orange-400 inline-block bg-orange-50"></span>Check-Out</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-red-400 inline-block bg-red-50"></span>Dirty</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-yellow-400 inline-block bg-yellow-50"></span>Hold</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border-2 border-gray-400 inline-block bg-gray-100"></span>Maintenance</span>
    </div>
    <div class="flex gap-4 text-xs font-semibold">
      <span class="text-green-600">${totalAvail} Available</span>
      <span class="text-purple-600">${totalOcc} Occupied</span>
      <span class="text-red-500">${totalDirty} Dirty</span>
    </div>
  </div>

  <!-- Summary Stats Cards -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
    <div class="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
      <div class="text-2xl font-bold text-green-600">${totalAvail}</div>
      <div class="text-xs text-gray-500 mt-1">Available Now</div>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
      <div class="text-2xl font-bold text-purple-600">${totalOcc}</div>
      <div class="text-xs text-gray-500 mt-1">Currently Occupied</div>
    </div>
    <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
      <div class="text-2xl font-bold text-red-500">${totalDirty}</div>
      <div class="text-xs text-gray-500 mt-1">Needs Cleaning</div>
    </div>
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
      <div class="text-2xl font-bold text-blue-600">${Math.round(totalOcc/18*100)}%</div>
      <div class="text-xs text-gray-500 mt-1">Occupancy Rate</div>
    </div>
  </div>

  <!-- Category-Grouped Room Cards -->
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    ${categoryGrid}
  </div>

  ${roomModalsHTML()}
  `
  return c.html(adminLayout('Room Availability', content, 'property', 'room-availability'))
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
          <div><label class="form-label">Room Number *</label><input type="text" class="form-input" placeholder="e.g., 101"></div>
          <div><label class="form-label">Room Category *</label>
            <select class="form-input">
              <option>Select category</option>
              <option>Standard</option><option>Deluxe</option><option>Super Deluxe</option>
              <option>Deluxe Couple</option><option>Suite</option><option>Presidential Suite</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Floor Number</label><input type="number" class="form-input" placeholder="1"></div>
          <div><label class="form-label">Room Size (sq ft)</label><input type="number" class="form-input" placeholder="250"></div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div><label class="form-label">Max Adults *</label><input type="number" class="form-input" value="2" min="1"></div>
          <div><label class="form-label">Max Children</label><input type="number" class="form-input" value="1" min="0"></div>
          <div><label class="form-label">Bed Type *</label>
            <select class="form-input">
              <option>King Bed</option><option>Queen Bed</option><option>Double Bed</option><option>Twin Beds</option>
            </select>
          </div>
        </div>
        <h4 class="font-medium text-gray-700 mt-4 border-t pt-4">Pricing</h4>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Base Rate / Night *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div></div>
          <div><label class="form-label">Weekend Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div></div>
          <div><label class="form-label">B2B Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div></div>
          <div><label class="form-label">OTA Rate / Night</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">৳</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div></div>
        </div>
        <h4 class="font-medium text-gray-700 mt-2 border-t pt-4">Amenities</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${['Air Conditioning','WiFi','Flat Screen TV','Mini Bar','Safe','Bathtub','Balcony','Ocean View','Garden View','City View','Pool View','Coffee Maker','Hair Dryer','Iron & Board','Room Service'].map(a =>
            `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" class="rounded border-gray-300 text-blue-600"> ${a}</label>`
          ).join('')}
        </div>
        <div><label class="form-label">Room Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe the room..."></textarea></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Room Status</label>
            <select class="form-input"><option>Available</option><option>Under Maintenance</option><option>Inactive</option></select></div>
          <div><label class="form-label">Smoking Policy</label>
            <select class="form-input"><option>Non-Smoking</option><option>Smoking Allowed</option></select></div>
        </div>
        <div class="flex gap-2 pt-2">
          <button type="submit" class="btn-primary" onclick="showToast('Room created successfully!', 'success'); return false;"><i class="fas fa-save"></i>Save Room</button>
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
    <div class="card-header"><h3 class="font-semibold text-gray-800">Room Categories</h3></div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Category Name</th><th class="table-header">Rooms</th>
            <th class="table-header">Base Rate</th><th class="table-header">Min Stay</th>
            <th class="table-header">Max Guests</th><th class="table-header">Breakfast</th>
            <th class="table-header">Status</th><th class="table-header">Actions</th>
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
            <tr class="hover:bg-gray-50">
              <td class="table-cell font-medium text-gray-800">${cat.name}</td>
              <td class="table-cell">${cat.rooms}</td>
              <td class="table-cell font-semibold">${cat.rate}/night</td>
              <td class="table-cell">${cat.minStay} night${cat.minStay > 1 ? 's' : ''}</td>
              <td class="table-cell">${cat.guests} guests</td>
              <td class="table-cell"><span class="text-xs px-2 py-0.5 rounded ${cat.breakfast === 'Included' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${cat.breakfast}</span></td>
              <td class="table-cell">${statusBadge(cat.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 hover:text-blue-700 p-1"><i class="fas fa-edit text-xs"></i></button>
                  <button class="text-red-500 hover:text-red-600 p-1" onclick="showToast('Category deleted','error')"><i class="fas fa-trash text-xs"></i></button>
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
            <input type="number" class="form-input pl-6" placeholder="0.00"></div></div>
          <div><label class="form-label">Minimum Stay (nights)</label><input type="number" class="form-input" value="1" min="1"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Max Adults</label><input type="number" class="form-input" value="2" min="1"></div>
          <div><label class="form-label">Max Children</label><input type="number" class="form-input" value="1" min="0"></div>
        </div>
        <div><label class="form-label">Breakfast Policy</label>
          <select class="form-input"><option>Not Included</option><option>Included in Rate</option><option>Optional Add-on</option></select></div>
        <div><label class="form-label">Category Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe this room category..."></textarea></div>
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

// ─── Manage Website (7 fully built tabs) ──────────────────────────────────────
propertyRoute.get('/manage-website', (c) => {
  const content = `
  ${pageHeader('Manage Website', 'Configure your public-facing hotel website', `
    <a href="/website" target="_blank" class="btn-secondary"><i class="fas fa-external-link-alt"></i>Preview Site</a>
    <button class="btn-primary" onclick="showToast('All changes saved successfully!', 'success')"><i class="fas fa-save"></i>Save Changes</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
    <!-- Tab Content Area -->
    <div class="lg:col-span-3 card p-5">
      <!-- Tab Navigation -->
      <div class="flex overflow-x-auto gap-1 mb-6 border-b border-gray-200 pb-0">
        ${[
          {id:'gen',  label:'General Info',  icon:'fa-info-circle'},
          {id:'home', label:'Homepage',      icon:'fa-home'},
          {id:'rooms',label:'Rooms Page',    icon:'fa-bed'},
          {id:'gal',  label:'Gallery',       icon:'fa-images'},
          {id:'about',label:'About Us',      icon:'fa-building'},
          {id:'cont', label:'Contact & Map', icon:'fa-map-marker-alt'},
          {id:'seo',  label:'SEO Settings',  icon:'fa-search'},
        ].map((t, i) => `
          <button onclick="switchWebTab('${t.id}')" id="wtab_${t.id}"
            class="web-tab-btn whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${i===0 ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">
            <i class="fas ${t.icon} mr-1"></i>${t.label}
          </button>
        `).join('')}
      </div>

      <!-- TAB 1: General Info -->
      <div id="wtab_content_gen" class="web-tab-content space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Basic Property Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="form-label">Hotel / Property Name *</label>
            <input type="text" class="form-input" value="Grand Palace Hotel"></div>
          <div><label class="form-label">Tagline / Slogan</label>
            <input type="text" class="form-input" value="Your Luxury Escape Awaits"></div>
          <div><label class="form-label">Property Type</label>
            <select class="form-input"><option selected>Hotel</option><option>Resort</option><option>Boutique Hotel</option><option>Guest House</option></select></div>
          <div><label class="form-label">Star Rating</label>
            <select class="form-input"><option>Unrated</option><option>3 Star</option><option selected>4 Star</option><option>5 Star</option></select></div>
          <div><label class="form-label">Primary Language</label>
            <select class="form-input"><option>English</option><option>Bengali</option><option>English & Bengali</option></select></div>
          <div><label class="form-label">Currency Display</label>
            <select class="form-input"><option selected>BDT (৳)</option><option>USD ($)</option><option>EUR (€)</option></select></div>
          <div><label class="form-label">Timezone</label>
            <select class="form-input"><option>Asia/Dhaka (GMT+6)</option><option>America/New_York</option></select></div>
        </div>
        <div><label class="form-label">Short Description (shown on homepage hero)</label>
          <textarea class="form-input" rows="3">Experience unparalleled luxury at Grand Palace Hotel. Nestled in the heart of Cox's Bazar, we offer world-class amenities and breathtaking ocean views.</textarea></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Contact Phone</label>
            <input type="tel" class="form-input" value="+880 1700-000000"></div>
          <div><label class="form-label">Contact Email</label>
            <input type="email" class="form-input" value="info@grandpalacehotel.com"></div>
        </div>
        <div><label class="form-label">Full Address</label>
          <input type="text" class="form-input" value="Marine Drive Road, Cox's Bazar, Bangladesh"></div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Logo & Branding</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Hotel Logo</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
              <div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-hotel text-white text-2xl"></i>
              </div>
              <p class="text-xs text-gray-500">Click to change logo</p>
              <p class="text-xs text-gray-400">PNG/SVG, max 2MB</p>
            </div>
          </div>
          <div>
            <label class="form-label">Favicon</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
              <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-hotel text-blue-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-500">Click to change favicon</p>
              <p class="text-xs text-gray-400">ICO/PNG 32×32</p>
            </div>
          </div>
        </div>
        <div><label class="form-label">Primary Brand Color</label>
          <div class="flex items-center gap-3">
            <input type="color" class="w-12 h-10 rounded border border-gray-200 cursor-pointer" value="#2563eb">
            <input type="text" class="form-input w-32" value="#2563eb">
            <span class="text-xs text-gray-400">Used for buttons, highlights, nav bar</span>
          </div>
        </div>
      </div>

      <!-- TAB 2: Homepage -->
      <div id="wtab_content_home" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Hero / Banner Section</h4>
        <div><label class="form-label">Hero Headline *</label>
          <input type="text" class="form-input" value="Welcome to Grand Palace Hotel"></div>
        <div><label class="form-label">Hero Sub-headline</label>
          <input type="text" class="form-input" value="Experience luxury, comfort & breathtaking ocean views in Cox's Bazar"></div>
        <div>
          <label class="form-label">Hero Background Image</label>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-gray-50">
            <i class="fas fa-image text-4xl text-gray-300 mb-2"></i>
            <p class="text-sm text-gray-500">Drop hero image or click to upload</p>
            <p class="text-xs text-gray-400 mt-1">Recommended: 1920×1080px, max 5MB</p>
            <button class="btn-secondary btn-sm mt-3">Browse Files</button>
          </div>
        </div>
        <div><label class="form-label">CTA Button Text</label>
          <input type="text" class="form-input" value="Book Your Stay"></div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Features / Highlights Section</h4>
        <div class="grid grid-cols-3 gap-4">
          ${[
            {icon:'fa-swimming-pool', title:'Infinity Pool', desc:'Stunning ocean-view pool'},
            {icon:'fa-utensils', title:'Fine Dining', desc:'Award-winning restaurant'},
            {icon:'fa-spa', title:'Luxury Spa', desc:'Full wellness center'},
          ].map(f => `
            <div class="border border-gray-200 rounded-xl p-3">
              <div class="text-center mb-2"><i class="fas ${f.icon} text-blue-500 text-2xl"></i></div>
              <input type="text" class="form-input text-xs mb-1" value="${f.title}">
              <input type="text" class="form-input text-xs" value="${f.desc}">
            </div>
          `).join('')}
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <p class="text-sm font-semibold text-gray-700">Show Testimonials Section</p>
            <p class="text-xs text-gray-500">Display guest reviews on homepage</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <p class="text-sm font-semibold text-gray-700">Show Online Booking Widget</p>
            <p class="text-xs text-gray-500">Quick booking form on homepage</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </div>

      <!-- TAB 3: Rooms Page -->
      <div id="wtab_content_rooms" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Rooms Page Configuration</h4>
        <div><label class="form-label">Page Title</label>
          <input type="text" class="form-input" value="Our Rooms & Suites"></div>
        <div><label class="form-label">Page Subtitle</label>
          <input type="text" class="form-input" value="Choose from our elegantly designed rooms and suites"></div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Room Categories to Display</h4>
        <div class="space-y-3">
          ${[
            {name:'Standard Room', rate:'৳2,000', show:true, featured:false},
            {name:'Deluxe Room', rate:'৳3,500', show:true, featured:true},
            {name:'Super Deluxe', rate:'৳5,000', show:true, featured:false},
            {name:'Deluxe Couple', rate:'৳4,500', show:true, featured:false},
            {name:'Suite', rate:'৳8,000', show:true, featured:true},
          ].map(r => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <i class="fas fa-grip-vertical text-gray-300 cursor-move"></i>
                <div>
                  <p class="text-sm font-semibold text-gray-800">${r.name}</p>
                  <p class="text-xs text-gray-500">From ${r.rate}/night</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                ${r.featured ? '<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-semibold">Featured</span>' : ''}
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" ${r.show ? 'checked' : ''} class="sr-only peer">
                  <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Rooms Per Page</label>
            <select class="form-input"><option>6</option><option selected>9</option><option>12</option></select></div>
          <div><label class="form-label">Default Sort</label>
            <select class="form-input"><option selected>Price: Low to High</option><option>Price: High to Low</option><option>Featured First</option></select></div>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <p class="text-sm font-semibold text-gray-700">Show Availability Calendar on Room Page</p>
            <p class="text-xs text-gray-500">Let guests check availability before booking</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </div>

      <!-- TAB 4: Gallery -->
      <div id="wtab_content_gal" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Photo Gallery Management</h4>
        <div><label class="form-label">Gallery Page Title</label>
          <input type="text" class="form-input" value="Photo Gallery"></div>
        <div>
          <label class="form-label">Upload Gallery Images</label>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer bg-gray-50">
            <i class="fas fa-cloud-upload-alt text-4xl text-gray-300 mb-3"></i>
            <p class="text-sm text-gray-600 font-medium">Drag & drop images here or click to upload</p>
            <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP — max 5MB each — up to 50 images</p>
            <button class="btn-primary btn-sm mt-4">Browse & Upload</button>
          </div>
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Gallery Albums</h4>
        <div class="grid grid-cols-2 gap-3">
          ${[
            {name:'Lobby & Common Areas', count:12, thumb:'fa-couch'},
            {name:'Standard Rooms', count:8, thumb:'fa-bed'},
            {name:'Deluxe Rooms', count:15, thumb:'fa-bed'},
            {name:'Suites', count:10, thumb:'fa-crown'},
            {name:'Restaurant & Bar', count:9, thumb:'fa-utensils'},
            {name:'Pool & Spa', count:7, thumb:'fa-swimming-pool'},
          ].map(a => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas ${a.thumb} text-blue-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">${a.name}</p>
                <p class="text-xs text-gray-500">${a.count} photos</p>
              </div>
              <div class="flex gap-1">
                <button class="text-blue-500 hover:text-blue-700 p-1"><i class="fas fa-edit text-xs"></i></button>
                <button class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-trash text-xs"></i></button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div><p class="text-sm font-semibold text-gray-700">Enable Lightbox</p><p class="text-xs text-gray-500">Full-screen image viewer</p></div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked class="sr-only peer">
              <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
          <div><label class="form-label">Images Per Row</label>
            <select class="form-input"><option>2</option><option selected>3</option><option>4</option></select></div>
        </div>
      </div>

      <!-- TAB 5: About Us -->
      <div id="wtab_content_about" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">About Us Page</h4>
        <div><label class="form-label">Page Title</label>
          <input type="text" class="form-input" value="About Grand Palace Hotel"></div>
        <div><label class="form-label">Story / About Text *</label>
          <textarea class="form-input" rows="6" placeholder="Tell your hotel's story...">Founded in 2010, Grand Palace Hotel has been redefining luxury hospitality in Cox's Bazar. Our property spans 5 acres of pristine beachfront, offering our guests an unparalleled blend of natural beauty and modern comfort.

Our dedicated team of hospitality professionals is committed to providing every guest with a memorable and personalized experience. From our award-winning restaurant to our state-of-the-art spa, every facility has been designed with your comfort in mind.</textarea></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Year Established</label>
            <input type="number" class="form-input" value="2010"></div>
          <div><label class="form-label">Total Rooms</label>
            <input type="number" class="form-input" value="45"></div>
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Key Statistics (displayed on About page)</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[
            {label:'Years of Excellence', value:'14+'},
            {label:'Rooms & Suites', value:'45'},
            {label:'Happy Guests', value:'50K+'},
            {label:'Awards Won', value:'12'},
          ].map(s => `
            <div class="border border-gray-200 rounded-xl p-3">
              <input type="text" class="form-input text-lg font-bold text-center text-blue-600 mb-1" value="${s.value}">
              <input type="text" class="form-input text-xs text-center text-gray-500" value="${s.label}">
            </div>
          `).join('')}
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Team / Leadership</h4>
        <div class="grid grid-cols-3 gap-4">
          ${[
            {name:'Mr. Abdullah Hasan', role:'General Manager'},
            {name:'Ms. Fatema Begum', role:'Head of Operations'},
            {name:'Mr. Reza Khan', role:'Head of F&B'},
          ].map(m => `
            <div class="border border-gray-200 rounded-xl p-3 text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-user text-blue-600"></i>
              </div>
              <input type="text" class="form-input text-xs font-semibold text-center mb-1" value="${m.name}">
              <input type="text" class="form-input text-xs text-center text-gray-500" value="${m.role}">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 6: Contact & Map -->
      <div id="wtab_content_cont" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Contact Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Primary Phone *</label>
            <input type="tel" class="form-input" value="+880 1700-000000"></div>
          <div><label class="form-label">Secondary Phone</label>
            <input type="tel" class="form-input" value="+880 1800-000000"></div>
          <div><label class="form-label">Email Address *</label>
            <input type="email" class="form-input" value="info@grandpalacehotel.com"></div>
          <div><label class="form-label">Reservations Email</label>
            <input type="email" class="form-input" value="reservations@grandpalacehotel.com"></div>
        </div>
        <div><label class="form-label">Full Address *</label>
          <input type="text" class="form-input" value="Marine Drive Road, Cox's Bazar Sadar, Chittagong Division, Bangladesh - 4700"></div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Social Media Links</h4>
        <div class="grid grid-cols-2 gap-4">
          ${[
            {icon:'fa-facebook', label:'Facebook', val:'https://facebook.com/grandpalacehotel', color:'text-blue-600'},
            {icon:'fa-instagram', label:'Instagram', val:'https://instagram.com/grandpalacehotel', color:'text-pink-600'},
            {icon:'fa-twitter', label:'Twitter / X', val:'https://twitter.com/grandpalacehotel', color:'text-sky-500'},
            {icon:'fa-youtube', label:'YouTube', val:'', color:'text-red-600'},
          ].map(s => `
            <div class="flex items-center gap-2">
              <i class="fab ${s.icon} ${s.color} w-5 text-center text-lg"></i>
              <input type="url" class="form-input flex-1" placeholder="${s.label}" value="${s.val}">
            </div>
          `).join('')}
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Google Maps Embed</h4>
        <div><label class="form-label">Google Maps Embed Code / URL</label>
          <textarea class="form-input font-mono text-xs" rows="4" placeholder="Paste Google Maps embed iframe code here..."><iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="300" style="border:0;" allowfullscreen></iframe></textarea></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Latitude</label>
            <input type="text" class="form-input" value="21.4272" placeholder="e.g. 21.4272"></div>
          <div><label class="form-label">Longitude</label>
            <input type="text" class="form-input" value="92.0058" placeholder="e.g. 92.0058"></div>
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Business Hours</h4>
        <div class="space-y-2">
          ${[
            {day:'Check-in Time', val:'2:00 PM'},
            {day:'Check-out Time', val:'12:00 PM (Noon)'},
            {day:'Front Desk Hours', val:'24/7 (Round the Clock)'},
            {day:'Restaurant Hours', val:'7:00 AM – 11:00 PM'},
          ].map(h => `
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-600 w-36 flex-shrink-0">${h.day}</span>
              <input type="text" class="form-input flex-1" value="${h.val}">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 7: SEO Settings -->
      <div id="wtab_content_seo" class="web-tab-content hidden space-y-5">
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2">Search Engine Optimization (SEO)</h4>
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
          <i class="fas fa-info-circle mr-1"></i>
          Good SEO helps your hotel appear higher in Google search results, driving more organic bookings.
        </div>
        <div><label class="form-label">Meta Title (50–60 characters) *</label>
          <input type="text" class="form-input" value="Grand Palace Hotel Cox's Bazar | Luxury Sea View Rooms">
          <p class="text-xs text-gray-400 mt-1">Characters: <span id="metaTitleCount">55</span>/60</p></div>
        <div><label class="form-label">Meta Description (150–160 characters) *</label>
          <textarea class="form-input" rows="3">Book your luxury stay at Grand Palace Hotel in Cox's Bazar. Sea view rooms, fine dining, infinity pool & spa. Best rates guaranteed. Call +880 1700-000000.</textarea>
          <p class="text-xs text-gray-400 mt-1">Characters: 155/160</p></div>
        <div><label class="form-label">Focus Keywords (comma separated)</label>
          <input type="text" class="form-input" value="Cox's Bazar hotel, luxury hotel Bangladesh, sea view hotel, Grand Palace Hotel"></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">OG Title (Social Share)</label>
            <input type="text" class="form-input" value="Grand Palace Hotel — Luxury in Cox's Bazar"></div>
          <div><label class="form-label">OG Description</label>
            <input type="text" class="form-input" value="Experience world-class hospitality by the sea"></div>
        </div>
        <div>
          <label class="form-label">OG / Social Share Image</label>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 cursor-pointer">
            <i class="fas fa-image text-3xl text-gray-300 mb-2"></i>
            <p class="text-xs text-gray-500">Recommended: 1200×630px, max 2MB</p>
            <button class="btn-secondary btn-sm mt-2">Upload OG Image</button>
          </div>
        </div>
        <h4 class="text-sm font-bold text-gray-700 border-b pb-2 pt-2">Schema & Structured Data</h4>
        <div class="space-y-3">
          ${[
            {label:'Enable Hotel Schema Markup', desc:'Helps Google show star ratings in search results', checked:true},
            {label:'Enable Review Schema', desc:'Display review stars in Google snippets', checked:true},
            {label:'Generate XML Sitemap', desc:'Auto-update sitemap for search engines', checked:true},
            {label:'Enable Google Analytics', desc:'Track visitor behavior', checked:false},
          ].map(s => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div><p class="text-sm font-semibold text-gray-700">${s.label}</p><p class="text-xs text-gray-500">${s.desc}</p></div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${s.checked ? 'checked' : ''} class="sr-only peer">
                <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          `).join('')}
        </div>
        <div><label class="form-label">Google Analytics ID</label>
          <input type="text" class="form-input" placeholder="G-XXXXXXXXXX"></div>
        <div><label class="form-label">Google Search Console Verification Code</label>
          <input type="text" class="form-input" placeholder="Paste verification meta content here"></div>
        <div><label class="form-label">Custom robots.txt</label>
          <textarea class="form-input font-mono text-xs" rows="4">User-agent: *
Allow: /
Sitemap: https://grandpalacehotel.com/sitemap.xml</textarea></div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="space-y-4">
      <!-- Website Status Card -->
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Website Status</h3>
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-medium text-gray-700">Online Status</p>
            <p class="text-xs text-green-600">● Live & Active</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
        <div class="text-xs text-gray-500 space-y-1 mb-3">
          <div class="flex justify-between"><span>Website URL</span><a href="/website" class="text-blue-600">grandpalacehotel.com</a></div>
          <div class="flex justify-between"><span>Last Updated</span><span>Mar 24, 2026</span></div>
          <div class="flex justify-between"><span>Pages Indexed</span><span>12</span></div>
        </div>
        <a href="/website" target="_blank" class="btn-secondary w-full justify-center text-sm flex items-center gap-2">
          <i class="fas fa-globe"></i>Visit Website
        </a>
      </div>
      <!-- Quick Stats -->
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Website Analytics</h3>
        <div class="space-y-3">
          ${[
            {label:'Visitors (This Month)', value:'2,847', icon:'fa-users', color:'text-blue-600'},
            {label:'Page Views', value:'12,390', icon:'fa-eye', color:'text-green-600'},
            {label:'Bookings via Website', value:'184', icon:'fa-calendar-check', color:'text-purple-600'},
            {label:'Bounce Rate', value:'34%', icon:'fa-sign-out-alt', color:'text-orange-500'},
          ].map(s => `
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fas ${s.icon} ${s.color} w-4 text-center"></i>
                <span class="text-xs text-gray-600">${s.label}</span>
              </div>
              <span class="text-xs font-bold text-gray-800">${s.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <!-- OTA Connections -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800">OTA Channels</h3>
          <a href="/property/ota-settings" class="text-xs text-blue-600 hover:underline">Manage</a>
        </div>
        <div class="space-y-2">
          ${[
            {name:'Booking.com', status:'connected', icon:'fa-globe'},
            {name:'Agoda', status:'connected', icon:'fa-globe'},
            {name:'Expedia', status:'pending', icon:'fa-globe'},
            {name:'Airbnb', status:'disconnected', icon:'fa-globe'},
          ].map(o => `
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <i class="fas ${o.icon} text-gray-400"></i>
                <span class="text-gray-700">${o.name}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full font-semibold ${o.status==='connected'?'bg-green-100 text-green-700':o.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-500'}">${o.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

  <script>
    function switchWebTab(tabId) {
      // Hide all tab contents
      document.querySelectorAll('.web-tab-content').forEach(el => el.classList.add('hidden'));
      // Reset all tab buttons
      document.querySelectorAll('.web-tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-600','text-blue-700','bg-blue-50');
        btn.classList.add('border-transparent','text-gray-500');
      });
      // Show selected
      const content = document.getElementById('wtab_content_' + tabId);
      const btn = document.getElementById('wtab_' + tabId);
      if (content) content.classList.remove('hidden');
      if (btn) {
        btn.classList.remove('border-transparent','text-gray-500');
        btn.classList.add('border-blue-600','text-blue-700','bg-blue-50');
      }
    }
  </script>
  `
  return c.html(adminLayout('Manage Website', content, 'property', 'manage-website'))
})

// ─── OTA Settings ─────────────────────────────────────────────────────────────
propertyRoute.get('/ota-settings', (c) => {
  const content = `
  ${pageHeader('OTA & Source Management', 'Manage your online travel agency channel connections', `
    <button onclick="openModal('addOtaModal')" class="btn-primary"><i class="fas fa-plus"></i>Add OTA Channel</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    ${[
      {name:'Booking.com',  code:'booking',  status:'connected', bookings:124, revenue:'৳ 4,87,500', commission:'15%', color:'bg-blue-600',   icon:'fa-globe'},
      {name:'Agoda',        code:'agoda',    status:'connected', bookings:87,  revenue:'৳ 3,21,000', commission:'18%', color:'bg-red-500',    icon:'fa-globe'},
      {name:'Expedia',      code:'expedia',  status:'pending',   bookings:0,   revenue:'৳ 0',         commission:'15%', color:'bg-yellow-500', icon:'fa-globe'},
      {name:'Airbnb',       code:'airbnb',   status:'disconnected', bookings:0, revenue:'৳ 0',       commission:'13%', color:'bg-pink-500',   icon:'fa-home'},
      {name:'Hotels.com',   code:'hotels',   status:'disconnected', bookings:0, revenue:'৳ 0',       commission:'15%', color:'bg-purple-500', icon:'fa-hotel'},
      {name:'MakeMyTrip',   code:'mmt',      status:'connected', bookings:43,  revenue:'৳ 1,72,000', commission:'12%', color:'bg-orange-500', icon:'fa-plane'},
    ].map(o => `
      <div class="card p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 ${o.color} rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="fas ${o.icon} text-white text-sm"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-sm">${o.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${o.status==='connected'?'bg-green-100 text-green-700':o.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-500'}">${o.status}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <button class="text-blue-500 hover:text-blue-700 p-1" title="Edit"><i class="fas fa-edit text-xs"></i></button>
            <button class="text-gray-400 hover:text-gray-600 p-1" title="Settings"><i class="fas fa-cog text-xs"></i></button>
          </div>
        </div>
        <div class="space-y-1 text-xs text-gray-600 mb-3">
          <div class="flex justify-between"><span>Bookings (This Month)</span><span class="font-bold text-gray-800">${o.bookings}</span></div>
          <div class="flex justify-between"><span>Revenue</span><span class="font-bold text-gray-800">${o.revenue}</span></div>
          <div class="flex justify-between"><span>Commission Rate</span><span class="font-bold text-orange-600">${o.commission}</span></div>
        </div>
        ${o.status === 'connected'
          ? `<button onclick="showToast('${o.name} disconnected','error')" class="w-full text-xs border border-red-200 text-red-500 hover:bg-red-50 py-1.5 rounded-lg font-semibold">Disconnect</button>`
          : o.status === 'pending'
          ? `<button class="w-full text-xs bg-yellow-100 text-yellow-700 py-1.5 rounded-lg font-semibold">Awaiting Approval…</button>`
          : `<button onclick="showToast('Connection request sent to ${o.name}','success')" class="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-semibold">Connect</button>`
        }
      </div>
    `).join('')}
  </div>

  <!-- OTA Rate Mapping -->
  <div class="card">
    <div class="card-header"><h3 class="font-semibold text-gray-800">OTA Rate Mapping by Category</h3></div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Category</th>
            <th class="table-header text-right">Base Rate</th>
            <th class="table-header text-right">Booking.com</th>
            <th class="table-header text-right">Agoda</th>
            <th class="table-header text-right">Expedia</th>
            <th class="table-header text-right">MakeMyTrip</th>
            <th class="table-header">Auto-Sync</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${roomCategories.map(cat => `
            <tr class="hover:bg-gray-50">
              <td class="table-cell font-semibold text-gray-800">${cat.name}</td>
              <td class="table-cell text-right text-gray-700">৳${cat.rate.toLocaleString()}</td>
              <td class="table-cell text-right"><input type="number" class="w-24 text-right border border-gray-200 rounded px-2 py-1 text-xs" value="${Math.round(cat.rate*1.15)}"></td>
              <td class="table-cell text-right"><input type="number" class="w-24 text-right border border-gray-200 rounded px-2 py-1 text-xs" value="${Math.round(cat.rate*1.18)}"></td>
              <td class="table-cell text-right"><input type="number" class="w-24 text-right border border-gray-200 rounded px-2 py-1 text-xs" value="${Math.round(cat.rate*1.15)}"></td>
              <td class="table-cell text-right"><input type="number" class="w-24 text-right border border-gray-200 rounded px-2 py-1 text-xs" value="${Math.round(cat.rate*1.12)}"></td>
              <td class="table-cell"><label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 border-t flex justify-end">
      <button onclick="showToast('OTA rates saved!','success')" class="btn-primary">Save Rate Mapping</button>
    </div>
  </div>

  <!-- Add OTA Modal -->
  <div id="addOtaModal" class="modal-overlay hidden">
    <div class="modal-container max-w-md">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add OTA Channel</h3>
        <button onclick="closeModal('addOtaModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div><label class="form-label">Select OTA Platform *</label>
          <select class="form-input">
            <option>Select platform</option>
            <option>Booking.com</option><option>Agoda</option><option>Expedia</option>
            <option>Airbnb</option><option>Hotels.com</option><option>MakeMyTrip</option>
            <option>TripAdvisor</option><option>Goibibo</option><option>Other</option>
          </select>
        </div>
        <div><label class="form-label">API Key / Property ID</label>
          <input type="text" class="form-input" placeholder="Enter your OTA property ID or API key"></div>
        <div><label class="form-label">Commission Rate (%)</label>
          <input type="number" class="form-input" placeholder="e.g. 15" min="0" max="100"></div>
        <div><label class="form-label">Contact Email at OTA</label>
          <input type="email" class="form-input" placeholder="partner@booking.com"></div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
          <i class="fas fa-info-circle mr-1"></i>
          After saving, our team will verify the connection and activate the channel within 24 hours.
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('addOtaModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('OTA channel request submitted!','success'); closeModal('addOtaModal')" class="btn-primary">Submit Request</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('OTA Settings', content, 'property', 'ota-settings'))
})

// ─── Reviews ──────────────────────────────────────────────────────────────────
propertyRoute.get('/reviews', (c) => {
  const reviews = [
    {guest:'Sarah Johnson', room:'Deluxe', rating:5, date:'Mar 10, 2026', comment:'Absolutely amazing stay! The staff was incredibly welcoming and the room was spotless.', source:'TripAdvisor', replied:true},
    {guest:'Michael Brown', room:'Super Deluxe', rating:4, date:'Mar 8, 2026', comment:'Great location and lovely amenities. The breakfast was excellent.', source:'Booking.com', replied:true},
    {guest:'Emma Wilson', room:'Standard', rating:3, date:'Mar 5, 2026', comment:'Good value for money. AC was a bit noisy at night.', source:'Website', replied:false},
    {guest:'James Lee', room:'Suite', rating:5, date:'Mar 3, 2026', comment:'Exceptional experience! Will definitely return. The pool view was breathtaking.', source:'Expedia', replied:true},
    {guest:'Priya Sharma', room:'Deluxe Couple', rating:4, date:'Feb 28, 2026', comment:'Perfect for our anniversary. Staff went above and beyond.', source:'Agoda', replied:false},
  ]
  const content = `
  ${pageHeader('Guest Reviews', 'Monitor and respond to guest reviews', `
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="card p-4 text-center"><div class="text-3xl font-bold text-gray-800">4.7</div><div class="text-yellow-400 my-1 text-lg">★★★★★</div><div class="text-xs text-gray-500">Overall Rating</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800 mb-1">1,248</div><div class="text-xs text-gray-500">Total Reviews</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">87%</div><div class="text-xs text-gray-500 mt-1">Positive Reviews</div></div>
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
                <div class="text-yellow-400 text-sm my-1">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <p class="text-sm text-gray-600">${r.comment}</p>
                ${r.replied ? `<div class="mt-1 text-xs text-green-600 flex items-center gap-1"><i class="fas fa-reply"></i>Replied by management</div>` : ''}
              </div>
            </div>
            ${!r.replied ? `<button onclick="openModal('replyReviewModal')" class="btn-primary btn-sm text-xs flex-shrink-0"><i class="fas fa-reply mr-1"></i>Reply</button>` : ''}
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
        <div class="bg-gray-50 rounded-lg p-3"><p class="text-sm text-gray-600 italic">"Good value for money. AC was a bit noisy at night."</p><div class="text-xs text-gray-400 mt-1">— Emma Wilson, Mar 5, 2026 (Standard Room)</div></div>
        <div><label class="form-label">Your Response *</label><textarea class="form-input" rows="4" placeholder="Write a professional, courteous response..."></textarea></div>
        <div class="text-xs text-gray-500">This reply will be publicly visible on ${'{source}'}</div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('replyReviewModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Reply posted successfully!','success'); closeModal('replyReviewModal')">Post Reply</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Reviews', content, 'property', 'reviews'))
})

// ─── Create My Property ───────────────────────────────────────────────────────
propertyRoute.get('/create-property', (c) => {
  const steps = [
    {label:'Basic Info', icon:'fa-info-circle'},
    {label:'Location', icon:'fa-map-marker-alt'},
    {label:'Rooms & Rates', icon:'fa-bed'},
    {label:'Amenities', icon:'fa-concierge-bell'},
    {label:'Media', icon:'fa-images'},
    {label:'Review & Launch', icon:'fa-rocket'},
  ]
  const content = `
  ${pageHeader('Create My Property', 'Set up a new property in the system', `
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}
  <!-- Step Progress -->
  <div class="card p-5 mb-4">
    <div class="flex items-center justify-between">
      ${steps.map((s, i) => `
        <div class="flex items-center ${i < steps.length-1 ? 'flex-1' : ''}">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${i===0?'bg-blue-600 text-white':i<3?'bg-green-500 text-white':'bg-gray-200 text-gray-500'}">
              ${i < 1 ? `<i class="fas ${s.icon} text-xs"></i>` : i < 3 ? '<i class="fas fa-check text-xs"></i>' : (i+1).toString()}
            </div>
            <span class="text-xs mt-1 font-medium ${i===0?'text-blue-600':i<3?'text-green-600':'text-gray-400'} hidden sm:block">${s.label}</span>
          </div>
          ${i < steps.length-1 ? `<div class="flex-1 h-1 mx-2 rounded ${i<2?'bg-blue-300':'bg-gray-200'}"></div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Step 1: Basic Property Information</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="form-label">Property Name *</label><input type="text" class="form-input" placeholder="e.g., Grand Palace Hotel & Resort"></div>
          <div><label class="form-label">Property Type *</label>
            <select class="form-input"><option>Hotel</option><option>Resort</option><option>Boutique Hotel</option><option>Guest House</option><option>Villa</option></select></div>
          <div><label class="form-label">Star Rating</label>
            <select class="form-input"><option>Unrated</option>${[1,2,3,4,5].map(s => `<option>${s} Star</option>`).join('')}</select></div>
          <div><label class="form-label">Total Rooms *</label><input type="number" class="form-input" placeholder="e.g. 45" min="1"></div>
          <div><label class="form-label">Year Established</label><input type="number" class="form-input" placeholder="e.g. 2015"></div>
          <div><label class="form-label">Phone Number *</label><input type="tel" class="form-input" placeholder="+880 1700-000000"></div>
          <div><label class="form-label">Email Address *</label><input type="email" class="form-input" placeholder="hotel@example.com"></div>
          <div class="col-span-2"><label class="form-label">Property Description *</label><textarea class="form-input" rows="4" placeholder="Describe your property, highlights, unique features..."></textarea></div>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" class="btn-primary" onclick="showToast('Basic info saved! Proceeding to Location...','success')">Save & Next <i class="fas fa-arrow-right ml-1"></i></button>
          <button type="button" class="btn-secondary">Save Draft</button>
        </div>
      </form>
    </div>
    <div class="space-y-4">
      <div class="card p-4 bg-blue-50 border-blue-100">
        <h4 class="font-semibold text-blue-800 mb-2"><i class="fas fa-info-circle mr-1"></i>Setup Checklist</h4>
        <ul class="text-xs text-blue-700 space-y-2">
          ${[
            {label:'Basic Info', done:true},
            {label:'Location & Address', done:false},
            {label:'Room Categories', done:false},
            {label:'Pricing Setup', done:false},
            {label:'Amenities List', done:false},
            {label:'Photos Upload', done:false},
            {label:'Payment Config', done:false},
          ].map(item => `
            <li class="flex items-center gap-2">
              <i class="fas ${item.done ? 'fa-check-circle text-green-500' : 'fa-circle text-blue-300'} text-sm"></i>
              <span class="${item.done ? 'line-through text-green-700' : ''}">${item.label}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="card p-4">
        <h4 class="font-semibold text-gray-800 mb-2">Need Help?</h4>
        <p class="text-xs text-gray-500 mb-3">Our onboarding team is ready to assist you set up your property.</p>
        <button class="btn-secondary w-full text-sm"><i class="fas fa-headset mr-1"></i>Contact Support</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create My Property', content, 'property', 'create-property'))
})
