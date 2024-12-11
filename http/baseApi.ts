import { AppName } from '.'
import { isDevMode } from '@/utils/env'
const envBaseUrl = import.meta.env.VITE_APP_BASE_URL || ''


const BaseApi = 'https://ai1foo.com/'
const SconendApi = 'https://gpt.53at.com/'
export {
	BaseApi,
	SconendApi
}