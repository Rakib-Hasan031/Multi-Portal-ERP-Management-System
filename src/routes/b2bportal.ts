import { Hono } from 'hono'
import { statusBadge } from '../components/layout'

export const b2bPortalRoute = new Hono()

function b2bLayout(title: string, content: string, active: string = ''): string {
  const navItems = [
    {href:'/b2b-portal', icon:'fa-tachometer-alt', label:'Dashboard', key:'dashboard'},
    {href:'/b2b-portal/search', icon:'fa-search', label:'Search & Book', key:'search'},
    {href:'/b2b-portal/bookings', icon:'fa-calendar-check', label:'My Bookings', key:'bookings'},
    {href:'/b2b-portal/commission', icon:'fa-percentage', label:'Commission', key:'commission'},
    {href:'/b2b-portal/invoices', icon:'fa-file-invoice', label:'Invoices', key:'invoices'},
    {href:'/b2b-portal/profile', icon:'fa-user-tie', label:'Profile', key:'profile'},
  ]
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — B2B Agent Portal</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body class="bg-gray-50 font-sans">
  <div class="flex h-screen overflow-hidden">
    <!-- B2B Sidebar -->
    <aside class="w-60 bg-indigo-900 text-white flex flex-col flex-shrink-0">
      <div class="flex items-center gap-2 px-4 py-4 border-b border-indigo-800">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <i class="fas fa-briefcase text-white text-sm"></i>
        </div>
        <div>
          <div class="text-white font-bold text-sm">Agent Portal</div>
          <div class="text-indigo-300 text-xs">B2B Partner Access</div>
        </div>
      </div>
      <div class="px-3 py-2 border-b border-indigo-800">
        <div class="bg-indigo-800 rounded-lg p-2">
          <div class="text-white text-xs font-medium truncate">Horizon Travel Agency</div>
          <div class="text-indigo-300 text-xs">AGT-001 · 10% Commission</div>
        </div>
      </div>
      <nav class="flex-1 py-2 overflow-y-auto">
        ${navItems.map(n => `
          <a href="${n.href}" class="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-xs font-medium transition ${active === n.key ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}">
            <i class="fas ${n.icon} w-4 text-center"></i>${n.label}
          </a>
        `).join('')}
      </nav>
      <div class="border-t border-indigo-800 p-3">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">J</div>
          <div class="flex-1 min-w-0">
            <div class="text-white text-xs font-medium truncate">John Matthews</div>
            <div class="text-indigo-400 text-xs">Agent Manager</div>
          </div>
        </div>
        <a href="/auth/login" class="flex items-center gap-2 text-indigo-300 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-indigo-800/50">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 class="text-base font-semibold text-gray-800">${title}</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <i class="fas fa-bell text-gray-400"></i>
          <span class="text-xs">Grand Palace Hotel</span>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-4">
        ${content}
        <div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
      </main>
    </div>
  </div>
  <script src="/static/app.js"></script>
</body>
</html>`
}

// B2B Dashboard
b2bPortalRoute.get('/', (c) => {
  const content = `
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="card p-4 text-center border-t-4 border-blue-400"><div class="text-2xl font-bold text-blue-600">45</div><div class="text-xs text-gray-500 mt-1">Total Bookings</div></div>
    <div class="card p-4 text-center border-t-4 border-green-400"><div class="text-2xl font-bold text-green-600">$28,500</div><div class="text-xs text-gray-500 mt-1">Total Sales</div></div>
    <div class="card p-4 text-center border-t-4 border-purple-400"><div class="text-2xl font-bold text-purple-600">$2,850</div><div class="text-xs text-gray-500 mt-1">Commission Earned</div></div>
    <div class="card p-4 text-center border-t-4 border-orange-400"><div class="text-2xl font-bold text-orange-600">$1,350</div><div class="text-xs text-gray-500 mt-1">Balance Due</div></div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800 text-sm">Recent Bookings</h3>
        <a href="/b2b-portal/bookings" class="text-xs text-blue-600">View All</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {id:'BK-2024-B01', guest:'Michael Brown', room:'Suite', checkin:'Mar 12', status:'confirmed', amount:777},
          {id:'BK-2024-B02', guest:'Fatima Al-Sayed', room:'Deluxe', checkin:'Mar 14', status:'confirmed', amount:516},
          {id:'BK-2024-B03', guest:'Sarah Connor', room:'Standard', checkin:'Mar 8', status:'checked-out', amount:178},
        ].map(b => `
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-800">${b.guest}</div>
              <div class="text-xs text-gray-400">${b.id} · ${b.room} · ${b.checkin}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">$${b.amount}</div>
              ${statusBadge(b.status)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card p-4">
      <h3 class="font-semibold text-gray-800 text-sm mb-3">Commission Summary</h3>
      <div class="space-y-3">
        <div class="flex justify-between text-sm"><span class="text-gray-500">Commission Rate</span><span class="font-bold text-purple-600">10%</span></div>
        <div class="flex justify-between text-sm"><span class="text-gray-500">Total Earned</span><span class="font-semibold">$2,850</span></div>
        <div class="flex justify-between text-sm"><span class="text-gray-500">Paid Out</span><span class="text-green-600">$1,500</span></div>
        <div class="flex justify-between text-sm font-bold border-t pt-2"><span>Balance Due to You</span><span class="text-orange-600">$1,350</span></div>
      </div>
      <a href="/b2b-portal/commission" class="btn-primary w-full justify-center mt-3 text-sm"><i class="fas fa-eye mr-1"></i>View Statement</a>
    </div>
  </div>
  `
  return c.html(b2bLayout('B2B Dashboard', content, 'dashboard'))
})

