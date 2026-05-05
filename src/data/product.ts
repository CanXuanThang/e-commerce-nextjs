const apiURL = process.env.NEXT_PUBLIC_URL_API;

export async function getProducts() {
  const res = await fetch(`${apiURL}/products`, {
    next: {
      revalidate: 3600,
    },
  });

  return res.json();
}

export async function getProductById(id: number) {
  const res = await fetch(`${apiURL}/products/${id}`, {
    next: { revalidate: 3600 },
  });

  return res.json();
}

export async function getProductByBestReview() {
  const res = await fetch(`${apiURL}/products/best-review`, {
    next: { revalidate: 3600 },
  });

  return res.json();
}

export async function getCartItems() {
  const res = await fetch(`${apiURL}/cart-items`, {
    next: { revalidate: 3600 },
  });

  return res.json();
}
