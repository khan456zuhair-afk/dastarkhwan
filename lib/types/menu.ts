export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number; // in PKR
  imageUrl: string;
  originBadge?: string;
  portionInfo?: string;
  spiceLevel: number; // 1 - 4
  rating: number;
  reviewCount: number;
  dietaryTags: string[];
  isFeatured?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