// B2B Search & Book
b2bPortalRoute.get('/search', (c) => {
  const content = `
  <div class="card p-5 mb-4">
    <h3 class="font-semibold text-gray-800 mb-4">Search & Book for Your Client</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div><label class="form-label">Check-in</label><input type="date" class="form-input text-sm"></div>
      <div><label class="form-label">Check-out</label><input type="date" class="form-input text-sm"></div>
      <div><label class="form-label">Guests</label><select class="form-input text-sm"><option>2 Adults</option><option>1 Adult</option><option>3 Adults</option></select></div>
      <div class="flex items-end"><button class="btn-primary w-full justify-center" onclick="showToast('Searching available rooms...','info')"><i class="fas fa-search mr-1"></i>Search</button></div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${[
      {name:'Standard Room', price:79, agentPrice:71, commission:10, color:'bg-blue-500'},
      {name:'Deluxe Room', price:129, agentPrice:116, commission:10, color:'bg-purple-500'},
      {name:'Junior Suite', price:189, agentPrice:170, commission:10, color:'bg-teal-500'},
      {name:'Suite', price:259, agentPrice:233, commission:10, color:'bg-orange-500'},
      {name:'Executive Suite', price:389, agentPrice:350, commission:10, color:'bg-red-500'},
      {name:'Presidential Suite', price:599, agentPrice:539, commission:10, color:'bg-indigo-500'},
    ].map(r => `
      <div class="card overflow-hidden hover:shadow-md transition">
        <div class="${r.color} h-24 flex items-end p-3">
          <div class="text-white">
            <div class="font-bold text-sm">${r.name}</div>
            <div class="text-white/80 text-xs">Up to 2 guests</div>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <div class="text-xs text-gray-400 line-through">$${r.price}/night</div>
              <div class="text-lg font-bold text-gray-800">$${r.agentPrice}<span class="text-sm font-normal text-gray-500">/night</span></div>
              <div class="text-xs text-green-600 font-medium"><i class="fas fa-percentage mr-1"></i>${r.commission}% commission = $${(r.agentPrice * 0.1).toFixed(0)}/night</div>
            </div>
            <button onclick="openModal('agentBookingModal')" class="btn-primary btn-sm text-xs">Book</button>
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- Agent Booking Modal -->
  <div id="agentBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-calendar-plus text-indigo-500 mr-2"></i>New Agent Booking</h3>
        <button onclick="closeModal('agentBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Client First Name *</label><input type="text" class="form-input" placeholder="First name"></div>
          <div><label class="form-label">Client Last Name *</label><input type="text" class="form-input" placeholder="Last name"></div>
          <div><label class="form-label">Client Email</label><input type="email" class="form-input" placeholder="client@email.com"></div>
          <div><label class="form-label">Client Phone</label><input type="tel" class="form-input" placeholder="+1 000 000 0000"></div>
          <div><label class="form-label">Check-in *</label><input type="date" class="form-input"></div>
          <div><label class="form-label">Check-out *</label><input type="date" class="form-input"></div>
          <div><label class="form-label">Adults</label><input type="number" class="form-input" value="2"></div>
          <div><label class="form-label">Children</label><input type="number" class="form-input" value="0"></div>
          <div class="col-span-2"><label class="form-label">Special Requests</label><textarea class="form-input" rows="2" placeholder="Any special requirements from your client..."></textarea></div>
        </div>
        <div class="bg-indigo-50 rounded-xl p-3 text-sm">
          <div class="font-medium text-gray-800 mb-1">Booking Summary</div>
          <div class="flex justify-between text-gray-600"><span>Room Rate:</span><span>$116/night</span></div>
          <div class="flex justify-between text-green-600 font-medium"><span>Your Commission (10%):</span><span>$11.60/night</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('agentBookingModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Booking submitted! Confirmation will be sent.','success');closeModal('agentBookingModal')">Confirm Booking</button>
      </div>
    </div>
  </div>
  `
  return c.html(b2bLayout('Search & Book', content, 'search'))
})

// B2B Bookings List
b2bPortalRoute.get('/bookings', (c) => {
  const content = `
  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">My Client Bookings</h3>
      <a href="/b2b-portal/search" class="btn-primary btn-sm"><i class="fas fa-plus mr-1"></i>New Booking</a>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Client Name</th>
            <th class="table-header">Room Type</th>
            <th class="table-header">Dates</th>
            <th class="table-header">Nights</th>
            <th class="table-header">Rate</th>
            <th class="table-header">Commission</th>
            <th class="table-header">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'BK-2024-B01', client:'Michael Brown', room:'Suite', checkin:'Mar 12', checkout:'Mar 15', nights:3, rate:777, comm:77.70, status:'confirmed'},
            {id:'BK-2024-B02', client:'Fatima Al-Sayed', room:'Deluxe Room', checkin:'Mar 14', checkout:'Mar 18', nights:4, rate:516, comm:61.92, status:'confirmed'},
            {id:'BK-2024-B03', client:'Sarah Connor', room:'Standard Room', checkin:'Mar 8', checkout:'Mar 10', nights:2, rate:178, comm:17.80, status:'checked-out'},
          ].map(b => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-indigo-600">${b.id}</td>
              <td class="table-cell font-medium text-gray-800">${b.client}</td>
              <td class="table-cell">${b.room}</td>
              <td class="table-cell text-xs">${b.checkin} → ${b.checkout}</td>
              <td class="table-cell text-center">${b.nights}</td>
              <td class="table-cell font-semibold">$${b.rate}</td>
              <td class="table-cell text-green-600 font-medium">+$${b.comm.toFixed(2)}</td>
              <td class="table-cell">${statusBadge(b.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(b2bLayout('My Bookings', content, 'bookings'))
})

// B2B Commission
b2bPortalRoute.get('/commission', (c) => {
  const content = `
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="card p-4 text-center border-t-4 border-green-400"><div class="text-2xl font-bold text-green-600">$2,850</div><div class="text-xs text-gray-500 mt-1">Total Earned</div></div>
    <div class="card p-4 text-center border-t-4 border-blue-400"><div class="text-2xl font-bold text-blue-600">$1,500</div><div class="text-xs text-gray-500 mt-1">Paid Out</div></div>
    <div class="card p-4 text-center border-t-4 border-orange-400"><div class="text-2xl font-bold text-orange-600">$1,350</div><div class="text-xs text-gray-500 mt-1">Pending Balance</div></div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Commission Statement</h3>
      <div class="flex gap-2">
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>March 2024</option><option>February 2024</option><option>January 2024</option></select>
        <button class="btn-secondary btn-sm text-xs"><i class="fas fa-download mr-1"></i>Download PDF</button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Client</th>
            <th class="table-header">Room</th>
            <th class="table-header">Stay Dates</th>
            <th class="table-header">Booking Value</th>
            <th class="table-header">Comm. %</th>
            <th class="table-header">Commission Earned</th>
            <th class="table-header">Payment Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'BK-2024-B01', client:'Michael Brown', room:'Suite', dates:'Mar 12-15', value:777, commPct:10, commAmt:77.70, paid:false},
            {id:'BK-2024-B02', client:'Fatima Al-Sayed', room:'Deluxe', dates:'Mar 14-18', value:516, commPct:10, commAmt:61.92, paid:false},
            {id:'BK-2024-B03', client:'Sarah Connor', room:'Standard', dates:'Mar 8-10', value:178, commPct:10, commAmt:17.80, paid:true},
            {id:'BK-2024-B04', client:'Klaus Müller', room:'Exec Suite', dates:'Mar 5-10', value:1945, commPct:10, commAmt:194.50, paid:true},
          ].map(b => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-indigo-600">${b.id}</td>
              <td class="table-cell font-medium">${b.client}</td>
              <td class="table-cell">${b.room}</td>
              <td class="table-cell text-xs text-gray-500">${b.dates}</td>
              <td class="table-cell font-semibold">$${b.value}</td>
              <td class="table-cell text-center"><span class="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">${b.commPct}%</span></td>
              <td class="table-cell font-bold text-green-600">$${b.commAmt.toFixed(2)}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded-full ${b.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                  ${b.paid ? '<i class="fas fa-check mr-1"></i>Paid' : '<i class="fas fa-clock mr-1"></i>Pending'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 bg-gray-50 border-t flex justify-between items-center">
      <div class="text-sm text-gray-500">Next payout: March 31, 2024</div>
      <div class="text-sm font-bold text-orange-600">Outstanding: $1,350.00</div>
    </div>
  </div>
  `
  return c.html(b2bLayout('Commission Statement', content, 'commission'))
})
