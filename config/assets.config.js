import CONFIG from './config.js'
const getUrl = (url) =>{
	return CONFIG.staticPath + url
}
export default{
	//我的页面
	vipCard:getUrl('/2024/07/29/396b53c790a06edd99dd4676c9066bd8.svg'),
	// 功能页面
	ppt_cover:getUrl('/2024/07/29/ae8a249b18293065506c5c18f9bf4802.svg'),
	aixz_cover:getUrl('/2024/07/29/d43cefcff1e8a7c8c15ff4d0d3e6e391.svg'),
	gzzj_cover:getUrl('/2024/07/29/aa9686df0e44172525901ab0a23ca56d.svg'),
	swdt_cover:getUrl('/2024/07/29/55725ecb144c844178dbb1c178c75cca.svg'),
	wzyh_cover:getUrl('/2024/07/29/a17dca27807bb8f048a6c963563da670.svg'),
	wddh_cover:getUrl('/2024/07/29/23319b9224489ef905f0e677fe0d9a6e.svg')
}