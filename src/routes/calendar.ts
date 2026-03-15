import { Hono } from 'hono'
import { adminLayout, pageHeader } from '../components/layout'

export const calendarRoute = new Hono()

calendarRoute.get('/', (c) => {
  const rooms = [
    {num:'101', cat:'Standard'}, {num:'102', cat:'Standard'}, {num:'103', cat:'Standard'}, {num:'104', cat:'Standard'}, {num:'105', cat:'Standard'},
    {num:'201', cat:'Deluxe'},   {num:'202', cat:'Deluxe'},   {num:'203', cat:'Deluxe'},   {num:'204', cat:'Deluxe'},   {num:'205', cat:'Deluxe'},
    {num:'301', cat:'Super Deluxe'}, {num:'302', cat:'Super Deluxe'}, {num:'303', cat:'Super Deluxe'}, {num:'304', cat:'Super Deluxe'},
    {num:'401', cat:'Deluxe Couple'}, {num:'402', cat:'Deluxe Couple'}, {num:'403', cat:'Deluxe Couple'}, {num:'404', cat:'Deluxe Couple'},
  ]

  const days = Array.from({length: 31}, (_, i) => {
    const d = new Date(2026, 2, i + 1)
    return {
      num: i + 1,
      day: d.toLocaleDateString('en', {weekday:'short'}),
      isToday: i === 13,  // March 14
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }
  })

  const occupancyData: Record<string, string> = {
    // Standard
    '101-11': 'check-in', '101-12': 'occupied', '101-13': 'occupied', '101-14': 'check-out',
    '102-16': 'check-in', '102-17': 'occupied', '102-18': 'occupied', '102-19': 'check-out',
    '103-14': 'check-in', '103-15': 'occupied', '103-16': 'occupied', '103-17': 'check-out',
    '104-11': 'maintenance', '104-12': 'maintenance', '104-13': 'maintenance',
    '105-9':  'occupied',  '105-10': 'occupied',  '105-11': 'check-out',
    // Deluxe
    '201-8':  'check-in',  '201-9':  'occupied',  '201-10': 'occupied', '201-11': 'check-out',
    '202-14': 'check-in',  '202-15': 'occupied',  '202-16': 'occupied', '202-17': 'check-out',
    '203-11': 'check-in',  '203-12': 'occupied',  '203-13': 'occupied', '203-14': 'occupied',  '203-15': 'check-out',
    '204-14': 'check-in',  '204-15': 'occupied',  '204-16': 'check-out',
    '205-10': 'occupied',  '205-11': 'occupied',  '205-12': 'occupied',  '205-13': 'check-out',
    // Super Deluxe
    '301-7':  'check-in',  '301-8':  'occupied',  '301-9':  'occupied',  '301-10': 'occupied', '301-11': 'check-out',
    '302-12': 'maintenance','302-13': 'maintenance',
    '303-18': 'check-in',  '303-19': 'occupied',  '303-20': 'occupied',  '303-21': 'check-out',
    '304-11': 'check-in',  '304-12': 'occupied',  '304-13': 'occupied',  '304-14': 'check-out',
    // Deluxe Couple
    '401-14': 'check-in',  '401-15': 'occupied',  '401-16': 'occupied',  '401-17': 'check-out',
    '402-9':  'check-in',  '402-10': 'occupied',  '402-11': 'occupied',  '402-12': 'check-out',
    '403-16': 'check-in',  '403-17': 'occupied',  '403-18': 'occupied',  '403-19': 'check-out',
    '404-21': 'check-in',  '404-22': 'occupied',  '404-23': 'check-out',
  }

  const cellClasses: Record<string, string> = {
    'check-in':    'bg-teal-200',
    'check-out':   'bg-orange-200',
    'occupied':    'bg-blue-200',
    'maintenance': 'bg-yellow-100',
    'available':   'bg-green-50',
  }

  // Mini availability calendar data
  const miniCalDays = Array.from({length: 31}, (_, i) => {
    const dayNum = i + 1
    // Count occupied rooms on this day
    let occupied = 0
    rooms.forEach(r => {
      const k = `${r.num}-${dayNum}`
      if (occupancyData[k] && occupancyData[k] !== 'available') occupied++
    })
    const avail = rooms.length - occupied
    const ratio = occupied / rooms.length
    let calStatus = 'available'
    if (ratio > 0.7) calStatus = 'occupied'
    else if (ratio > 0.3) calStatus = 'reserved'
    return { num: dayNum, status: calStatus, avail: avail, occ: occupied, isToday: dayNum === 14 }
  })

  const content = `
  ${pageHeader('Booking Calendar', 'Full-month visual room availability & occupancy', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-th"></i>Room Board</a>
    <div class="flex gap-1 items-center">
      <button class="btn-secondary btn-sm"><i class="fas fa-chevron-left"></i></button>
      <span class="text-sm font-medium text-gray-700 px-2">March 2026</span>
      <button class="btn-secondary btn-sm"><i class="fas fa-chevron-right"></i></button>
    </div>
  `)}

  <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
    <!-- ─── Mini Room Availability Calendar Widget (Image 2 style) ─── -->
    <div class="xl:col-span-1 card p-4">
      <div class="flex items-center gap-2 mb-3">
        <i class="fas fa-calendar-alt text-blue-500"></i>
        <h3 class="font-semibold text-gray-800">Room Availability</h3>
      </div>
      <!-- Legend -->
      <div class="flex items-center gap-3 mb-3 text-xs">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>Avail</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>Occup</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>Resv</span>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1 mb-3">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d =>
          `<div class="text-center text-xs font-semibold text-gray-500 py-1">${d}</div>`
        ).join('')}
        <!-- March 2026 starts on Sunday (offset = 0) -->
        ${miniCalDays.map(d => {
          const statusColor = {
            available: 'avail-cal-available',
            occupied:  'avail-cal-occupied',
            reserved:  'avail-cal-reserved',
          }[d.status]
          return `<div class="avail-cal-day ${statusColor} ${d.isToday ? 'avail-cal-today' : ''}"
            title="Mar ${d.num}: ${d.avail} available, ${d.occ} occupied">${d.num}</div>`
        }).join('')}
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-2 mt-3">
        <div class="bg-green-50 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-green-600">18</div>
          <div class="text-xs text-gray-500">Available</div>
        </div>
        <div class="bg-red-50 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-red-500">27</div>
          <div class="text-xs text-gray-500">Occupied</div>
        </div>
        <div class="bg-yellow-50 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-yellow-600">0</div>
          <div class="text-xs text-gray-500">Reserved</div>
        </div>
      </div>
    </div>

    <!-- ─── Full Timeline Calendar ─── -->
    <div class="xl:col-span-3 card">
      <!-- Legend -->
      <div class="flex gap-4 flex-wrap text-xs p-3 border-b border-gray-100">
        ${[
          ['Check-in', 'bg-teal-200'],
          ['Occupied', 'bg-blue-200'],
          ['Check-out', 'bg-orange-200'],
          ['Maintenance', 'bg-yellow-100'],
          ['Available', 'bg-green-50 border border-gray-200'],
        ].map(([l, cls]) => `<span class="flex items-center gap-1"><span class="w-4 h-4 rounded ${cls} inline-block border border-gray-200"></span>${l}</span>`).join('')}
      </div>
      <div class="overflow-x-auto">
        <table class="border-collapse" style="min-width:900px;width:100%">
          <thead>
            <tr>
              <th class="sticky left-0 z-10 bg-gray-50 border border-gray-200 p-2 text-xs font-semibold text-gray-600 text-left w-24 min-w-[96px]">Room</th>
              ${days.map(d => `
                <th class="border border-gray-200 p-1 text-center min-w-[36px] ${d.isToday ? 'bg-blue-50' : d.isWeekend ? 'bg-amber-50/50' : 'bg-gray-50'}">
                  <div class="text-xs font-medium ${d.isToday ? 'text-blue-600' : 'text-gray-400'}">${d.day.charAt(0)}</div>
                  <div class="text-xs font-bold ${d.isToday ? 'text-blue-700 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto' : 'text-gray-700'}">${d.num}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${rooms.map(room => `
              <tr>
                <td class="sticky left-0 z-10 bg-white border border-gray-200 p-2">
                  <div class="font-bold text-xs text-gray-800">${room.num}</div>
                  <div class="text-xs text-gray-400 leading-tight">${room.cat}</div>
                </td>
                ${days.map(d => {
                  const key = `${room.num}-${d.num}`
                  const state = occupancyData[key] || 'available'
                  const cls = cellClasses[state] || 'bg-green-50'
                  return `<td class="border border-gray-100 p-0 h-7 ${cls} cursor-pointer hover:opacity-70 transition"
                    onclick="openModal('quickBookingModal')"
                    title="Room ${room.num} - ${state.charAt(0).toUpperCase()+state.slice(1)} - Mar ${d.num}">
                  </td>`
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Occupancy Summary Row -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-green-600">7</div>
      <div class="text-xs text-gray-500 mt-1">Available Now</div>
      <div class="text-xs text-green-500 mt-0.5">+2 check-outs today</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">9</div>
      <div class="text-xs text-gray-500 mt-1">Occupied</div>
      <div class="text-xs text-blue-500 mt-0.5">3 due check-out</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-yellow-600">2</div>
      <div class="text-xs text-gray-500 mt-1">Maintenance</div>
      <div class="text-xs text-yellow-500 mt-0.5">Rooms 104, 302</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-purple-600">61%</div>
      <div class="text-xs text-gray-500 mt-1">Occupancy Rate</div>
      <div class="text-xs text-purple-500 mt-0.5">↑ 5% vs last week</div>
    </div>
  </div>

  <!-- Quick Booking Modal (same as in property overview) -->
  <div id="quickBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl" style="max-height:88vh;overflow-y:auto;">
      <div class="modal-header sticky top-0 bg-white z-10 border-b">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center"><i class="fas fa-plus text-white text-xs"></i></div>
          <h3 class="text-lg font-semibold text-gray-800">Quick New Booking</h3>
        </div>
        <button onclick="closeModal('quickBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="form-label">Guest Name *</label><input type="text" class="form-input" placeholder="Full name"></div>
          <div><label class="form-label">Phone Number *</label><input type="tel" class="form-input" placeholder="+880 1700-000000"></div>
          <div><label class="form-label">Email</label><input type="email" class="form-input" placeholder="guest@email.com"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Room Category *</label>
            <select class="form-input">
              <option value="">Select Category</option>
              <option value="standard">Standard — ৳2,000/night</option>
              <option value="deluxe">Deluxe — ৳3,500/night</option>
              <option value="super_deluxe">Super Deluxe — ৳5,000/night</option>
              <option value="deluxe_couple">Deluxe Couple — ৳4,500/night</option>
            </select>
          </div>
          <div><label class="form-label">Total Rooms</label><input type="number" class="form-input" value="1" min="1"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Check-in Date *</label><input type="date" class="form-input"></div>
          <div><label class="form-label">Check-out Date *</label><input type="date" class="form-input"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">Adults *</label><input type="number" class="form-input" value="2" min="1"></div>
          <div><label class="form-label">Children</label><input type="number" class="form-input" value="0" min="0"></div>
        </div>
        <div><label class="form-label">Booking Source</label>
          <select class="form-input"><option>Walk-in</option><option>Phone</option><option>Website</option><option>B2B Agent</option><option>OTA</option></select>
        </div>
        <div><label class="form-label">Special Requests</label><textarea class="form-input" rows="2" placeholder="Any special requirements..."></textarea></div>
        <div class="bg-blue-50 rounded-xl p-3 text-xs text-blue-700"><i class="fas fa-info-circle mr-1"></i>Rate will be calculated automatically. Room will be assigned upon confirmation.</div>
      </div>
      <div class="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3 justify-end">
        <button onclick="closeModal('quickBookingModal')" class="btn-secondary">Cancel</button>
        <button onclick="showToast('Booking created! Pending room assignment.','success'); closeModal('quickBookingModal')" class="btn-primary">Create Booking</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Calendar', content, 'calendar'))
})
