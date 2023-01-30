import React from "react";

import MainLayout from "components/layouts/MainLayout";

const ContactUs = () => {
  return <div className="min-h-[calc(100vh_-_391px)]">Contact Us</div>;
};

ContactUs.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ContactUs;
