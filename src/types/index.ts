export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  is_blocked: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  is_active: boolean
  display_order: number
  type: 'freshly_bakes' | 'regular' | 'both'
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  price: number
  discount_price: number | null
  type: 'freshly_bakes' | 'regular'
  is_best_seller: boolean
  is_treat_of_day: boolean
  is_active: boolean
  rating: number
  rating_count: number
  stock: number
  images: string[]
  category?: Category
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product: Product
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  landmark: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  items: OrderItem[]
  subtotal: number
  delivery_charge: number
  discount: number
  total: number
  status: 'pending' | 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled'
  payment_method: 'razorpay' | 'cod'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  delivery_address: Address
  pincode: string
  coupon_code: string | null
  notes: string | null
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Pincode {
  id: string
  pincode: string
  area: string
  delivery_type: 'free' | 'paid' | 'not_available'
  delivery_charge: number
  delivery_time_hours: number
  is_bandra: boolean
  is_same_day_available: boolean
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value: number
  max_discount: number | null
  valid_from: string
  valid_until: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
}

export interface HeroBanner {
  id: string
  image_url: string
  title: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  display_order: number
  is_active: boolean
}

export interface HelpTicket {
  id: string
  ticket_number: string
  user_id: string
  order_id: string | null
  subject: string
  message: string
  admin_reply: string | null
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  order?: Order
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  category: string | null
  tags: string[]
  author: string
  is_published: boolean
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
}

export interface Settings {
  razorpay_enabled: boolean
  free_delivery_threshold: number
  same_day_cutoff_hour: number
  top_banner_text: string
  top_banner_active: boolean
  contact_phone: string
  contact_email: string
  instagram_url: string
  default_delivery_charge: number
}