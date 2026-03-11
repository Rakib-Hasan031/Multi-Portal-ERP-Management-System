// Layout helper functions for the Hotel ERP system

export function adminLayout(title: string, content: string, activeMenu: string = '', activeSub: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - HotelERP Pro</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
            hotel: { 50:'#f0fdf4',100:'#dcfce7',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 font-sans">
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside id="sidebar" class="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300 z-50">
      <!-- Logo -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <i class="fas fa-hotel text-white text-sm"></i>
          </div>
          <div>
            <div class="text-white font-bold text-sm">HotelERP Pro</div>
            <div class="text-gray-400 text-xs">Property Management</div>
          </div>
        </div>
        <button onclick="toggleSidebar()" class="text-gray-400 hover:text-white lg:hidden">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Property Selector -->
      <div class="px-3 py-2 border-b border-gray-700">
        <select class="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:outline-none focus:border-blue-500">
          <option>Grand Palace Hotel</option>
          <option>Ocean View Resort</option>
          <option>Mountain Lodge</option>
        </select>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <div class="px-3 py-1">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Main</p>
        </div>

        <!-- Dashboard -->
        <a href="/dashboard" class="nav-item ${activeMenu === 'dashboard' ? 'active' : ''}">
          <i class="fas fa-tachometer-alt w-5 text-center"></i>
          <span>Dashboard</span>
        </a>

        <!-- Property -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('property-sub')" class="nav-item w-full ${activeMenu === 'property' ? 'active' : ''}">
            <i class="fas fa-building w-5 text-center"></i>
            <span class="flex-1 text-left">Property</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'property' ? 'rotate-180' : ''}" id="property-arrow"></i>
          </button>
          <div id="property-sub" class="submenu ${activeMenu === 'property' ? 'open' : ''}">
            <a href="/property/overview" class="submenu-item ${activeSub === 'overview' ? 'active-sub' : ''}"><i class="fas fa-eye w-4 text-center"></i> Overview</a>
            <a href="/property/create-room" class="submenu-item ${activeSub === 'create-room' ? 'active-sub' : ''}"><i class="fas fa-bed w-4 text-center"></i> Create Room</a>
            <a href="/property/create-category" class="submenu-item ${activeSub === 'create-category' ? 'active-sub' : ''}"><i class="fas fa-tags w-4 text-center"></i> Create Category</a>
            <a href="/property/manage-website" class="submenu-item ${activeSub === 'manage-website' ? 'active-sub' : ''}"><i class="fas fa-globe w-4 text-center"></i> Manage Website</a>
            <a href="/property/reviews" class="submenu-item ${activeSub === 'reviews' ? 'active-sub' : ''}"><i class="fas fa-star w-4 text-center"></i> Reviews</a>
            <a href="/property/create-property" class="submenu-item ${activeSub === 'create-property' ? 'active-sub' : ''}"><i class="fas fa-plus-circle w-4 text-center"></i> Create My Property</a>
          </div>
        </div>

        <!-- Booking -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('booking-sub')" class="nav-item w-full ${activeMenu === 'booking' ? 'active' : ''}">
            <i class="fas fa-calendar-check w-5 text-center"></i>
            <span class="flex-1 text-left">Booking</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'booking' ? 'rotate-180' : ''}" id="booking-arrow"></i>
          </button>
          <div id="booking-sub" class="submenu ${activeMenu === 'booking' ? 'open' : ''}">
            <a href="/booking/all" class="submenu-item ${activeSub === 'all' ? 'active-sub' : ''}"><i class="fas fa-list w-4 text-center"></i> All Bookings</a>
            <a href="/booking/pending" class="submenu-item ${activeSub === 'pending' ? 'active-sub' : ''}"><i class="fas fa-clock w-4 text-center"></i> Pending Bookings</a>
            <a href="/booking/cancelled" class="submenu-item ${activeSub === 'cancelled' ? 'active-sub' : ''}"><i class="fas fa-times-circle w-4 text-center"></i> Cancelled Bookings</a>
            <a href="/booking/walk-in" class="submenu-item ${activeSub === 'walk-in' ? 'active-sub' : ''}"><i class="fas fa-walking w-4 text-center"></i> Walk-in / Front Desk</a>
            <a href="/booking/group" class="submenu-item ${activeSub === 'group' ? 'active-sub' : ''}"><i class="fas fa-users w-4 text-center"></i> Group Reservations</a>
            <a href="/booking/calendar" class="submenu-item ${activeSub === 'calendar-view' ? 'active-sub' : ''}"><i class="fas fa-calendar-alt w-4 text-center"></i> Calendar View</a>
          </div>
        </div>

        <!-- Calendar -->
        <a href="/calendar" class="nav-item ${activeMenu === 'calendar' ? 'active' : ''}">
          <i class="fas fa-calendar w-5 text-center"></i>
          <span>Calendar</span>
        </a>

        <div class="px-3 py-1 mt-2">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Partners</p>
        </div>

        <!-- B2B Agent -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('b2b-sub')" class="nav-item w-full ${activeMenu === 'b2b' ? 'active' : ''}">
            <i class="fas fa-handshake w-5 text-center"></i>
            <span class="flex-1 text-left">B2B Agent</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'b2b' ? 'rotate-180' : ''}" id="b2b-arrow"></i>
          </button>
          <div id="b2b-sub" class="submenu ${activeMenu === 'b2b' ? 'open' : ''}">
            <a href="/b2b/requests" class="submenu-item ${activeSub === 'requests' ? 'active-sub' : ''}"><i class="fas fa-inbox w-4 text-center"></i> Agent Requests</a>
            <a href="/b2b/all-agents" class="submenu-item ${activeSub === 'all-agents' ? 'active-sub' : ''}"><i class="fas fa-user-tie w-4 text-center"></i> All Agents</a>
            <a href="/b2b/agent-bookings" class="submenu-item ${activeSub === 'agent-bookings' ? 'active-sub' : ''}"><i class="fas fa-book w-4 text-center"></i> Agent Bookings</a>
            <a href="/b2b/commission" class="submenu-item ${activeSub === 'commission' ? 'active-sub' : ''}"><i class="fas fa-percentage w-4 text-center"></i> Commission & Payouts</a>
            <a href="/b2b/create-agent" class="submenu-item ${activeSub === 'create-agent' ? 'active-sub' : ''}"><i class="fas fa-user-plus w-4 text-center"></i> Create Agent</a>
          </div>
        </div>

        <div class="px-3 py-1 mt-2">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Finance</p>
        </div>

        <!-- Payment -->
        <a href="/payment" class="nav-item ${activeMenu === 'payment' ? 'active' : ''}">
          <i class="fas fa-credit-card w-5 text-center"></i>
          <span>Payment</span>
        </a>

        <!-- Sales Reports -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('sales-sub')" class="nav-item w-full ${activeMenu === 'sales' ? 'active' : ''}">
            <i class="fas fa-chart-bar w-5 text-center"></i>
            <span class="flex-1 text-left">Sales Reports</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'sales' ? 'rotate-180' : ''}" id="sales-arrow"></i>
          </button>
          <div id="sales-sub" class="submenu ${activeMenu === 'sales' ? 'open' : ''}">
            <a href="/sales/b2c" class="submenu-item ${activeSub === 'b2c' ? 'active-sub' : ''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
            <a href="/sales/b2b" class="submenu-item ${activeSub === 'b2b-sales' ? 'active-sub' : ''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
            <a href="/sales/frontdesk" class="submenu-item ${activeSub === 'frontdesk-sales' ? 'active-sub' : ''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
            <a href="/sales/all-channel" class="submenu-item ${activeSub === 'all-channel' ? 'active-sub' : ''}"><i class="fas fa-chart-pie w-4 text-center"></i> All Channel Sales</a>
          </div>
        </div>

        <!-- Promo Management -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('promo-sub')" class="nav-item w-full ${activeMenu === 'promo' ? 'active' : ''}">
            <i class="fas fa-tag w-5 text-center"></i>
            <span class="flex-1 text-left">Promo Management</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'promo' ? 'rotate-180' : ''}" id="promo-arrow"></i>
          </button>
          <div id="promo-sub" class="submenu ${activeMenu === 'promo' ? 'open' : ''}">
            <a href="/promo/b2c" class="submenu-item ${activeSub === 'promo-b2c' ? 'active-sub' : ''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
            <a href="/promo/b2b" class="submenu-item ${activeSub === 'promo-b2b' ? 'active-sub' : ''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
            <a href="/promo/ota" class="submenu-item ${activeSub === 'promo-ota' ? 'active-sub' : ''}"><i class="fas fa-globe w-4 text-center"></i> OTA</a>
            <a href="/promo/festival" class="submenu-item ${activeSub === 'promo-festival' ? 'active-sub' : ''}"><i class="fas fa-star w-4 text-center"></i> Festival</a>
            <a href="/promo/others" class="submenu-item ${activeSub === 'promo-others' ? 'active-sub' : ''}"><i class="fas fa-ellipsis-h w-4 text-center"></i> Others</a>
          </div>
        </div>

        <div class="px-3 py-1 mt-2">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Reports & Users</p>
        </div>

        <!-- Log Reports -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('log-sub')" class="nav-item w-full ${activeMenu === 'logs' ? 'active' : ''}">
            <i class="fas fa-clipboard-list w-5 text-center"></i>
            <span class="flex-1 text-left">Log Reports</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'logs' ? 'rotate-180' : ''}" id="log-arrow"></i>
          </button>
          <div id="log-sub" class="submenu ${activeMenu === 'logs' ? 'open' : ''}">
            <a href="/logs/b2c" class="submenu-item ${activeSub === 'log-b2c' ? 'active-sub' : ''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
            <a href="/logs/b2b" class="submenu-item ${activeSub === 'log-b2b' ? 'active-sub' : ''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
            <a href="/logs/frontdesk" class="submenu-item ${activeSub === 'log-frontdesk' ? 'active-sub' : ''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
          </div>
        </div>

        <!-- Trash -->
        <a href="/trash" class="nav-item ${activeMenu === 'trash' ? 'active' : ''}">
          <i class="fas fa-trash w-5 text-center"></i>
          <span>Trash</span>
        </a>

        <!-- Manage Users -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('users-sub')" class="nav-item w-full ${activeMenu === 'users' ? 'active' : ''}">
            <i class="fas fa-users-cog w-5 text-center"></i>
            <span class="flex-1 text-left">Manage Users</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'users' ? 'rotate-180' : ''}" id="users-arrow"></i>
          </button>
          <div id="users-sub" class="submenu ${activeMenu === 'users' ? 'open' : ''}">
            <a href="/users/b2c" class="submenu-item ${activeSub === 'users-b2c' ? 'active-sub' : ''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
            <a href="/users/b2b" class="submenu-item ${activeSub === 'users-b2b' ? 'active-sub' : ''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
            <a href="/users/frontdesk" class="submenu-item ${activeSub === 'users-frontdesk' ? 'active-sub' : ''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
          </div>
        </div>

        <!-- Staff System -->
        <div class="nav-group">
          <button onclick="toggleSubmenu('staff-sub')" class="nav-item w-full ${activeMenu === 'staff' ? 'active' : ''}">
            <i class="fas fa-id-card w-5 text-center"></i>
            <span class="flex-1 text-left">Staff System</span>
            <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'staff' ? 'rotate-180' : ''}" id="staff-arrow"></i>
          </button>
          <div id="staff-sub" class="submenu ${activeMenu === 'staff' ? 'open' : ''}">
            <a href="/staff/directory" class="submenu-item ${activeSub === 'directory' ? 'active-sub' : ''}"><i class="fas fa-address-book w-4 text-center"></i> Employee Directory</a>
            <a href="/staff/roles" class="submenu-item ${activeSub === 'roles' ? 'active-sub' : ''}"><i class="fas fa-shield-alt w-4 text-center"></i> Role & Access</a>
            <a href="/staff/departments" class="submenu-item ${activeSub === 'departments' ? 'active-sub' : ''}"><i class="fas fa-sitemap w-4 text-center"></i> Departments</a>
            <a href="/staff/shifts" class="submenu-item ${activeSub === 'shifts' ? 'active-sub' : ''}"><i class="fas fa-clock w-4 text-center"></i> Shift Scheduling</a>
          </div>
        </div>

        <!-- Portal Links -->
        <div class="px-3 py-1 mt-2">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Portals</p>
        </div>
        <a href="/frontdesk" class="nav-item" target="_blank">
          <i class="fas fa-desktop w-5 text-center"></i>
          <span>Front Desk Portal</span>
          <i class="fas fa-external-link-alt text-xs ml-auto text-gray-500"></i>
        </a>
        <a href="/b2b-portal" class="nav-item" target="_blank">
          <i class="fas fa-briefcase w-5 text-center"></i>
          <span>B2B Portal</span>
          <i class="fas fa-external-link-alt text-xs ml-auto text-gray-500"></i>
        </a>
        <a href="/website" class="nav-item" target="_blank">
          <i class="fas fa-globe w-5 text-center"></i>
          <span>Public Website</span>
          <i class="fas fa-external-link-alt text-xs ml-auto text-gray-500"></i>
        </a>
      </nav>

      <!-- Logout -->
      <div class="border-t border-gray-700 p-3">
        <div class="flex items-center gap-3 mb-2 px-2 py-1">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">A</div>
          <div class="flex-1 min-w-0">
            <div class="text-white text-sm font-medium truncate">Admin User</div>
            <div class="text-gray-400 text-xs truncate">admin@hotelerpro.com</div>
          </div>
        </div>
        <a href="/auth/login" class="nav-item text-red-400 hover:text-red-300 hover:bg-red-900/20">
          <i class="fas fa-sign-out-alt w-5 text-center"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-40 flex-shrink-0">
        <div class="flex items-center gap-3">
          <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-700 p-1 rounded">
            <i class="fas fa-bars text-lg"></i>
          </button>
          <nav class="text-sm text-gray-500 hidden sm:flex items-center gap-1">
            <span>HotelERP Pro</span>
            <i class="fas fa-chevron-right text-xs"></i>
            <span class="text-gray-800 font-medium">${title}</span>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <!-- Quick Actions -->
          <button onclick="openModal('quickBookingModal')" class="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
            <i class="fas fa-plus"></i><span>New Booking</span>
          </button>
          <!-- Date -->
          <div class="hidden lg:flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            <i class="fas fa-calendar text-gray-400"></i>
            <span id="currentDate"></span>
          </div>
          <!-- Notifications -->
          <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <i class="fas fa-bell"></i>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <!-- Settings -->
          <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <i class="fas fa-cog"></i>
          </button>
          <!-- User Avatar -->
          <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1">
            <div class="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">A</div>
            <span class="text-sm text-gray-700 hidden sm:block">Admin</span>
            <i class="fas fa-chevron-down text-xs text-gray-400"></i>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        ${content}
      </main>
    </div>
  </div>

  <!-- Quick Booking Modal -->
  <div id="quickBookingModal" class="modal-overlay hidden">
    <div class="modal-container max-w-2xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-plus-circle text-blue-500 mr-2"></i>Quick New Booking</h3>
        <button onclick="closeModal('quickBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="form-label">Guest Name *</label>
            <input type="text" class="form-input" placeholder="Full name">
          </div>
          <div>
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" placeholder="+1 000 000 0000">
          </div>
          <div>
            <label class="form-label">Email</label>
            <input type="email" class="form-input" placeholder="guest@email.com">
          </div>
          <div>
            <label class="form-label">Check-in Date *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Check-out Date *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Room Category *</label>
            <select class="form-input">
              <option value="">Select Category</option>
              <option>Deluxe Room</option>
              <option>Suite</option>
              <option>Standard Room</option>
              <option>Presidential Suite</option>
            </select>
          </div>
          <div>
            <label class="form-label">Room Number</label>
            <select class="form-input">
              <option value="">Select Room</option>
              <option>101</option><option>102</option><option>201</option><option>202</option>
            </select>
          </div>
          <div>
            <label class="form-label">Adults</label>
            <input type="number" class="form-input" value="1" min="1">
          </div>
          <div>
            <label class="form-label">Children</label>
            <input type="number" class="form-input" value="0" min="0">
          </div>
          <div>
            <label class="form-label">Booking Source</label>
            <select class="form-input">
              <option>Walk-in</option>
              <option>Website</option>
              <option>Phone</option>
              <option>B2B Agent</option>
              <option>OTA</option>
            </select>
          </div>
          <div>
            <label class="form-label">Special Requests</label>
            <textarea class="form-input" rows="2" placeholder="Any special requirements..."></textarea>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <i class="fas fa-info-circle text-blue-400 mr-1"></i>
            Rate will be calculated automatically
          </div>
          <div class="flex gap-2">
            <button onclick="closeModal('quickBookingModal')" class="btn-secondary">Cancel</button>
            <button class="btn-primary">Create Booking</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notifications Container -->
  <div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>

  <script src="/static/app.js"></script>
  <script>
    // Set current date
    document.getElementById('currentDate').textContent = dayjs().format('MMM DD, YYYY');
    
    // Auto-open active submenu
    const activeMenus = ['property-sub', 'booking-sub', 'b2b-sub', 'sales-sub', 'promo-sub', 'log-sub', 'users-sub', 'staff-sub'];
    activeMenus.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.classList.contains('open')) {
        el.style.maxHeight = el.scrollHeight + 'px';
      }
    });
  </script>
