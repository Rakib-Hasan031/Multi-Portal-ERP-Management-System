import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const logRoute = new Hono()

function logTable(title: string, logs: any[]): string {
  return `
  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">${title}</h3>
      <div class="flex gap-2">
        <button class="btn-secondary btn-sm"><i class="fas fa-download mr-1"></i>Export</button>
        <button class="btn-danger btn-sm text-xs" onclick="confirmAction('Clear all logs?', ()=>showToast('Logs cleared','success'))">Clear Logs</button>
      </div>
    </div>
    <!-- Filter Bar -->
    <div class="p-3 border-b border-gray-100 flex gap-3 flex-wrap">
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search logs..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <input type="date" class="form-input text-sm w-auto py-2">
      <input type="date" class="form-input text-sm w-auto py-2">
      <select class="form-input text-sm w-auto py-2">
        <option>All Actions</option>
        <option>Login</option><option>Booking Created</option><option>Booking Modified</option>
        <option>Payment</option><option>Logout</option>
      </select>
      <button class="btn-primary btn-sm">Filter</button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Log ID</th>
            <th class="table-header">User</th>
            <th class="table-header">Action</th>
            <th class="table-header">Description</th>
            <th class="table-header">IP Address</th>
            <th class="table-header">Device / Browser</th>
            <th class="table-header">Date & Time</th>
            <th class="table-header">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${logs.map(l => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-gray-500">${l.id}</td>
              <td class="table-cell">
                <div class="font-medium text-sm text-gray-800">${l.user}</div>
                <div class="text-xs text-gray-400">${l.email}</div>
              </td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium ${
                  l.action.includes('Login') ? 'bg-blue-100 text-blue-700' :
                  l.action.includes('Booking') ? 'bg-green-100 text-green-700' :
                  l.action.includes('Payment') ? 'bg-purple-100 text-purple-700' :
                  l.action.includes('Cancel') ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }">${l.action}</span>
              </td>
              <td class="table-cell text-xs text-gray-600 max-w-xs truncate">${l.description}</td>
              <td class="table-cell font-mono text-xs text-gray-500">${l.ip}</td>
              <td class="table-cell text-xs text-gray-500">${l.device}</td>
              <td class="table-cell text-xs text-gray-500">
                <div>${l.date}</div>
                <div class="text-gray-400">${l.time}</div>
              </td>
              <td class="table-cell">
                <span class="text-xs ${l.status === 'success' ? 'text-green-600' : 'text-red-500'}">
                  <i class="fas ${l.status === 'success' ? 'fa-check-circle' : 'fa-times-circle'} mr-0.5"></i>${l.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 1-10 of 1,247 logs</span>
      <div class="flex gap-1">
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-left text-xs"></i></button>
        <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-right text-xs"></i></button>
      </div>
    </div>
  </div>`
}

const sampleLogs = [
  {id:'LOG-10001', user:'Admin User', email:'admin@hotel.com', action:'Login', description:'Successful login from admin dashboard', ip:'192.168.1.1', device:'Chrome / Windows', date:'Mar 11', time:'9:00 AM', status:'success'},
  {id:'LOG-10002', user:'Sarah Johnson', email:'sarah@hotel.com', action:'Booking Created', description:'New booking BK-2024-001 created for James Wilson, Room 204', ip:'192.168.1.5', device:'Firefox / Mac', date:'Mar 11', time:'10:15 AM', status:'success'},
  {id:'LOG-10003', user:'Admin User', email:'admin@hotel.com', action:'Payment Recorded', description:'Payment of $435 recorded for booking BK-2024-001', ip:'192.168.1.1', device:'Chrome / Windows', date:'Mar 11', time:'2:15 PM', status:'success'},
  {id:'LOG-10004', user:'Mike Chen', email:'mike@hotel.com', action:'Booking Modified', description:'Checkout date changed for BK-2024-002 from Mar 15 to Mar 16', ip:'10.0.0.8', device:'Safari / iPhone', date:'Mar 11', time:'3:30 PM', status:'success'},
  {id:'LOG-10005', user:'Unknown', email:'hacker@test.com', action:'Login Failed', description:'Failed login attempt with invalid password - 3rd attempt', ip:'203.45.67.89', device:'Chrome / Windows', date:'Mar 11', time:'4:45 PM', status:'failed'},
  {id:'LOG-10006', user:'Admin User', email:'admin@hotel.com', action:'Booking Cancelled', description:'Booking BK-2024-008 cancelled - Guest request, partial refund issued', ip:'192.168.1.1', device:'Chrome / Windows', date:'Mar 11', time:'5:20 PM', status:'success'},
  {id:'LOG-10007', user:'Sarah Johnson', email:'sarah@hotel.com', action:'Agent Approved', description:'B2B Agent request REQ-004 approved for Europa Tours GmbH', ip:'192.168.1.5', device:'Firefox / Mac', date:'Mar 10', time:'11:00 AM', status:'success'},
]

