import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const staffRoute = new Hono()

// Employee Directory
staffRoute.get('/directory', (c) => {
  const employees = [
    {id:'EMP-001', name:'John Desk', dept:'Front Desk', role:'Front Desk Officer', email:'john.d@hotel.com', phone:'+1-305-555-1001', joined:'Jan 10, 2022', shift:'Morning (7AM-3PM)', salary:3200, status:'active'},
    {id:'EMP-002', name:'Sarah Counter', dept:'Front Desk', role:'Front Desk Officer', email:'sarah.c@hotel.com', phone:'+1-305-555-1002', joined:'Mar 15, 2023', shift:'Afternoon (3PM-11PM)', salary:3200, status:'active'},
    {id:'EMP-003', name:'Mike Chen', dept:'Housekeeping', role:'Housekeeping Supervisor', email:'mike.c@hotel.com', phone:'+1-305-555-1003', joined:'Aug 5, 2020', shift:'Morning (6AM-2PM)', salary:3800, status:'active'},
    {id:'EMP-004', name:'Lisa Night', dept:'Front Desk', role:'Night Auditor', email:'lisa.n@hotel.com', phone:'+1-305-555-1004', joined:'Nov 20, 2021', shift:'Night (11PM-7AM)', salary:3500, status:'active'},
    {id:'EMP-005', name:'Carlos Garcia', dept:'Food & Beverage', role:'F&B Supervisor', email:'carlos.g@hotel.com', phone:'+1-305-555-1005', joined:'Jun 1, 2019', shift:'Morning (6AM-2PM)', salary:4200, status:'active'},
    {id:'EMP-006', name:'Anna Kim', dept:'Sales', role:'Sales Executive', email:'anna.k@hotel.com', phone:'+1-305-555-1006', joined:'Sep 12, 2022', shift:'Office Hours', salary:4500, status:'active'},
    {id:'EMP-007', name:'Robert Park', dept:'Maintenance', role:'Maintenance Technician', email:'robert.p@hotel.com', phone:'+1-305-555-1007', joined:'Feb 28, 2021', shift:'Morning (8AM-4PM)', salary:3000, status:'on-leave'},
    {id:'EMP-008', name:'Priya Sharma', dept:'Spa & Wellness', role:'Spa Therapist', email:'priya.s@hotel.com', phone:'+1-305-555-1008', joined:'Apr 20, 2023', shift:'Afternoon (12PM-8PM)', salary:3400, status:'active'},
  ]

  const content = `
  ${pageHeader('Employee Directory', 'Complete staff roster and employee management', `
    <button onclick="openModal('addEmployeeModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Employee</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export HR Report</button>
  `)}

  <!-- Summary Stats -->
  <div class="grid grid-cols-5 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">48</div><div class="text-xs text-gray-500 mt-1">Total Staff</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">44</div><div class="text-xs text-gray-500 mt-1">Active</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-yellow-600">3</div><div class="text-xs text-gray-500 mt-1">On Leave</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">1</div><div class="text-xs text-gray-500 mt-1">New (This Month)</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-purple-600">7</div><div class="text-xs text-gray-500 mt-1">Departments</div></div>
  </div>

  <!-- Department Filter Tabs -->
  <div class="tab-nav mb-4 overflow-x-auto bg-white rounded-xl border border-gray-100 px-3">
    ${['All', 'Front Desk', 'Housekeeping', 'Food & Beverage', 'Sales', 'Maintenance', 'Spa & Wellness', 'Management'].map((d, i) =>
      `<button class="tab-btn ${i === 0 ? 'active' : ''}">${d}</button>`
    ).join('')}
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Employee List</h3>
      <div class="flex gap-2">
        <div class="relative"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search employees..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">EMP ID</th>
            <th class="table-header">Employee</th>
            <th class="table-header">Department</th>
            <th class="table-header">Role / Position</th>
            <th class="table-header">Contact</th>
            <th class="table-header">Current Shift</th>
            <th class="table-header">Joined</th>
            <th class="table-header">Salary</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${employees.map(e => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-gray-500">${e.id}</td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">${e.name.charAt(0)}</div>
                  <div>
                    <div class="font-medium text-gray-800">${e.name}</div>
                    <div class="text-xs text-gray-400">${e.email}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell"><span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">${e.dept}</span></td>
              <td class="table-cell text-sm text-gray-700">${e.role}</td>
              <td class="table-cell text-xs text-gray-500">${e.phone}</td>
              <td class="table-cell text-xs text-gray-600">${e.shift}</td>
              <td class="table-cell text-xs text-gray-500">${e.joined}</td>
              <td class="table-cell font-semibold text-gray-700">$${e.salary.toLocaleString()}/mo</td>
              <td class="table-cell">
                ${e.status === 'on-leave' ? 
                  `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">On Leave</span>` : 
                  statusBadge(e.status)
                }
              </td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button onclick="openModal('viewEmployeeModal')" class="text-blue-600 hover:text-blue-700 p-1 text-xs"><i class="fas fa-eye"></i></button>
                  <button class="text-gray-500 hover:text-gray-700 p-1 text-xs"><i class="fas fa-edit"></i></button>
                  <button class="text-green-500 hover:text-green-600 p-1 text-xs" title="Payslip"><i class="fas fa-file-invoice-dollar"></i></button>
                  <button class="text-red-400 hover:text-red-500 p-1 text-xs"><i class="fas fa-user-minus"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add Employee Modal -->
  <div id="addEmployeeModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-user-plus text-blue-500 mr-2"></i>Add New Employee</h3>
        <button onclick="closeModal('addEmployeeModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div><label class="form-label">First Name *</label><input type="text" class="form-input" placeholder="First name"></div>
          <div><label class="form-label">Last Name *</label><input type="text" class="form-input" placeholder="Last name"></div>
          <div><label class="form-label">Email *</label><input type="email" class="form-input" placeholder="employee@hotel.com"></div>
          <div><label class="form-label">Phone *</label><input type="tel" class="form-input" placeholder="+1 (000) 000-0000"></div>
          <div><label class="form-label">Department *</label>
            <select class="form-input">
              <option>Front Desk</option><option>Housekeeping</option><option>Food & Beverage</option>
              <option>Sales</option><option>Maintenance</option><option>Spa & Wellness</option><option>Management</option>
            </select>
          </div>
          <div><label class="form-label">Position / Role *</label><input type="text" class="form-input" placeholder="e.g., Front Desk Officer"></div>
          <div><label class="form-label">Date of Joining *</label><input type="date" class="form-input"></div>
          <div><label class="form-label">Monthly Salary ($) *</label><input type="number" class="form-input" placeholder="e.g., 3000"></div>
          <div><label class="form-label">Shift Assignment</label>
            <select class="form-input">
              <option>Morning (7AM-3PM)</option><option>Afternoon (3PM-11PM)</option>
              <option>Night (11PM-7AM)</option><option>Office Hours (9AM-5PM)</option>
            </select>
          </div>
          <div><label class="form-label">Employment Type</label>
            <select class="form-input"><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
          </div>
          <div class="col-span-2"><label class="form-label">Address</label><input type="text" class="form-input" placeholder="Home address"></div>
          <div><label class="form-label">Emergency Contact</label><input type="text" class="form-input" placeholder="Contact name"></div>
          <div><label class="form-label">Emergency Phone</label><input type="tel" class="form-input" placeholder="+1 (000) 000-0000"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('addEmployeeModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Employee added successfully!','success'); closeModal('addEmployeeModal')"><i class="fas fa-save mr-1"></i>Add Employee</button>
      </div>
    </div>
  </div>

  <!-- View Employee Modal -->
  <div id="viewEmployeeModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-id-card text-blue-500 mr-2"></i>Employee Profile</h3>
        <button onclick="closeModal('viewEmployeeModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold flex-shrink-0">J</div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">John Desk</h3>
            <div class="text-gray-500 text-sm">EMP-001 · Front Desk Officer</div>
            <div class="flex gap-2 mt-1">
              ${statusBadge('active')}
              <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Front Desk Dept.</span>
            </div>
          </div>
          <div class="ml-auto">
            <button class="btn-success btn-sm text-xs"><i class="fas fa-file-invoice-dollar mr-1"></i>Generate Payslip</button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm mb-4">
          <div><p class="text-xs text-gray-400 uppercase">Email</p><p>john.d@hotel.com</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Phone</p><p>+1-305-555-1001</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Date Joined</p><p>Jan 10, 2022</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Shift</p><p>Morning (7AM-3PM)</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Monthly Salary</p><p class="font-bold text-green-600">$3,200/month</p></div>
          <div><p class="text-xs text-gray-400 uppercase">Employment Type</p><p>Full-time</p></div>
        </div>
        <!-- Payslip Preview -->
        <div class="bg-gray-50 rounded-xl p-3">
          <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Latest Payslip — March 2024</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Base Salary</span><span>$3,200.00</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Overtime (8h)</span><span>$160.00</span></div>
            <div class="flex justify-between text-red-500"><span>Tax Deduction</span><span>-$336.00</span></div>
            <div class="flex justify-between font-bold border-t pt-1"><span>Net Pay</span><span class="text-green-600">$3,024.00</span></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('viewEmployeeModal')" class="btn-secondary">Close</button>
        <button class="btn-primary btn-sm"><i class="fas fa-edit mr-1"></i>Edit Profile</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Employee Directory', content, 'staff', 'directory'))
})

