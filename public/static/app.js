// HotelERP Pro - Frontend JavaScript

// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// Submenu toggle
function toggleSubmenu(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  // Close all submenus
  document.querySelectorAll('.submenu').forEach(s => {
    s.classList.remove('open');
    s.style.maxHeight = null;
  });
  // Toggle arrows
  document.querySelectorAll('[id$="-arrow"]').forEach(a => a.classList.remove('rotate-180'));
  // Open selected
  if (!isOpen) {
    el.classList.add('open');
    el.style.maxHeight = el.scrollHeight + 'px';
    const arrow = document.querySelector(`[onclick*="${id}"] [id$="-arrow"]`);
    if (arrow) arrow.classList.add('rotate-180');
  }
}

// Modal functions
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
    document.body.style.overflow = '';
  }
});

// Tab system
function switchTab(tabGroup, tabId) {
  document.querySelectorAll(`[data-tab-group="${tabGroup}"]`).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tabId === tabId);
  });
  document.querySelectorAll(`[data-tab-content="${tabGroup}"]`).forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// Toast notifications
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = { success: 'fa-check-circle text-green-500', error: 'fa-times-circle text-red-500', info: 'fa-info-circle text-blue-500', warning: 'fa-exclamation-triangle text-yellow-500' };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span class="flex-1">${message}</span><button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 ml-2"><i class="fas fa-times text-xs"></i></button>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Confirm dialog
function confirmAction(message, callback) {
  if (confirm(message)) callback();
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// Format date
function formatDate(date) {
  return dayjs(date).format('MMM DD, YYYY');
}

// Data Table Search
function initTableSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// Auto-calculate nights
function calculateNights() {
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  const nights = document.getElementById('nights');
  if (!checkIn || !checkOut || !nights) return;
  if (checkIn.value && checkOut.value) {
    const diff = dayjs(checkOut.value).diff(dayjs(checkIn.value), 'day');
    nights.textContent = diff > 0 ? `${diff} night${diff > 1 ? 's' : ''}` : '';
  }
}

// Print page
function printPage() {
  window.print();
}

// Export table to CSV
function exportTableCSV(tableId, filename = 'export.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;
  let csv = [];
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cols = row.querySelectorAll('th, td');
    const rowData = Array.from(cols).map(col => `"${col.textContent.trim().replace(/"/g, '""')}"`);
    csv.push(rowData.join(','));
  });
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Chart colors
const CHART_COLORS = {
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
  purple: '#a855f7',
  yellow: '#eab308',
  teal: '#14b8a6',
  pink: '#ec4899',
};

// Initialize booking trend chart
function initBookingTrendChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'B2C Bookings', data: [120,145,132,168,189,210,245,230,198,175,162,188], borderColor: CHART_COLORS.blue, backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
        { label: 'B2B Bookings', data: [45,52,48,60,71,85,92,88,75,65,58,70], borderColor: CHART_COLORS.green, backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
        { label: 'Walk-in', data: [30,28,35,40,38,45,55,50,42,35,30,38], borderColor: CHART_COLORS.orange, backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4 },
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
  });
}

// Initialize channel distribution chart
function initChannelChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Website (B2C)', 'B2B Agents', 'Walk-in', 'OTA', 'Phone'],
      datasets: [{ data: [42, 28, 15, 10, 5], backgroundColor: Object.values(CHART_COLORS) }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

// Initialize revenue chart
function initRevenueChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        { label: 'Room Revenue', data: [45200, 52100, 48900, 61300], backgroundColor: CHART_COLORS.blue },
        { label: 'Service Revenue', data: [8400, 9200, 7800, 10500], backgroundColor: CHART_COLORS.green },
        { label: 'F&B Revenue', data: [5600, 6100, 5400, 7200], backgroundColor: CHART_COLORS.orange },
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
  });
}

// Initialize occupancy chart
function initOccupancyChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Occupancy %',
        data: [65, 72, 68, 80, 92, 95, 88],
        backgroundColor: (ctx) => ctx.raw > 80 ? CHART_COLORS.green : ctx.raw > 60 ? CHART_COLORS.blue : CHART_COLORS.orange,
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
  });
}

// Room availability mini calendar
function initAvailabilityCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayjs();
  let html = '<div class="grid grid-cols-7 gap-1 text-center">';
  days.forEach(d => html += `<div class="text-xs text-gray-500 font-medium py-1">${d}</div>`);
  const startDay = today.startOf('month').day();
  for (let i = 0; i < startDay; i++) html += '<div></div>';
  for (let d = 1; d <= today.daysInMonth(); d++) {
    const status = Math.random() > 0.4 ? (Math.random() > 0.5 ? 'occupied' : 'available') : 'reserved';
    const colors = { occupied: 'bg-red-100 text-red-700', available: 'bg-green-100 text-green-700', reserved: 'bg-yellow-100 text-yellow-700' };
    const isToday = d === today.date();
    html += `<div class="text-xs py-1 rounded cursor-pointer ${isToday ? 'ring-2 ring-blue-500 ' : ''}${colors[status]}">${d}</div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

// Initialize all charts on page
document.addEventListener('DOMContentLoaded', () => {
  // Dashboard charts
  initBookingTrendChart('bookingTrendChart');
  initChannelChart('channelChart');
  initRevenueChart('revenueChart');
  initOccupancyChart('occupancyChart');

  // Table search
  const searchInputs = document.querySelectorAll('[data-search-table]');
  searchInputs.forEach(input => {
    initTableSearch(input.id, input.dataset.searchTable);
  });

  // Date calculations
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  if (checkIn) checkIn.addEventListener('change', calculateNights);
  if (checkOut) checkOut.addEventListener('change', calculateNights);

  // Availability calendar
  initAvailabilityCalendar('availabilityCalendar');

  // Show sidebar active submenu
  document.querySelectorAll('.submenu.open').forEach(sub => {
    sub.style.maxHeight = sub.scrollHeight + 'px';
  });
});
