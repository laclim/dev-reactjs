import Link, { LinkProps } from "next/link";
import styled from "styled-components";

const CustomLink = styled.a`
  text-decoration: none;
`;
interface extendedLinkProps extends LinkProps {
  children: any;
}
export function StyledLink(props: extendedLinkProps) {
  return (
    <Link {...props} passHref>
      <CustomLink>{props.children}</CustomLink>
    </Link>
  );
}
