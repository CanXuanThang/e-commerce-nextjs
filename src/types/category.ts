export interface CategoryResponse {
  id: number;
  name: string;
  children: CategoryResponse[];
}

export interface UpdateCategoryRequest {
  name: string;
  parentId: number | null;
}
