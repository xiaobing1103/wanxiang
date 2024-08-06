import CONFIG from './config.js'
import { IconConfig } from './type.js'
const getUrl = (url : string) => {
	return CONFIG.staticPath + url
}
const iconConfig : IconConfig = {
	//我的页面
	vipCard: getUrl('/2024/07/29/396b53c790a06edd99dd4676c9066bd8.svg'),
	// 功能页面
	ppt_cover: getUrl('/2024/07/29/ae8a249b18293065506c5c18f9bf4802.svg'),
	aixz_cover: getUrl('/2024/07/29/d43cefcff1e8a7c8c15ff4d0d3e6e391.svg'),
	gzzj_cover: getUrl('/2024/07/29/aa9686df0e44172525901ab0a23ca56d.svg'),
	swdt_cover: getUrl('/2024/07/29/55725ecb144c844178dbb1c178c75cca.svg'),
	wzyh_cover: getUrl('/2024/07/29/a17dca27807bb8f048a6c963563da670.svg'),
	wddh_cover: getUrl('/2024/07/29/23319b9224489ef905f0e677fe0d9a6e.svg'),
	//绘画页面
	xgst_cover: getUrl('/2024/07/29/b8995e5f2bca2177a828807f33e2fed6.svg'),
	tpzkt_cover: getUrl('/2024/07/29/76df995762df7fb7f831683dff8fa0d5.svg'),
	aihl_cover: getUrl('/2024/07/29/d7a6a27f4d8fdcaa941a91192a21acc9.svg'),
	paintAixz_cover: getUrl('/2024/07/29/98b5614e65a4c4383ca14cfb1a49ab39.svg'),
	tpst_cover: getUrl('/2024/07/29/9d35318e0f3a1915c1aa54dc3d62da52.svg'),
	wzst_cover: getUrl('/2024/07/29/79cf1c92dad3344d09c588ed894d15fc.svg'),
	jbzh_cover: getUrl('/2024/07/29/264f04a7b3cae3546bf0544c201d0d7c.svg'),
	rxkt_cover: getUrl('/2024/07/29/b5e3e490318dd92361e3afee5e16c0bd.svg'),

	// 所有模型icon
	v35ModelIcon: getUrl('/2023/12/12/941983dadec37a257e67974675d21734.png'),
	v40ModelIcon: getUrl('/2023/12/12/ce9426096ab671825e0ba57c750a14d8.png'),
	netModelIcon: getUrl('/2023/12/12/ce9426096ab671825e0ba57c750a14d8.png'),
	echartsModelIcon: getUrl('/2024/01/02/d4169bfc46ee0d0a29c6c9c8653ebc06.png'),

	// 对话页面icon

	// 切换模型
	Change_Model_Icon: getUrl('/2024/08/06/1a164d08dfe054b06dac984aecf187ad.svg')

}

export default iconConfig