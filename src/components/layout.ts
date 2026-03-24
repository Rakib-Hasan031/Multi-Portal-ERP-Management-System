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
            hotel:   { 50:'#f0fdf4',100:'#dcfce7',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 font-sans">
<div class="flex h-screen overflow-hidden">

  <!-- ═══ SIDEBAR ═══ -->
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
        <i class="fas fa-tachometer-alt w-5 text-center"></i><span>Dashboard</span>
      </a>

      <!-- Property -->
      <div class="nav-group">
        <button onclick="toggleSubmenu('property-sub')" class="nav-item w-full ${activeMenu === 'property' ? 'active' : ''}">
          <i class="fas fa-building w-5 text-center"></i>
          <span class="flex-1 text-left">Property</span>
          <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'property' ? 'rotate-180' : ''}" id="property-arrow"></i>
        </button>
        <div id="property-sub" class="submenu ${activeMenu === 'property' ? 'open' : ''}">
          <a href="/property/overview"       class="submenu-item ${activeSub==='overview'?'active-sub':''}"><i class="fas fa-eye w-4 text-center"></i> Overview</a>
          <a href="/property/room-availability" class="submenu-item ${activeSub==='room-availability'?'active-sub':''}"><i class="fas fa-th-large w-4 text-center"></i> Room Availability</a>
          <a href="/property/create-room"    class="submenu-item ${activeSub==='create-room'?'active-sub':''}"><i class="fas fa-bed w-4 text-center"></i> Create Room</a>
          <a href="/property/create-category" class="submenu-item ${activeSub==='create-category'?'active-sub':''}"><i class="fas fa-tags w-4 text-center"></i> Create Category</a>
          <a href="/property/manage-website" class="submenu-item ${activeSub==='manage-website'?'active-sub':''}"><i class="fas fa-globe w-4 text-center"></i> Manage Website</a>
          <a href="/property/ota-settings"   class="submenu-item ${activeSub==='ota-settings'?'active-sub':''}"><i class="fas fa-plug w-4 text-center"></i> OTA Settings</a>
          <a href="/property/reviews"        class="submenu-item ${activeSub==='reviews'?'active-sub':''}"><i class="fas fa-star w-4 text-center"></i> Reviews</a>
          <a href="/property/create-property" class="submenu-item ${activeSub==='create-property'?'active-sub':''}"><i class="fas fa-plus-circle w-4 text-center"></i> Create My Property</a>
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
          <a href="/booking/all"       class="submenu-item ${activeSub==='all'?'active-sub':''}"><i class="fas fa-list w-4 text-center"></i> All Bookings</a>
          <a href="/booking/pending"   class="submenu-item ${activeSub==='pending'?'active-sub':''}"><i class="fas fa-clock w-4 text-center"></i> Pending Bookings</a>
          <a href="/booking/confirmed" class="submenu-item ${activeSub==='confirmed'?'active-sub':''}"><i class="fas fa-check-circle w-4 text-center"></i> Confirmed Bookings</a>
          <a href="/booking/cancelled" class="submenu-item ${activeSub==='cancelled'?'active-sub':''}"><i class="fas fa-times-circle w-4 text-center"></i> Cancelled Bookings</a>
          <a href="/booking/walk-in"   class="submenu-item ${activeSub==='walk-in'?'active-sub':''}"><i class="fas fa-walking w-4 text-center"></i> Walk-in / Front Desk</a>
          <a href="/booking/group"     class="submenu-item ${activeSub==='group'?'active-sub':''}"><i class="fas fa-users w-4 text-center"></i> Group Reservations</a>
          <a href="/booking/calendar"  class="submenu-item ${activeSub==='calendar-view'?'active-sub':''}"><i class="fas fa-calendar-alt w-4 text-center"></i> Calendar View</a>
        </div>
      </div>

      <!-- Calendar -->
      <a href="/calendar" class="nav-item ${activeMenu === 'calendar' ? 'active' : ''}">
        <i class="fas fa-calendar w-5 text-center"></i><span>Calendar</span>
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
          <a href="/b2b/requests"       class="submenu-item ${activeSub==='requests'?'active-sub':''}"><i class="fas fa-inbox w-4 text-center"></i> Agent Requests</a>
          <a href="/b2b/all-agents"     class="submenu-item ${activeSub==='all-agents'?'active-sub':''}"><i class="fas fa-user-tie w-4 text-center"></i> All Agents</a>
          <a href="/b2b/agent-bookings" class="submenu-item ${activeSub==='agent-bookings'?'active-sub':''}"><i class="fas fa-book w-4 text-center"></i> Agent Bookings</a>
          <a href="/b2b/commission"     class="submenu-item ${activeSub==='commission'?'active-sub':''}"><i class="fas fa-percentage w-4 text-center"></i> Commission & Payouts</a>
          <a href="/b2b/create-agent"   class="submenu-item ${activeSub==='create-agent'?'active-sub':''}"><i class="fas fa-user-plus w-4 text-center"></i> Create Agent</a>
        </div>
      </div>

      <div class="px-3 py-1 mt-2">
        <p class="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Finance</p>
      </div>

      <!-- Payment -->
      <a href="/payment" class="nav-item ${activeMenu === 'payment' ? 'active' : ''}">
        <i class="fas fa-credit-card w-5 text-center"></i><span>Payment</span>
      </a>

      <!-- Sales Reports -->
      <div class="nav-group">
        <button onclick="toggleSubmenu('sales-sub')" class="nav-item w-full ${activeMenu === 'sales' ? 'active' : ''}">
          <i class="fas fa-chart-bar w-5 text-center"></i>
          <span class="flex-1 text-left">Sales Reports</span>
          <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'sales' ? 'rotate-180' : ''}" id="sales-arrow"></i>
        </button>
        <div id="sales-sub" class="submenu ${activeMenu === 'sales' ? 'open' : ''}">
          <a href="/sales/b2c"         class="submenu-item ${activeSub==='b2c'?'active-sub':''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
          <a href="/sales/b2b"         class="submenu-item ${activeSub==='b2b-sales'?'active-sub':''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
          <a href="/sales/frontdesk"   class="submenu-item ${activeSub==='frontdesk-sales'?'active-sub':''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
          <a href="/sales/all-channel" class="submenu-item ${activeSub==='all-channel'?'active-sub':''}"><i class="fas fa-chart-pie w-4 text-center"></i> All Channel Sales</a>
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
          <a href="/promo/b2c"      class="submenu-item ${activeSub==='promo-b2c'?'active-sub':''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
          <a href="/promo/b2b"      class="submenu-item ${activeSub==='promo-b2b'?'active-sub':''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
          <a href="/promo/ota"      class="submenu-item ${activeSub==='promo-ota'?'active-sub':''}"><i class="fas fa-globe w-4 text-center"></i> OTA</a>
          <a href="/promo/festival" class="submenu-item ${activeSub==='promo-festival'?'active-sub':''}"><i class="fas fa-star w-4 text-center"></i> Festival</a>
          <a href="/promo/others"   class="submenu-item ${activeSub==='promo-others'?'active-sub':''}"><i class="fas fa-ellipsis-h w-4 text-center"></i> Others</a>
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
          <a href="/logs/b2c"       class="submenu-item ${activeSub==='log-b2c'?'active-sub':''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
          <a href="/logs/b2b"       class="submenu-item ${activeSub==='log-b2b'?'active-sub':''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
          <a href="/logs/frontdesk" class="submenu-item ${activeSub==='log-frontdesk'?'active-sub':''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
        </div>
      </div>

      <!-- Trash -->
      <a href="/trash" class="nav-item ${activeMenu === 'trash' ? 'active' : ''}">
        <i class="fas fa-trash w-5 text-center"></i><span>Trash</span>
      </a>

      <!-- Manage Users -->
      <div class="nav-group">
        <button onclick="toggleSubmenu('users-sub')" class="nav-item w-full ${activeMenu === 'users' ? 'active' : ''}">
          <i class="fas fa-users-cog w-5 text-center"></i>
          <span class="flex-1 text-left">Manage Users</span>
          <i class="fas fa-chevron-down text-xs transition-transform ${activeMenu === 'users' ? 'rotate-180' : ''}" id="users-arrow"></i>
        </button>
        <div id="users-sub" class="submenu ${activeMenu === 'users' ? 'open' : ''}">
          <a href="/users/b2c"       class="submenu-item ${activeSub==='users-b2c'?'active-sub':''}"><i class="fas fa-user w-4 text-center"></i> B2C</a>
          <a href="/users/b2b"       class="submenu-item ${activeSub==='users-b2b'?'active-sub':''}"><i class="fas fa-building w-4 text-center"></i> B2B</a>
          <a href="/users/frontdesk" class="submenu-item ${activeSub==='users-frontdesk'?'active-sub':''}"><i class="fas fa-desktop w-4 text-center"></i> Front Desk</a>
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
          <a href="/staff/directory"   class="submenu-item ${activeSub==='directory'?'active-sub':''}"><i class="fas fa-address-book w-4 text-center"></i> Employee Directory</a>
          <a href="/staff/roles"       class="submenu-item ${activeSub==='roles'?'active-sub':''}"><i class="fas fa-shield-alt w-4 text-center"></i> Role & Access</a>
          <a href="/staff/departments" class="submenu-item ${activeSub==='departments'?'active-sub':''}"><i class="fas fa-sitemap w-4 text-center"></i> Departments</a>
          <a href="/staff/shifts"      class="submenu-item ${activeSub==='shifts'?'active-sub':''}"><i class="fas fa-clock w-4 text-center"></i> Shift Scheduling</a>
        </div>
      </div>

      <!-- Portals -->
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
        <i class="fas fa-sign-out-alt w-5 text-center"></i><span>Logout</span>
      </a>
    </div>
  </aside>

  <!-- ═══ MAIN CONTENT ═══ -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top Nav Bar -->
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
        <button onclick="openModal('globalBookingModal')" class="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
          <i class="fas fa-plus"></i><span>New Booking</span>
        </button>
        <div class="hidden lg:flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
          <i class="fas fa-calendar text-gray-400"></i>
          <span id="currentDate"></span>
        </div>
        <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <i class="fas fa-bell"></i>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <i class="fas fa-cog"></i>
        </button>
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

