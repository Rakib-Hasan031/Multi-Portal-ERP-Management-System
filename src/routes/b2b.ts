import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const b2bRoute = new Hono()

// Agent Requests
b2bRoute.get('/requests', (c) => {
  const requests = [
    {id:'REQ-001', agency:'Horizon Travel Agency', contact:'John Matthews', email:'john@horizontravel.com', phone:'+1-212-555-0101', region:'USA - Northeast', affiliation:'IATA', applied:'Mar 10, 2024', kyc:'verified', status:'pending'},
    {id:'REQ-002', agency:'Dubai Star Tours', contact:'Ahmed Khalid', email:'ahmed@dubaistar.ae', phone:'+971-4-555-0202', region:'UAE - Dubai', affiliation:'ATAA', applied:'Mar 8, 2024', kyc:'verified', status:'pending'},
    {id:'REQ-003', agency:'Pacific Voyages Ltd', contact:'Mei Lin', email:'mei@pacificvoyages.sg', phone:'+65-6555-0303', region:'Singapore', affiliation:'NATAS', applied:'Mar 5, 2024', kyc:'pending', status:'under-review'},
    {id:'REQ-004', agency:'Europa Tours GmbH', contact:'Klaus Weber', email:'k.weber@europatours.de', phone:'+49-89-555-0404', region:'Germany - Bavaria', affiliation:'DRV', applied:'Feb 28, 2024', kyc:'verified', status:'approved'},
    {id:'REQ-005', agency:'Sunrise Travel Inc.', contact:'Sara Nguyen', email:'sara@sunrisetravel.vn', phone:'+84-28-555-0505', region:'Vietnam - HCMC', affiliation:'VNAT', applied:'Feb 25, 2024', kyc:'failed', status:'rejected'},
  ]

  const content = `
  ${pageHeader('Agent Requests', 'Review and manage B2B partner applications', `
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
    <button onclick="openModal('createAgentDirectModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Agent Directly</button>
  `)}

  <!-- Stats -->
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center border-t-4 border-blue-400">
      <div class="text-2xl font-bold text-gray-800">12</div>
      <div class="text-xs text-gray-500 mt-1">Total Requests</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-yellow-400">
      <div class="text-2xl font-bold text-yellow-600">8</div>
      <div class="text-xs text-gray-500 mt-1">Pending Review</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-green-400">
      <div class="text-2xl font-bold text-green-600">3</div>
      <div class="text-xs text-gray-500 mt-1">Approved Today</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-red-400">
      <div class="text-2xl font-bold text-red-600">1</div>
      <div class="text-xs text-gray-500 mt-1">Rejected</div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Agent Applications</h3>
      <div class="flex gap-2">
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Status</option><option>Pending</option><option>Under Review</option><option>Approved</option><option>Rejected</option></select>
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All KYC</option><option>Verified</option><option>Pending</option><option>Failed</option></select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Request ID</th>
            <th class="table-header">Agency Info</th>
            <th class="table-header">Contact</th>
            <th class="table-header">Region / Affiliation</th>
            <th class="table-header">Date Applied</th>
            <th class="table-header">KYC Status</th>
            <th class="table-header">Status</th>
            <th class="table-header">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${requests.map(r => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600">${r.id}</span></td>
              <td class="table-cell">
                <div class="font-medium text-gray-800">${r.agency}</div>
                <div class="text-xs text-gray-400">${r.email}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm">${r.contact}</div>
                <div class="text-xs text-gray-400">${r.phone}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm">${r.region}</div>
                <div class="text-xs text-gray-400"><i class="fas fa-id-badge mr-1"></i>${r.affiliation}</div>
              </td>
              <td class="table-cell text-xs text-gray-500">${r.applied}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded-full ${r.kyc === 'verified' ? 'bg-green-100 text-green-700' : r.kyc === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                  <i class="fas ${r.kyc === 'verified' ? 'fa-shield-alt' : r.kyc === 'failed' ? 'fa-times' : 'fa-clock'} mr-1"></i>${r.kyc}
                </span>
              </td>
              <td class="table-cell">${statusBadge(r.status)}</td>
              <td class="table-cell">
                <button onclick="openModal('reviewAgentModal')" class="btn-primary btn-sm text-xs">
                  <i class="fas fa-search mr-1"></i>Review Application
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Review Agent Modal -->
  <div id="reviewAgentModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-user-check text-blue-500 mr-2"></i>Review Agent Application — REQ-001</h3>
        <button onclick="closeModal('reviewAgentModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <!-- Agent Details -->
        <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div class="space-y-2">
            <div><p class="text-xs text-gray-400 uppercase">Agency Name</p><p class="font-medium">Horizon Travel Agency</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Contact Person</p><p>John Matthews</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Email</p><p>john@horizontravel.com</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Phone</p><p>+1-212-555-0101</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Region</p><p>USA - Northeast</p></div>
          </div>
          <div class="space-y-2">
            <div><p class="text-xs text-gray-400 uppercase">Business Type</p><p>Travel Agency (B2B)</p></div>
            <div><p class="text-xs text-gray-400 uppercase">IATA/Affiliation</p><p>IATA Member #12345678</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Business Reg. No.</p><p>TX-2019-88765</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Years in Business</p><p>8 years</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Monthly Volume</p><p>Est. 50-100 bookings/month</p></div>
          </div>
        </div>

        <!-- KYC Documents -->
        <div class="bg-gray-50 rounded-xl p-3 mb-4">
          <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">KYC Documents Submitted</h4>
          <div class="space-y-1">
            ${['Business Registration Certificate','IATA License','Tax Identification Number','Bank Account Details','Representative ID (Passport)'].map(doc => `
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-file-pdf text-red-400"></i>
                <span class="flex-1 text-gray-600">${doc}</span>
                <span class="text-green-500 text-xs"><i class="fas fa-check-circle"></i> Uploaded</span>
                <button class="text-xs text-blue-600 hover:underline">View</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Commission Setup -->
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Commission Setup (if approving)</h4>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="form-label">Base Commission %</label>
              <input type="number" class="form-input" value="10" min="0" max="30">
            </div>
            <div>
              <label class="form-label">Commission Type</label>
              <select class="form-input"><option>Percentage</option><option>Fixed Amount</option></select>
            </div>
            <div>
              <label class="form-label">Payment Cycle</label>
              <select class="form-input"><option>Monthly</option><option>Weekly</option><option>Per Booking</option></select>
            </div>
          </div>
        </div>

        <!-- Rejection Reason (if rejecting) -->
        <div>
          <label class="form-label">Notes / Rejection Reason (if applicable)</label>
          <textarea class="form-input" rows="2" placeholder="Add any notes about this application..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('reviewAgentModal')" class="btn-secondary">Cancel</button>
        <button class="btn-danger" onclick="showToast('Application rejected', 'error'); closeModal('reviewAgentModal')"><i class="fas fa-times mr-1"></i>Reject</button>
        <button class="btn-success" onclick="showToast('Agent approved and portal access granted!', 'success'); closeModal('reviewAgentModal')"><i class="fas fa-check mr-1"></i>Approve & Activate</button>
      </div>
    </div>
  </div>

  <div id="createAgentDirectModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add Agent Directly</h3>
        <button onclick="closeModal('createAgentDirectModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Agency Name *</label><input type="text" class="form-input" placeholder="Agency name"></div>
          <div><label class="form-label">Contact Person *</label><input type="text" class="form-input" placeholder="Full name"></div>
          <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="email@agency.com"></div>
          <div><label class="form-label">Phone *</label><input type="tel" class="form-input" placeholder="+1 000 000 0000"></div>
          <div><label class="form-label">Commission %</label><input type="number" class="form-input" value="10"></div>
          <div><label class="form-label">Region</label><input type="text" class="form-input" placeholder="Country/Region"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createAgentDirectModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Agent created!','success');closeModal('createAgentDirectModal')">Create Agent</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Agent Requests', content, 'b2b', 'requests'))
})

