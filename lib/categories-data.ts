import { categories, pricingData } from "./pricing-data"

export type Category = {
  id: string
  name: string
  productCount: number
  averageMargin: number
  totalStock: number
}

// Function to generate category data based on the pricing data
export function getCategoryData(): Category[] {
  return categories.map((categoryName, index) => {
    // Filter products by category
    const categoryProducts = pricingData.filter(item => item.category === categoryName)
    
    // Calculate metrics
    const productCount = categoryProducts.length
    const totalStock = categoryProducts.reduce((sum, product) => sum + product.inStock, 0)
    
    // Calculate average margin
    const totalMargin = categoryProducts.reduce((sum, product) => sum + product.profitMargin, 0)
    const averageMargin = totalMargin / productCount
    
    return {
      id: (index + 1).toString(),
      name: categoryName,
      productCount,
      averageMargin,
      totalStock
    }
  })
}

export const categoryData = getCategoryData() 