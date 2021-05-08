import React from "react";
import getConfig from "next/config";
import { Link, LinkBaseProps } from "@material-ui/core";
import { isInterfaceType } from "graphql";

interface CustomLinkProps extends LinkBaseProps {
  subdomain: string;
}

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const SubLink = (props: CustomLinkProps) => {
  const { subdomain, children } = props;
  const APP_DOMAIN = publicRuntimeConfig.APP_DOMAIN;
  const NODE_ENV = publicRuntimeConfig.NODE_ENV;
  console.log(NODE_ENV);
  const protocol = NODE_ENV == "development" ? "http" : "https";
  return (
    <div>
      <Link
        href={`${protocol}://${subdomain}.${APP_DOMAIN}`}
        style={{ textDecoration: "none" }}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
};

export default SubLink;