// All Agents
b2bRoute.get('/all-agents', (c) => {
  const agents = [
    {id:'AGT-001', agency:'Horizon Travel Agency', contact:'John Matthews', email:'john@horizontravel.com', region:'USA', bookings:45, totalSales:28500, commission:10, totalComm:2850, portal:'Active', status:'active'},
    {id:'AGT-002', agency:'Dubai Star Tours', contact:'Ahmed Khalid', email:'ahmed@dubaistar.ae', region:'UAE', bookings:32, totalSales:19200, commission:12, totalComm:2304, portal:'Active', status:'active'},
    {id:'AGT-003', agency:'Pacific Voyages', contact:'Mei Lin', email:'mei@pacificvoyages.sg', region:'Singapore', bookings:18, totalSales:10800, commission:10, totalComm:1080, portal:'Active', status:'active'},
    {id:'AGT-004', agency:'Europa Tours GmbH', contact:'Klaus Weber', email:'k.weber@europatours.de', region:'Germany', bookings:28, totalSales:16800, commission:11, totalComm:1848, portal:'Active', status:'active'},
    {id:'AGT-005', agency:'Sunrise Travel Inc.', contact:'Sara Nguyen', email:'sara@sunrisetravel.vn', region:'Vietnam', bookings:12, totalSales:7200, commission:8, totalComm:576, portal:'Suspended', status:'inactive'},
    {id:'AGT-006', agency:'Crown Hospitality', contact:'Robert King', email:'r.king@crownhosp.co.uk', region:'UK', bookings:55, totalSales:33000, commission:12, totalComm:3960, portal:'Active', status:'active'},
  ]

  const content = `
  ${pageHeader('All B2B Agents', 'Manage your travel agent and partner network', `
    <button onclick="openModal('createAgentDirectModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Agent</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}

  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">24</div><div class="text-xs text-gray-500 mt-1">Total Agents</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">21</div><div class="text-xs text-gray-500 mt-1">Active Agents</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">$115,500</div><div class="text-xs text-gray-500 mt-1">Total B2B Sales</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-purple-600">$12,618</div><div class="text-xs text-gray-500 mt-1">Total Commissions</div></div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Agent Directory</h3>
      <div class="flex gap-2">
        <div class="relative"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search agents..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Status</option><option>Active</option><option>Inactive</option></select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Agent ID</th>
            <th class="table-header">Agency</th>
            <th class="table-header">Contact</th>
            <th class="table-header">Region</th>
            <th class="table-header">Total Bookings</th>
            <th class="table-header">Total Sales</th>
            <th class="table-header">Commission %</th>
            <th class="table-header">Total Commission</th>
            <th class="table-header">Portal</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${agents.map(a => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600 font-medium">${a.id}</span></td>
              <td class="table-cell">
                <div class="font-medium text-gray-800">${a.agency}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm">${a.contact}</div>
                <div class="text-xs text-gray-400">${a.email}</div>
              </td>
              <td class="table-cell text-sm text-gray-600">${a.region}</td>
              <td class="table-cell text-center font-medium">${a.bookings}</td>
              <td class="table-cell font-semibold">$${a.totalSales.toLocaleString()}</td>
              <td class="table-cell text-center"><span class="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">${a.commission}%</span></td>
              <td class="table-cell font-medium text-green-600">$${a.totalComm.toLocaleString()}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded ${a.portal === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                  <i class="fas fa-circle text-xs mr-1"></i>${a.portal}
                </span>
              </td>
              <td class="table-cell">${statusBadge(a.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button onclick="openModal('viewAgentModal')" class="text-blue-600 hover:text-blue-700 p-1 text-xs" title="View Profile"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-500 hover:text-gray-700 p-1 text-xs" title="Edit"><i class="fas fa-edit"></i></button>
                  <button class="text-purple-500 hover:text-purple-700 p-1 text-xs" title="Bookings"><i class="fas fa-book"></i></button>
                  <button class="text-red-400 hover:text-red-500 p-1 text-xs" title="Suspend"><i class="fas fa-ban"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- View Agent Modal -->
  <div id="viewAgentModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-user-tie text-blue-500 mr-2"></i>Agent Profile — AGT-001</h3>
        <button onclick="closeModal('viewAgentModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold flex-shrink-0">H</div>
          <div>
            <h3 class="font-bold text-gray-800">Horizon Travel Agency</h3>
            <div class="text-gray-500 text-sm">AGT-001 · IATA Member</div>
            ${statusBadge('active')}
          </div>
          <div class="ml-auto flex gap-2">
            <button class="btn-secondary btn-sm text-xs"><i class="fas fa-edit mr-1"></i>Edit</button>
            <button class="btn-primary btn-sm text-xs"><i class="fas fa-envelope mr-1"></i>Message</button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm mb-4">
          <div class="space-y-2">
            <div><p class="text-xs text-gray-400 uppercase">Contact Person</p><p class="font-medium">John Matthews</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Phone</p><p>+1-212-555-0101</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Email</p><p>john@horizontravel.com</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Region</p><p>USA - Northeast</p></div>
          </div>
          <div class="space-y-2">
            <div><p class="text-xs text-gray-400 uppercase">Commission Rate</p><p class="font-bold text-purple-600">10%</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Payment Cycle</p><p>Monthly</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Portal Login</p><p class="text-green-600"><i class="fas fa-check-circle mr-1"></i>Active</p></div>
            <div><p class="text-xs text-gray-400 uppercase">Member Since</p><p>Jan 2023</p></div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3">
          <div class="text-center"><div class="text-xl font-bold text-gray-800">45</div><div class="text-xs text-gray-500">Bookings</div></div>
          <div class="text-center"><div class="text-xl font-bold text-blue-600">$28,500</div><div class="text-xs text-gray-500">Total Sales</div></div>
          <div class="text-center"><div class="text-xl font-bold text-green-600">$2,850</div><div class="text-xs text-gray-500">Commission Earned</div></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('viewAgentModal')" class="btn-secondary">Close</button>
        <a href="/b2b/agent-bookings" class="btn-primary text-xs"><i class="fas fa-book mr-1"></i>View Bookings</a>
        <a href="/b2b/commission" class="btn-success text-xs"><i class="fas fa-percentage mr-1"></i>Commission</a>
      </div>
    </div>
  </div>

  <div id="createAgentDirectModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add New Agent</h3>
        <button onclick="closeModal('createAgentDirectModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="form-label">Agency Name *</label><input type="text" class="form-input" placeholder="Travel agency name"></div>
          <div><label class="form-label">Contact Person *</label><input type="text" class="form-input" placeholder="Full name"></div>
          <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="email@agency.com"></div>
          <div><label class="form-label">Phone *</label><input type="tel" class="form-input" placeholder="+1 000 000 0000"></div>
          <div><label class="form-label">Region</label><input type="text" class="form-input" placeholder="Country/Region"></div>
          <div><label class="form-label">Commission %</label><input type="number" class="form-input" value="10" min="0" max="50"></div>
          <div><label class="form-label">Payment Cycle</label><select class="form-input"><option>Monthly</option><option>Weekly</option><option>Per Booking</option></select></div>
          <div class="col-span-2"><label class="form-label">Portal Password</label><input type="password" class="form-input" placeholder="Create portal login password"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createAgentDirectModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Agent created & portal access granted!','success');closeModal('createAgentDirectModal')">Create Agent</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('All Agents', content, 'b2b', 'all-agents'))
})

// Agent Bookings
b2bRoute.get('/agent-bookings', (c) => {
  const bookings = [
    {bookingId:'BK-2024-B01', agentId:'AGT-001', agency:'Horizon Travel', guest:'Michael Brown', room:'Suite', checkin:'Mar 12', checkout:'Mar 15', nights:3, totalRate:777, commission:10, commAmount:77.70, commStatus:'pending'},
    {bookingId:'BK-2024-B02', agentId:'AGT-002', agency:'Dubai Star Tours', guest:'Fatima Al-Sayed', room:'Deluxe Room', checkin:'Mar 14', checkout:'Mar 18', nights:4, totalRate:516, commission:12, commAmount:61.92, commStatus:'pending'},
    {bookingId:'BK-2024-B03', agentId:'AGT-001', agency:'Horizon Travel', guest:'Sarah Connor', room:'Standard Room', checkin:'Mar 8', checkout:'Mar 10', nights:2, totalRate:178, commission:10, commAmount:17.80, commStatus:'paid'},
    {bookingId:'BK-2024-B04', agentId:'AGT-004', agency:'Europa Tours GmbH', guest:'Klaus Müller', room:'Executive Suite', checkin:'Mar 5', checkout:'Mar 10', nights:5, totalRate:1945, commission:11, commAmount:213.95, commStatus:'paid'},
  ]

  const content = `
  ${pageHeader('Agent Bookings', 'Track all bookings made by B2B agents', `
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export Report</button>
  `)}

  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">190</div><div class="text-xs text-gray-500 mt-1">Total B2B Bookings</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">$115,500</div><div class="text-xs text-gray-500 mt-1">Total B2B Revenue</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">$12,618</div><div class="text-xs text-gray-500 mt-1">Total Commission</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-orange-600">$4,230</div><div class="text-xs text-gray-500 mt-1">Unpaid Commission</div></div>
  </div>

  <!-- Filter -->
  <div class="bg-white rounded-xl border border-gray-100 p-3 mb-4 flex gap-3 flex-wrap">
    <select class="form-input text-sm w-auto py-1.5"><option>All Agents</option><option>Horizon Travel</option><option>Dubai Star Tours</option></select>
    <input type="date" class="form-input text-sm w-auto py-1.5">
    <input type="date" class="form-input text-sm w-auto py-1.5">
    <select class="form-input text-sm w-auto py-1.5"><option>All Comm Status</option><option>Pending</option><option>Paid</option></select>
    <button class="btn-primary btn-sm">Filter</button>
  </div>

  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Booking ID</th>
            <th class="table-header">Agent</th>
            <th class="table-header">Guest Name</th>
            <th class="table-header">Room Type</th>
            <th class="table-header">Stay Info</th>
            <th class="table-header">Total Rate</th>
            <th class="table-header">Commission %</th>
            <th class="table-header">Commission Amount</th>
            <th class="table-header">Comm Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${bookings.map(b => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600">${b.bookingId}</span></td>
              <td class="table-cell">
                <div class="text-xs font-medium text-gray-800">${b.agency}</div>
                <div class="text-xs text-gray-400">${b.agentId}</div>
              </td>
              <td class="table-cell font-medium text-gray-800">${b.guest}</td>
              <td class="table-cell">${b.room}</td>
              <td class="table-cell text-xs">
                <div>${b.checkin} → ${b.checkout}</div>
                <div class="text-gray-400">${b.nights} nights</div>
              </td>
              <td class="table-cell font-semibold">$${b.totalRate}</td>
              <td class="table-cell text-center"><span class="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded">${b.commission}%</span></td>
              <td class="table-cell font-medium text-green-600">$${b.commAmount.toFixed(2)}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded-full ${b.commStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                  ${b.commStatus === 'paid' ? '<i class="fas fa-check mr-1"></i>' : '<i class="fas fa-clock mr-1"></i>'}${b.commStatus}
                </span>
              </td>
              <td class="table-cell">
                <button class="text-blue-600 hover:text-blue-700 text-xs p-1"><i class="fas fa-eye"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(adminLayout('Agent Bookings', content, 'b2b', 'agent-bookings'))
})

// Commission & Payouts
b2bRoute.get('/commission', (c) => {
  const agents = [
    {id:'AGT-001', name:'Horizon Travel Agency', contact:'John Matthews', totalSales:28500, commRate:10, totalEarned:2850, paidOut:1500, unpaidBalance:1350, lastPayDate:'Feb 28, 2024'},
    {id:'AGT-002', name:'Dubai Star Tours', contact:'Ahmed Khalid', totalSales:19200, commRate:12, totalEarned:2304, paidOut:2304, unpaidBalance:0, lastPayDate:'Mar 1, 2024'},
    {id:'AGT-003', name:'Pacific Voyages', contact:'Mei Lin', totalSales:10800, commRate:10, totalEarned:1080, paidOut:540, unpaidBalance:540, lastPayDate:'Feb 15, 2024'},
    {id:'AGT-004', name:'Europa Tours GmbH', contact:'Klaus Weber', totalSales:16800, commRate:11, totalEarned:1848, paidOut:1848, unpaidBalance:0, lastPayDate:'Mar 5, 2024'},
    {id:'AGT-006', name:'Crown Hospitality', contact:'Robert King', totalSales:33000, commRate:12, totalEarned:3960, paidOut:2000, unpaidBalance:1960, lastPayDate:'Feb 20, 2024'},
  ]

  const content = `
  ${pageHeader('Commission & Payouts', 'Manage agent commission calculations and payment processing', `
    <button onclick="openModal('bulkPayoutModal')" class="btn-primary"><i class="fas fa-money-bill-wave mr-1"></i>Bulk Payout</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}

  <!-- Summary Cards -->
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center border-t-4 border-green-400">
      <div class="text-2xl font-bold text-green-600">$12,042</div>
      <div class="text-xs text-gray-500 mt-1">Total Commission Earned</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-blue-400">
      <div class="text-2xl font-bold text-blue-600">$8,192</div>
      <div class="text-xs text-gray-500 mt-1">Total Paid Out</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-orange-400">
      <div class="text-2xl font-bold text-orange-600">$3,850</div>
      <div class="text-xs text-gray-500 mt-1">Outstanding Balance</div>
    </div>
    <div class="card p-4 text-center border-t-4 border-purple-400">
      <div class="text-2xl font-bold text-purple-600">3</div>
      <div class="text-xs text-gray-500 mt-1">Agents with Balance</div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Commission Ledger</h3>
      <div class="flex gap-2">
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Agents</option></select>
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>This Month</option><option>Last Month</option><option>This Year</option></select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Agent ID</th>
            <th class="table-header">Agent Name</th>
            <th class="table-header">Contact</th>
            <th class="table-header">Total Sales Amount</th>
            <th class="table-header">Comm. Rate</th>
            <th class="table-header">Total Earned</th>
            <th class="table-header">Paid Out</th>
            <th class="table-header">Unpaid / Balance Due</th>
            <th class="table-header">Last Payment Date</th>
            <th class="table-header">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${agents.map(a => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-blue-600">${a.id}</span></td>
              <td class="table-cell font-medium text-gray-800">${a.name}</td>
              <td class="table-cell text-sm text-gray-600">${a.contact}</td>
              <td class="table-cell font-semibold">$${a.totalSales.toLocaleString()}</td>
              <td class="table-cell text-center"><span class="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">${a.commRate}%</span></td>
              <td class="table-cell font-medium text-green-600">$${a.totalEarned.toLocaleString()}</td>
              <td class="table-cell text-blue-600">$${a.paidOut.toLocaleString()}</td>
              <td class="table-cell">
                <span class="font-bold ${a.unpaidBalance > 0 ? 'text-orange-600' : 'text-gray-400'}">
                  $${a.unpaidBalance.toLocaleString()}
                </span>
              </td>
              <td class="table-cell text-xs text-gray-500">${a.lastPayDate}</td>
              <td class="table-cell">
                ${a.unpaidBalance > 0 ? `
                  <button onclick="openModal('processPayoutModal')" class="btn-success btn-sm text-xs">
                    <i class="fas fa-money-bill-wave mr-1"></i>Process Payout
                  </button>
                ` : `<span class="text-xs text-gray-400"><i class="fas fa-check mr-1"></i>All Settled</span>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Process Payout Modal -->
  <div id="processPayoutModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-money-bill-wave text-green-500 mr-2"></i>Process Commission Payout</h3>
        <button onclick="closeModal('processPayoutModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="bg-blue-50 rounded-xl p-3">
          <div class="font-medium text-gray-800">Horizon Travel Agency — AGT-001</div>
          <div class="text-sm text-gray-500 mt-1">Outstanding Balance: <span class="font-bold text-orange-600">$1,350.00</span></div>
        </div>
        <div>
          <label class="form-label">Payout Amount *</label>
          <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input type="number" class="form-input pl-6" value="1350.00"></div>
        </div>
        <div>
          <label class="form-label">Payment Method *</label>
          <select class="form-input">
            <option>Bank Transfer</option><option>Check</option><option>PayPal</option><option>Stripe</option>
          </select>
        </div>
        <div>
          <label class="form-label">Bank Details / Reference</label>
          <input type="text" class="form-input" placeholder="Bank reference or transaction ID">
        </div>
        <div>
          <label class="form-label">Payment Date</label>
          <input type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">Notes</label>
          <textarea class="form-input" rows="2" placeholder="Optional notes..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('processPayoutModal')" class="btn-secondary">Cancel</button>
        <button class="btn-success" onclick="showToast('Payout processed successfully! Agent notified.','success'); closeModal('processPayoutModal')">
          <i class="fas fa-check mr-1"></i>Confirm Payout
        </button>
      </div>
    </div>
  </div>

  <!-- Bulk Payout Modal -->
  <div id="bulkPayoutModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-layer-group text-blue-500 mr-2"></i>Bulk Commission Payout</h3>
        <button onclick="closeModal('bulkPayoutModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <p class="text-sm text-gray-600 mb-3">Select agents to pay out all outstanding balances:</p>
        <div class="space-y-2">
          ${agents.filter(a => a.unpaidBalance > 0).map(a => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label class="flex items-center gap-2 flex-1">
                <input type="checkbox" checked class="rounded border-gray-300 text-blue-600">
                <span class="text-sm font-medium text-gray-700">${a.name}</span>
              </label>
              <span class="font-bold text-orange-600 text-sm">$${a.unpaidBalance.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        <div class="mt-4 pt-3 border-t flex justify-between font-semibold text-sm">
          <span>Total to Pay Out:</span>
          <span class="text-green-600">$3,850.00</span>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('bulkPayoutModal')" class="btn-secondary">Cancel</button>
        <button class="btn-success" onclick="showToast('Bulk payout initiated for 3 agents!','success'); closeModal('bulkPayoutModal')"><i class="fas fa-check mr-1"></i>Process All Payouts</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Commission & Payouts', content, 'b2b', 'commission'))
})

// Create Agent
b2bRoute.get('/create-agent', (c) => {
  const content = `
  ${pageHeader('Create Agent', 'Manually onboard a new B2B travel agent or partner', `
    <a href="/b2b/all-agents" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <form class="space-y-5">
        <!-- Agency Info -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-building text-blue-500"></i>Agency Information
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2"><label class="form-label">Agency / Company Name *</label><input type="text" class="form-input" placeholder="Full agency name"></div>
            <div><label class="form-label">Business Type *</label><select class="form-input"><option>Travel Agency</option><option>Tour Operator</option><option>Corporate Travel</option><option>OTA Partner</option><option>Individual Agent</option></select></div>
            <div><label class="form-label">Business Registration No.</label><input type="text" class="form-input" placeholder="Reg. number"></div>
            <div><label class="form-label">IATA / Affiliation No.</label><input type="text" class="form-input" placeholder="Optional"></div>
            <div><label class="form-label">Country / Region *</label><select class="form-input"><option>United States</option><option>United Kingdom</option><option>UAE</option><option>Singapore</option><option>Germany</option></select></div>
          </div>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2 border-t pt-4">
            <i class="fas fa-user text-blue-500"></i>Contact Person
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="form-label">Contact Name *</label><input type="text" class="form-input" placeholder="Full name"></div>
            <div><label class="form-label">Designation</label><input type="text" class="form-input" placeholder="e.g., Director of Sales"></div>
            <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="contact@agency.com"></div>
            <div><label class="form-label">Phone *</label><input type="tel" class="form-input" placeholder="+1 (000) 000-0000"></div>
            <div><label class="form-label">WhatsApp (optional)</label><input type="tel" class="form-input" placeholder="+1 (000) 000-0000"></div>
            <div><label class="form-label">Preferred Contact Method</label><select class="form-input"><option>Email</option><option>Phone</option><option>WhatsApp</option></select></div>
          </div>
        </div>

        <!-- Commission Settings -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2 border-t pt-4">
            <i class="fas fa-percentage text-blue-500"></i>Commission & Payment Settings
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="form-label">Commission Rate % *</label><input type="number" class="form-input" value="10" min="0" max="30"></div>
            <div><label class="form-label">Commission Type</label><select class="form-input"><option>Percentage of Booking Value</option><option>Fixed Amount Per Booking</option></select></div>
            <div><label class="form-label">Payment Cycle</label><select class="form-input"><option>Monthly</option><option>Bi-Weekly</option><option>Weekly</option><option>Per Booking</option></select></div>
            <div><label class="form-label">Payment Method</label><select class="form-input"><option>Bank Transfer</option><option>PayPal</option><option>Check</option></select></div>
            <div><label class="form-label">Minimum Payout Threshold ($)</label><input type="number" class="form-input" value="50"></div>
            <div><label class="form-label">Credit Limit ($)</label><input type="number" class="form-input" value="5000" placeholder="Max credit allowed"></div>
          </div>
        </div>

        <!-- Portal Access -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2 border-t pt-4">
            <i class="fas fa-key text-blue-500"></i>B2B Portal Access
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="form-label">Portal Email / Username *</label><input type="email" class="form-input" placeholder="Same as contact email"></div>
            <div><label class="form-label">Temporary Password *</label><input type="password" class="form-input" placeholder="Will be emailed to agent"></div>
            <div class="col-span-2">
              <label class="form-label">Portal Permissions</label>
              <div class="flex gap-4 flex-wrap mt-1">
                ${['View Own Bookings','Make Bookings','View Rates','View Commission','Request Payouts','Access Invoices'].map(p =>
                  `<label class="flex items-center gap-1.5 text-sm"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600"> ${p}</label>`
                ).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button type="button" class="btn-primary" onclick="showToast('Agent created and portal access granted! Welcome email sent.', 'success')">
            <i class="fas fa-user-plus mr-1"></i>Create Agent
          </button>
          <button type="button" class="btn-secondary">Save as Draft</button>
          <button type="reset" class="btn-secondary text-red-500">Clear Form</button>
        </div>
      </form>
    </div>

    <!-- Right Panel -->
    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">Quick Info</h3>
        <ul class="text-xs text-gray-500 space-y-2">
          <li class="flex gap-2"><i class="fas fa-info-circle text-blue-400 mt-0.5"></i>Agent will receive portal login via email</li>
          <li class="flex gap-2"><i class="fas fa-info-circle text-blue-400 mt-0.5"></i>Commission applies to all bookings made through portal</li>
          <li class="flex gap-2"><i class="fas fa-info-circle text-blue-400 mt-0.5"></i>KYC documents can be uploaded later</li>
          <li class="flex gap-2"><i class="fas fa-info-circle text-blue-400 mt-0.5"></i>Agent status starts as Active by default</li>
        </ul>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">Commission Preview</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Example Booking</span><span>$500</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Commission (10%)</span><span class="text-green-600 font-medium">$50.00</span></div>
          <div class="flex justify-between border-t pt-1"><span class="text-gray-500">Hotel Revenue</span><span class="font-medium">$450.00</span></div>
        </div>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create Agent', content, 'b2b', 'create-agent'))
})
