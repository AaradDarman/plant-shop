import MyPopover from "components/shared/MyPopover";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ProductsCategoryDropdown = ({ categories }) => {
  const router = useRouter();
  return (
    <MyPopover
      title={
        <Link href="/products" passHref>
          <a
            className={`py-2 px-3 font-bold ${
              router.pathname === "/products"
                ? " border-b-2 border-b-accent-400 text-slate-900 border-b-solid dark:text-slate-50"
                : "text-slate-400 hover:text-accent-700"
            }`}
          >
            محصولات
          </a>
        </Link>
      }
    >
      <div className="w-max bg-white dark:bg-primary-800">
        <Link href="/products" passHref>
          <a className="flex flex-1 px-3 py-1 hover:bg-black/[.1] hover:text-accent-700 dark:hover:bg-primary-900">
            مشاهده همه
          </a>
        </Link>
        {categories?.map((category) => (
          <Link
            href={`/products/${category.slug}`}
            passHref
            key={category.slug}
          >
            <a className="flex flex-1 px-3 py-1 hover:bg-black/[.1] hover:text-accent-700 dark:hover:bg-primary-900">
              {category.name}
            </a>
          </Link>
        ))}
      </div>
    </MyPopover>
  );
};

export default ProductsCategoryDropdown;
