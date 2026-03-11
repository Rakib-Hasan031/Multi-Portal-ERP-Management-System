import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const usersRoute = new Hono()

// B2C Users
usersRoute.get('/b2c', (c) => {
  const users = [
    {id:'USR-001', name:'James Wilson', email:'james@email.com', phone:'+1-305-555-0101', joined:'Jan 15, 2024', bookings:3, totalSpent:1305, status:'active', verified:true},
    {id:'USR-002', name:'Maria Santos', email:'maria@email.com', phone:'+1-786-555-0202', joined:'Feb 3, 2024', bookings:1, totalSpent:1036, status:'active', verified:true},
    {id:'USR-003', name:'Sophie Chen', email:'sophie@email.com', phone:'+1-415-555-0404', joined:'Mar 1, 2024', bookings:2, totalSpent:756, status:'active', verified:true},
    {id:'USR-004', name:'Anna Schmidt', email:'anna@email.com', phone:'+49-30-5550808', joined:'Feb 20, 2024', bookings:1, totalSpent:258, status:'inactive', verified:false},
    {id:'USR-005', name:'Carlos Rivera', email:'carlos@email.com', phone:'+1-212-555-0505', joined:'Dec 10, 2023', bookings:5, totalSpent:4200, status:'active', verified:true},
  ]

  const content = `
  ${pageHeader('B2C Users', 'Manage website members and direct booking customers', `
    <button onclick="openModal('createUserModal')" class="btn-primary"><i class="fas fa-plus"></i>Add User</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export</button>
  `)}

  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">1,284</div><div class="text-xs text-gray-500 mt-1">Total Registered Users</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">892</div><div class="text-xs text-gray-500 mt-1">Active Users</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">45</div><div class="text-xs text-gray-500 mt-1">New This Month</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-purple-600">$348</div><div class="text-xs text-gray-500 mt-1">Avg. Lifetime Value</div></div>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Customer Directory</h3>
      <div class="flex gap-2">
        <div class="relative"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search users..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Status</option><option>Active</option><option>Inactive</option></select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">User ID</th>
            <th class="table-header">Name</th>
            <th class="table-header">Contact</th>
            <th class="table-header">Joined</th>
            <th class="table-header">Bookings</th>
            <th class="table-header">Total Spent</th>
            <th class="table-header">Verified</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${users.map(u => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><span class="font-mono text-xs text-gray-500">${u.id}</span></td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">${u.name.charAt(0)}</div>
                  <span class="font-medium text-gray-800">${u.name}</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm">${u.email}</div>
                <div class="text-xs text-gray-400">${u.phone}</div>
              </td>
              <td class="table-cell text-xs text-gray-500">${u.joined}</td>
              <td class="table-cell text-center font-medium">${u.bookings}</td>
              <td class="table-cell font-semibold text-green-600">$${u.totalSpent}</td>
              <td class="table-cell">
                <span class="text-xs ${u.verified ? 'text-green-600' : 'text-gray-400'}">
                  <i class="fas ${u.verified ? 'fa-check-circle' : 'fa-times-circle'} mr-1"></i>${u.verified ? 'Verified' : 'Unverified'}
                </span>
              </td>
              <td class="table-cell">${statusBadge(u.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button onclick="openModal('viewUserModal')" class="text-blue-600 hover:text-blue-700 p-1 text-xs"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-500 hover:text-gray-700 p-1 text-xs"><i class="fas fa-edit"></i></button>
                  <button class="text-red-400 hover:text-red-500 p-1 text-xs"><i class="fas fa-ban"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create User Modal -->
  <div id="createUserModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add New User</h3>
        <button onclick="closeModal('createUserModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">First Name *</label><input type="text" class="form-input" placeholder="First name"></div>
          <div><label class="form-label">Last Name *</label><input type="text" class="form-input" placeholder="Last name"></div>
          <div class="col-span-2"><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="user@email.com"></div>
          <div><label class="form-label">Phone</label><input type="tel" class="form-input" placeholder="+1 000 000 0000"></div>
          <div><label class="form-label">Nationality</label><input type="text" class="form-input" placeholder="Country"></div>
          <div class="col-span-2"><label class="form-label">Password *</label><input type="password" class="form-input" placeholder="Temporary password"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createUserModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('User created!','success');closeModal('createUserModal')">Create User</button>
      </div>
    </div>
  </div>

  <!-- View User Modal -->
  <div id="viewUserModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-user text-blue-500 mr-2"></i>User Profile</h3>
        <button onclick="closeModal('viewUserModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">J</div>
          <div>
            <h3 class="font-bold text-gray-800">James Wilson</h3>
            <div class="text-gray-500 text-sm">USR-001 · Joined Jan 15, 2024</div>
            ${statusBadge('active')}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm mb-4">
          <div><p class="text-xs text-gray-400 uppercase">Email</p><p>james@email.com</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Phone</p><p>+1-305-555-0101</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Nationality</p><p>American</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Email Verified</p><p class="text-green-600">✓ Verified</p></div>
        </div>
        <div class="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 text-center">
          <div><div class="text-xl font-bold text-gray-800">3</div><div class="text-xs text-gray-500">Bookings</div></div>
          <div><div class="text-xl font-bold text-blue-600">$1,305</div><div class="text-xs text-gray-500">Total Spent</div></div>
          <div><div class="text-xl font-bold text-green-600">$435</div><div class="text-xs text-gray-500">Avg. Booking</div></div>
        </div>
        <div class="mt-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Recent Bookings</h4>
          <div class="space-y-1">
            ${[
              {id:'BK-2024-001', room:'Deluxe Room', dates:'Mar 11-14', amount:'$435'},
              {id:'BK-2023-089', room:'Standard Room', dates:'Dec 20-23', amount:'$267'},
            ].map(b => `
              <div class="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                <span class="font-mono text-blue-600">${b.id}</span>
                <span class="text-gray-600">${b.room} · ${b.dates}</span>
                <span class="font-medium">${b.amount}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('viewUserModal')" class="btn-secondary">Close</button>
        <button class="btn-primary btn-sm"><i class="fas fa-edit mr-1"></i>Edit Profile</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('B2C Users', content, 'users', 'users-b2c'))
})

