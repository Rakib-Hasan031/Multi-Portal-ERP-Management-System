import { Hono } from 'hono'
import { adminLayout, pageHeader } from '../components/layout'

// Simple trash route
const trashHono = new Hono()

trashHono.get('/', (c) => {
  const content = `
  ${pageHeader('Trash', 'Recover or permanently delete items', `
    <button onclick="confirmAction('Permanently delete all items?', ()=>showToast('All items deleted','success'))" class="btn-danger"><i class="fas fa-trash mr-1"></i>Empty Trash</button>
  `)}

  <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex items-start gap-2">
    <i class="fas fa-exclamation-triangle text-yellow-500 mt-0.5 flex-shrink-0"></i>
    <p class="text-sm text-yellow-700">Items in trash will be permanently deleted after 30 days. Restore them before they are removed.</p>
  </div>

  <div class="card overflow-hidden">
    <div class="card-header flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Deleted Items</h3>
      <select class="text-xs border border-gray-200 rounded px-2 py-1"><option>All Types</option><option>Bookings</option><option>Guests</option><option>Agents</option><option>Promotions</option></select>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header"><input type="checkbox" class="rounded border-gray-300"></th>
            <th class="table-header">Item ID</th>
            <th class="table-header">Type</th>
            <th class="table-header">Description</th>
            <th class="table-header">Deleted By</th>
            <th class="table-header">Deleted On</th>
            <th class="table-header">Expires In</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${[
            {id:'BK-2024-008', type:'Booking', desc:'Cancelled booking — Anna Schmidt, Deluxe Room', by:'Admin', date:'Mar 5, 2024', expires:'Apr 4'},
            {id:'PRO-005', type:'Promotion', desc:'Winter Special — Expired Dec 2023', by:'Sarah M.', date:'Jan 5, 2024', expires:'Feb 4'},
            {id:'USR-099', type:'User Account', desc:'Guest: Tom Parker — Account deleted on request', by:'Admin', date:'Feb 20, 2024', expires:'Mar 21'},
          ].map(item => `
            <tr class="table-row hover:bg-gray-50">
              <td class="table-cell"><input type="checkbox" class="rounded border-gray-300"></td>
              <td class="table-cell font-mono text-xs text-gray-500">${item.id}</td>
              <td class="table-cell"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${item.type}</span></td>
              <td class="table-cell text-sm text-gray-600">${item.desc}</td>
              <td class="table-cell text-xs text-gray-500">${item.by}</td>
              <td class="table-cell text-xs text-gray-500">${item.date}</td>
              <td class="table-cell text-xs text-red-500 font-medium">${item.expires}</td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button class="btn-secondary btn-sm text-xs" onclick="showToast('Item restored successfully!','success')"><i class="fas fa-undo mr-1"></i>Restore</button>
                  <button class="btn-danger btn-sm text-xs" onclick="confirmAction('Permanently delete this item?', ()=>showToast('Item deleted permanently','error'))"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `
  return c.html(adminLayout('Trash', content, 'trash'))
})

export { trashHono as trashRoute }
