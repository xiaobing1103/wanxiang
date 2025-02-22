export interface MenuItem {
	cover : string;
	title : string;
	description : string;
	path : string;
}

export interface DefineFunc {
	aigcTaskCheck : (parmas : {
		file_id : number;
		rewrite_sw : number;
		score : 30;
	}, headers ?: any) => Promise<any>;
	taskLists : (data ?: {
		file_md5 : string;
	}, headers ?: any) => Promise<any>;
	tasksEmpty : (headers : any) => Promise<any>;
	tasksDelete : (param : {
		task_id : Key;
	}, headers : any) => Promise<any>;
}


export interface LanguageItem {
	label : string;
	value : string;
}
export const languageData : LanguageItem[] = [
	{
		label: '英文',
		value: 'en'
	},
	{
		label: '中文',
		value: 'zh'
	},
	{
		label: '印度尼西亚',
		value: 'id'
	},
	{
		label: '法语',
		value: 'fr'
	},
	{
		label: '德语',
		value: 'de'
	},
	{
		label: '俄语',
		value: 'ru'
	},
	{
		label: '韩语',
		value: 'ko'
	},
	{
		label: '越南语',
		value: 'vi'
	},
	{
		label: '西班牙语',
		value: 'es'
	},
	{
		label: '日语',
		value: 'ja'
	},
	{
		label: '尼泊尔语',
		value: 'ne'
	},
	{
		label: '阿拉伯语',
		value: 'ar',
	},
	{
		label: '意大利语',
		value: 'it'
	},
	{
		label: '泰语',
		value: 'th'
	},
	{
		label: '荷兰语',
		value: 'nl'
	},
	{
		label: '缅甸语',
		value: 'my'
	}
]

export const languages = [
	'英文', '中文', '印度尼西亚', '法语', '德语', '俄语', '韩语', '越南语', '西班牙语', '日语', '尼泊尔语', '阿拉伯语', '意大利语', '泰语', '荷兰语', '缅甸语'
]