// Roles & Access
staffRoute.get('/roles', (c) => {
  const roles = [
    {id:'ROLE-01', name:'Super Admin', perms:['All Permissions'], users:2, color:'bg-red-100 text-red-700'},
    {id:'ROLE-02', name:'Property Manager', perms:['Bookings','Payments','Reports','Staff','Property'], users:3, color:'bg-purple-100 text-purple-700'},
    {id:'ROLE-03', name:'Front Desk Officer', perms:['Bookings','Check-in/out','Walk-in','Payments'], users:5, color:'bg-blue-100 text-blue-700'},
    {id:'ROLE-04', name:'Reservations Manager', perms:['All Bookings','B2B','Group Res'], users:2, color:'bg-green-100 text-green-700'},
    {id:'ROLE-05', name:'Sales Executive', perms:['B2B Agents','Reports','Promotions'], users:3, color:'bg-orange-100 text-orange-700'},
    {id:'ROLE-06', name:'Accountant', perms:['Payments','Sales Reports','Commission'], users:2, color:'bg-teal-100 text-teal-700'},
    {id:'ROLE-07', name:'Night Auditor', perms:['Bookings View','Walk-in','Basic Reports'], users:2, color:'bg-indigo-100 text-indigo-700'},
  ]

  const allPerms = {
    'Bookings': ['View All Bookings','Create Booking','Edit Booking','Cancel Booking','Check-in','Check-out'],
    'Financial': ['View Payments','Record Payment','View Commission','Process Payout','View Sales Reports'],
    'Property': ['Property Overview','Room Management','Website Management','Reviews'],
    'B2B': ['View Agents','Approve Agents','View Agent Bookings','Commission Management'],
    'Promotions': ['View Promos','Create Promo','Edit/Delete Promo'],
    'Staff': ['Employee Directory','Shift Scheduling','Payroll View'],
    'System': ['User Management','Log Reports','Trash','System Settings'],
  }

  const content = `
  ${pageHeader('Role & Access Control', 'Define staff roles and manage system permissions', `
    <button onclick="openModal('createRoleModal')" class="btn-primary"><i class="fas fa-plus"></i>Create Role</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Roles List -->
    <div class="lg:col-span-1 space-y-2">
      ${roles.map((r, i) => `
        <div class="card p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition ${i === 0 ? 'ring-2 ring-blue-500' : ''}">
          <div class="w-9 h-9 ${r.color} rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">${r.name.charAt(0)}</div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-800 text-sm">${r.name}</div>
            <div class="text-xs text-gray-400">${r.users} staff member${r.users > 1 ? 's' : ''}</div>
          </div>
          <div class="flex gap-1">
            <button onclick="openModal('editRoleModal')" class="text-gray-400 hover:text-blue-600 p-0.5"><i class="fas fa-edit text-xs"></i></button>
            <button class="text-gray-400 hover:text-red-500 p-0.5"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Role Permission Editor -->
    <div class="lg:col-span-2 card p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-gray-800">Super Admin — Permissions</h3>
          <p class="text-xs text-gray-500 mt-0.5">2 staff members have this role</p>
        </div>
        <button onclick="showToast('Permissions saved!','success')" class="btn-primary btn-sm"><i class="fas fa-save mr-1"></i>Save</button>
      </div>

      <div class="space-y-4">
        ${Object.entries(allPerms).map(([group, perms]) => `
          <div class="border border-gray-100 rounded-xl p-3">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-semibold text-gray-700">${group}</h4>
              <label class="text-xs text-gray-500 flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked class="rounded border-gray-300 text-blue-600"> Select All
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2">
              ${perms.map(p => `
                <label class="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked class="rounded border-gray-300 text-blue-600"> ${p}
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Create Role Modal -->
  <div id="createRoleModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-shield-alt text-purple-500 mr-2"></i>Create New Role</h3>
        <button onclick="closeModal('createRoleModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div><label class="form-label">Role Name *</label><input type="text" class="form-input" placeholder="e.g., Revenue Manager"></div>
        <div><label class="form-label">Description</label><textarea class="form-input" rows="2" placeholder="Describe what this role can do..."></textarea></div>
        <div>
          <label class="form-label">Copy Permissions From</label>
          <select class="form-input"><option>Start from scratch</option>${roles.map(r => `<option>${r.name}</option>`).join('')}</select>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createRoleModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Role created! Now configure permissions.','success'); closeModal('createRoleModal')">Create Role</button>
      </div>
    </div>
  </div>

  <div id="editRoleModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Edit Role</h3>
        <button onclick="closeModal('editRoleModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div><label class="form-label">Role Name</label><input type="text" class="form-input" value="Front Desk Officer"></div>
        <div><label class="form-label">Description</label><textarea class="form-input" rows="2">Handles check-in, check-out, walk-in bookings, and payment collection.</textarea></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('editRoleModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Role updated!','success');closeModal('editRoleModal')">Save Changes</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Role & Access Control', content, 'staff', 'roles'))
})

// Departments
staffRoute.get('/departments', (c) => {
  const departments = [
    {id:'DEPT-01', name:'Front Desk', head:'Sarah Counter', staff:5, duties:'Check-in, Check-out, Walk-in Bookings, Guest Services', status:'active'},
    {id:'DEPT-02', name:'Housekeeping', head:'Mike Chen', staff:12, duties:'Room Cleaning, Laundry, Minibar Restocking, Room Inspections', status:'active'},
    {id:'DEPT-03', name:'Food & Beverage', head:'Carlos Garcia', staff:8, duties:'Restaurant Service, Room Service, Bar Operations, Event Catering', status:'active'},
    {id:'DEPT-04', name:'Sales & Marketing', head:'Anna Kim', staff:4, duties:'Sales Strategy, B2B Relations, Promotions, Digital Marketing', status:'active'},
    {id:'DEPT-05', name:'Maintenance', head:'Robert Park', staff:6, duties:'Repairs, Equipment Maintenance, Utilities, Safety Compliance', status:'active'},
    {id:'DEPT-06', name:'Spa & Wellness', head:'Priya Sharma', staff:5, duties:'Massage Therapy, Beauty Treatments, Wellness Programs', status:'active'},
    {id:'DEPT-07', name:'Security', head:'David Brown', staff:8, duties:'Guest Security, Property Monitoring, Emergency Response', status:'active'},
  ]

  const content = `
  ${pageHeader('Departments', 'Manage hotel departments and organizational structure', `
    <button onclick="openModal('createDeptModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Department</button>
  `)}

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">7</div><div class="text-xs text-gray-500 mt-1">Departments</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-blue-600">48</div><div class="text-xs text-gray-500 mt-1">Total Staff</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">7</div><div class="text-xs text-gray-500 mt-1">Department Heads</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-purple-600">$178k</div><div class="text-xs text-gray-500 mt-1">Monthly Payroll</div></div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    ${departments.map(d => `
      <div class="card p-4 hover:shadow-md transition">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <i class="fas ${d.name.includes('Front') ? 'fa-concierge-bell' : d.name.includes('House') ? 'fa-broom' : d.name.includes('Food') ? 'fa-utensils' : d.name.includes('Sales') ? 'fa-chart-line' : d.name.includes('Main') ? 'fa-wrench' : d.name.includes('Spa') ? 'fa-spa' : 'fa-shield-alt'} text-blue-500"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">${d.name}</h3>
              <p class="text-xs text-gray-400">${d.id}</p>
            </div>
          </div>
          <div class="flex gap-1">
            <button onclick="openModal('editDeptModal')" class="text-gray-400 hover:text-blue-600 p-1"><i class="fas fa-edit text-xs"></i></button>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <i class="fas fa-user-tie text-gray-300 w-4 text-center"></i>
            <span class="text-gray-600">Head: <span class="font-medium">${d.head}</span></span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-users text-gray-300 w-4 text-center"></i>
            <span class="text-gray-600">${d.staff} Staff Members</span>
          </div>
          <div class="flex items-start gap-2">
            <i class="fas fa-tasks text-gray-300 w-4 text-center mt-0.5 flex-shrink-0"></i>
            <span class="text-gray-500 text-xs leading-relaxed">${d.duties}</span>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="btn-secondary btn-sm text-xs flex-1 justify-center" onclick="window.location='/staff/directory'">
            <i class="fas fa-users mr-1"></i>View Staff
          </button>
          <button class="btn-secondary btn-sm text-xs" onclick="window.location='/staff/shifts'">
            <i class="fas fa-clock"></i>
          </button>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- Create Department Modal -->
  <div id="createDeptModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-sitemap text-blue-500 mr-2"></i>Create Department</h3>
        <button onclick="closeModal('createDeptModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div><label class="form-label">Department Name *</label><input type="text" class="form-input" placeholder="e.g., Concierge Services"></div>
        <div><label class="form-label">Department Head</label>
          <select class="form-input"><option>Select employee</option><option>EMP-001 - John Desk</option><option>EMP-003 - Mike Chen</option><option>EMP-005 - Carlos Garcia</option></select>
        </div>
        <div><label class="form-label">Description / Duties</label><textarea class="form-input" rows="3" placeholder="Describe the department's duties and responsibilities..."></textarea></div>
        <div><label class="form-label">Cost Center (optional)</label><input type="text" class="form-input" placeholder="e.g., CC-008"></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createDeptModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Department created!','success'); closeModal('createDeptModal')">Create Department</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Departments', content, 'staff', 'departments'))
})

// Shift Scheduling
staffRoute.get('/shifts', (c) => {
  const shifts = ['Morning (7AM-3PM)', 'Afternoon (3PM-11PM)', 'Night (11PM-7AM)', 'Office Hours (9AM-5PM)']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const staff = [
    {name:'John Desk', role:'FD Officer', mon:'Morning', tue:'Morning', wed:'Off', thu:'Morning', fri:'Morning', sat:'Afternoon', sun:'Off'},
    {name:'Sarah Counter', role:'FD Officer', mon:'Afternoon', tue:'Afternoon', wed:'Afternoon', thu:'Off', fri:'Afternoon', sat:'Morning', sun:'Afternoon'},
    {name:'Lisa Night', role:'Night Auditor', mon:'Night', tue:'Night', wed:'Night', thu:'Night', fri:'Off', sat:'Off', sun:'Night'},
    {name:'Mike Chen', role:'HK Supervisor', mon:'Morning', tue:'Morning', wed:'Morning', thu:'Morning', fri:'Morning', sat:'Off', sun:'Off'},
    {name:'Carlos Garcia', role:'F&B Sup.', mon:'Morning', tue:'Morning', wed:'Afternoon', thu:'Afternoon', fri:'Morning', sat:'Morning', sun:'Afternoon'},
  ]

  const shiftColors: Record<string, string> = {
    'Morning': 'bg-blue-100 text-blue-700',
    'Afternoon': 'bg-orange-100 text-orange-700',
    'Night': 'bg-indigo-100 text-indigo-700',
    'Off': 'bg-gray-100 text-gray-400',
    'Office': 'bg-green-100 text-green-700',
  }

  const content = `
  ${pageHeader('Shift Scheduling', 'Manage weekly staff shift assignments', `
    <button onclick="openModal('assignShiftModal')" class="btn-primary"><i class="fas fa-plus"></i>Assign Shift</button>
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export Schedule</button>
    <button class="btn-secondary"><i class="fas fa-print mr-1"></i>Print</button>
  `)}

  <!-- Shift Legend -->
  <div class="flex gap-4 mb-4 flex-wrap text-xs bg-white rounded-xl border border-gray-100 p-3">
    ${[['Morning','bg-blue-100 text-blue-700','7AM-3PM'], ['Afternoon','bg-orange-100 text-orange-700','3PM-11PM'], ['Night','bg-indigo-100 text-indigo-700','11PM-7AM'], ['Office','bg-green-100 text-green-700','9AM-5PM'], ['Off','bg-gray-100 text-gray-400','Day Off']].map(([label, cls, time]) =>
      `<span class="flex items-center gap-1"><span class="px-2 py-0.5 rounded ${cls}">${label}</span><span class="text-gray-400">${time}</span></span>`
    ).join('')}
  </div>

  <!-- Week Selector -->
  <div class="flex items-center gap-3 mb-4">
    <button class="btn-secondary btn-sm"><i class="fas fa-chevron-left"></i></button>
    <span class="text-sm font-medium text-gray-700">Week of March 11 - 17, 2024</span>
    <button class="btn-secondary btn-sm"><i class="fas fa-chevron-right"></i></button>
    <button class="btn-secondary btn-sm ml-4"><i class="fas fa-calendar mr-1"></i>Today</button>
  </div>

  <!-- Shift Schedule Table -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full" style="min-width:700px">
        <thead>
          <tr>
            <th class="table-header sticky left-0 bg-gray-50 w-36">Employee</th>
            ${days.map(d => `<th class="table-header text-center">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${staff.map(s => `
            <tr class="table-row">
              <td class="table-cell sticky left-0 bg-white border-r border-gray-100">
                <div class="font-medium text-gray-800">${s.name}</div>
                <div class="text-xs text-gray-400">${s.role}</div>
              </td>
              ${[s.mon, s.tue, s.wed, s.thu, s.fri, s.sat, s.sun].map(shift => {
                const shiftType = shift.split(' ')[0]
                const cls = shiftColors[shiftType] || 'bg-gray-100 text-gray-400'
                return `<td class="table-cell text-center p-1">
                  <button class="w-full ${cls} text-xs font-medium rounded px-1 py-1.5 hover:opacity-80 transition" onclick="openModal('assignShiftModal')">
                    ${shift}
                  </button>
                </td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
      <span>Showing 5 of 48 employees · <a href="#" class="text-blue-600">View all departments</a></span>
      <span>Click any shift to modify · Drag to move</span>
    </div>
  </div>

  <!-- Assign Shift Modal -->
  <div id="assignShiftModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-clock text-blue-500 mr-2"></i>Assign / Modify Shift</h3>
        <button onclick="closeModal('assignShiftModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Employee *</label>
          <select class="form-input">
            <option>John Desk — Front Desk</option>
            <option>Sarah Counter — Front Desk</option>
            <option>Lisa Night — Night Audit</option>
          </select>
        </div>
        <div>
          <label class="form-label">Shift *</label>
          <select class="form-input">
            <option>Morning (7AM - 3PM)</option>
            <option>Afternoon (3PM - 11PM)</option>
            <option>Night (11PM - 7AM)</option>
            <option>Office Hours (9AM - 5PM)</option>
            <option>Day Off</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">From Date *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">To Date *</label>
            <input type="date" class="form-input">
          </div>
        </div>
        <div>
          <label class="form-label">Repeat</label>
          <select class="form-input">
            <option>No Repeat (One-time)</option>
            <option>Repeat Weekly</option>
            <option>Repeat Monthly</option>
          </select>
        </div>
        <div>
          <label class="form-label">Notes</label>
          <textarea class="form-input" rows="2" placeholder="Optional shift notes..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('assignShiftModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Shift assigned successfully!','success'); closeModal('assignShiftModal')"><i class="fas fa-check mr-1"></i>Assign Shift</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Shift Scheduling', content, 'staff', 'shifts'))
})
