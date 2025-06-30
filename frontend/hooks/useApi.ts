"use client";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

export function useApi() {
	// GET method
	const get = async (endpoint: string) => {
		const response = await axios.get(baseURL + endpoint);
		if (response.status !== 200) {
			throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
		}
		return response.data;
	};

	// POST method
	const post = async (endpoint: string, data: object) => {
		const response = await axios.post(baseURL + endpoint, data);
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
		}
		return response.data;
	};

	// PUT method
	const put = async (endpoint: string, data: object) => {
		const response = await axios.put(baseURL + endpoint, data);
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
		}
		return response.data;
	};

	// DELETE method
	const del = async (endpoint: string) => {
		const response = await axios.delete(baseURL + endpoint);
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
		}
		return response.data;
	};

	return {
		get,
		post,
		put,
		del,
	};
}
