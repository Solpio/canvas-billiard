import React, { ForwardedRef, forwardRef } from "react";
import styled from "./table.module.css";

interface TableProps {
	children: React.ReactNode;
}
const Table = forwardRef(function Table(
	{ children }: TableProps,
	ref: ForwardedRef<HTMLDivElement>
): React.ReactNode {
	return (
		<div className={styled.wrapper}>
			<div className={styled.innerWrapper} ref={ref}>
				{children}
			</div>
		</div>
	);
});

export default Table;
