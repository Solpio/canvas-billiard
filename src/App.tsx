import React, { useEffect, useRef, useState } from "react";

import Table from "shared/Table";
import Layout from "shared/Layout";
import Billiard from "features/Billiard";

function App(): React.ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const updateDimensions = () => {
			if (ref.current) {
				setDimensions({
					width: ref.current.offsetWidth,
					height: ref.current.offsetHeight,
				});
			}
		};

		updateDimensions();

		// Event listener to update dimensions when the window is resized
		window.addEventListener("resize", updateDimensions);

		// Cleanup function to remove the event listener
		return () => {
			window.removeEventListener("resize", updateDimensions);
		};
	}, []);
	return (
		<Layout>
			<Table ref={ref}>
				<Billiard height={dimensions.height} width={dimensions.width} />
			</Table>
		</Layout>
	);
}

export default App;
