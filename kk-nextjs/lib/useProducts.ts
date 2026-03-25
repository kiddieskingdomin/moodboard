'use client'

import { useEffect, useState } from 'react'
import type { KKProduct } from '@/types/moodboard'

export interface Product extends KKProduct {
  id: number
  slug: string
  category: string
  ageRange: string[]
  skill: string[]
  price: string
  image: string
  description: string
}

interface UseProductsOptions {
  category?: string
  ageRange?: string
  skill?: string
  search?: string
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options?.category) params.append('category', options.category)
        if (options?.ageRange) params.append('ageRange', options.ageRange)
        if (options?.skill) params.append('skill', options.skill)
        if (options?.search) params.append('search', options.search)

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        setProducts(data.products)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [options?.category, options?.ageRange, options?.skill, options?.search])

  return { products, loading, error }
}
