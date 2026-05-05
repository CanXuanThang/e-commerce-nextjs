async function ProductByCategory({
  params,
}: {
  params: Promise<{ segment: string[] }>;
}) {
  const { segment } = await params;
  return <section></section>;
}

export default ProductByCategory;
