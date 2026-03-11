import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { dashboardRoute } from './routes/dashboard'
import { propertyRoute } from './routes/property'
import { bookingRoute } from './routes/booking'
import { b2bRoute } from './routes/b2b'
import { paymentRoute } from './routes/payment'
import { salesRoute } from './routes/sales'
import { promoRoute } from './routes/promo'
import { logRoute } from './routes/logs'
import { usersRoute } from './routes/users'
import { staffRoute } from './routes/staff'
import { calendarRoute } from './routes/calendar'
import { publicRoute } from './routes/public'
import { b2bPortalRoute } from './routes/b2bportal'
import { frontdeskRoute } from './routes/frontdesk'
import { authRoute } from './routes/auth'
import { apiRoute } from './routes/api'
import { trashRoute } from './routes/trash'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/api/*', cors())

// Auth routes
app.route('/auth', authRoute)

// API routes
app.route('/api', apiRoute)

// Admin/HQ Portal routes
app.route('/dashboard', dashboardRoute)
app.route('/property', propertyRoute)
app.route('/booking', bookingRoute)
app.route('/calendar', calendarRoute)
app.route('/b2b', b2bRoute)
app.route('/payment', paymentRoute)
app.route('/sales', salesRoute)
app.route('/promo', promoRoute)
app.route('/logs', logRoute)
app.route('/users', usersRoute)
app.route('/staff', staffRoute)
app.route('/trash', trashRoute)

// Sub-portals
app.route('/b2b-portal', b2bPortalRoute)
app.route('/frontdesk', frontdeskRoute)
app.route('/website', publicRoute)

// Root redirect to login
app.get('/', (c) => {
  return c.redirect('/auth/login')
})

export default app
