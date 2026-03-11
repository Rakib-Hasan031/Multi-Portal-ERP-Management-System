import { Hono } from 'hono'

export const authRoute = new Hono()

authRoute.get('/login', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - HotelERP Pro</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
  <div class="w-full max-w-4xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-2xl">
    <!-- Left Panel -->
    <div class="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 flex flex-col justify-between text-white hidden md:flex">
      <div>
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-hotel text-white text-lg"></i>
          </div>
          <div>
            <div class="font-bold text-lg">HotelERP Pro</div>
            <div class="text-blue-200 text-sm">Property Management System</div>
          </div>
        </div>
        <h2 class="text-3xl font-bold mb-4">Complete Hotel & Resort Management</h2>
        <p class="text-blue-200 text-sm leading-relaxed">Manage your entire property operations from one powerful dashboard. Bookings, staff, payments, and more.</p>
      </div>
      <div class="space-y-3">
        <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <i class="fas fa-calendar-check text-blue-200 w-5 text-center"></i>
          <div>
            <div class="font-medium text-sm">Booking Management</div>
            <div class="text-blue-200 text-xs">B2C, B2B, Walk-in & Group</div>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <i class="fas fa-handshake text-blue-200 w-5 text-center"></i>
          <div>
            <div class="font-medium text-sm">B2B Partner Network</div>
            <div class="text-blue-200 text-xs">Commission & Payout Automation</div>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <i class="fas fa-chart-line text-blue-200 w-5 text-center"></i>
          <div>
            <div class="font-medium text-sm">Multi-Channel Analytics</div>
            <div class="text-blue-200 text-xs">Real-time Revenue Reporting</div>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <i class="fas fa-users text-blue-200 w-5 text-center"></i>
          <div>
            <div class="font-medium text-sm">Multi-Portal Architecture</div>
            <div class="text-blue-200 text-xs">Admin, Front Desk & B2B Portals</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="p-8 md:p-12 flex flex-col justify-center">
      <div class="mb-8">
        <div class="flex items-center gap-2 md:hidden mb-6">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-hotel text-white text-sm"></i>
          </div>
          <span class="font-bold text-gray-800">HotelERP Pro</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
        <p class="text-gray-500 text-sm">Sign in to your portal to continue</p>
      </div>

      <!-- Portal Selector -->
      <div class="mb-6">
        <p class="text-xs text-gray-500 font-medium mb-2">Select Portal</p>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="selectPortal('admin')" id="portal-admin" class="portal-btn active-portal p-2 rounded-lg border-2 text-center cursor-pointer transition">
            <i class="fas fa-building text-sm block mb-1"></i>
            <span class="text-xs font-medium">Admin / HQ</span>
          </button>
          <button onclick="selectPortal('frontdesk')" id="portal-frontdesk" class="portal-btn p-2 rounded-lg border-2 text-center cursor-pointer transition border-gray-200 text-gray-500">
            <i class="fas fa-desktop text-sm block mb-1"></i>
            <span class="text-xs font-medium">Front Desk</span>
          </button>
          <button onclick="selectPortal('b2b')" id="portal-b2b" class="portal-btn p-2 rounded-lg border-2 text-center cursor-pointer transition border-gray-200 text-gray-500">
            <i class="fas fa-briefcase text-sm block mb-1"></i>
            <span class="text-xs font-medium">B2B Agent</span>
          </button>
        </div>
      </div>

      <form action="" onsubmit="handleLogin(event)" class="space-y-4">
        <div>
          <label class="form-label">Email Address</label>
          <div class="relative">
            <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="email" class="form-input pl-9" placeholder="your@email.com" value="admin@hotelerpro.com">
          </div>
        </div>
        <div>
          <label class="form-label">Password</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="password" id="passwordInput" class="form-input pl-9 pr-9" placeholder="••••••••" value="password">
            <button type="button" onclick="togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <i class="fas fa-eye text-sm" id="eyeIcon"></i>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded border-gray-300 text-blue-600">
            <span class="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
        </div>
        <button type="submit" class="w-full btn-primary justify-center py-2.5 text-sm">
          <i class="fas fa-sign-in-alt"></i>
          Sign In to Dashboard
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-gray-100 text-center">
        <p class="text-xs text-gray-500">Demo Credentials: admin@hotelerpro.com / password</p>
      </div>
    </div>
  </div>

  <style>
    .active-portal { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
    .portal-btn { background: white; }
    .portal-btn:not(.active-portal):hover { border-color: #93c5fd; color: #2563eb; }
  </style>
  <script>
    let selectedPortal = 'admin';
    const portalRedirects = { admin: '/dashboard', frontdesk: '/frontdesk', b2b: '/b2b-portal' };

    function selectPortal(p) {
      selectedPortal = p;
      document.querySelectorAll('.portal-btn').forEach(btn => {
        btn.classList.remove('active-portal');
        btn.classList.add('border-gray-200', 'text-gray-500');
        btn.style.background = 'white';
      });
      const btn = document.getElementById('portal-' + p);
      btn.classList.add('active-portal');
      btn.classList.remove('border-gray-200', 'text-gray-500');
    }

    function togglePassword() {
      const input = document.getElementById('passwordInput');
      const icon = document.getElementById('eyeIcon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash text-sm';
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye text-sm';
      }
    }

    function handleLogin(e) {
      e.preventDefault();
      window.location.href = portalRedirects[selectedPortal];
    }
  </script>
</body>
</html>`)
})

authRoute.get('/logout', (c) => c.redirect('/auth/login'))
