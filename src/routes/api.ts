import { Hono } from 'hono'

export const apiRoute = new Hono()

// API: Get booking stats
apiRoute.get('/stats', (c) => {
  return c.json({
    dashboard: {
      newRequests: 12,
      pendingApproval: 8,
      assignedToday: 24,
      cancelled: 3,
      availableRooms: 18,
      checkInCount: 11,
      checkOutCount: 9,
      inHouseGuests: 63,
    },
    revenue: {
      today: 48234,
      monthly: 312500,
      outstanding: 12890,
    }
  })
})

// API: Get bookings
apiRoute.get('/bookings', (c) => {
  const bookings = [
    {id:'BK-2024-001', guest:'James Wilson', room:'204', category:'Deluxe Room', checkin:'2024-03-11', checkout:'2024-03-14', amount:435, status:'confirmed', source:'website'},
    {id:'BK-2024-002', guest:'Maria Santos', room:'301', category:'Suite', checkin:'2024-03-12', checkout:'2024-03-16', amount:1036, status:'confirmed', source:'b2b'},
    {id:'BK-2024-003', guest:'Ahmed Al-Rashid', room:'105', category:'Standard Room', checkin:'2024-03-11', checkout:'2024-03-13', amount:178, status:'pending', source:'ota'},
  ]
  return c.json({ bookings, total: 247 })
})

// API: Create booking
apiRoute.post('/bookings', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const bookingId = 'BK-' + Date.now()
  return c.json({ 
    success: true, 
    bookingId, 
    message: 'Booking created successfully',
    data: { ...body, id: bookingId, status: 'confirmed', createdAt: new Date().toISOString() }
  }, 201)
})

// API: Get agents
apiRoute.get('/agents', (c) => {
  const agents = [
    {id:'AGT-001', agency:'Horizon Travel Agency', commission:10, status:'active', bookings:45, totalSales:28500},
    {id:'AGT-002', agency:'Dubai Star Tours', commission:12, status:'active', bookings:32, totalSales:19200},
  ]
  return c.json({ agents, total: 24 })
})

// API: Get rooms
apiRoute.get('/rooms', (c) => {
  const rooms = [
    {id:'R101', number:'101', category:'Standard', floor:1, status:'available', rate:89},
    {id:'R201', number:'201', category:'Deluxe', floor:2, status:'occupied', rate:129},
    {id:'R301', number:'301', category:'Suite', floor:3, status:'available', rate:259},
  ]
  return c.json({ rooms, total: 45, available: 18 })
})

// API: Health check
apiRoute.get('/health', (c) => {
  return c.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() })
})