// B2B Users
usersRoute.get('/b2b', (c) => {
  const content = `
  ${pageHeader('B2B Users', 'Manage B2B agent portal users and accounts', `
    <button onclick="openModal('createB2BUserModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Agent User</button>
  `)}

  <div class="card overflow-hidden">
    <div class="card-header">
      <h3 class="font-semibold text-gray-800">Agent Portal Users</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">User ID</th>
            <th class="table-header">Agent Name</th>
            <th class="table-header">Agency</th>
            <th class="table-header">Email</th>
            <th class="table-header">Phone</th>
            <th class="table-header">Portal Access</th>
            <th class="table-header">Last Login</th>
            <th class="table-header">Invoices</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'B2B-USR-01', name:'John Matthews', agency:'Horizon Travel', email:'john@horizontravel.com', phone:'+1-212-555-0101', portal:'Active', lastLogin:'Mar 11, 2:30 PM', invoices:12, status:'active'},
            {id:'B2B-USR-02', name:'Ahmed Khalid', agency:'Dubai Star Tours', email:'ahmed@dubaistar.ae', phone:'+971-4-555-0202', portal:'Active', lastLogin:'Mar 10, 10:00 AM', invoices:8, status:'active'},
            {id:'B2B-USR-03', name:'Mei Lin', agency:'Pacific Voyages', email:'mei@pacificvoyages.sg', phone:'+65-6555-0303', portal:'Active', lastLogin:'Mar 8, 9:45 AM', invoices:5, status:'active'},
            {id:'B2B-USR-04', name:'Sara Nguyen', agency:'Sunrise Travel', email:'sara@sunrisetravel.vn', phone:'+84-28-555-0505', portal:'Suspended', lastLogin:'Mar 1, 3:00 PM', invoices:3, status:'inactive'},
          ].map(u => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-gray-500">${u.id}</td>
              <td class="table-cell font-medium text-gray-800">${u.name}</td>
              <td class="table-cell text-gray-600">${u.agency}</td>
              <td class="table-cell text-sm">${u.email}</td>
              <td class="table-cell text-sm text-gray-500">${u.phone}</td>
              <td class="table-cell">
                <span class="text-xs px-2 py-0.5 rounded ${u.portal === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${u.portal}</span>
              </td>
              <td class="table-cell text-xs text-gray-500">${u.lastLogin}</td>
              <td class="table-cell text-center">
                <button class="text-blue-600 hover:underline text-xs">${u.invoices} invoices</button>
              </td>
              <td class="table-cell">${statusBadge(u.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 p-1 text-xs"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-500 p-1 text-xs"><i class="fas fa-edit"></i></button>
                  <button class="text-yellow-500 p-1 text-xs" title="Reset Password"><i class="fas fa-key"></i></button>
                  <button class="text-red-400 p-1 text-xs"><i class="fas fa-ban"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div id="createB2BUserModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add B2B Agent User</h3>
        <button onclick="closeModal('createB2BUserModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div><label class="form-label">Link to Agent</label>
          <select class="form-input"><option>Select existing agent</option><option>AGT-001 - Horizon Travel</option><option>AGT-002 - Dubai Star Tours</option></select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Full Name *</label><input type="text" class="form-input" placeholder="Contact person name"></div>
          <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="agent@email.com"></div>
          <div><label class="form-label">Phone</label><input type="tel" class="form-input" placeholder="+1 000 000 0000"></div>
          <div><label class="form-label">Role</label><select class="form-input"><option>Agent (Standard)</option><option>Agent Manager</option></select></div>
          <div class="col-span-2"><label class="form-label">Temporary Password *</label><input type="password" class="form-input" placeholder="Will be emailed"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createB2BUserModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('B2B user created!','success');closeModal('createB2BUserModal')">Create User</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('B2B Users', content, 'users', 'users-b2b'))
})

// Front Desk Users
usersRoute.get('/frontdesk', (c) => {
  const content = `
  ${pageHeader('Front Desk Users', 'Manage counter staff portal accounts', `
    <button onclick="openModal('createFDUserModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Staff Account</button>
  `)}

  <div class="card overflow-hidden">
    <div class="card-header">
      <h3 class="font-semibold text-gray-800">Front Desk Staff Accounts</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Staff ID</th>
            <th class="table-header">Name</th>
            <th class="table-header">Role</th>
            <th class="table-header">Email</th>
            <th class="table-header">Counter</th>
            <th class="table-header">Permissions</th>
            <th class="table-header">Last Login</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'FD-001', name:'John Desk', role:'Front Desk Officer', email:'john.d@hotel.com', counter:'Counter 1', perms:'Full Access', lastLogin:'Mar 11, 9:00 AM', status:'active'},
            {id:'FD-002', name:'Sarah Counter', role:'Front Desk Officer', email:'sarah.c@hotel.com', counter:'Counter 2', perms:'Full Access', lastLogin:'Mar 11, 8:45 AM', status:'active'},
            {id:'FD-003', name:'Mike Recept', role:'Receptionist', email:'mike.r@hotel.com', counter:'Counter 3', perms:'View Only', lastLogin:'Mar 10, 9:00 AM', status:'active'},
            {id:'FD-004', name:'Lisa Night', role:'Night Auditor', email:'lisa.n@hotel.com', counter:'Night Desk', perms:'Full Access', lastLogin:'Mar 10, 11:00 PM', status:'active'},
          ].map(u => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-gray-500">${u.id}</td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xs font-bold">${u.name.charAt(0)}</div>
                  <span class="font-medium text-gray-800">${u.name}</span>
                </div>
              </td>
              <td class="table-cell text-sm text-gray-600">${u.role}</td>
              <td class="table-cell text-sm">${u.email}</td>
              <td class="table-cell text-sm text-gray-500">${u.counter}</td>
              <td class="table-cell"><span class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">${u.perms}</span></td>
              <td class="table-cell text-xs text-gray-500">${u.lastLogin}</td>
              <td class="table-cell">${statusBadge(u.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 p-1 text-xs"><i class="fas fa-edit"></i></button>
                  <button class="text-yellow-500 p-1 text-xs"><i class="fas fa-key"></i></button>
                  <button class="text-red-400 p-1 text-xs"><i class="fas fa-ban"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div id="createFDUserModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Add Front Desk Staff Account</h3>
        <button onclick="closeModal('createFDUserModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Full Name *</label><input type="text" class="form-input" placeholder="Staff name"></div>
          <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="staff@hotel.com"></div>
          <div><label class="form-label">Role *</label><select class="form-input"><option>Front Desk Officer</option><option>Receptionist</option><option>Night Auditor</option><option>Supervisor</option></select></div>
          <div><label class="form-label">Counter Assignment</label><select class="form-input"><option>Counter 1</option><option>Counter 2</option><option>Night Desk</option></select></div>
          <div><label class="form-label">Access Level *</label><select class="form-input"><option>Full Access</option><option>Standard Access</option><option>View Only</option></select></div>
          <div><label class="form-label">Password *</label><input type="password" class="form-input" placeholder="Temporary password"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createFDUserModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Staff account created!','success');closeModal('createFDUserModal')">Create Account</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Front Desk Users', content, 'users', 'users-frontdesk'))
})
