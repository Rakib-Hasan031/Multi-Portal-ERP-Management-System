import { Hono } from 'hono'
import { statusBadge } from '../components/layout'

export const frontdeskRoute = new Hono()

function fdLayout(title: string, content: string, active: string = ''): string {
  const navItems = [
    {href:'/frontdesk', icon:'fa-tachometer-alt', label:'Dashboard', key:'dashboard'},
    {href:'/frontdesk/arrivals', icon:'fa-sign-in-alt', label:"Today's Arrivals", key:'arrivals'},
    {href:'/frontdesk/departures', icon:'fa-sign-out-alt', label:"Today's Departures", key:'departures'},
    {href:'/frontdesk/walk-in', icon:'fa-walking', label:'Walk-in Booking', key:'walkin'},
    {href:'/frontdesk/rooms', icon:'fa-bed', label:'Room Status', key:'rooms'},
    {href:'/frontdesk/payment', icon:'fa-credit-card', label:'Collect Payment', key:'payment'},
    {href:'/frontdesk/inhouse', icon:'fa-user-friends', label:'In-House Guests', key:'inhouse'},
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Front Desk</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body class="bg-gray-50 font-sans">
  <div class="flex h-screen overflow-hidden">
    <!-- FD Sidebar -->
    <aside class="w-56 bg-teal-900 text-white flex flex-col flex-shrink-0">
      <div class="flex items-center gap-2 px-4 py-4 border-b border-teal-800">
        <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
          <i class="fas fa-desktop text-white text-sm"></i>
        </div>
        <div>
          <div class="text-white font-bold text-sm">Front Desk</div>
          <div class="text-teal-300 text-xs">Grand Palace Hotel</div>
        </div>
      </div>
      <div class="px-3 py-2 border-b border-teal-800">
        <div class="text-teal-300 text-xs" id="fdDateTime"></div>
        <div class="text-white text-xs font-medium mt-0.5">Counter 1</div>
      </div>
      <nav class="flex-1 py-2 overflow-y-auto">
        ${navItems.map(n => `
          <a href="${n.href}" class="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-xs font-medium transition ${active === n.key ? 'bg-teal-600 text-white' : 'text-teal-200 hover:bg-teal-800 hover:text-white'}">
            <i class="fas ${n.icon} w-4 text-center"></i>${n.label}
          </a>
        `).join('')}
      </nav>
      <div class="border-t border-teal-800 p-3">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold">J</div>
          <div class="flex-1 min-w-0">
            <div class="text-white text-xs font-medium">John Desk</div>
            <div class="text-teal-400 text-xs">FD Officer</div>
          </div>
        </div>
        <a href="/auth/login" class="flex items-center gap-2 text-teal-300 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-teal-800/50">
          <i class="fas fa-sign-out-alt"></i> End Shift
        </a>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-2">
          <h1 class="text-base font-semibold text-gray-800">${title}</h1>
        </div>
        <div class="flex items-center gap-3">
          <a href="/frontdesk/walk-in" class="btn-primary btn-sm text-xs"><i class="fas fa-plus mr-1"></i>Walk-in</a>
          <button onclick="openModal('fdPaymentModal')" class="btn-secondary btn-sm text-xs"><i class="fas fa-credit-card mr-1"></i>Payment</button>
          <div class="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white">J</div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-4">
        ${content}
        <div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
      </main>
    </div>
  </div>
  <script src="/static/app.js"></script>
  <script>
    function updateDateTime() {
      const el = document.getElementById('fdDateTime');
      if (el) el.textContent = dayjs().format('ddd MMM D · h:mm A');
    }
    updateDateTime();
    setInterval(updateDateTime, 30000);
  </script>
</body>
</html>`
}

// FD Dashboard
frontdeskRoute.get('/', (c) => {
  const content = `
  <!-- Today's Overview -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
    <div class="card p-3 text-center border-t-4 border-teal-400"><div class="text-xl font-bold text-teal-600">11</div><div class="text-xs text-gray-500 mt-0.5">Check-ins Today</div></div>
    <div class="card p-3 text-center border-t-4 border-orange-400"><div class="text-xl font-bold text-orange-600">9</div><div class="text-xs text-gray-500 mt-0.5">Check-outs Today</div></div>
    <div class="card p-3 text-center border-t-4 border-blue-400"><div class="text-xl font-bold text-blue-600">63</div><div class="text-xs text-gray-500 mt-0.5">In-House Guests</div></div>
    <div class="card p-3 text-center border-t-4 border-green-400"><div class="text-xl font-bold text-green-600">18</div><div class="text-xs text-gray-500 mt-0.5">Available Rooms</div></div>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-4 gap-3 mb-4">
    ${[
      {href:'/frontdesk/walk-in', icon:'fa-walking', label:'Walk-in', color:'bg-blue-500 hover:bg-blue-600'},
      {onclick:"openModal('fdPaymentModal')", icon:'fa-credit-card', label:'Payment', color:'bg-green-500 hover:bg-green-600'},
      {href:'/frontdesk/arrivals', icon:'fa-sign-in-alt', label:'Check-in', color:'bg-teal-500 hover:bg-teal-600'},
      {href:'/frontdesk/departures', icon:'fa-sign-out-alt', label:'Check-out', color:'bg-orange-500 hover:bg-orange-600'},
    ].map(a => `
      <button ${a.href ? `onclick="window.location='${a.href}'"` : `onclick="${a.onclick}"`} class="${a.color} text-white rounded-xl p-4 text-center transition cursor-pointer">
        <i class="fas ${a.icon} text-2xl mb-2 block"></i>
        <span class="text-sm font-medium">${a.label}</span>
      </button>
    `).join('')}
  </div>

  <!-- Arrivals Today -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800 text-sm"><i class="fas fa-sign-in-alt text-teal-500 mr-1"></i>Pending Arrivals</h3>
        <a href="/frontdesk/arrivals" class="text-xs text-blue-600">All Arrivals</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {name:'James Wilson', room:'204', time:'2:00 PM', status:'confirmed', bookingId:'BK-2024-001'},
          {name:'Maria Santos', room:'301', time:'3:30 PM', status:'confirmed', bookingId:'BK-2024-002'},
          {name:'Ahmed Al-Rashid', room:'105', time:'4:00 PM', status:'pending', bookingId:'BK-2024-003'},
          {name:'Sophie Chen', room:'402', time:'5:00 PM', status:'confirmed', bookingId:'BK-2024-004'},
        ].map(a => `
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xs font-bold flex-shrink-0">${a.name.charAt(0)}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800">${a.name}</div>
              <div class="text-xs text-gray-400">Room ${a.room} · ${a.time} · ${a.bookingId}</div>
            </div>
            <button onclick="showToast('${a.name} checked in to Room ${a.room}!','success')" class="btn-success btn-sm text-xs">Check-in</button>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800 text-sm"><i class="fas fa-sign-out-alt text-orange-500 mr-1"></i>Pending Departures</h3>
        <a href="/frontdesk/departures" class="text-xs text-blue-600">All Departures</a>
      </div>
      <div class="divide-y divide-gray-50">
        ${[
          {name:'Emily Clark', room:'206', time:'10:00 AM', balance:0, bookingId:'BK-2024-006'},
          {name:'David Lee', room:'318', time:'11:00 AM', balance:0, bookingId:'BK-2024-007'},
          {name:'Fatima Nair', room:'101', time:'12:00 PM', balance:50, bookingId:'BK-2024-008'},
          {name:'Carlos Rivera', room:'415', time:'1:00 PM', balance:200, bookingId:'BK-2024-009'},
        ].map(d => `
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">${d.name.charAt(0)}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800">${d.name}</div>
              <div class="text-xs text-gray-400">Room ${d.room} · ${d.time}</div>
            </div>
            <div class="flex items-center gap-2">
              ${d.balance > 0 ? `<span class="text-xs text-red-500 font-medium">$${d.balance} due</span>` : `<span class="text-xs text-green-500">✓ Settled</span>`}
              <button onclick="showToast('${d.name} checked out from Room ${d.room}!','info')" class="btn-secondary btn-sm text-xs">Check-out</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- FD Payment Modal -->
  <div id="fdPaymentModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-credit-card text-green-500 mr-2"></i>Collect Payment</h3>
        <button onclick="closeModal('fdPaymentModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div>
          <label class="form-label">Search Guest (Phone / Booking ID) *</label>
          <div class="flex gap-2">
            <input type="text" class="form-input flex-1" placeholder="Enter phone or booking ID">
            <button class="btn-secondary" onclick="showToast('Guest record fetched!','info')"><i class="fas fa-search"></i></button>
          </div>
        </div>
        <div class="bg-teal-50 rounded-lg p-3 text-sm">
          <div class="font-medium text-gray-800">Fatima Nair — Room 101</div>
          <div class="text-gray-500 text-xs">BK-2024-008 · Outstanding: <span class="font-bold text-red-500">$50.00</span></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Amount ($)</label><input type="number" class="form-input" value="50.00"></div>
          <div><label class="form-label">Method</label><select class="form-input"><option>Cash</option><option>Credit Card</option><option>Debit Card</option></select></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('fdPaymentModal')" class="btn-secondary">Cancel</button>
        <button class="btn-success" onclick="showToast('Payment of $50 collected!','success');closeModal('fdPaymentModal')"><i class="fas fa-check mr-1"></i>Collect Payment</button>
      </div>
    </div>
  </div>
  `
  return c.html(fdLayout('Front Desk Dashboard', content, 'dashboard'))
})

// Arrivals
frontdeskRoute.get('/arrivals', (c) => {
  const content = `
  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800"><i class="fas fa-sign-in-alt text-teal-500 mr-2"></i>Today's Arrivals — ${new Date().toLocaleDateString('en',{dateStyle:'long'})}</h3>
      <span class="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">11 Expected</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Guest Name</th>
            <th class="table-header">Room</th>
            <th class="table-header">Category</th>
            <th class="table-header">Adults/Children</th>
            <th class="table-header">Checkout Date</th>
            <th class="table-header">Balance Due</th>
            <th class="table-header">Source</th>
            <th class="table-header">Status</th>
            <th class="table-header">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'BK-2024-001', guest:'James Wilson', room:'204', cat:'Deluxe', adults:2, children:0, checkout:'Mar 14', balance:0, source:'Website', status:'confirmed'},
            {id:'BK-2024-002', guest:'Maria Santos', room:'301', cat:'Suite', adults:2, children:1, checkout:'Mar 16', balance:536, source:'B2B', status:'confirmed'},
            {id:'BK-2024-003', guest:'Ahmed Al-Rashid', room:'105', cat:'Standard', adults:1, children:0, checkout:'Mar 13', balance:178, source:'OTA', status:'pending'},
            {id:'BK-2024-004', guest:'Sophie Chen', room:'402', cat:'Junior Suite', adults:2, children:2, checkout:'Mar 15', balance:0, source:'Website', status:'confirmed'},
          ].map(a => `
            <tr class="table-row hover:bg-teal-50">
              <td class="table-cell font-mono text-xs text-teal-600">${a.id}</td>
              <td class="table-cell font-medium text-gray-800">${a.guest}</td>
              <td class="table-cell font-bold">${a.room}</td>
              <td class="table-cell">${a.cat}</td>
              <td class="table-cell text-center">${a.adults}+${a.children}</td>
              <td class="table-cell text-xs">${a.checkout}</td>
              <td class="table-cell ${a.balance > 0 ? 'text-red-500 font-medium' : 'text-green-500'}">
                ${a.balance > 0 ? '$'+a.balance : 'Settled'}
              </td>
              <td class="table-cell text-xs"><span class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">${a.source}</span></td>
              <td class="table-cell">${statusBadge(a.status)}</td>
              <td class="table-cell">
                <button onclick="showToast('${a.guest} checked in! Key card issued.','success')" class="btn-success btn-sm text-xs">
                  <i class="fas fa-sign-in-alt mr-1"></i>Check-in
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(fdLayout("Today's Arrivals", content, 'arrivals'))
})

// Walk-in from FD
frontdeskRoute.get('/walk-in', (c) => {
  const content = `
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4"><i class="fas fa-walking text-teal-500 mr-2"></i>New Walk-in Booking</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">First Name *</label><input type="text" class="form-input" placeholder="John"></div>
          <div><label class="form-label">Last Name *</label><input type="text" class="form-input" placeholder="Smith"></div>
          <div><label class="form-label">Phone *</label><input type="tel" class="form-input" placeholder="+1 (000) 000-0000"></div>
          <div><label class="form-label">Nationality</label><select class="form-input"><option>United States</option><option>UK</option><option>UAE</option><option>Others</option></select></div>
          <div><label class="form-label">ID Type</label><select class="form-input"><option>Passport</option><option>Driver's License</option><option>National ID</option></select></div>
          <div><label class="form-label">ID Number *</label><input type="text" class="form-input" placeholder="Document number"></div>
          <div><label class="form-label">Check-in *</label><input type="date" class="form-input" id="checkIn" onchange="calculateNights()"></div>
          <div><label class="form-label">Check-out *</label><input type="date" class="form-input" id="checkOut" onchange="calculateNights()"></div>
          <div><label class="form-label">Room Type *</label><select class="form-input"><option>Standard ($89)</option><option>Deluxe ($129)</option><option>Suite ($259)</option></select></div>
          <div><label class="form-label">Room No.</label><select class="form-input"><option>101</option><option>103</option><option>204</option></select></div>
          <div><label class="form-label">Adults</label><input type="number" class="form-input" value="1" min="1"></div>
          <div><label class="form-label">Payment Method</label><select class="form-input"><option>Cash</option><option>Credit Card</option><option>Debit Card</option></select></div>
        </div>
        <button type="button" class="btn-success w-full justify-center" onclick="showToast('Walk-in booking created! Room 101 assigned. Key card issued.','success')">
          <i class="fas fa-check mr-1"></i>Create Walk-in & Assign Room
        </button>
      </form>
    </div>
    <div class="card p-4">
      <h3 class="font-semibold text-gray-800 mb-3 text-sm">Available Rooms</h3>
      <div class="space-y-1.5">
        ${[
          {room:'101', cat:'Standard', rate:89},
          {room:'103', cat:'Standard', rate:89},
          {room:'204', cat:'Deluxe', rate:129},
          {room:'207', cat:'Deluxe', rate:129},
          {room:'305', cat:'Suite', rate:259},
        ].map(r => `
          <div class="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-xs">
            <span class="font-bold text-green-700">Rm ${r.room}</span>
            <span class="text-gray-500">${r.cat}</span>
            <span class="font-medium">$${r.rate}/n</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `
  return c.html(fdLayout('Walk-in Booking', content, 'walkin'))
})

// Room Status
frontdeskRoute.get('/rooms', (c) => {
  const content = `
  <div class="flex gap-3 mb-4 flex-wrap text-xs">
    ${[['Available','bg-green-100 text-green-700',18], ['Occupied','bg-red-100 text-red-700',22], ['Dirty/Cleaning','bg-yellow-100 text-yellow-700',3], ['Maintenance','bg-gray-100 text-gray-600',2]].map(([l, c, n]) =>
      `<div class="card px-3 py-2 flex items-center gap-2"><span class="w-3 h-3 rounded ${(c as string).split(' ')[0]} inline-block"></span><span class="font-medium">${l}</span><span class="font-bold text-gray-800">(${n})</span></div>`
    ).join('')}
  </div>

  <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
    ${Array.from({length: 45}, (_, i) => {
      const roomNum = 100 + i + 1;
      const states = ['available', 'occupied', 'occupied', 'occupied', 'dirty'];
      const state = i === 5 ? 'maintenance' : i === 12 ? 'maintenance' : states[Math.floor(Math.random()*4)];
      const configs: Record<string, [string, string, string]> = {
        available: ['bg-green-100 border-green-200 text-green-700', 'fa-door-open', 'Available'],
        occupied: ['bg-red-100 border-red-200 text-red-700', 'fa-user', 'Occupied'],
        dirty: ['bg-yellow-100 border-yellow-200 text-yellow-700', 'fa-broom', 'Needs Cleaning'],
        maintenance: ['bg-gray-100 border-gray-200 text-gray-500', 'fa-wrench', 'Maintenance'],
      };
      const [cls, icon, label] = configs[state] || configs.available;
      return `<div class="aspect-square border rounded-xl ${cls} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition text-xs" title="Room ${roomNum} - ${label}">
        <i class="fas ${icon} text-xs mb-0.5"></i>
        <span class="font-bold">${roomNum}</span>
      </div>`;
    }).join('')}
  </div>
  `
  return c.html(fdLayout('Room Status', content, 'rooms'))
})

// In-house Guests
frontdeskRoute.get('/inhouse', (c) => {
  const content = `
  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800"><i class="fas fa-user-friends text-teal-500 mr-2"></i>In-House Guests (63)</h3>
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input type="text" placeholder="Search guest..." class="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-teal-500">
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Room</th>
            <th class="table-header">Guest Name</th>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Check-in</th>
            <th class="table-header">Check-out</th>
            <th class="table-header">Nights Left</th>
            <th class="table-header">Adults+Kids</th>
            <th class="table-header">Balance</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {room:'101', guest:'Carlos Mendez', id:'BK-2024-W01', checkin:'Mar 11', checkout:'Mar 13', nightsLeft:1, guests:'2+0', balance:0},
            {room:'204', guest:'James Wilson', id:'BK-2024-001', checkin:'Mar 11', checkout:'Mar 14', nightsLeft:2, guests:'2+0', balance:0},
            {room:'301', guest:'Maria Santos', id:'BK-2024-002', checkin:'Mar 12', checkout:'Mar 16', nightsLeft:3, guests:'2+1', balance:536},
            {room:'402', guest:'Sophie Chen', id:'BK-2024-004', checkin:'Mar 11', checkout:'Mar 15', nightsLeft:2, guests:'2+2', balance:0},
          ].map(g => `
            <tr class="table-row hover:bg-teal-50">
              <td class="table-cell font-bold text-teal-700 text-base">${g.room}</td>
              <td class="table-cell font-medium text-gray-800">${g.guest}</td>
              <td class="table-cell font-mono text-xs text-teal-600">${g.id}</td>
              <td class="table-cell text-xs">${g.checkin}</td>
              <td class="table-cell text-xs">${g.checkout}</td>
              <td class="table-cell text-center"><span class="font-bold text-gray-700">${g.nightsLeft}</span></td>
              <td class="table-cell text-center text-xs">${g.guests}</td>
              <td class="table-cell ${g.balance > 0 ? 'text-red-500 font-medium' : 'text-green-500'}">
                ${g.balance > 0 ? '$'+g.balance : 'Settled'}
              </td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="btn-secondary btn-sm text-xs" onclick="showToast('Extension processed!','success')">Extend</button>
                  <button class="btn-secondary btn-sm text-xs"><i class="fas fa-receipt"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(fdLayout('In-House Guests', content, 'inhouse'))
})