</body>
</html>`
}

export function pageHeader(title: string, subtitle: string, actions: string = ''): string {
  return `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold text-gray-800">${title}</h1>
      <p class="text-sm text-gray-500 mt-0.5">${subtitle}</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">${actions}</div>
  </div>`
}

export function statCard(icon: string, iconBg: string, label: string, value: string, trend: string = '', trendDir: string = 'up'): string {
  const trendColor = trendDir === 'up' ? 'text-green-600' : 'text-red-500'
  const trendIcon = trendDir === 'up' ? 'fa-arrow-up' : 'fa-arrow-down'
  return `<div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">${label}</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">${value}</p>
        ${trend ? `<p class="${trendColor} text-xs mt-1 flex items-center gap-1"><i class="fas ${trendIcon} text-xs"></i>${trend}</p>` : ''}
      </div>
      <div class="${iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="${icon} text-white text-sm"></i>
      </div>
    </div>
  </div>`
}

export function tableWrapper(headers: string[], rows: string[], options: { searchable?: boolean, filterable?: boolean, exportable?: boolean } = {}): string {
  const headerCells = headers.map(h => `<th class="table-header">${h}</th>`).join('')
  return `<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    ${options.searchable || options.filterable || options.exportable ? `
    <div class="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between">
      ${options.searchable ? `
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" placeholder="Search..." class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
      </div>` : '<div></div>'}
      <div class="flex gap-2">
        ${options.filterable ? `<button class="btn-secondary text-sm"><i class="fas fa-filter mr-1"></i>Filter</button>` : ''}
        ${options.exportable ? `<button class="btn-secondary text-sm"><i class="fas fa-download mr-1"></i>Export</button>` : ''}
      </div>
    </div>` : ''}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${rows.join('')}
        </tbody>
      </table>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 1-10 of 247 results</span>
      <div class="flex gap-1">
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40"><i class="fas fa-chevron-left text-xs"></i></button>
        <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-right text-xs"></i></button>
      </div>
    </div>
  </div>`
}

export function statusBadge(status: string): string {
  const configs: Record<string, string> = {
    'confirmed': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'cancelled': 'bg-red-100 text-red-700',
    'checked-in': 'bg-blue-100 text-blue-700',
    'checked-out': 'bg-gray-100 text-gray-700',
    'active': 'bg-green-100 text-green-700',
    'inactive': 'bg-red-100 text-red-700',
    'approved': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700',
    'processing': 'bg-purple-100 text-purple-700',
    'completed': 'bg-green-100 text-green-700',
    'paid': 'bg-green-100 text-green-700',
    'unpaid': 'bg-red-100 text-red-700',
    'partial': 'bg-orange-100 text-orange-700',
  }
  const cls = configs[status.toLowerCase()] || 'bg-gray-100 text-gray-700'
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls} capitalize">${status}</span>`
}

export function modal(id: string, title: string, content: string, footer: string = ''): string {
  return `<div id="${id}" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
        <button onclick="closeModal('${id}')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4">${content}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  </div>`
}
