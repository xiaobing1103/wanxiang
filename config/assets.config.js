import CONFIG from './config.js'
const getUrl = (url) =>{
	return CONFIG.staticPath + url
}
export default{
	//我的页面
	vipCard:getUrl('/2024/07/29/396b53c790a06edd99dd4676c9066bd8.svg')
}