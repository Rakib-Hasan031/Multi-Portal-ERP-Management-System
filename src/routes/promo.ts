import { Hono } from 'hono'
import { adminLayout, pageHeader, statusBadge } from '../components/layout'

export const promoRoute = new Hono()

function promoTable(title: string, type: string, promos: any[]): string {
  return `
  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">${title}</h3>
      <button onclick="openModal('createPromoModal')" class="btn-primary btn-sm">
        <i class="fas fa-plus mr-1"></i>Create Promo
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header">Promo ID</th>
            <th class="table-header">Promo Name</th>
            <th class="table-header">Discount</th>
            <th class="table-header">Valid Period</th>
            <th class="table-header">Room Types</th>
            <th class="table-header">Min Stay</th>
            <th class="table-header">Promo Code</th>
            <th class="table-header">Redemptions</th>
            <th class="table-header">Status</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${promos.map(p => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell font-mono text-xs text-blue-600">${p.id}</td>
              <td class="table-cell font-medium text-gray-800">${p.name}</td>
              <td class="table-cell">
                <span class="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-semibold">${p.discount}</span>
              </td>
              <td class="table-cell text-xs">
                <div>${p.start} — ${p.end}</div>
              </td>
              <td class="table-cell text-xs text-gray-500">${p.rooms}</td>
              <td class="table-cell text-center text-xs">${p.minStay}</td>
              <td class="table-cell">
                ${p.code ? `<span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">${p.code}</span>` : '<span class="text-gray-400 text-xs">No code</span>'}
              </td>
              <td class="table-cell text-center font-medium">${p.uses}</td>
              <td class="table-cell">${statusBadge(p.status)}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button onclick="openModal('editPromoModal')" class="text-blue-600 hover:text-blue-700 p-1 text-xs"><i class="fas fa-edit"></i></button>
                  <button class="text-red-400 hover:text-red-500 p-1 text-xs"><i class="fas fa-trash"></i></button>
                  <button class="text-gray-400 hover:text-gray-600 p-1 text-xs" title="${p.status === 'active' ? 'Deactivate' : 'Activate'}">
                    <i class="fas ${p.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

const createPromoModal = `
  <div id="createPromoModal" class="modal-overlay hidden">
    <div class="modal-container max-w-xl">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-tag text-orange-500 mr-2"></i>Create Promotion</h3>
        <button onclick="closeModal('createPromoModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div>
          <label class="form-label">Promotion Name *</label>
          <input type="text" class="form-input" placeholder="e.g., Summer Special 2024">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Discount Type *</label>
            <select class="form-input">
              <option>Percentage Off</option><option>Fixed Amount Off</option>
              <option>Free Night</option><option>Complimentary Service</option>
            </select>
          </div>
          <div>
            <label class="form-label">Discount Value *</label>
            <input type="number" class="form-input" placeholder="e.g., 20">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Valid From *</label>
            <input type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">Valid To *</label>
            <input type="date" class="form-input">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Apply to Room Types</label>
            <select class="form-input" multiple style="height:80px">
              <option>All Rooms</option>
              <option>Standard Room</option><option>Deluxe Room</option>
              <option>Suite</option><option>Executive Suite</option>
            </select>
          </div>
          <div>
            <label class="form-label">Minimum Stay (nights)</label>
            <input type="number" class="form-input" value="1" min="1">
          </div>
        </div>
        <div>
          <label class="form-label">Promo Code (optional)</label>
          <div class="flex gap-2">
            <input type="text" class="form-input" placeholder="e.g., SUMMER20" id="promoCodeInput">
            <button type="button" onclick="document.getElementById('promoCodeInput').value = 'PROMO' + Math.random().toString(36).substr(2,6).toUpperCase()" class="btn-secondary btn-sm">Generate</button>
          </div>
        </div>
        <div>
          <label class="form-label">Max Redemptions (leave blank for unlimited)</label>
          <input type="number" class="form-input" placeholder="Unlimited">
        </div>
        <div>
          <label class="form-label">Applicable Channels</label>
          <div class="flex gap-4 flex-wrap mt-1">
            ${['B2C Website','B2B Agents','Walk-in','OTA'].map(c =>
              `<label class="flex items-center gap-1.5 text-sm"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600"> ${c}</label>`
            ).join('')}
          </div>
        </div>
        <div>
          <label class="form-label">Terms & Conditions</label>
          <textarea class="form-input" rows="2" placeholder="e.g., Booking must be made 7 days in advance. Not combinable with other offers."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('createPromoModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Promotion created successfully!','success'); closeModal('createPromoModal')">
          <i class="fas fa-check mr-1"></i>Create Promotion
        </button>
      </div>
    </div>
  </div>

  <div id="editPromoModal" class="modal-overlay hidden">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-edit text-blue-500 mr-2"></i>Edit Promotion</h3>
        <button onclick="closeModal('editPromoModal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
      </div>
      <div class="p-4 space-y-3">
        <div><label class="form-label">Promotion Name</label><input type="text" class="form-input" value="Summer Special Offer"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="form-label">Valid From</label><input type="date" class="form-input" value="2024-06-01"></div>
          <div><label class="form-label">Valid To</label><input type="date" class="form-input" value="2024-08-31"></div>
        </div>
        <div><label class="form-label">Discount</label><input type="number" class="form-input" value="20"></div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal('editPromoModal')" class="btn-secondary">Cancel</button>
        <button class="btn-primary" onclick="showToast('Promotion updated!','success');closeModal('editPromoModal')">Save Changes</button>
      </div>
    </div>
  </div>
