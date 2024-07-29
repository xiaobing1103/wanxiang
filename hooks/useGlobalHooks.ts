import { getCurrentInstance } from 'vue';
export const useGlobalProperties = () =>{
	const instance = getCurrentInstance()
	  if (instance) {
	    return instance.appContext.config.globalProperties;
	  }
	  return null;
}