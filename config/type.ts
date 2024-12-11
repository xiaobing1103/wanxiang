export interface ModelConfig {
	title : string;
	ModelPath : string;
	modelIcon : string;
	ModelApi : string;
	modelDesc : string;
	resetPassWord ?: string
	checkNumsType ?: string
}

export type CommonModelKeys = 'v35' | 'v40' | 'net' | 'echarts' | 'vfast';