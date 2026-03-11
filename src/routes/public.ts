import { Hono } from 'hono'

export const publicRoute = new Hono()

// Public Hotel Website
publicRoute.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grand Palace Hotel — Luxury Resort & Spa</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <link rel="stylesheet" href="/static/styles.css">
  <style>
    .hero-bg { background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); }
    .nav-link { @apply text-white/80 hover:text-white text-sm font-medium transition; }
    .room-card { transition: transform 0.2s, box-shadow 0.2s; }
    .room-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
  </style>
</head>
<body class="bg-white font-sans">
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <i class="fas fa-hotel text-white text-sm"></i>
        </div>
        <div>
          <div class="font-bold text-gray-800">Grand Palace Hotel</div>
          <div class="text-xs text-gray-400">Luxury Resort & Spa ⭐⭐⭐⭐⭐</div>
        </div>
      </div>
      <div class="hidden md:flex items-center gap-6">
        ${['Rooms', 'Amenities', 'Gallery', 'About', 'Contact'].map(l => `<a href="#" class="text-gray-600 hover:text-blue-600 text-sm font-medium transition">${l}</a>`).join('')}
      </div>
      <div class="flex items-center gap-2">
        <a href="/auth/login" class="text-sm text-gray-600 hover:text-blue-600 font-medium">My Bookings</a>
        <a href="#booking" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition">Book Now</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-bg min-h-screen flex items-center relative overflow-hidden pt-16">
    <div class="absolute inset-0 opacity-20" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400'); background-size: cover; background-position: center;"></div>
    <div class="max-w-6xl mx-auto px-4 py-20 text-center text-white relative z-10">
      <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm mb-6">
        <i class="fas fa-star text-yellow-400"></i>
        <span>5-Star Luxury Hotel — TripAdvisor Certificate of Excellence 2024</span>
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
        Your Luxury Escape<br><span class="text-blue-300">Awaits You</span>
      </h1>
      <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Experience unparalleled luxury at Grand Palace Hotel, where world-class amenities meet exceptional service in the heart of Miami Beach.
      </p>
      <div class="flex gap-4 justify-center flex-wrap">
        <a href="#booking" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition">
          <i class="fas fa-calendar-check mr-2"></i>Check Availability
        </a>
        <a href="#rooms" class="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold text-sm transition backdrop-blur-sm border border-white/20">
          <i class="fas fa-bed mr-2"></i>Explore Rooms
        </a>
      </div>
    </div>
  </section>

  <!-- Booking Widget -->
  <section id="booking" class="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
    <div class="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-search text-blue-500"></i>Check Availability & Book
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label class="text-xs text-gray-500 font-medium mb-1 block">Check-in Date</label>
          <input type="date" class="form-input text-sm">
        </div>
        <div>
          <label class="text-xs text-gray-500 font-medium mb-1 block">Check-out Date</label>
          <input type="date" class="form-input text-sm">
        </div>
        <div>
          <label class="text-xs text-gray-500 font-medium mb-1 block">Adults</label>
          <select class="form-input text-sm"><option>1 Adult</option><option>2 Adults</option><option>3 Adults</option><option>4 Adults</option></select>
        </div>
        <div>
          <label class="text-xs text-gray-500 font-medium mb-1 block">Room Type</label>
          <select class="form-input text-sm"><option>Any Room</option><option>Standard Room</option><option>Deluxe Room</option><option>Suite</option></select>
        </div>
        <div class="flex items-end">
          <button onclick="showToast('Showing available rooms for your dates!','info')" class="btn-primary w-full justify-center">
            <i class="fas fa-search mr-1"></i>Search Rooms
          </button>
        </div>
      </div>
      <div class="flex gap-4 mt-3 text-xs text-gray-400">
        <span><i class="fas fa-shield-alt text-green-400 mr-1"></i>Best Rate Guarantee</span>
        <span><i class="fas fa-times-circle text-green-400 mr-1"></i>Free Cancellation</span>
        <span><i class="fas fa-lock text-green-400 mr-1"></i>Secure Booking</span>
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <section class="max-w-6xl mx-auto px-4 py-10">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[
        {icon:'fa-bed', num:'45', label:'Luxury Rooms'},
        {icon:'fa-star', num:'4.8', label:'Average Rating'},
        {icon:'fa-users', num:'15k+', label:'Happy Guests'},
        {icon:'fa-concierge-bell', num:'24/7', label:'Concierge Service'},
      ].map(s => `
        <div class="text-center p-4">
          <i class="fas ${s.icon} text-2xl text-blue-500 mb-2"></i>
          <div class="text-2xl font-bold text-gray-800">${s.num}</div>
          <div class="text-sm text-gray-500">${s.label}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Rooms Section -->
  <section id="rooms" class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">Our Rooms & Suites</h2>
        <p class="text-gray-500 max-w-xl mx-auto">From our comfortable standard rooms to our lavish presidential suites, every space is designed with your comfort in mind.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${[
          {cat:'Standard Room', price:89, img:'bg-gradient-to-br from-blue-400 to-blue-600', amenities:['WiFi','AC','TV'], guests:2},
          {cat:'Deluxe Room', price:129, img:'bg-gradient-to-br from-purple-400 to-purple-600', amenities:['WiFi','AC','Mini Bar','Ocean View'], guests:2},
          {cat:'Junior Suite', price:189, img:'bg-gradient-to-br from-teal-400 to-teal-600', amenities:['WiFi','AC','Mini Bar','Balcony'], guests:3},
          {cat:'Suite', price:259, img:'bg-gradient-to-br from-orange-400 to-orange-600', amenities:['WiFi','AC','Jacuzzi','Living Room'], guests:4},
          {cat:'Executive Suite', price:389, img:'bg-gradient-to-br from-red-400 to-red-600', amenities:['Butler Service','Jacuzzi','Kitchen','Panoramic View'], guests:4},
          {cat:'Presidential Suite', price:599, img:'bg-gradient-to-br from-indigo-500 to-indigo-700', amenities:['Private Pool','Butler','Chef','Private Entrance'], guests:6},
        ].map(r => `
          <div class="room-card bg-white rounded-2xl overflow-hidden shadow-md">
            <div class="${r.img} h-48 flex items-end p-4">
              <div class="text-white">
                <div class="text-lg font-bold">${r.cat}</div>
                <div class="text-white/80 text-sm">Up to ${r.guests} guests</div>
              </div>
            </div>
            <div class="p-4">
              <div class="flex gap-1 flex-wrap mb-3">
                ${r.amenities.map(a => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${a}</span>`).join('')}
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-gray-400 text-xs">From</div>
                  <div class="text-2xl font-bold text-gray-800">$${r.price}<span class="text-sm text-gray-400 font-normal">/night</span></div>
                </div>
                <button onclick="document.querySelector('#booking').scrollIntoView({behavior:'smooth'})" class="btn-primary btn-sm">Book Now</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Amenities -->
  <section class="py-16 max-w-6xl mx-auto px-4">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-800 mb-3">Hotel Amenities</h2>
      <p class="text-gray-500">Everything you need for a perfect stay</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[
        {icon:'fa-swimming-pool', label:'Infinity Pool', desc:'Rooftop pool with panoramic views'},
        {icon:'fa-spa', label:'Luxury Spa', desc:'Full-service spa & wellness center'},
        {icon:'fa-utensils', label:'Fine Dining', desc:'3 award-winning restaurants'},
        {icon:'fa-dumbbell', label:'Fitness Center', desc:'State-of-the-art gym equipment'},
        {icon:'fa-wifi', label:'Free WiFi', desc:'High-speed internet throughout'},
        {icon:'fa-car', label:'Valet Parking', desc:'24/7 secure valet service'},
        {icon:'fa-concierge-bell', label:'Butler Service', desc:'Personal butler for suites'},
        {icon:'fa-plane', label:'Airport Transfer', desc:'Complimentary airport pickup'},
      ].map(a => `
        <div class="bg-gray-50 rounded-xl p-4 text-center hover:bg-blue-50 transition cursor-default">
          <i class="fas ${a.icon} text-2xl text-blue-500 mb-2"></i>
          <div class="font-semibold text-gray-800 text-sm">${a.label}</div>
          <div class="text-xs text-gray-500 mt-1">${a.desc}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Testimonials -->
  <section class="py-16 bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-3">What Our Guests Say</h2>
        <div class="text-yellow-400 text-2xl">★★★★★</div>
        <div class="text-gray-400 text-sm">4.8/5 from 1,248 reviews</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[
          {name:'Sarah J.', rating:5, comment:'Absolutely amazing stay! The staff was incredibly welcoming and the room was spotless. The infinity pool view is breathtaking!', source:'TripAdvisor'},
          {name:'Michael B.', rating:5, comment:'Best hotel experience ever. The food was exceptional, and the spa treatments were world-class. Will definitely return!', source:'Booking.com'},
          {name:'James L.', rating:5, comment:'The Presidential Suite was beyond expectations. Personal butler, private pool, and incredible service. Worth every penny.', source:'Expedia'},
        ].map(t => `
          <div class="bg-white/10 rounded-2xl p-5">
            <div class="text-yellow-400 text-sm mb-2">${'★'.repeat(t.rating)}</div>
            <p class="text-gray-300 text-sm leading-relaxed italic mb-4">"${t.comment}"</p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">${t.name.charAt(0)}</div>
              <div>
                <div class="font-medium text-sm">${t.name}</div>
                <div class="text-xs text-gray-400">${t.source}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact & Footer -->
  <footer class="bg-gray-800 text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="col-span-2">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><i class="fas fa-hotel text-white text-sm"></i></div>
            <div class="font-bold">Grand Palace Hotel</div>
          </div>
          <p class="text-gray-400 text-sm">123 Beach Road, Miami, FL 33139</p>
          <p class="text-gray-400 text-sm mt-1">+1 (305) 555-0100</p>
          <p class="text-gray-400 text-sm">info@grandpalacehotel.com</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Quick Links</h4>
          <div class="space-y-2 text-sm text-gray-400">
            ${['About Us', 'Rooms', 'Gallery', 'Amenities', 'Contact', 'Privacy Policy'].map(l => `<div><a href="#" class="hover:text-white transition">${l}</a></div>`).join('')}
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Guest Services</h4>
          <div class="space-y-2 text-sm text-gray-400">
            ${['Online Check-in', 'My Bookings', 'Room Service', 'Concierge', 'Spa Booking', 'Dining Reservations'].map(l => `<div><a href="#" class="hover:text-white transition">${l}</a></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 pt-6 flex flex-wrap justify-between items-center gap-2">
        <div class="text-gray-400 text-sm">© 2024 Grand Palace Hotel. All rights reserved. Powered by HotelERP Pro.</div>
        <div class="flex gap-3">
          ${['fa-facebook', 'fa-instagram', 'fa-twitter', 'fa-tripadvisor'].map(i => `<a href="#" class="text-gray-400 hover:text-white transition"><i class="fab ${i}"></i></a>`).join('')}
        </div>
      </div>
    </div>
  </footer>

  <!-- Toast Container -->
  <div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
  <script src="/static/app.js"></script>
</body>
</html>`)
})
