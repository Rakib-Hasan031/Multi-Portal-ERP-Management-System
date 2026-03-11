import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const propertyRoute = new Hono()

// Property Overview
propertyRoute.get('/overview', (c) => {
  const content = `
  ${pageHeader('Property Overview', 'Manage your property details and room inventory', `
    <a href="/property/create-room" class="btn-primary"><i class="fas fa-plus"></i>Add Room</a>
    <button class="btn-secondary"><i class="fas fa-edit"></i>Edit Property</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <!-- Property Details Card -->
    <div class="lg:col-span-1 card p-5">
      <div class="text-center mb-4">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <i class="fas fa-hotel text-white text-3xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-800">Grand Palace Hotel</h2>
        <p class="text-gray-500 text-sm">Luxury Resort & Spa</p>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">Active</span>
      </div>
      <div class="space-y-3 text-sm">
        <div class="flex gap-2"><i class="fas fa-map-marker-alt text-gray-400 w-4 mt-0.5 flex-shrink-0"></i><span class="text-gray-600">123 Beach Road, Miami, FL 33139, United States</span></div>
        <div class="flex gap-2"><i class="fas fa-phone text-gray-400 w-4 flex-shrink-0"></i><span class="text-gray-600">+1 (305) 555-0100</span></div>
        <div class="flex gap-2"><i class="fas fa-envelope text-gray-400 w-4 flex-shrink-0"></i><span class="text-gray-600">info@grandpalacehotel.com</span></div>
        <div class="flex gap-2"><i class="fas fa-globe text-gray-400 w-4 flex-shrink-0"></i><a href="/website" class="text-blue-600 hover:underline">www.grandpalacehotel.com</a></div>
        <div class="flex gap-2"><i class="fas fa-star text-yellow-400 w-4 flex-shrink-0"></i><span class="text-gray-600">5-Star Hotel · Est. 2005</span></div>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center">
        <div class="bg-gray-50 rounded-lg p-2"><div class="font-bold text-gray-800">45</div><div class="text-xs text-gray-500">Rooms</div></div>
        <div class="bg-gray-50 rounded-lg p-2"><div class="font-bold text-gray-800">6</div><div class="text-xs text-gray-500">Categories</div></div>
        <div class="bg-gray-50 rounded-lg p-2"><div class="font-bold text-gray-800">4.8</div><div class="text-xs text-gray-500">Rating</div></div>
      </div>
    </div>

    <!-- Room Inventory Summary -->
    <div class="lg:col-span-2 card">
      <div class="card-header flex justify-between items-center">
        <h3 class="font-semibold text-gray-800">Room Inventory by Category</h3>
        <button class="btn-secondary btn-sm"><i class="fas fa-filter mr-1"></i>Filter</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="table-header">Category</th>
              <th class="table-header">Total Rooms</th>
              <th class="table-header">Available</th>
              <th class="table-header">Occupied</th>
              <th class="table-header">Maintenance</th>
              <th class="table-header">Base Rate</th>
              <th class="table-header">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${[
              {cat:'Standard Room', total:10, avail:3, occ:7, maint:0, rate:'$89/night', status:'active'},
              {cat:'Deluxe Room', total:12, avail:4, occ:8, maint:0, rate:'$129/night', status:'active'},
              {cat:'Junior Suite', total:8, avail:2, occ:5, maint:1, rate:'$189/night', status:'active'},
              {cat:'Suite', total:10, avail:6, occ:4, maint:0, rate:'$259/night', status:'active'},
              {cat:'Executive Suite', total:3, avail:2, occ:1, maint:0, rate:'$389/night', status:'active'},
              {cat:'Presidential Suite', total:2, avail:1, occ:1, maint:0, rate:'$599/night', status:'active'},
            ].map(r => `
              <tr class="table-row hover:bg-gray-50">
                <td class="table-cell font-medium text-gray-800">${r.cat}</td>
                <td class="table-cell text-center">${r.total}</td>
                <td class="table-cell text-center"><span class="text-green-600 font-medium">${r.avail}</span></td>
                <td class="table-cell text-center"><span class="text-red-600 font-medium">${r.occ}</span></td>
                <td class="table-cell text-center"><span class="text-yellow-600 font-medium">${r.maint}</span></td>
                <td class="table-cell font-medium">${r.rate}</td>
                <td class="table-cell">${statusBadge(r.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- All Rooms Grid -->
  <div class="card">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Room Status Board</h3>
      <div class="flex gap-2">
        <span class="flex items-center gap-1 text-xs text-gray-500"><span class="w-3 h-3 rounded bg-green-400 inline-block"></span>Available</span>
        <span class="flex items-center gap-1 text-xs text-gray-500"><span class="w-3 h-3 rounded bg-red-400 inline-block"></span>Occupied</span>
        <span class="flex items-center gap-1 text-xs text-gray-500"><span class="w-3 h-3 rounded bg-yellow-400 inline-block"></span>Reserved</span>
        <span class="flex items-center gap-1 text-xs text-gray-500"><span class="w-3 h-3 rounded bg-gray-400 inline-block"></span>Maintenance</span>
      </div>
    </div>
    <div class="p-4">
      <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
        ${Array.from({length: 45}, (_, i) => {
          const roomNum = 100 + i + 1;
          const statuses = ['available', 'occupied', 'occupied', 'occupied', 'reserved'];
          const status = i === 5 || i === 12 || i === 28 ? 'maintenance' : statuses[Math.floor(Math.random()*4)];
          const colors = { available: 'bg-green-100 text-green-700 border-green-200', occupied: 'bg-red-100 text-red-700 border-red-200', reserved: 'bg-yellow-100 text-yellow-700 border-yellow-200', maintenance: 'bg-gray-100 text-gray-500 border-gray-200' };
          const icons = { available: 'fa-bed', occupied: 'fa-user', reserved: 'fa-calendar', maintenance: 'fa-wrench' };
          return `<div class="aspect-square border rounded-lg ${colors[status]} flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition" onclick="showRoomDetail('${roomNum}')">
            <i class="fas ${icons[status]} text-xs mb-0.5"></i>
            <span class="text-xs font-bold">${roomNum}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>
  `

  return c.html(adminLayout('Property Overview', content, 'property', 'overview'))
})

// Create Room
propertyRoute.get('/create-room', (c) => {
  const content = `
  ${pageHeader('Create Room', 'Add a new room to your property inventory', `
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Room Information</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Room Number *</label>
            <input type="text" class="form-input" placeholder="e.g., 101">
          </div>
          <div>
            <label class="form-label">Room Category *</label>
            <select class="form-input">
              <option>Select category</option>
              <option>Standard Room</option><option>Deluxe Room</option><option>Junior Suite</option>
              <option>Suite</option><option>Executive Suite</option><option>Presidential Suite</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Floor Number</label>
            <input type="number" class="form-input" placeholder="1">
          </div>
          <div>
            <label class="form-label">Room Size (sq ft)</label>
            <input type="number" class="form-input" placeholder="350">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">Max Adults *</label>
            <input type="number" class="form-input" value="2" min="1">
          </div>
          <div>
            <label class="form-label">Max Children</label>
            <input type="number" class="form-input" value="1" min="0">
          </div>
          <div>
            <label class="form-label">Bed Type *</label>
            <select class="form-input">
              <option>King Bed</option><option>Queen Bed</option><option>Twin Beds</option>
              <option>Single Bed</option><option>Bunk Beds</option>
            </select>
          </div>
        </div>

        <!-- Pricing -->
        <h4 class="font-medium text-gray-700 mt-4 border-t pt-4">Pricing</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Base Rate / Night *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" class="form-input pl-6" placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="form-label">Weekend Rate / Night</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" class="form-input pl-6" placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="form-label">B2B Rate / Night</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" class="form-input pl-6" placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="form-label">OTA Rate / Night</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input type="number" class="form-input pl-6" placeholder="0.00">
            </div>
          </div>
        </div>

        <!-- Amenities -->
        <h4 class="font-medium text-gray-700 mt-2 border-t pt-4">Amenities</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${['Air Conditioning','WiFi','Flat Screen TV','Mini Bar','Safe','Bathtub','Balcony','Ocean View','Garden View','City View','Coffee Maker','Hair Dryer','Iron & Board','Room Service','Kitchenette'].map(a => 
            `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" class="rounded border-gray-300 text-blue-600"> ${a}</label>`
          ).join('')}
        </div>

        <!-- Room Description -->
        <div>
          <label class="form-label">Room Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe the room..."></textarea>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Room Status</label>
            <select class="form-input">
              <option>Available</option><option>Under Maintenance</option><option>Inactive</option>
            </select>
          </div>
          <div>
            <label class="form-label">Smoking Policy</label>
            <select class="form-input">
              <option>Non-Smoking</option><option>Smoking Allowed</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button type="submit" class="btn-primary" onclick="showToast('Room created successfully!', 'success'); return false;">
            <i class="fas fa-save"></i>Save Room
          </button>
          <button type="button" class="btn-secondary">Save & Add Another</button>
          <button type="reset" class="btn-secondary text-red-500">Reset</button>
        </div>
      </form>
    </div>

    <!-- Right Panel: Images & Preview -->
    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Room Images</h3>
        <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
          <p class="text-sm text-gray-500">Drop images here or click to upload</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
          <input type="file" multiple accept="image/*" class="hidden">
          <button type="button" class="btn-secondary btn-sm mt-3">Browse Files</button>
        </div>
        <p class="text-xs text-gray-400 mt-2">Recommended: 1200×800px minimum</p>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Room Preview</h3>
        <div class="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
          <i class="fas fa-bed text-3xl mb-2 block"></i>
          Fill in room details to see preview
        </div>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Quick Guidelines</h3>
        <ul class="text-xs text-gray-500 space-y-1.5">
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Room number must be unique</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Set competitive base rates</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Add clear room description</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>Upload high-quality images</li>
          <li class="flex gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i>B2B rate usually lower than base</li>
        </ul>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create Room', content, 'property', 'create-room'))
})

// Create Category
propertyRoute.get('/create-category', (c) => {
  const content = `
  ${pageHeader('Create Category', 'Manage room types and categories', `
    <button onclick="openModal('createCategoryModal')" class="btn-primary"><i class="fas fa-plus"></i>Add Category</button>
  `)}

  <div class="card mb-4">
    <div class="card-header">
      <h3 class="font-semibold text-gray-800">Room Categories</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Category Name</th>
            <th class="table-header">Rooms</th>
            <th class="table-header">Base Rate</th>
            <th class="table-header">Min Stay</th>
            <th class="table-header">Max Guests</th>
            <th class="table-header">Breakfast</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {name:'Standard Room', rooms:10, rate:'$89', minStay:1, guests:2, breakfast:'Optional', status:'active'},
            {name:'Deluxe Room', rooms:12, rate:'$129', minStay:1, guests:2, breakfast:'Included', status:'active'},
            {name:'Junior Suite', rooms:8, rate:'$189', minStay:2, guests:3, breakfast:'Included', status:'active'},
            {name:'Suite', rooms:10, rate:'$259', minStay:2, guests:4, breakfast:'Included', status:'active'},
            {name:'Executive Suite', rooms:3, rate:'$389', minStay:2, guests:4, breakfast:'Included', status:'active'},
            {name:'Presidential Suite', rooms:2, rate:'$599', minStay:3, guests:6, breakfast:'Included', status:'active'},
          ].map(c => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-medium text-gray-800">${c.name}</td>
              <td class="table-cell">${c.rooms}</td>
              <td class="table-cell font-semibold">${c.rate}/night</td>
              <td class="table-cell">${c.minStay} night${c.minStay > 1 ? 's' : ''}</td>
              <td class="table-cell">${c.guests} guests</td>
              <td class="table-cell"><span class="text-xs px-2 py-0.5 rounded ${c.breakfast === 'Included' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${c.breakfast}</span></td>
              <td class="table-cell">${statusBadge(c.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="text-blue-600 hover:text-blue-700 p-1" title="Edit"><i class="fas fa-edit text-xs"></i></button>
                  <button class="text-red-500 hover:text-red-600 p-1" title="Delete"><i class="fas fa-trash text-xs"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Create Category Modal -->
  <div id="createCategoryModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Create Room Category</h3>
        <button onclick="closeModal('createCategoryModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Category Name *</label>
          <input type="text" class="form-input" placeholder="e.g., Deluxe Ocean View">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Base Rate / Night *</label>
            <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input type="number" class="form-input pl-6" placeholder="0.00"></div>
          </div>
          <div>
            <label class="form-label">Minimum Stay (nights)</label>
            <input type="number" class="form-input" value="1" min="1">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Max Adults</label>
            <input type="number" class="form-input" value="2" min="1">
          </div>
          <div>
            <label class="form-label">Max Children</label>
            <input type="number" class="form-input" value="1" min="0">
          </div>
        </div>
        <div>
          <label class="form-label">Breakfast Policy</label>
          <select class="form-input">
            <option>Not Included</option><option>Included in Rate</option><option>Optional Add-on</option>
          </select>
        </div>
        <div>
          <label class="form-label">Category Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe this room category..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createCategoryModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Category created!', 'success'); closeModal('createCategoryModal')">Create Category</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create Category', content, 'property', 'create-category'))
})

// Manage Website
propertyRoute.get('/manage-website', (c) => {
  const content = `
  ${pageHeader('Manage Website', 'Configure your public-facing hotel website', `
    <a href="/website" target="_blank" class="btn-secondary"><i class="fas fa-external-link-alt"></i>Preview Website</a>
    <button class="btn-primary" onclick="showToast('Changes saved!', 'success')"><i class="fas fa-save"></i>Save Changes</button>
  `)}

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
    <!-- Website Config Tabs -->
    <div class="lg:col-span-3 card p-5">
      <div class="tab-nav mb-5 overflow-x-auto">
        ${['General Info', 'Homepage', 'Rooms Page', 'Gallery', 'About Us', 'Contact & Map', 'SEO Settings', 'Booking Widget'].map((t, i) =>
          `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab-group="website" data-tab-id="website-tab-${i}" onclick="switchTab('website', 'website-tab-${i}')">${t}</button>`
        ).join('')}
      </div>

      <!-- General Info Tab -->
      <div id="website-tab-0" data-tab-content="website" class="tab-content active space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="form-label">Hotel/Property Name *</label>
            <input type="text" class="form-input" value="Grand Palace Hotel">
          </div>
          <div>
            <label class="form-label">Tagline</label>
            <input type="text" class="form-input" value="Your Luxury Escape Awaits">
          </div>
          <div>
            <label class="form-label">Primary Language</label>
            <select class="form-input"><option>English</option><option>Spanish</option><option>French</option></select>
          </div>
          <div>
            <label class="form-label">Currency Display</label>
            <select class="form-input"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
          </div>
          <div>
            <label class="form-label">Timezone</label>
            <select class="form-input"><option>America/New_York</option><option>America/Chicago</option><option>America/Los_Angeles</option></select>
          </div>
        </div>
        <div>
          <label class="form-label">Short Description (shown on homepage)</label>
          <textarea class="form-input" rows="3">Experience unparalleled luxury at Grand Palace Hotel, where world-class amenities meet exceptional service in the heart of Miami Beach.</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Logo</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400">
              <i class="fas fa-image text-2xl text-gray-300 mb-1"></i>
              <p class="text-xs text-gray-500">Upload Logo</p>
            </div>
          </div>
          <div>
            <label class="form-label">Favicon</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400">
              <i class="fas fa-image text-2xl text-gray-300 mb-1"></i>
              <p class="text-xs text-gray-500">Upload Favicon (32x32)</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Other tabs are hidden by default -->
      ${[1,2,3,4,5,6,7].map(i => `<div id="website-tab-${i}" data-tab-content="website" class="tab-content"><p class="text-gray-500 text-sm p-4 text-center">Select this tab to configure settings</p></div>`).join('')}
    </div>

    <!-- Right: Publish & Settings -->
    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3">Website Status</h3>
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">Online Status</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">Booking Enabled</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked class="sr-only peer">
            <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
        <div class="text-xs text-gray-400 mt-2">Last published: Today at 10:30 AM</div>
        <a href="/website" target="_blank" class="btn-primary w-full justify-center mt-3 text-sm">
          <i class="fas fa-globe"></i>Visit Website
        </a>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">Website URL</h3>
        <div class="bg-gray-50 rounded p-2 text-xs text-blue-600 break-all">https://grandpalace.hotelerpro.com</div>
        <button class="btn-secondary btn-sm w-full mt-2"><i class="fas fa-copy mr-1"></i>Copy URL</button>
      </div>

      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">Pages</h3>
        <div class="space-y-2">
          ${['Home','Rooms','Gallery','Amenities','About Us','Contact','Blog'].map(p =>
            `<div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">${p}</span>
              <span class="text-green-500 text-xs"><i class="fas fa-check-circle"></i> Active</span>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Manage Website', content, 'property', 'manage-website'))
})

// Reviews
propertyRoute.get('/reviews', (c) => {
  const reviews = [
    {guest:'Sarah Johnson', room:'Deluxe Room', rating:5, date:'Mar 10, 2024', comment:'Absolutely amazing stay! The staff was incredibly welcoming and the room was spotless.', source:'TripAdvisor', replied:true},
    {guest:'Michael Brown', room:'Suite', rating:4, date:'Mar 8, 2024', comment:'Great location and lovely amenities. The breakfast was excellent. Room was a bit small.', source:'Booking.com', replied:true},
    {guest:'Emma Wilson', room:'Standard Room', rating:3, date:'Mar 5, 2024', comment:'Good value for money. AC was a bit noisy at night but overall acceptable.', source:'Website', replied:false},
    {guest:'James Lee', room:'Presidential Suite', rating:5, date:'Mar 3, 2024', comment:'Exceptional experience! The butler service was outstanding. Will definitely return.', source:'Expedia', replied:true},
    {guest:'Fatima Al-Sayed', room:'Junior Suite', rating:4, date:'Feb 28, 2024', comment:'Beautiful property. The pool area was stunning. Would recommend for family trips.', source:'Google', replied:false},
  ]

  const content = `
  ${pageHeader('Guest Reviews', 'Monitor and respond to guest reviews across all channels', `
    <button class="btn-secondary"><i class="fas fa-download mr-1"></i>Export Reviews</button>
    <button class="btn-secondary"><i class="fas fa-filter mr-1"></i>Filter</button>
  `)}

  <!-- Review Stats -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="card p-4 text-center">
      <div class="text-3xl font-bold text-gray-800">4.7</div>
      <div class="flex justify-center my-1">${'★'.repeat(5)}</div>
      <div class="text-xs text-gray-500">Overall Rating</div>
    </div>
    <div class="card p-4">
      <div class="text-2xl font-bold text-gray-800 mb-1">1,248</div>
      <div class="text-xs text-gray-500 mb-2">Total Reviews</div>
      <div class="space-y-1">
        ${[5,4,3,2,1].map((star, i) => {
          const pcts = [62,24,9,3,2];
          return `<div class="flex items-center gap-1 text-xs">
            <span class="w-3 text-gray-600">${star}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-1.5"><div class="bg-yellow-400 h-1.5 rounded-full" style="width:${pcts[i]}%"></div></div>
            <span class="w-6 text-gray-400">${pcts[i]}%</span>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-green-600">87%</div>
      <div class="text-xs text-gray-500 mt-1">Positive Reviews</div>
      <div class="mt-2 text-xs text-gray-400">+5% from last month</div>
    </div>
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">76%</div>
      <div class="text-xs text-gray-500 mt-1">Response Rate</div>
      <div class="mt-2 text-xs text-gray-400">Within 24 hours</div>
    </div>
  </div>

  <!-- Reviews List -->
  <div class="card">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">All Reviews</h3>
      <div class="flex gap-2">
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Sources</option><option>TripAdvisor</option><option>Booking.com</option><option>Google</option><option>Website</option></select>
        <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Ratings</option><option>5 Stars</option><option>4 Stars</option><option>3 Stars</option></select>
      </div>
    </div>
    <div class="divide-y divide-gray-50">
      ${reviews.map(r => `
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex gap-3 flex-1">
              <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">${r.guest.charAt(0)}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-medium text-gray-800 text-sm">${r.guest}</span>
                  <span class="text-gray-400 text-xs">·</span>
                  <span class="text-gray-500 text-xs">${r.room}</span>
                  <span class="text-gray-400 text-xs">·</span>
                  <span class="text-gray-400 text-xs">${r.date}</span>
                  <span class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">${r.source}</span>
                </div>
                <div class="text-yellow-400 text-xs my-1">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <p class="text-sm text-gray-600 mt-1">${r.comment}</p>
                ${r.replied ? `<div class="mt-2 text-xs text-green-600 flex items-center gap-1"><i class="fas fa-reply"></i> Replied by management</div>` : ''}
              </div>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              ${!r.replied ? `<button onclick="openModal('replyReviewModal')" class="btn-primary btn-sm text-xs"><i class="fas fa-reply mr-1"></i>Reply</button>` : ''}
              <button class="btn-secondary btn-sm text-xs"><i class="fas fa-flag"></i></button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Reply Modal -->
  <div id="replyReviewModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800">Reply to Review</h3>
        <button onclick="closeModal('replyReviewModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm text-gray-600 italic">"Good value for money. AC was a bit noisy at night but overall acceptable."</p>
          <div class="text-xs text-gray-400 mt-1">— Emma Wilson, Mar 5, 2024</div>
        </div>
        <div>
          <label class="form-label">Your Response *</label>
          <textarea class="form-input" rows="4" placeholder="Write a professional and courteous response...">Dear Emma, thank you for your feedback! We're glad you enjoyed your stay. We apologize for the noise from the AC unit and have reported this to our maintenance team for immediate attention. We hope to welcome you back soon!</textarea>
        </div>
        <div>
          <label class="form-label">Reply As</label>
          <select class="form-input"><option>Management Team</option><option>Customer Service</option><option>Hotel Director</option></select>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('replyReviewModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Reply posted successfully!', 'success'); closeModal('replyReviewModal')">Post Reply</button>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Reviews', content, 'property', 'reviews'))
})

// Create My Property
propertyRoute.get('/create-property', (c) => {
  const content = `
  ${pageHeader('Create My Property', 'Set up a new property in the system', `
    <a href="/property/overview" class="btn-secondary"><i class="fas fa-arrow-left"></i>Back</a>
  `)}

  <!-- Step Progress -->
  <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
    <div class="flex items-center justify-between">
      ${[
        {num:1, label:'Basic Info', icon:'fa-building'},
        {num:2, label:'Location', icon:'fa-map-marker-alt'},
        {num:3, label:'Amenities', icon:'fa-concierge-bell'},
        {num:4, label:'Policies', icon:'fa-file-alt'},
        {num:5, label:'Media', icon:'fa-images'},
        {num:6, label:'Billing', icon:'fa-credit-card'},
      ].map((step, i) => `
        <div class="flex items-center ${i < 5 ? 'flex-1' : ''}">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}">
              <i class="fas ${step.icon} text-xs"></i>
            </div>
            <span class="text-xs mt-1 ${i === 0 ? 'text-blue-600 font-medium' : 'text-gray-400'} hidden sm:block">${step.label}</span>
          </div>
          ${i < 5 ? '<div class="flex-1 h-0.5 bg-gray-200 mx-2 mb-4"></div>' : ''}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 card p-5">
      <h3 class="font-semibold text-gray-800 mb-4">Step 1: Basic Property Information</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="form-label">Property Name *</label>
            <input type="text" class="form-input" placeholder="e.g., Grand Palace Hotel & Resort">
          </div>
          <div>
            <label class="form-label">Property Type *</label>
            <select class="form-input">
              <option>Select type</option>
              <option>Hotel</option><option>Resort</option><option>Boutique Hotel</option>
              <option>Guest House</option><option>Villa</option><option>Hostel</option>
            </select>
          </div>
          <div>
            <label class="form-label">Star Rating</label>
            <select class="form-input">
              <option>Unrated</option>
              ${[1,2,3,4,5].map(s => `<option>${s} Star</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" placeholder="+1 (000) 000-0000">
          </div>
          <div>
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-input" placeholder="hotel@example.com">
          </div>
          <div>
            <label class="form-label">Website URL</label>
            <input type="url" class="form-input" placeholder="https://...">
          </div>
          <div>
            <label class="form-label">Year Established</label>
            <input type="number" class="form-input" placeholder="e.g., 2005">
          </div>
          <div class="col-span-2">
            <label class="form-label">Property Description *</label>
            <textarea class="form-input" rows="4" placeholder="Describe your property, its unique features, and what makes it special..."></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" class="btn-primary" onclick="showToast('Basic info saved! Proceed to Location.', 'success')">Save & Next <i class="fas fa-arrow-right ml-1"></i></button>
          <button type="button" class="btn-secondary">Save Draft</button>
        </div>
      </form>
    </div>

    <div class="space-y-4">
      <div class="card p-4">
        <h3 class="font-semibold text-gray-800 mb-2 text-sm">Setup Checklist</h3>
        <ul class="space-y-2 text-xs">
          ${[
            {label:'Basic Info', done:false}, {label:'Location & Address', done:false},
            {label:'Amenities', done:false}, {label:'Policies', done:false},
            {label:'Photos & Media', done:false}, {label:'Billing Setup', done:false},
          ].map(item => `
            <li class="flex items-center gap-2 ${item.done ? 'text-green-600' : 'text-gray-400'}">
              <i class="fas ${item.done ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-200'}"></i>
              ${item.label}
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="card p-4 bg-blue-50 border-blue-100">
        <div class="flex gap-2">
          <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <p class="text-xs text-blue-700">Complete all steps to activate your property on the system. You can save as draft and complete later.</p>
        </div>
      </div>
    </div>
  </div>
  `
  return c.html(adminLayout('Create My Property', content, 'property', 'create-property'))
})
