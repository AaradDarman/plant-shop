import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import MainLayout from "components/layouts/MainLayout";
import heroPic from "public/images/hero-plant.png";
const ProductsSwiperComponent = dynamic(() =>
  import("components/shared/ProductsSwiperComponent")
);
import api from "adapters/adapter";

export default function Home({
  mostVisitedProducts,
  bestSellingtProducts,
  ...otherProps
}) {
  return (
    <MainLayout {...otherProps}>
      <Head>
        <title>{`فروشگاه اینترنتی ${process.env.NEXT_PUBLIC_SITE_NAME}`}</title>
      </Head>
      <section className="hero h-screen pt-20">
        <div className="absolute top-0 left-28 h-full w-1/3 bg-secondary-light dark:bg-secondary-dark-800"></div>
        <div className="absolute top-80 left-0 w-2/3 sm:top-48 sm:left-4 md:w-1/3 lg:left-20 lg:w-auto">
          <Image
            src={heroPic}
            priority
            alt="plant"
            className="drop-shadow-2xl"
          />
        </div>
        <h1 className="relative z-10 text-4xl font-semibold md:text-8xl">
          <span className="text-accent-600">سبز</span>
          <span> فکر کن و </span>
          <br />
          <span className="text-accent-600">یک چیزی</span>
          <span> بکار</span>
        </h1>
        <p className="relative z-10 w-56 py-4 text-slate-400">
          گیاه رویایی خود را برای دکوراسیون منزل خود با ما بیابید و ما آن را
          محقق خواهیم کرد.
        </p>
        <button className="relative z-10 rounded-md bg-accent-800 py-2 px-6 text-white shadow-md shadow-accent-500">
          کاوش بیشتر
        </button>
      </section>
      {/* most visited products */}
      <div className="relative mb-8 flex justify-between sm:mb-0 sm:justify-center">
        <Link href="/products?sortBy=mostVisited" passHref>
          <a className="absolute left-0 text-accent-700">مشاهده همه</a>
        </Link>
        <h4 className="absolute right-0 sm:relative">پر بازدیدترین محصولات</h4>
      </div>
      <ProductsSwiperComponent products={mostVisitedProducts} />
      {/* best selling products */}
      <div className="relative mb-8 flex justify-between sm:mb-0 sm:justify-center">
        <Link href="/products?sortBy=bestSelling" passHref>
          <a className="absolute left-0 text-accent-700">مشاهده همه</a>
        </Link>
        <h4 className="absolute right-0 sm:relative">پرفروش ترین محصولات</h4>
      </div>
      <ProductsSwiperComponent products={bestSellingtProducts} />
    </MainLayout>
  );
}

export const getStaticProps = async () => {
  try {
    const { data: mostVisitedData } = await api.getProducts({
      page: 1,
      search: "",
      sortBy: "mostVisited",
    });

    const { data: bestSellingtData } = await api.getProducts({
      page: 1,
      search: "",
      sortBy: "bestSelling",
    });

    return {
      props: {
        mostVisitedProducts: mostVisitedData.products,
        bestSellingtProducts: bestSellingtData.products,
      },
    };
  } catch (e) {
    return e;
  }
};