logRoute.get('/b2c', (c) => {
  const b2cLogs = sampleLogs.filter(l => ['Booking Created', 'Login', 'Payment Recorded'].includes(l.action)).concat([
    {id:'LOG-10008', user:'Guest: Tom R.', email:'tom@email.com', action:'Website Login', description:'Guest logged into booking portal', ip:'74.125.32.45', device:'Chrome / Android', date:'Mar 11', time:'8:30 AM', status:'success'},
    {id:'LOG-10009', user:'Guest: Priya S.', email:'priya@email.com', action:'Booking Created', description:'Online booking made for standard room Mar 15-17', ip:'45.67.89.100', device:'Safari / iPhone', date:'Mar 11', time:'9:45 AM', status:'success'},
  ])
  const content = `
  ${pageHeader('B2C Log Reports', 'Website and direct booking activity logs', `<button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>`)}
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">1,247</div><div class="text-xs text-gray-500 mt-1">Total B2C Logs</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">284</div><div class="text-xs text-gray-500 mt-1">Booking Events</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">412</div><div class="text-xs text-gray-500 mt-1">Login Events</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-red-600">8</div><div class="text-xs text-gray-500 mt-1">Failed Logins</div></div>
  </div>
  ${logTable('B2C Activity Logs', b2cLogs)}
  `
  return c.html(adminLayout('B2C Log Reports', content, 'logs', 'log-b2c'))
})

logRoute.get('/b2b', (c) => {
  const b2bLogs = [
    {id:'LOG-20001', user:'John Matthews', email:'john@horizontravel.com', action:'Agent Login', description:'B2B portal login from Horizon Travel Agency', ip:'85.62.14.200', device:'Chrome / Windows', date:'Mar 11', time:'9:30 AM', status:'success'},
    {id:'LOG-20002', user:'John Matthews', email:'john@horizontravel.com', action:'Booking Created', description:'Agent booking BK-2024-B01 for Michael Brown, Suite, Mar 12-15', ip:'85.62.14.200', device:'Chrome / Windows', date:'Mar 11', time:'10:00 AM', status:'success'},
    {id:'LOG-20003', user:'Ahmed Khalid', email:'ahmed@dubaistar.ae', action:'Commission View', description:'Viewed commission statement for Feb 2024', ip:'203.45.78.10', device:'Firefox / Mac', date:'Mar 10', time:'2:00 PM', status:'success'},
    {id:'LOG-20004', user:'Admin User', email:'admin@hotel.com', action:'Payout Processed', description:'Commission payout of $2,304 processed for Dubai Star Tours (AGT-002)', ip:'192.168.1.1', device:'Chrome / Windows', date:'Mar 1', time:'10:00 AM', status:'success'},
    {id:'LOG-20005', user:'Sara Nguyen', email:'sara@sunrisetravel.vn', action:'Agent Login Failed', description:'Failed login - account suspended', ip:'123.45.67.89', device:'Chrome / Windows', date:'Mar 8', time:'3:15 PM', status:'failed'},
  ]
  const content = `
  ${pageHeader('B2B Log Reports', 'Agent portal activity and transaction logs', `<button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>`)}
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">847</div><div class="text-xs text-gray-500 mt-1">Total B2B Logs</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">190</div><div class="text-xs text-gray-500 mt-1">Booking Events</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">24</div><div class="text-xs text-gray-500 mt-1">Active Agents Logged</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-red-600">2</div><div class="text-xs text-gray-500 mt-1">Suspicious Activities</div></div>
  </div>
  ${logTable('B2B Agent Activity Logs', b2bLogs)}
  `
  return c.html(adminLayout('B2B Log Reports', content, 'logs', 'log-b2b'))
})

logRoute.get('/frontdesk', (c) => {
  const fdLogs = [
    {id:'LOG-30001', user:'John Desk (Counter 1)', email:'john.d@hotel.com', action:'Walk-in Created', description:'Walk-in booking for Carlos Mendez, Room 108, 2 nights', ip:'192.168.0.10', device:'Internal System', date:'Mar 11', time:'9:15 AM', status:'success'},
    {id:'LOG-30002', user:'Sarah Counter (Counter 2)', email:'sarah.c@hotel.com', action:'Check-in', description:'Guest Emily Clark checked in, Room 206', ip:'192.168.0.12', device:'Internal System', date:'Mar 11', time:'10:30 AM', status:'success'},
    {id:'LOG-30003', user:'John Desk (Counter 1)', email:'john.d@hotel.com', action:'Payment Recorded', description:'Cash payment of $178 for booking BK-2024-003', ip:'192.168.0.10', device:'Internal System', date:'Mar 11', time:'11:00 AM', status:'success'},
    {id:'LOG-30004', user:'Sarah Counter (Counter 2)', email:'sarah.c@hotel.com', action:'Check-out', description:'Guest David Lee checked out, Room 318, full settlement processed', ip:'192.168.0.12', device:'Internal System', date:'Mar 11', time:'12:15 PM', status:'success'},
    {id:'LOG-30005', user:'John Desk (Counter 1)', email:'john.d@hotel.com', action:'Room Transfer', description:'Guest moved from Room 204 to Room 206 upon request', ip:'192.168.0.10', device:'Internal System', date:'Mar 11', time:'2:00 PM', status:'success'},
  ]
  const content = `
  ${pageHeader('Front Desk Log Reports', 'Counter and front desk operation activity logs', `<button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>`)}
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">423</div><div class="text-xs text-gray-500 mt-1">Total FD Logs</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">98</div><div class="text-xs text-gray-500 mt-1">Walk-in Bookings</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">52</div><div class="text-xs text-gray-500 mt-1">Check-ins Today</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-orange-600">48</div><div class="text-xs text-gray-500 mt-1">Check-outs Today</div></div>
  </div>
  ${logTable('Front Desk Activity Logs', fdLogs)}
  `
  return c.html(adminLayout('Front Desk Log Reports', content, 'logs', 'log-frontdesk'))
})
