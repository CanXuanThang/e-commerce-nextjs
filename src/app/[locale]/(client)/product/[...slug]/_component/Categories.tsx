import { Link } from "@/i18n/navigation";
import { CategoryResponse } from "@/types/category";
import { renderPath } from "@/utils";

interface Props {
  categories: CategoryResponse[];
}

function Categories({ categories }: Props) {
  return (
    <div className="flex px-5 gap-3 md:px-12">
      {categories.map((child) => (
        <Link
          href={`/product/${renderPath(child.name)}/${child.id}`}
          key={child.id}
          className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm cursor-pointer hover:opacity-90"
        >
          {child.name}
        </Link>
      ))}
    </div>
  );
}

export default Categories;
