import React, { useEffect } from "react";

import { Breadcrumbs, Typography } from "@mui/material";

import Link from "next/link";
import Head from "next/head";

const MyBreadCrumbs = ({ breadcrumbs }) => {
  let homeBread = { name: "خانه", slug: "/" };

  const bcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      breadcrumbs.unshift(homeBread);
      return breadcrumbs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breadcrumbs]
  );

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ width: "100%", padding: "10px" }}
    >
      {bcrumbs.map((crumb, idx) => (
        <Crumb
          text={crumb.name}
          href={idx === 0 ? crumb.slug : `/${crumb.slug}`}
          key={crumb.slug}
          last={idx === breadcrumbs.length - 1}
        />
      ))}
    </Breadcrumbs>
  );
};

function Crumb({ text: defaultText, href, last = false }) {
  const [text, setText] = React.useState(defaultText);

  if (last) {
    return <Typography color="text.primary">{text}</Typography>;
  }

  return (
    <Link href={href}>
      <a className="hover:text-accent-700">{text}</a>
    </Link>
  );
}

export default MyBreadCrumbs;
