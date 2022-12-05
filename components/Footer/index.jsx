import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t-secondary-dark-800 border-t-2 border-t-solid grid grid-cols-4 pb-[77px] lg:pb-0">
      <nav className="flex flex-wrap col-span-4 sm:col-span-2 lg:col-span-3 justify-between p-4">
        <ul>
          <li className="text-slate-400 font-bold mb-1">خدمات مشتری</li>
          <Link href="/FAQ" passHref>
            <a className="hover:text-accent-800">
              <li>سؤالات متداول</li>
            </a>
          </Link>
          <Link href="/shipping-and-handling" passHref>
            <a className="hover:text-accent-800">
              <li>بسته بندی و ارسال</li>
            </a>
          </Link>
          <Link href="/guarantee" passHref>
            <a className="hover:text-accent-800">
              <li>گارانتی 30 روزه</li>
            </a>
          </Link>
          <Link href="/contact-us" passHref>
            <a className="hover:text-accent-800">
              <li>ارتباط با ما</li>
            </a>
          </Link>
        </ul>
        <ul>
          <li className="text-slate-400 font-bold mb-1">منابع</li>
          <Link href="/find-your-plant" passHref>
            <a className="hover:text-accent-800">
              <li>گیاهتو پیدا کن</li>
            </a>
          </Link>
          <Link href="/care-library" passHref>
            <a className="hover:text-accent-800">
              <li>کتابخانه مراقبت از گیاه</li>
            </a>
          </Link>
          <Link href="/plant-course" passHref>
            <a className="hover:text-accent-800">
              <li>دوره های رایگان آنلاین</li>
            </a>
          </Link>
        </ul>
        <ul>
          <li className="text-slate-400 font-bold mb-1">جست و جو</li>
          <Link href="/about-us" passHref>
            <a className="hover:text-accent-800">
              <li>داستان ما</li>
            </a>
          </Link>
          <Link href="/careers" passHref>
            <a className="hover:text-accent-800">
              <li>مشاغل</li>
            </a>
          </Link>
          <Link href="/locations" passHref>
            <a className="hover:text-accent-800">
              <li>مکان ها</li>
            </a>
          </Link>
        </ul>
      </nav>
      <div className="subscribe-container flex flex-col col-span-4 sm:col-span-2 lg:col-span-1 p-4">
        <h5 className="text-3xl font-semibold mb-4">خااکی شو.</h5>
        <p className="mb-4">
          نکات مراقبت از گیاه، پیشنهادات منحصر به فرد و رویداد را دریافت کنید.
          دعوت نامه ها مستقیم درون صندوق ورودی شما.بدون هرزنامه
        </p>
        <form className="flex flex-col mb-3">
          <input
            type="email"
            placeholder="ایمیل خود را وارد کنید..."
            className="mb-4 py-2 px-2 rounded-md bg-transparent border border-secondary-dark-800 outline-none focus:border-accent-800"
          />
          <input
            type="submit"
            value="ثبت نام"
            className="bg-accent-800 text-white rounded-md py-2 cursor-pointer"
          />
        </form>
        <div className="social-media flex justify-around">
          <Link
            href="https://www.instagram.com/thesill/"
            target="_blank"
            passHref
          >
            <a className="hover:text-instagram-color">
              <FontAwesomeIcon fixedWidth size="lg" icon={faInstagram} />
            </a>
          </Link>
          <Link
            href="https://www.facebook.com/thesill/"
            target="_blank"
            passHref
          >
            <a className="hover:text-facebook-color">
              <FontAwesomeIcon fixedWidth size="lg" icon={faFacebook} />
            </a>
          </Link>
          <Link
            href="https://www.twitter.com/thesill/"
            target="_blank"
            passHref
          >
            <a className="hover:text-twitter-color">
              <FontAwesomeIcon fixedWidth size="lg" icon={faTwitter} />
            </a>
          </Link>
          <Link
            href="https://www.linkedin.com/thesill/"
            target="_blank"
            passHref
          >
            <a className="hover:text-linkedin-color">
              <FontAwesomeIcon fixedWidth size="lg" icon={faLinkedin} />
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
