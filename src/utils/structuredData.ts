export interface ProductStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string | string[];
  brand: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: number | string;
    availability: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
}

export interface ArticleStructuredData {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: {
    "@type": string;
    name: string;
  };
}

export function generateProductStructuredData(
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    price?: number;
    inStock?: boolean;
  },
  siteUrl: string,
): ProductStructuredData {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "Krik",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: "VND",
      price: product.price || 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function generateArticleStructuredData(
  article: {
    title: string;
    description: string;
    image?: string;
    datePublished?: string;
  },
  siteUrl: string,
): ArticleStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || `${siteUrl}/logo3.png`,
    datePublished: article.datePublished || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Krik",
    },
  };
}
