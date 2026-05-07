import { Link } from "@/i18n/navigation";
import { CategoryResponse } from "@/types/category";
import { renderPath } from "@/utils";
import { MouseEventHandler } from "react";

interface Props {
  data: CategoryResponse[];
  className?: string;
  itemClassName?: string;
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
}

function Category({
  data,
  className = "",
  itemClassName = "",
  onNavigate,
}: Props) {
  return (
    <div className={`w-full mx-auto px-2 flex gap-6 h-[48px] ${className}`}>
      {data.map((parent) => (
        <div
          key={parent.id}
          className="relative group py-3.5 px-3.5 cursor-pointer text-black hover:bg-white md:text-white hover:text-gray-500 uppercase font-semibold text-sm"
        >
          <Link
            href={`/product/${renderPath(parent.name)}/${parent.id}`}
            className="cursor-pointer font-semibold uppercase"
          >
            {parent.name}
          </Link>

          {parent.children && parent.children.length > 0 && (
            <div className="absolute hidden group-hover:block bg-white shadow-md p-4 min-w-[200px] bottom-[-52px] left-0">
              {parent.children.map((child) => (
                <div key={child.id}>
                  <Link
                    href={`/product/${renderPath(child.name)}/${child.id}`}
                    className="font-medium"
                  >
                    {child.name}
                  </Link>

                  {child.children && child.children.length > 0 && (
                    <div className="ml-3 mt-1 flex flex-col">
                      {child.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/product/${renderPath(sub.name)}/${sub.id}`}
                          onClick={onNavigate}
                          className={`text-sm hover:text-blue-500 ${itemClassName}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Category;
