import { Link } from "@/i18n/navigation";

const categories = [
  { id: 1, name: "Quần nam", url: "/man" },
  { id: 2, name: "Áo nam", url: "/t-shirt" },
  { id: 3, name: "Áo nữ", url: "/t-shirt" },
  { id: 4, name: "Quần nữ", url: "/t-shirt" },
];

function Category() {
  return (
    <div className="w-full mx-auto px-2 flex">
      {categories.map((item) => (
        <Link
          className="py-3 px-3.5 cursor-pointer text-white hover:bg-white hover:text-gray-500 uppercase font-semibold text-sm"
          href={item.url}
          key={item.id}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default Category;
