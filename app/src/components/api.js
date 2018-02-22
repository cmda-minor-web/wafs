const api = {
	call: async function (api) {
		try {
			const response = await fetch(api)
			const data = await response.json()

			if (data) {
				return data
			}
			throw new Error()

		} catch (error) {
			console.log(`Unable to get data back from ${api}`)
		}
	}
}

export default api