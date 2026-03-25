export interface MoodboardItem {
  id: string
  type: 'product' | 'text' | 'shape' | 'sticky' | 'upload' | 'element'
  x: number
  y: number
  w: number
  h: number
  rotation: number
  zIndex: number
  locked: boolean
  data: Record<string, unknown>
}

export interface MoodboardState {
  id: string
  title: string
  background: string
  items: MoodboardItem[]
  drawingData?: string // base64 canvas data
  updatedAt: string
}

export interface KKProduct {
  name: string
  col: string
  cat: string
  age: string
  ageN: [number, number]
  price: string
  url: string
  img: string
  alt: string
}

// Database schema
export interface MoodboardDB {
  id: string
  user_id: string
  title: string
  background: string
  items: string // JSON stringified
  drawing_data: string | null
  created_at: string
  updated_at: string
}
