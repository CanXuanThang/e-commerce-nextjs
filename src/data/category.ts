const apiURL = process.env.NEXT_PUBLIC_URL_API;

export async function getCategoryById(id: number) {
  const res = await fetch(`${apiURL}/categories/${id}`, {
    next: {
      revalidate: 3600,
    },
  });

  return res.json();
}
