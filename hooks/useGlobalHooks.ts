import { getCurrentInstance, ComponentInternalInstance, ComponentCustomProperties } from 'vue';

export const useGlobalProperties = () => {
	const instance = getCurrentInstance() as ComponentInternalInstance | null;
	if (instance) {
		return instance.appContext.config.globalProperties as ComponentCustomProperties;
	}
	return null;
}