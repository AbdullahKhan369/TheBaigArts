import { useState } from 'react'
import { createOrder } from '../../hooks/useOrders'
import { openWhatsAppWithOrder } from '../../lib/whatsapp'
import { PROVINCES } from '../../lib/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const initialValues = {
  customer_name: '',
  customer_phone: '',
  house_number: '',
  street: '',
  area: '',
  city: '',
  province: '',
  postal_code: '',
  landmark: '',
  notes: '',
}

export default function OrderForm({ painting }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('idle') // idle | success | dbError
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!values.customer_name.trim()) nextErrors.customer_name = 'Required'
    if (!values.customer_phone.trim()) nextErrors.customer_phone = 'Required'
    else if (!/^[0-9+\-\s]{7,15}$/.test(values.customer_phone.trim()))
      nextErrors.customer_phone = 'Enter a valid phone number'
    if (!values.area.trim()) nextErrors.area = 'Required'
    if (!values.city.trim()) nextErrors.city = 'Required'
    if (!values.province) nextErrors.province = 'Required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    if (painting.status === 'sold') {
      // Race-condition guard: painting could have sold between page load and submit.
      setStatus('dbError')
      return
    }

    setSubmitting(true)
    const { data, error } = await createOrder({ painting, formValues: values })
    setSubmitting(false)

    if (error) {
      // DB save failed — per spec, WhatsApp must NEVER open on a failed save.
      console.error(error)
      setStatus('dbError')
      return
    }

    // DB save confirmed successful — now, and only now, open WhatsApp.
    setConfirmedOrder(data)
    setStatus('success')
    openWhatsAppWithOrder(data)
  }

  if (status === 'success' && confirmedOrder) {
    return (
      
      <div className="border border-line bg-ink-soft p-8 text-center">
        <p className="wall-label text-brass">Order Received</p>
        <h3 className="mt-3 font-display text-2xl text-ivory">Order #{confirmedOrder.order_number}</h3>
        <p className="mt-3 text-sm text-ivory-dim">
          We've saved your order request. A WhatsApp chat should have opened with your order
          details — if it didn't open automatically, your browser may have blocked the popup. please
          consfirm the order in the chat and we'll get back to you.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => openWhatsAppWithOrder(confirmedOrder)}
        >
          Reopen WhatsApp message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'dbError' && (
        <div className="border border-sold bg-sold/10 px-4 py-3 text-sm text-ivory">
          {painting.status === 'sold'
            ? 'This painting was just marked as sold and can no longer be ordered. Please browse other available paintings.'
            : "We couldn't save your order just now. Please check your connection and try again — nothing was sent yet."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          required
          value={values.customer_name}
          onChange={(e) => update('customer_name', e.target.value)}
          error={errors.customer_name}
        />
        <Input
          label="Phone Number"
          required
          placeholder="03xx-xxxxxxx"
          value={values.customer_phone}
          onChange={(e) => update('customer_phone', e.target.value)}
          error={errors.customer_phone}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="House / Flat / Shop No."
          value={values.house_number}
          onChange={(e) => update('house_number', e.target.value)}
        />
        <Input
          label="Street / Road"
          value={values.street}
          onChange={(e) => update('street', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Area"
          required
          value={values.area}
          onChange={(e) => update('area', e.target.value)}
          error={errors.area}
        />
        <Input
          label="City"
          required
          value={values.city}
          onChange={(e) => update('city', e.target.value)}
          error={errors.city}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Province"
          required
          options={PROVINCES}
          value={values.province}
          onChange={(e) => update('province', e.target.value)}
          error={errors.province}
        />
        <Input
          label="Postal Code"
          value={values.postal_code}
          onChange={(e) => update('postal_code', e.target.value)}
        />
      </div>

      <Input
        label="Landmark (optional)"
        value={values.landmark}
        onChange={(e) => update('landmark', e.target.value)}
      />

      <Input
        label="Additional Order Notes (optional)"
        textarea
        value={values.notes}
        onChange={(e) => update('notes', e.target.value)}
      />

      <Button type="submit" loading={submitting} className="w-full sm:w-auto">
        Submit Order Request
      </Button>
      <p className="text-xs text-ivory-dim">
        After submitting, we'll open WhatsApp with your order details so we can confirm directly with you.
      </p>
    </form>
  )
}
