import { Hono } from 'hono'
import { adminLayout, pageHeader } from '../components/layout'

export const calendarRoute = new Hono()

calendarRoute.get('/', (c) => {
  const rooms = [
    {num:'101', cat:'Standard'}, {num:'102', cat:'Standard'}, {num:'103', cat:'Standard'},
    {num:'201', cat:'Deluxe'}, {num:'202', cat:'Deluxe'}, {num:'203', cat:'Deluxe'},
    {num:'204', cat:'Deluxe'}, {num:'205', cat:'Deluxe'},
    {num:'301', cat:'Suite'}, {num:'302', cat:'Suite'}, {num:'303', cat:'Suite'},
    {num:'401', cat:'Presidential'},
  ]

  const days = Array.from({length: 31}, (_, i) => {
    const d = new Date(2024, 2, i + 1)
    return {
      num: i + 1,
      day: d.toLocaleDateString('en', {weekday:'short'}),
      isToday: i === 10,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }
  })

  const occupancyData: Record<string, string> = {
    '101-11': 'check-in', '101-12': 'occupied', '101-13': 'occupied', '101-14': 'check-out',
    '201-9': 'occupied', '201-10': 'occupied', '201-11': 'check-out',
    '203-11': 'check-in', '203-12': 'occupied', '203-13': 'occupied', '203-14': 'occupied', '203-15': 'check-out',
    '301-8': 'check-in', '301-9': 'occupied', '301-10': 'occupied', '301-11': 'occupied', '301-12': 'occupied', '301-13': 'check-out',
    '302-15': 'check-in', '302-16': 'occupied', '302-17': 'occupied', '302-18': 'check-out',
    '202-11': 'maintenance', '202-12': 'maintenance',
    '102-14': 'check-in', '102-15': 'occupied', '102-16': 'occupied', '102-17': 'check-out',
    '205-10': 'occupied', '205-11': 'occupied', '205-12': 'occupied', '205-13': 'check-out',
    '303-20': 'check-in', '303-21': 'occupied', '303-22': 'occupied', '303-23': 'check-out',
  }

  const cellClasses: Record<string, string> = {
    'check-in': 'bg-teal-200 border-teal-400',
    'check-out': 'bg-orange-200 border-orange-400',
    'occupied': 'bg-blue-200 border-blue-400',
    'maintenance': 'bg-yellow-100 border-yellow-400',
    'available': 'bg-green-50',
  }

  const content = `
  ${pageHeader('Booking Calendar', 'Full-month visual room availability calendar', `
    <button onclick="openModal('quickBookingModal')" class="btn-primary"><i class="fas fa-plus"></i>New Booking</button>
    <div class="flex gap-1">
      <button class="btn-secondary btn-sm"><i class="fas fa-chevron-left"></i></button>
      <span class="text-sm font-medium text-gray-700 px-2 flex items-center">March 2024</span>
      <button class="btn-secondary btn-sm"><i class="fas fa-chevron-right"></i></button>
    </div>
  `)}

  <!-- Legend -->
  <div class="flex gap-4 mb-3 flex-wrap text-xs bg-white rounded-xl border border-gray-100 p-3">
    ${[
      ['Check-in', 'bg-teal-200'],
      ['Occupied', 'bg-blue-200'],
      ['Check-out', 'bg-orange-200'],
      ['Maintenance', 'bg-yellow-100'],
      ['Available', 'bg-green-50 border border-gray-200'],
    ].map(([l, cls]) => `<span class="flex items-center gap-1"><span class="w-4 h-4 rounded ${cls} inline-block border border-gray-200"></span>${l}</span>`).join('')}
    <span class="ml-auto text-gray-400">Total: ${rooms.length} rooms shown</span>
  </div>

  <!-- Calendar -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="border-collapse" style="min-width:1200px; width:100%">
        <thead>
          <tr>
            <th class="sticky left-0 z-10 bg-gray-50 border border-gray-200 p-2 text-xs font-semibold text-gray-600 text-left w-24 min-w-[96px]">Room</th>
            ${days.map(d => `
              <th class="border border-gray-200 p-1 text-center min-w-[40px] ${d.isToday ? 'bg-blue-50' : d.isWeekend ? 'bg-amber-50/50' : 'bg-gray-50'}">
                <div class="text-xs font-medium ${d.isToday ? 'text-blue-600' : 'text-gray-500'}">${d.day}</div>
                <div class="text-xs font-bold ${d.isToday ? 'text-blue-700' : 'text-gray-700'}">${d.num}</div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rooms.map(room => `
            <tr>
              <td class="sticky left-0 z-10 bg-white border border-gray-200 p-2">
                <div class="font-bold text-sm text-gray-800">Rm ${room.num}</div>
                <div class="text-xs text-gray-400">${room.cat}</div>
              </td>
              ${days.map(d => {
                const key = `${room.num}-${d.num}`
                const state = occupancyData[key] || 'available'
                const cls = cellClasses[state] || 'bg-green-50'
                const tooltip = state === 'available' ? 'Available' : state.charAt(0).toUpperCase() + state.slice(1)
                return `<td class="border border-gray-100 p-0 h-8 ${cls} cursor-pointer hover:opacity-75 transition" 
                  onclick="openModal('quickBookingModal')" title="${room.num} - ${tooltip} - Mar ${d.num}">
                  ${state !== 'available' ? `<div class="w-full h-full"></div>` : ''}
                </td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Occupancy Summary -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
    <div class="card p-3 text-center">
      <div class="text-xl font-bold text-green-600">5</div>
      <div class="text-xs text-gray-500">Available Now</div>
    </div>
    <div class="card p-3 text-center">
      <div class="text-xl font-bold text-blue-600">7</div>
      <div class="text-xs text-gray-500">Currently Occupied</div>
    </div>
    <div class="card p-3 text-center">
      <div class="text-xl font-bold text-yellow-600">2</div>
      <div class="text-xs text-gray-500">Maintenance</div>
    </div>
    <div class="card p-3 text-center">
      <div class="text-xl font-bold text-gray-600">58.3%</div>
      <div class="text-xs text-gray-500">Occupancy Rate</div>
    </div>
  </div>
  `
  return c.html(adminLayout('Calendar', content, 'calendar'))
})
