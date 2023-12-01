import axios from 'axios'
import {
	IUpdateUserTokenRequest,
	IUpdateUserTokenResponse,
} from '../../api/users/dto/updateUserToken.ts'
import useVirtualStore from '../../storage'

export const API_URL = 'http://localhost:3000'

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
})

$api.interceptors.request.use(instance => {
	instance.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
	return instance
})

$api.interceptors.response.use(
	instance => {
		return instance
	},
	async error => {
		const originalRequest = error?.config
		if (error?.response.status == 401 && error.config && !error.config._isRetry) {
			originalRequest._isRetry = true
			try {
				if (useVirtualStore(state => state.userId) !== undefined) {
					const response = await axios.get<
						IUpdateUserTokenRequest,
						IUpdateUserTokenResponse,
						IUpdateUserTokenRequest
					>(`${API_URL}/tokens/update`, {
						withCredentials: true,
						data: {
							userId: useVirtualStore(state => state.userId)!,
							deviceId: useVirtualStore(state => state.deviceId)!,
							role: useVirtualStore(state => state.role)!,
							login: useVirtualStore(state => state.login)!,
						},
					})
					localStorage.setItem('accessToken', response.accessToken)
					return $api.request(originalRequest)
				}
			} catch (e) {
				console.log('Unauthorized')
			}
		}
		throw error
	}
)
export default $api
