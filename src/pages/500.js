import React from "react";
import router from "umi/router";

import { Button } from "antd";
import { localeMessage } from "@/utils";

export default ({ location }) => {
	const { query = {} } = location;

	return (
		<div
			className="es-container"
			style={{ paddingTop: 12, paddingBottom: 12 }}
		>
			<h1 style={{ color: "#ff4f2b", fontSize: 24 }}>{query.status}</h1>
			<p>Sorry, the server is wrong.</p>
			{/* <Button type="primary" onClick={() => router.push("/")}>
				{localeMessage("noAuth.goBack")}
			</Button> */}
		</div>
	);
};
