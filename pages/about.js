import React from "react";

import MainLayout from "components/layouts/MainLayout";

const About = () => {
  return <div className="min-h-[calc(100vh_-_391px)]">About Us</div>;
};

About.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default About;
