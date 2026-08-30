import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Submits a new order via the create_public_order() Postgres function
 * (see supabase/schema.sql) instead of a direct table insert.
 *
 * Why: Supabase's `.insert().select()` needs a SELECT RLS policy to return
 * the inserted row, and giving anon SELECT on orders would let anyone read
 * every customer's order history. The database function runs as a trusted
 * server-side routine instead — it also re-reads the painting's real price,
 * title, and status directly from the table rather than trusting whatever
 * the client sent, and rejects the order if the painting was sold in the
 * meantime (real race-condition protection, not just a client-side check).
 */
export async function createOrder({ painting, formValues }) {
  const { data, error } = await supabase.rpc('create_public_order', {
    p_painting_id: painting.id,
    p_customer_name: formValues.customer_name,
    p_customer_phone: formValues.customer_phone,
    p_house_number: formValues.house_number || null,
    p_street: formValues.street || null,
    p_area: formValues.area,
    p_city: formValues.city,
    p_province: formValues.province,
    p_postal_code: formValues.postal_code || null,
    p_landmark: formValues.landmark || null,
    p_notes: formValues.notes || null,
  })

  return { data, error }
}

/** Admin: fetch orders, optionally filtered by status. */
export function useOrders(filters = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filters.status) query = query.eq('status', filters.status)

    const { data, error: fetchError } = await query
    if (fetchError) setError(fetchError.message)
    else setOrders(data ?? [])
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

export function useOrder(id) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrder = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (fetchError) setError(fetchError.message)
    else setOrder(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  return { order, loading, error, refetch: fetchOrder }
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  return { error }
}
