
import http from "./http";

const urls = {
	login: {
		url: "/api/login", method: "POST", loading: true
	},
};

export default http.dispatch(urls);