`

const samplePromos = [
  {id:'PRO-001', name:'Summer Special Offer', discount:'20% OFF', start:'Jun 1', end:'Aug 31', rooms:'All Rooms', minStay:'2 nights', code:'SUMMER20', uses:45, status:'active'},
  {id:'PRO-002', name:'Early Bird Discount', discount:'15% OFF', start:'Jan 1', end:'Dec 31', rooms:'Deluxe+', minStay:'3 nights', code:'EARLY15', uses:28, status:'active'},
  {id:'PRO-003', name:'Last Minute Deal', discount:'$50 OFF', start:'Mar 1', end:'Mar 31', rooms:'Standard', minStay:'1 night', code:'', uses:12, status:'active'},
  {id:'PRO-004', name:'Long Stay Special', discount:'25% OFF', start:'Apr 1', end:'Jun 30', rooms:'All Rooms', minStay:'7 nights', code:'LONGSTAY', uses:8, status:'inactive'},
]

promoRoute.get('/b2c', (c) => {
  const content = `
  ${pageHeader('B2C Promotions', 'Manage promotional offers for website/direct bookings', `
    <button onclick="openModal('createPromoModal')" class="btn-primary"><i class="fas fa-plus"></i>Create Promotion</button>
  `)}
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">8</div><div class="text-xs text-gray-500 mt-1">Active Promos</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">93</div><div class="text-xs text-gray-500 mt-1">Total Redemptions</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-orange-600">$4,280</div><div class="text-xs text-gray-500 mt-1">Discount Given</div></div>
  </div>
  ${promoTable('B2C Promotions', 'b2c', samplePromos)}
  ${createPromoModal}
  `
  return c.html(adminLayout('B2C Promotions', content, 'promo', 'promo-b2c'))
})

promoRoute.get('/b2b', (c) => {
  const b2bPromos = [
    {id:'B2B-001', name:'Agent Volume Bonus', discount:'Extra 3%', start:'Jan 1', end:'Dec 31', rooms:'All Rooms', minStay:'2 nights', code:'', uses:34, status:'active'},
    {id:'B2B-002', name:'Peak Season Rate', discount:'10% OFF', start:'Dec 15', end:'Jan 15', rooms:'Suites', minStay:'3 nights', code:'PEAKB2B', uses:15, status:'active'},
    {id:'B2B-003', name:'New Agent Welcome', discount:'15% OFF', start:'Mar 1', end:'Apr 30', rooms:'All Rooms', minStay:'1 night', code:'NEWAGENT', uses:6, status:'active'},
  ]
  const content = `
  ${pageHeader('B2B Promotions', 'Special rates and offers for travel agents and partners', `
    <button onclick="openModal('createPromoModal')" class="btn-primary"><i class="fas fa-plus"></i>Create B2B Promo</button>
  `)}
  ${promoTable('B2B Agent Promotions', 'b2b', b2bPromos)}
  ${createPromoModal}
  `
  return c.html(adminLayout('B2B Promotions', content, 'promo', 'promo-b2b'))
})

promoRoute.get('/ota', (c) => {
  const otaPromos = [
    {id:'OTA-001', name:'Expedia Weekend Deal', discount:'18% OFF', start:'Mar 1', end:'Mar 31', rooms:'Standard+', minStay:'2 nights', code:'EXPWEEK', uses:22, status:'active'},
    {id:'OTA-002', name:'Booking.com Flash Sale', discount:'25% OFF', start:'Mar 15', end:'Mar 17', rooms:'All Rooms', minStay:'1 night', code:'', uses:18, status:'active'},
  ]
  const content = `
  ${pageHeader('OTA Promotions', 'Manage deals and promotions for OTA channels', `
    <button onclick="openModal('createPromoModal')" class="btn-primary"><i class="fas fa-plus"></i>Create OTA Promo</button>
  `)}
  <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex items-start gap-2">
    <i class="fas fa-info-circle text-yellow-500 mt-0.5 flex-shrink-0"></i>
    <p class="text-sm text-yellow-700">OTA promotions are synced with connected channels. Changes may take up to 2 hours to reflect on OTA platforms.</p>
  </div>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-gray-800">2</div><div class="text-xs text-gray-500 mt-1">Active OTA Promos</div></div>
    <div class="card p-4 text-center"><div class="text-2xl font-bold text-green-600">40</div><div class="text-xs text-gray-500 mt-1">OTA Bookings This Month</div></div>
    <div class="card p-4 text-center"><div class="text-sm font-medium text-gray-600 mt-1"><i class="fas fa-circle text-green-500 mr-1"></i>Expedia · <i class="fas fa-circle text-blue-500 mr-1"></i>Booking.com</div></div>
  </div>
  ${promoTable('OTA Promotions', 'ota', otaPromos)}
  ${createPromoModal}
  `
  return c.html(adminLayout('OTA Promotions', content, 'promo', 'promo-ota'))
})

promoRoute.get('/festival', (c) => {
  const festPromos = [
    {id:'FEST-001', name:'New Year Eve Package', discount:'Free Dinner', start:'Dec 30', end:'Jan 2', rooms:'Suite+', minStay:'2 nights', code:'NYE2024', uses:18, status:'inactive'},
    {id:'FEST-002', name:'Valentine\'s Romance Package', discount:'15% OFF', start:'Feb 12', end:'Feb 16', rooms:'All Rooms', minStay:'2 nights', code:'VALENTINES', uses:25, status:'inactive'},
    {id:'FEST-003', name:'Eid Mubarak Special', discount:'20% OFF', start:'Mar 30', end:'Apr 5', rooms:'All Rooms', minStay:'1 night', code:'EID2024', uses:0, status:'active'},
    {id:'FEST-004', name:'Christmas Celebration', discount:'25% OFF', start:'Dec 22', end:'Dec 26', rooms:'Suites', minStay:'3 nights', code:'XMAS2024', uses:0, status:'inactive'},
  ]
  const content = `
  ${pageHeader('Festival Promotions', 'Seasonal and holiday special offers', `
    <button onclick="openModal('createPromoModal')" class="btn-primary"><i class="fas fa-plus"></i>Create Festival Promo</button>
  `)}
  ${promoTable('Festival & Holiday Promotions', 'festival', festPromos)}
  ${createPromoModal}
  `
  return c.html(adminLayout('Festival Promotions', content, 'promo', 'promo-festival'))
})

promoRoute.get('/others', (c) => {
  const otherPromos = [
    {id:'OTH-001', name:'Corporate Rate', discount:'12% OFF', start:'Jan 1', end:'Dec 31', rooms:'All Rooms', minStay:'1 night', code:'CORP2024', uses:67, status:'active'},
    {id:'OTH-002', name:'Government Employee Rate', discount:'10% OFF', start:'Jan 1', end:'Dec 31', rooms:'Standard+', minStay:'1 night', code:'GOV10', uses:12, status:'active'},
    {id:'OTH-003', name:'Senior Citizens Discount', discount:'20% OFF', start:'Jan 1', end:'Dec 31', rooms:'All Rooms', minStay:'2 nights', code:'SENIOR20', uses:8, status:'active'},
    {id:'OTH-004', name:'Loyalty Returning Guest', discount:'$30 OFF', start:'Jan 1', end:'Dec 31', rooms:'All Rooms', minStay:'2 nights', code:'LOYAL30', uses:34, status:'active'},
  ]
  const content = `
  ${pageHeader('Other Promotions', 'Special rates for specific guest segments', `
    <button onclick="openModal('createPromoModal')" class="btn-primary"><i class="fas fa-plus"></i>Create Promotion</button>
  `)}
  ${promoTable('Other Special Promotions', 'others', otherPromos)}
  ${createPromoModal}
  `
  return c.html(adminLayout('Other Promotions', content, 'promo', 'promo-others'))
})
