/**
 * Pure function that builds the WhatsApp order notification message.
 * Decoupled from any UI component so it can be reused (email/SMS later) without
 * touching form logic. Takes the CONFIRMED order row as saved in Supabase —
 * never call this before the DB insert has succeeded.
 */
export function buildWhatsAppMessage(order) {
  const lines = [
    'NEW ORDER — THE BAIGARTS',
    '',
    `Order ID: #${order.order_number}`,
    '',
    'Painting:',
    order.painting_title_snapshot,
    '',
    'Price:',
    `Rs. ${Number(order.painting_price_snapshot).toLocaleString('en-PK')}`,
    '',
    'Customer:',
    order.customer_name,
    '',
    'Phone:',
    order.customer_phone,
    '',
    'Address:',
    formatAddress(order),
  ]

  if (order.landmark) {
    lines.push('', 'Landmark:', order.landmark)
  }

  if (order.notes) {
    lines.push('', 'Notes:', order.notes)
  }

  lines.push(
    '',
    'Order Date:',
    new Date(order.created_at ?? Date.now()).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  )

  return lines.join('\n')
}

function formatAddress(order) {
  const parts = []
  if (order.house_number) parts.push(order.house_number)
  if (order.street) parts.push(order.street)
  if (order.area) parts.push(`Area: ${order.area}`)
  const cityLine = [order.city, order.province].filter(Boolean).join(', ')
  if (cityLine) parts.push(cityLine)
  if (order.postal_code) parts.push(`Postal Code: ${order.postal_code}`)
  return parts.join('\n')
}

/**
 * Builds the final wa.me deep link for a confirmed order.
 * WhatsApp number comes from env config — never hardcode it at call sites.
 */
export function buildWhatsAppLink(order) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER
  if (!number) {
    console.error('VITE_WHATSAPP_NUMBER is not set in your environment variables.')
  }
  const message = buildWhatsAppMessage(order)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/**
 * Opens WhatsApp with the pre-filled order message.
 * Must ONLY be called after a confirmed successful Supabase insert.
 */
export function openWhatsAppWithOrder(order) {
  const link = buildWhatsAppLink(order)
  window.open(link, '_blank', 'noopener,noreferrer')
}