<!-- ═══════════════ GLOBAL BOOKING MODAL (Overhauled) ═══════════════ -->
<div id="globalBookingModal" class="modal-overlay hidden">
  <div class="modal-container" style="max-width:780px; max-height:92vh; overflow-y:auto;">
    <div class="modal-header sticky top-0 bg-white z-10 border-b">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
          <i class="fas fa-plus text-white text-xs"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">New Booking</h3>
        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">Category-Based</span>
      </div>
      <button onclick="closeModal('globalBookingModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>

    <div class="p-5 space-y-5">

      <!-- ── SECTION 1: Guest Info ── -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span class="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>Guest Information
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class="form-label">Full Name *</label>
            <input type="text" id="gb_name" class="form-input" placeholder="Guest full name">
          </div>
          <div>
            <label class="form-label">Phone Number *</label>
            <input type="tel" id="gb_phone" class="form-input" placeholder="+880 1700-000000">
          </div>
          <div>
            <label class="form-label">Email Address</label>
            <input type="email" id="gb_email" class="form-input" placeholder="guest@email.com">
          </div>
          <div>
            <label class="form-label">Address</label>
            <input type="text" id="gb_address" class="form-input" placeholder="Home address">
          </div>
          <div>
            <label class="form-label">Date of Birth</label>
            <input type="date" id="gb_dob" class="form-input">
          </div>
          <div>
            <label class="form-label">Arrival Time</label>
            <input type="time" id="gb_arrival" class="form-input" value="14:00">
          </div>
          <div>
            <label class="form-label">Special Requests</label>
            <input type="text" id="gb_special" class="form-input" placeholder="e.g. Late check-in, extra pillows">
          </div>
        </div>
        <!-- Guest ID / Passport Upload -->
        <div class="mt-3">
          <label class="form-label">Guest ID / Passport Upload</label>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:border-blue-400 transition cursor-pointer flex items-center gap-3 bg-gray-50">
            <i class="fas fa-id-card text-2xl text-gray-300 flex-shrink-0 ml-2"></i>
            <div class="text-left">
              <p class="text-sm text-gray-600 font-medium">Upload NID / Passport / Driving License</p>
              <p class="text-xs text-gray-400">JPG, PNG, PDF — max 5MB</p>
            </div>
            <input type="file" class="hidden" accept=".jpg,.jpeg,.png,.pdf" id="gb_idFile">
            <button type="button" onclick="document.getElementById('gb_idFile').click()" class="ml-auto btn-secondary btn-sm text-xs">Browse</button>
          </div>
        </div>
      </div>

      <hr class="border-gray-100">

      <!-- ── SECTION 2: Stay Info ── -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span class="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>Stay Information
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Location</label>
            <select id="gb_location" class="form-input">
              <option>Cox's Bazar</option><option>Dhaka</option><option>Sylhet</option><option>Chittagong</option>
            </select>
          </div>
          <div>
            <label class="form-label">Property</label>
            <select id="gb_property" class="form-input">
              <option>Grand Palace Hotel</option><option>Ocean View Resort</option>
            </select>
          </div>
          <div>
            <label class="form-label">Check-in Date *</label>
            <input type="date" id="gb_checkin" class="form-input" onchange="gbUpdateSummary()">
          </div>
          <div>
            <label class="form-label">Check-out Date *</label>
            <input type="date" id="gb_checkout" class="form-input" onchange="gbUpdateSummary()">
          </div>
          <div>
            <label class="form-label">Adults *</label>
            <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <input type="number" id="gb_adults" class="flex-1 px-3 py-2 text-sm focus:outline-none" value="2" min="1">
              <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold" onclick="document.getElementById('gb_adults').stepUp()">+</button>
            </div>
          </div>
          <div>
            <label class="form-label">Children</label>
            <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <input type="number" id="gb_children" class="flex-1 px-3 py-2 text-sm focus:outline-none" value="0" min="0">
              <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold" onclick="document.getElementById('gb_children').stepUp()">+</button>
            </div>
          </div>
          <div>
            <label class="form-label">Reference Code</label>
            <input type="text" id="gb_ref" class="form-input bg-gray-50 text-gray-500 font-mono text-xs" value="AG-98922" readonly>
          </div>
          <div>
            <label class="form-label">Booking Source *</label>
            <select id="gb_source" class="form-input" onchange="gbToggleOTA()">
              <option value="walk-in">Walk-in</option>
              <option value="phone">Phone</option>
              <option value="website">B2C Website</option>
              <option value="b2b">B2B Agent</option>
              <option value="ota">OTA</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <!-- OTA Sub-Dropdown (hidden unless OTA selected) -->
          <div id="gb_ota_wrap" class="hidden">
            <label class="form-label">OTA Channel *</label>
            <select id="gb_ota_channel" class="form-input">
              <option>Select OTA</option>
              <option>Booking.com</option>
              <option>Agoda</option>
              <option>Expedia</option>
              <option>Hotels.com</option>
              <option>MakeMyTrip</option>
              <option>Airbnb</option>
              <option>TripAdvisor</option>
              <option>Other OTA</option>
            </select>
          </div>
        </div>

        <!-- Room Categories (multi-category support) -->
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <label class="form-label mb-0">Room Categories *</label>
            <button type="button" onclick="gbAddCategoryRow()" class="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              <i class="fas fa-plus"></i>+ Add Category
            </button>
          </div>
          <div id="gb_catRows" class="space-y-2">
            <!-- Category Row 1 (default) -->
            <div class="gb-cat-row flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200">
              <select class="gb_cat form-input flex-1 text-sm" onchange="gbUpdateSummary()">
                <option value="">Select Category</option>
                <option value="standard"     data-rate="2000">Standard — ৳2,000/night</option>
                <option value="deluxe"       data-rate="3500">Deluxe — ৳3,500/night</option>
                <option value="super_deluxe" data-rate="5000">Super Deluxe — ৳5,000/night</option>
                <option value="deluxe_couple" data-rate="4500">Deluxe Couple — ৳4,500/night</option>
                <option value="suite"        data-rate="8000">Suite — ৳8,000/night</option>
              </select>
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden flex-shrink-0" style="width:120px">
                <span class="px-2 text-xs text-gray-500">Rooms</span>
                <input type="number" class="gb_rooms flex-1 px-2 py-2 text-sm focus:outline-none w-12 text-center" value="1" min="1" onchange="gbUpdateSummary()">
                <button class="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm" onclick="this.previousElementSibling.stepUp(); gbUpdateSummary()">+</button>
              </div>
              <button type="button" onclick="gbRemoveCategoryRow(this)" class="text-red-400 hover:text-red-600 p-1 flex-shrink-0" title="Remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Active Promos -->
        <div class="mt-3">
          <label class="form-label">Active Promotions</label>
          <div class="flex gap-2 flex-wrap">
            <button type="button" onclick="gbTogglePromo(this,'SUMMER26',500)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition">SUMMER26 (৳500 off)</button>
            <button type="button" onclick="gbTogglePromo(this,'EARLYBIRD',300)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition">EARLYBIRD (৳300 off)</button>
            <button type="button" onclick="gbTogglePromo(this,'WEEKEND15',0)" class="promo-tag px-3 py-1.5 rounded text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition">WEEKEND15 (15% off)</button>
          </div>
        </div>
      </div>

      <hr class="border-gray-100">

      <!-- ── SECTION 3: Payment ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Payment Summary -->
        <div>
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>Payment Summary
          </h4>
          <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between text-gray-600"><span>Room fare (base)</span><span id="gb_ps_fare" class="font-semibold">BDT 0</span></div>
            <div class="flex justify-between text-gray-600"><span>Promo discount</span><span id="gb_ps_disc" class="text-red-500 font-semibold">- BDT 0</span></div>
            <div class="flex justify-between text-gray-600"><span>VAT (7.5%)</span><span id="gb_ps_vat" class="font-semibold">BDT 0</span></div>
            <div class="flex justify-between font-bold text-gray-800 border-t pt-2 mt-1 text-base">
              <span>Total Payable</span><span id="gb_ps_total" class="text-blue-700">BDT 0</span>
            </div>
          </div>
          <!-- Paid / Due -->
          <div class="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label class="form-label">Advance Paid</label>
              <input type="number" id="gb_paid" class="form-input" placeholder="0" oninput="gbCalcDue()">
            </div>
            <div>
              <label class="form-label">Balance Due</label>
              <input type="number" id="gb_due" class="form-input bg-red-50 text-red-600 font-semibold" placeholder="0" readonly>
            </div>
          </div>
          <!-- Audit Fields -->
          <div class="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label class="form-label">Advance Received By</label>
              <input type="text" class="form-input bg-gray-50 text-gray-500 text-xs" value="Admin — Front Desk" readonly>
            </div>
            <div>
              <label class="form-label">Payment Received By</label>
              <input type="text" class="form-input bg-gray-50 text-gray-500 text-xs" value="Admin — Front Desk" readonly>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div>
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</h4>
          <!-- Method Tabs -->
          <div class="flex border-b border-gray-200 mb-3">
            <button onclick="gbSwitchPayTab('cash')"   id="gbtab_cash"  class="gbpay-tab flex-1 py-2 text-xs font-semibold rounded-tl-lg bg-green-500 text-white">Cash</button>
            <button onclick="gbSwitchPayTab('bkash')"  id="gbtab_bkash" class="gbpay-tab flex-1 py-2 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">bKash</button>
            <button onclick="gbSwitchPayTab('bank')"   id="gbtab_bank"  class="gbpay-tab flex-1 py-2 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-tr-lg">Bank</button>
          </div>

          <!-- Cash Panel -->
          <div id="gbpanel_cash" class="space-y-2">
            <div class="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
              <i class="fas fa-money-bill-wave mr-1"></i>
              Cash payment — record the amount received at the front desk.
            </div>
            <div><label class="form-label">Cash Received</label>
              <input type="number" class="form-input" placeholder="0.00"></div>
            <div><label class="form-label">Change Given</label>
              <input type="number" class="form-input bg-gray-50" placeholder="0.00" readonly></div>
          </div>

          <!-- bKash Panel -->
          <div id="gbpanel_bkash" class="hidden space-y-2">
            <div class="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs">
              <p class="font-bold text-pink-700 mb-1"><i class="fas fa-mobile-alt mr-1"></i>bKash Payment</p>
              <p class="text-gray-600">Send to: <strong>01XXXXXXXXX</strong></p>
              <div class="w-14 h-14 bg-gray-200 rounded mt-2 flex items-center justify-center text-xs text-gray-400">QR Code</div>
            </div>
            <div><label class="form-label">Sender bKash Number *</label>
              <input type="tel" class="form-input" placeholder="01XXXXXXXXX"></div>
            <div><label class="form-label">bKash Transaction ID *</label>
              <input type="text" class="form-input" placeholder="e.g. 8T6A2LKJX9"></div>
          </div>

          <!-- Bank Panel -->
          <div id="gbpanel_bank" class="hidden space-y-2">
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 space-y-1">
              <p class="font-semibold text-gray-700">Bank Transfer Details</p>
              <p>Bank: BRAC Bank Ltd</p>
              <p>Account: 1234567890</p>
              <p>Routing: 070274782</p>
            </div>
            <div><label class="form-label">Transaction / Ref No. *</label>
              <input type="text" class="form-input" placeholder="Bank reference number"></div>
          </div>

          <!-- Terms -->
          <div class="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-gray-600">
            <p class="font-bold text-yellow-800 mb-1">TERMS & CONDITIONS</p>
            <ol class="space-y-0.5 list-decimal list-inside">
              <li>All bookings must be confirmed with advance payment.</li>
              <li>Cancellations 72+ hours before check-in are fully refundable.</li>
              <li>By completing payment you agree to our booking terms.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="sticky bottom-0 bg-white border-t px-5 py-3 flex items-center justify-between gap-3">
      <p class="text-xs text-gray-500"><i class="fas fa-info-circle text-blue-400 mr-1"></i>Rate calculated automatically. Room assigned on confirmation.</p>
      <div class="flex gap-3">
        <button onclick="closeModal('globalBookingModal')" class="btn-secondary">Cancel</button>
        <button onclick="gbSubmitBooking()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition">
          <i class="fas fa-check mr-1"></i>Create Booking
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Global Assign Rooms Modal (shared) -->
<div id="globalAssignRoomsModal" class="modal-overlay hidden">
  <div class="modal-container max-w-md">
    <div class="modal-header">
      <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-layer-group text-blue-500 mr-2"></i>Assign Rooms</h3>
      <button onclick="closeModal('globalAssignRoomsModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5 space-y-4">
      <div class="bg-gray-50 rounded-xl p-3">
        <p class="text-sm font-semibold text-gray-800">Guest: <span id="gar_guest" class="text-blue-600">—</span></p>
        <p class="text-xs text-gray-500 mt-1">Request: <span id="gar_req" class="font-semibold">—</span></p>
      </div>
      <div id="gar_inputs" class="space-y-3">
        <div><label class="form-label">Room 1</label>
          <input type="text" class="form-input" placeholder="e.g. 101" list="gar_list"></div>
      </div>
      <datalist id="gar_list">
        <option value="101">101 — Standard (Available)</option>
        <option value="102">102 — Standard (Available)</option>
        <option value="202">202 — Deluxe (Available)</option>
        <option value="205">205 — Deluxe (Available)</option>
        <option value="304">304 — Super Deluxe (Available)</option>
        <option value="401">401 — Deluxe Couple (Available)</option>
        <option value="404">404 — Deluxe Couple (Available)</option>
      </datalist>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <i class="fas fa-info-circle mr-1"></i>Confirming assignment will update booking to <strong>Confirmed</strong>.
      </div>
    </div>
    <div class="modal-footer">
      <button onclick="closeModal('globalAssignRoomsModal')" class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      <button onclick="gbConfirmAssignment()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm">Confirm Assignment</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
