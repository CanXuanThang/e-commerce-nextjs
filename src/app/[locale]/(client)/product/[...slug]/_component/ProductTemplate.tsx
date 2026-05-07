"use client";

import { getProductByCategoryId } from "@/apis/product";
import ListItem from "@/component/Product";
import { setLoading } from "@/slices/common";
import { ProductState, setDataSortProduct, setProduct } from "@/slices/product";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  id: number;
}

function ProductTemplate({ id }: Props) {
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    queryKey: ["get-product-by-category-id"],
    queryFn: () => getProductByCategoryId(id),
  });

  const { dataSort }: ProductState = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (data && data.data && data.data.products.length > 0) {
      dispatch(setProduct(data.data.products));
      dispatch(setDataSortProduct());
    }
  }, [data, data?.data, isLoading]);

  return (
    <div>
      <ListItem data={dataSort} slideCount={6} />

      <div></div>
    </div>
  );
}

export default ProductTemplate;
