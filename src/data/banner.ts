export default async function getBanner() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/banners`, {
    next: {
      revalidate: 3600,
    },
  });

  return res.json();
}
