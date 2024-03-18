import React from "react";
import styled from "./layout.module.css";
interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return <div className={styled.wrapper}>{children}</div>;
};

export default Layout;