<div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>

<script src="/static/app.js"></script>
<script>
  document.getElementById('currentDate').textContent = dayjs().format('MMM DD, YYYY');

  // Auto-open active submenu
  ['property-sub','booking-sub','b2b-sub','sales-sub','promo-sub','log-sub','users-sub','staff-sub'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.classList.contains('open')) el.style.maxHeight = el.scrollHeight + 'px';
  });

  // Set default booking dates
  (function(){
    const today = new Date(), tom = new Date(today); tom.setDate(tom.getDate()+1);
    const fmt = d => d.toISOString().split('T')[0];
    const ci = document.getElementById('gb_checkin');
    const co = document.getElementById('gb_checkout');
    if (ci) ci.value = fmt(today);
    if (co) co.value = fmt(tom);
  })();

  // Global booking state
  let _gbTotal = 0;
  let _gbPromoDisc = 0;

  // OTA dropdown toggle
  function gbToggleOTA() {
    const src = document.getElementById('gb_source')?.value;
    const wrap = document.getElementById('gb_ota_wrap');
    if (wrap) wrap.classList.toggle('hidden', src !== 'ota');
  }

  // Add category row
  function gbAddCategoryRow() {
    const container = document.getElementById('gb_catRows');
    const div = document.createElement('div');
    div.className = 'gb-cat-row flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200';
    div.innerHTML = \`
      <select class="gb_cat form-input flex-1 text-sm" onchange="gbUpdateSummary()">
        <option value="">Select Category</option>
        <option value="standard" data-rate="2000">Standard — ৳2,000/night</option>
        <option value="deluxe" data-rate="3500">Deluxe — ৳3,500/night</option>
        <option value="super_deluxe" data-rate="5000">Super Deluxe — ৳5,000/night</option>
        <option value="deluxe_couple" data-rate="4500">Deluxe Couple — ৳4,500/night</option>
        <option value="suite" data-rate="8000">Suite — ৳8,000/night</option>
      </select>
      <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden flex-shrink-0" style="width:120px">
        <span class="px-2 text-xs text-gray-500">Rooms</span>
        <input type="number" class="gb_rooms flex-1 px-2 py-2 text-sm focus:outline-none w-12 text-center" value="1" min="1" onchange="gbUpdateSummary()">
        <button class="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm" onclick="this.previousElementSibling.stepUp(); gbUpdateSummary()">+</button>
      </div>
      <button type="button" onclick="gbRemoveCategoryRow(this)" class="text-red-400 hover:text-red-600 p-1 flex-shrink-0"><i class="fas fa-times"></i></button>
    \`;
    container.appendChild(div);
  }

  function gbRemoveCategoryRow(btn) {
    const rows = document.querySelectorAll('.gb-cat-row');
    if (rows.length <= 1) { showToast('At least one category is required.','error'); return; }
    btn.closest('.gb-cat-row').remove();
    gbUpdateSummary();
  }

  // Promo toggle
  function gbTogglePromo(btn, code, discount) {
    const isActive = btn.classList.contains('bg-green-500');
    document.querySelectorAll('.promo-tag').forEach(b => {
      b.classList.remove('bg-green-500','text-white');
      b.classList.add('bg-gray-200','text-gray-600');
    });
    if (!isActive) {
      btn.classList.remove('bg-gray-200','text-gray-600');
      btn.classList.add('bg-green-500','text-white');
      _gbPromoDisc = discount;
    } else {
      _gbPromoDisc = 0;
    }
    gbUpdateSummary();
  }

  // Summary calculator
  function gbUpdateSummary() {
    const cin  = document.getElementById('gb_checkin')?.value;
    const cout = document.getElementById('gb_checkout')?.value;
    let nights = 0;
    if (cin && cout) {
      const d1 = new Date(cin), d2 = new Date(cout);
      nights = Math.max(0, Math.round((d2-d1)/86400000));
    }
    let totalFare = 0;
    document.querySelectorAll('.gb-cat-row').forEach(row => {
      const catSel = row.querySelector('.gb_cat');
      const roomsIn = row.querySelector('.gb_rooms');
      const rate = catSel?.selectedOptions[0]?.dataset?.rate ? parseInt(catSel.selectedOptions[0].dataset.rate) : 0;
      const rooms = parseInt(roomsIn?.value) || 1;
      totalFare += rate * nights * rooms;
    });
    const disc  = Math.min(_gbPromoDisc, totalFare);
    const vat   = Math.round((totalFare - disc) * 0.075);
    const total = totalFare - disc + vat;
    _gbTotal = total;
    document.getElementById('gb_ps_fare').textContent  = 'BDT ' + totalFare.toLocaleString();
    document.getElementById('gb_ps_disc').textContent  = '- BDT ' + disc.toLocaleString();
    document.getElementById('gb_ps_vat').textContent   = 'BDT ' + vat.toLocaleString();
    document.getElementById('gb_ps_total').textContent = 'BDT ' + total.toLocaleString();
    gbCalcDue();
  }

  function gbCalcDue() {
    const paid = parseFloat(document.getElementById('gb_paid')?.value) || 0;
    const due  = Math.max(0, _gbTotal - paid);
    const el   = document.getElementById('gb_due');
    if (el) el.value = due || '';
  }

  // Payment tab switcher
  function gbSwitchPayTab(tab) {
    ['cash','bkash','bank'].forEach(t => {
      const btn   = document.getElementById('gbtab_'+t);
      const panel = document.getElementById('gbpanel_'+t);
      if (t === tab) {
        btn.classList.add('text-white');
        btn.classList.remove('text-gray-600','bg-gray-100');
        if (t==='cash')  btn.classList.add('bg-green-500');
        if (t==='bkash') btn.classList.add('bg-pink-500');
        if (t==='bank')  btn.classList.add('bg-blue-600');
        panel.classList.remove('hidden');
      } else {
        btn.classList.remove('bg-green-500','bg-pink-500','bg-blue-600','text-white');
        btn.classList.add('bg-gray-100','text-gray-600');
        panel.classList.add('hidden');
      }
    });
  }

  // Submit booking
  function gbSubmitBooking() {
    const name  = document.getElementById('gb_name')?.value?.trim();
    const phone = document.getElementById('gb_phone')?.value?.trim();
    const cin   = document.getElementById('gb_checkin')?.value;
    const cout  = document.getElementById('gb_checkout')?.value;
    // Validate at least one category selected
    const cats  = document.querySelectorAll('.gb_cat');
    let catSelected = false;
    cats.forEach(c => { if (c.value) catSelected = true; });
    if (!name || !phone || !cin || !cout || !catSelected) {
      showToast('Please fill all required fields and select a room category.','error'); return;
    }
    const paid  = parseFloat(document.getElementById('gb_paid')?.value) || 0;
    closeModal('globalBookingModal');
    if (paid >= _gbTotal && _gbTotal > 0) {
      showToast('Booking confirmed! Rooms auto-assigned (fully paid).','success');
    } else {
      showToast('Booking created. Pending room assignment.','success');
      setTimeout(() => {
        const guestName = name;
        const req = Array.from(cats).filter(c=>c.value).map(c => c.selectedOptions[0]?.text?.split('—')[0]?.trim()).join(', ');
        document.getElementById('gar_guest').textContent = guestName;
        document.getElementById('gar_req').textContent   = req;
        openModal('globalAssignRoomsModal');
      }, 700);
    }
  }

  function gbConfirmAssignment() {
    const inputs = document.querySelectorAll('#gar_inputs input');
    let ok = true;
    inputs.forEach(i => { if (!i.value.trim()) ok = false; });
    if (!ok) { showToast('Please fill all room assignments.','error'); return; }
    closeModal('globalAssignRoomsModal');
    showToast('Rooms assigned! Booking → Confirmed.','success');
  }
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
  const trendIcon  = trendDir === 'up' ? 'fa-arrow-up' : 'fa-arrow-down'
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
        <thead><tr>${headerCells}</tr></thead>
        <tbody class="divide-y divide-gray-50">${rows.join('')}</tbody>
      </table>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 1-10 of 247 results</span>
      <div class="flex gap-1">
        <button class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"><i class="fas fa-chevron-left text-xs"></i></button>
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
    'connected': 'bg-green-100 text-green-700',
    'disconnected': 'bg-red-100 text-red-700',
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
