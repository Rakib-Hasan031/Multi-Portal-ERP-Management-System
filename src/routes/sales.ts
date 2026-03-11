import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const salesRoute = new Hono()

function salesLayout(title: string, subtitle: string, activeMenu: string, content: string): string {
  return adminLayout(title, `
    ${pageHeader(title, subtitle, `
      <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export PDF</button>
      <button class="btn-secondary"><i class="fas fa-file-excel mr-1"></i>Excel</button>
      <select class="form-input text-sm w-auto py-2">
        <option>This Month</option><option>Last Month</option><option>This Quarter</option><option>This Year</option>
      </select>
    `)}
    ${content}
  `, 'sales', activeMenu)
}

// B2C Sales
salesRoute.get('/b2c', (c) => {
  const content = salesLayout('B2C Sales Report', 'Online website bookings and direct guest sales', 'b2c', `
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card p-4 text-center border-t-4 border-blue-400">
        <div class="text-2xl font-bold text-blue-600">$78,450</div>
        <div class="text-xs text-gray-500 mt-1">B2C Revenue (Month)</div>
        <div class="text-xs text-green-600 mt-0.5">+12.5% vs last month</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-green-400">
        <div class="text-2xl font-bold text-green-600">284</div>
        <div class="text-xs text-gray-500 mt-1">Total Bookings</div>
        <div class="text-xs text-green-600 mt-0.5">+8 from last month</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-purple-400">
        <div class="text-2xl font-bold text-purple-600">$276</div>
        <div class="text-xs text-gray-500 mt-1">Avg. Booking Value</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-orange-400">
        <div class="text-2xl font-bold text-orange-600">3.2</div>
        <div class="text-xs text-gray-500 mt-1">Avg. Nights/Booking</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="lg:col-span-2 card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">B2C Revenue Trend</h3>
        <canvas id="bookingTrendChart" height="220"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Channel Distribution</h3>
        <canvas id="channelChart" height="220"></canvas>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">B2C Booking Details</h3>
        <div class="flex gap-2">
          <input type="date" class="text-xs border border-gray-200 rounded px-2 py-1">
          <input type="date" class="text-xs border border-gray-200 rounded px-2 py-1">
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Booking ID</th>
              <th class="table-header">Guest Name</th>
              <th class="table-header">Room Type</th>
              <th class="table-header">Check-in</th>
              <th class="table-header">Nights</th>
              <th class="table-header">Amount</th>
              <th class="table-header">Payment Method</th>
              <th class="table-header">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${[
              {id:'BK-2024-001', guest:'James Wilson', room:'Deluxe Room', checkin:'Mar 11', nights:3, amount:435, method:'Credit Card', status:'confirmed'},
              {id:'BK-2024-004', guest:'Sophie Chen', room:'Junior Suite', checkin:'Mar 11', nights:4, amount:756, method:'Credit Card', status:'confirmed'},
              {id:'BK-2024-003', guest:'Ahmed Al-Rashid', room:'Standard Room', checkin:'Mar 11', nights:2, amount:178, method:'Online', status:'pending'},
              {id:'BK-2024-006', guest:'Emily Clark', room:'Deluxe Room', checkin:'Mar 8', nights:3, amount:435, method:'Credit Card', status:'checked-out'},
            ].map(b => `
              <tr class="table-row hover:bg-gray-50">
                <td class="table-cell font-mono text-xs text-blue-600">${b.id}</td>
                <td class="table-cell font-medium text-gray-800">${b.guest}</td>
                <td class="table-cell">${b.room}</td>
                <td class="table-cell text-xs">${b.checkin}</td>
                <td class="table-cell text-center">${b.nights}</td>
                <td class="table-cell font-semibold">$${b.amount}</td>
                <td class="table-cell text-sm text-gray-600">${b.method}</td>
                <td class="table-cell">${statusBadge(b.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `)
  return c.html(content)
})

// B2B Sales
salesRoute.get('/b2b', (c) => {
  const content = salesLayout('B2B Sales Report', 'Agent and partner channel revenue analytics', 'b2b-sales', `
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card p-4 text-center border-t-4 border-purple-400">
        <div class="text-2xl font-bold text-purple-600">$115,500</div>
        <div class="text-xs text-gray-500 mt-1">B2B Revenue</div>
        <div class="text-xs text-green-600 mt-0.5">+18.2% vs last month</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-blue-400">
        <div class="text-2xl font-bold text-blue-600">190</div>
        <div class="text-xs text-gray-500 mt-1">B2B Bookings</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-green-400">
        <div class="text-2xl font-bold text-green-600">$12,618</div>
        <div class="text-xs text-gray-500 mt-1">Total Commission Paid</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-orange-400">
        <div class="text-2xl font-bold text-orange-600">24</div>
        <div class="text-xs text-gray-500 mt-1">Active Agents</div>
      </div>
    </div>

    <div class="card overflow-hidden mb-4">
      <div class="card-header">
        <h3 class="font-semibold text-gray-800">Top Performing Agents</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Rank</th>
              <th class="table-header">Agent Name</th>
              <th class="table-header">Region</th>
              <th class="table-header">Bookings</th>
              <th class="table-header">Revenue</th>
              <th class="table-header">Commission</th>
              <th class="table-header">Net Revenue</th>
              <th class="table-header">Performance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${[
              {rank:1, name:'Crown Hospitality', region:'UK', bookings:55, revenue:33000, comm:3960, net:29040},
              {rank:2, name:'Horizon Travel Agency', region:'USA', bookings:45, revenue:28500, comm:2850, net:25650},
              {rank:3, name:'Dubai Star Tours', region:'UAE', bookings:32, revenue:19200, comm:2304, net:16896},
              {rank:4, name:'Europa Tours GmbH', region:'Germany', bookings:28, revenue:16800, comm:1848, net:14952},
              {rank:5, name:'Pacific Voyages', region:'Singapore', bookings:18, revenue:10800, comm:1080, net:9720},
            ].map(a => `
              <tr class="table-row hover:bg-gray-50">
                <td class="table-cell">
                  <span class="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${a.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}">${a.rank}</span>
                </td>
                <td class="table-cell font-medium text-gray-800">${a.name}</td>
                <td class="table-cell text-gray-500">${a.region}</td>
                <td class="table-cell text-center">${a.bookings}</td>
                <td class="table-cell font-semibold">$${a.revenue.toLocaleString()}</td>
                <td class="table-cell text-red-500">-$${a.comm.toLocaleString()}</td>
                <td class="table-cell font-bold text-green-600">$${a.net.toLocaleString()}</td>
                <td class="table-cell">
                  <div class="w-24 bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width:${Math.round(a.revenue/330)}%"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `)
  return c.html(content)
})

// Front Desk Sales
salesRoute.get('/frontdesk', (c) => {
  const content = salesLayout('Front Desk Sales Report', 'Walk-in counter and front desk booking revenue', 'frontdesk-sales', `
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card p-4 text-center border-t-4 border-teal-400">
        <div class="text-2xl font-bold text-teal-600">$45,200</div>
        <div class="text-xs text-gray-500 mt-1">Front Desk Revenue</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-blue-400">
        <div class="text-2xl font-bold text-blue-600">98</div>
        <div class="text-xs text-gray-500 mt-1">Walk-in Bookings</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-green-400">
        <div class="text-2xl font-bold text-green-600">$461</div>
        <div class="text-xs text-gray-500 mt-1">Avg. Walk-in Value</div>
      </div>
      <div class="card p-4 text-center border-t-4 border-orange-400">
        <div class="text-2xl font-bold text-orange-600">92%</div>
        <div class="text-xs text-gray-500 mt-1">Same-Day Payment Rate</div>
      </div>
    </div>

    <div class="card p-4 mb-4">
      <h3 class="font-semibold text-gray-800 mb-3">Daily Walk-in Performance</h3>
      <canvas id="occupancyChart" height="200"></canvas>
    </div>

    <div class="card overflow-hidden">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">Front Desk Transactions</h3>
        <div class="flex gap-2">
          <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Staff</option><option>John (Counter 1)</option><option>Sarah (Counter 2)</option></select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Booking ID</th>
              <th class="table-header">Guest</th>
              <th class="table-header">Room</th>
              <th class="table-header">Check-in</th>
              <th class="table-header">Nights</th>
              <th class="table-header">Amount</th>
              <th class="table-header">Handled By</th>
              <th class="table-header">Payment</th>
              <th class="table-header">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${[
              {id:'BK-2024-W01', guest:'Carlos Mendez', room:'108', checkin:'Mar 11', nights:2, amount:178, staff:'John D.', payment:'Cash', status:'checked-in'},
              {id:'BK-2024-W02', guest:'Priya Sharma', room:'203', checkin:'Mar 11', nights:3, amount:387, staff:'Sarah M.', payment:'Credit Card', status:'confirmed'},
              {id:'BK-2024-W03', guest:'Tom Richards', room:'115', checkin:'Mar 10', nights:1, amount:89, staff:'John D.', payment:'Cash', status:'checked-out'},
            ].map(b => `
              <tr class="table-row hover:bg-gray-50">
                <td class="table-cell font-mono text-xs text-blue-600">${b.id}</td>
                <td class="table-cell font-medium text-gray-800">${b.guest}</td>
                <td class="table-cell">${b.room}</td>
                <td class="table-cell text-xs">${b.checkin}</td>
                <td class="table-cell text-center">${b.nights}</td>
                <td class="table-cell font-semibold">$${b.amount}</td>
                <td class="table-cell text-sm text-gray-600">${b.staff}</td>
                <td class="table-cell text-sm text-gray-600">${b.payment}</td>
                <td class="table-cell">${statusBadge(b.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `)
  return c.html(content)
})

// All Channel Sales
salesRoute.get('/all-channel', (c) => {
  const content = salesLayout('All Channel Sales', 'Consolidated revenue overview across all booking channels', 'all-channel', `
    <!-- Master Summary -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card p-5 col-span-3 lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div class="text-xs text-blue-200 uppercase tracking-wide font-medium">Total Revenue (All Channels)</div>
        <div class="text-4xl font-bold mt-2">$239,150</div>
        <div class="text-blue-200 text-sm mt-1">+14.8% vs last month</div>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><div class="text-blue-200 text-xs">Total Bookings</div><div class="font-bold">572</div></div>
          <div><div class="text-blue-200 text-xs">Avg. ADR</div><div class="font-bold">$418</div></div>
          <div><div class="text-blue-200 text-xs">Occupancy Rate</div><div class="font-bold">78.4%</div></div>
          <div><div class="text-blue-200 text-xs">RevPAR</div><div class="font-bold">$327</div></div>
        </div>
      </div>

      <div class="card p-4 col-span-3 lg:col-span-2">
        <h3 class="font-semibold text-gray-800 mb-3">Revenue by Channel</h3>
        <div class="space-y-3">
          ${[
            {channel:'B2C Website', revenue:78450, pct:33, color:'bg-blue-500'},
            {channel:'B2B Agents', revenue:115500, pct:48, color:'bg-purple-500'},
            {channel:'Walk-in / Front Desk', revenue:45200, pct:19, color:'bg-green-500'},
          ].map(c => `
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-gray-700">${c.channel}</span>
                <span class="font-semibold">$${c.revenue.toLocaleString()} <span class="text-gray-400 font-normal">(${c.pct}%)</span></span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="${c.color} h-3 rounded-full transition-all" style="width:${c.pct}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Channel Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Monthly Revenue Comparison</h3>
        <canvas id="bookingTrendChart" height="220"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Revenue Distribution</h3>
        <canvas id="channelChart" height="220"></canvas>
      </div>
    </div>

    <!-- Channel Summary Table -->
    <div class="card overflow-hidden">
      <div class="card-header">
        <h3 class="font-semibold text-gray-800">Channel Performance Summary</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Channel</th>
              <th class="table-header">Bookings</th>
              <th class="table-header">Revenue</th>
              <th class="table-header">Avg. Value</th>
              <th class="table-header">Avg. Nights</th>
              <th class="table-header">Cancellation Rate</th>
              <th class="table-header">Revenue Share</th>
              <th class="table-header">vs Last Month</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${[
              {channel:'B2C Website', bookings:284, revenue:'$78,450', avg:'$276', nights:'3.2', cancel:'5.2%', share:'33%', change:'+12.5%', dir:'up'},
              {channel:'B2B Agents', bookings:190, revenue:'$115,500', avg:'$608', nights:'5.1', cancel:'3.8%', share:'48%', change:'+18.2%', dir:'up'},
              {channel:'Walk-in / Front Desk', bookings:98, revenue:'$45,200', avg:'$461', nights:'2.4', cancel:'8.1%', share:'19%', change:'+5.3%', dir:'up'},
              {channel:'OTA (Expedia/Booking)', bookings:0, revenue:'$0', avg:'—', nights:'—', cancel:'—', share:'0%', change:'N/A', dir:'up'},
              {channel:'Total', bookings:572, revenue:'$239,150', avg:'$418', nights:'3.9', cancel:'5.7%', share:'100%', change:'+14.8%', dir:'up'},
            ].map((r, i) => `
              <tr class="${i === 4 ? 'bg-gray-50 font-semibold' : 'table-row hover:bg-gray-50'}">
                <td class="table-cell">${i === 4 ? '<span class="font-bold">Total</span>' : r.channel}</td>
                <td class="table-cell text-center">${r.bookings}</td>
                <td class="table-cell font-semibold">${r.revenue}</td>
                <td class="table-cell">${r.avg}</td>
                <td class="table-cell text-center">${r.nights}</td>
                <td class="table-cell text-center">${r.cancel}</td>
                <td class="table-cell text-center">${r.share}</td>
                <td class="table-cell"><span class="${r.dir === 'up' ? 'text-green-600' : 'text-red-500'} text-xs font-medium">${r.change === 'N/A' ? '—' : (r.dir === 'up' ? '↑' : '↓') + ' ' + r.change}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `)
  return c.html(content)
})
