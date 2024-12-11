<template>
	<z-paging ref="paging" refresher-only :show-scrollbar="false" @onRefresh="getCurrentPagesLists">
		<template #top>
			<CommonHeader :defindTitle="currentType" />
			<view class="ArtistTest">
				<view class="ArtistTest_headerTitle">
					<up-tabs :current="currentPage" :list="tabconfigData" @click="changeTabs"></up-tabs>
				</view>
			</view>
		</template>
		<template v-if="currentPage == 0">
			<view class="ArtistTest_desc">
				对抗算法由本平台原创研发，不代表其他平台观点。经大量对比测试，本对抗算法适用于降低AI模型生成的特征
			</view>
			<view class="ArtistTestMain">
				<view class="ArtistTestMain_items" v-for="(items,index) in desceptions" :key="index">
					<view class="ArtistTestMain_items_title">
						{{items.title}}
					</view>
					<view class="ArtistTestMain_items_desc">
						{{items.desc}}
					</view>
				</view>
			</view>
			<view class="ArtistTestMain_articlesBox">
				<view class="">
					论文内容：
				</view>
				<up-radio-group v-model="radiovalue1" placement="row">
					<up-radio :customStyle="{marginRight: '15px'}" v-for="(item, index) in radiolist1" :key="index"
						:label="item.name" :name="item.name" @change="radioChange">
					</up-radio>
				</up-radio-group>
			</view>
			<view class="ArtistTestMain_textAreaBox">
				<view class="ArtistTestMain_textAreaBox_content">
					<template v-if="radiovalue1 == '粘贴文本'">
						<up-textarea v-model="text" height="300" placeholder="论文内容的长度至少300字,至多15万字"
							maxlength="-1"></up-textarea>
					</template>
					<template v-if="radiovalue1 == '上传文件'">
						<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center'}"
							:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all" :maxCount="1">
							<view class="uploadFile">
								<view class="uploadFile_images">
									<image class="uploadFile_images_img"
										src="http://file.1foo.com/2024/05/21/66d1d578283e48950e200e90a074ef5c.png"
										mode=""></image>
								</view>
								<view class="uploadFile_desc1">
									点击上传文件
								</view>
								<view class="uploadFile_desc2">
									暂时只支持docx格式的文件
								</view>
							</view>
						</up-upload>
					</template>
				</view>
				<view class="ArtistTestMain_textAreaBox_buttom">
					<view class="ArtistTestMain_textAreaBox_buttom_items">
						1.论文内容的长度至少300字，至多15万字，系统按照Word字数统计里面的字符数（不记空格）计算。
					</view>
					<view class="ArtistTestMain_textAreaBox_buttom_items">
						2.系统在检测时会分析论文的前后文关系，
					</view>
					<view class="ArtistTestMain_textAreaBox_buttom_items">
						3.仅支持中文检测，请勿提交英语、德语、西班牙语、法语、意大利语、日语、韩语、葡萄牙语、俄语的检测。
					</view>
				</view>
			</view>
		</template>
		<template v-if="currentPage == 1">
			<StepMain :CurrentLists="CurrentLists" :defineFunctions="defineFunctions" :currentType="currentType"
				:getCurrentPagesLists="getCurrentPagesLists" />
		</template>
		<template v-if="currentPage == 2">
			<MyFileCom :CurrentLists="CurrentLists" :defineFunctions="defineFunctions" :currentType="currentType"
				v-model:currentPage="currentPage" :getCurrentPagesLists="getCurrentPagesLists" />
		</template>
		<template #bottom>
			<view class="allButtonBox" v-if="currentPage == 0">
				<up-button @click="submitTest" :customStyle="{width:'60%'}" type="primary">提交检测</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import type { DefineFunc } from '../type.ts'
	import StepMain from './StepMain.vue'
	import MyFileCom from './MyFileCom.vue'
	import { useUserStore } from '@/store';
	const { $api } = useGlobalProperties()
	const fileList1 = ref([]);
	const paging = ref(null)
	const CurrentLists = ref([])
	const getCurrentPagesLists = async () => {
		if (currentPage.value == 1) {
			const signApires = await $api.get('api/v1/app/getAigcM', {}, {})
			if (signApires.code == 200) {
				const ListsRes = await props.defineFunctions.taskLists({ task_id: '' }, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
				if (ListsRes.code == 200) {
					CurrentLists.value = ListsRes.data.list
					paging.value.complete()
				} else {
					uni.$u.toast('请求失败！');
					paging.value.complete(false);
				}
			}
		}
		if (currentPage.value == 2) {
			const signApires = await $api.get('api/v1/app/getAigcM', {}, {})
			if (signApires.code == 200) {
				const Resp = await $api.post('https://appc.1foo.com/api/app/aigc/files/list', null, null, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
				// paging.value.complete(CurrentLists.value)
				CurrentLists.value = Resp.data.list
				paging.value.complete()
			} else {
				paging.value.complete(false);
			}
		}
		paging.value?.complete()
	}

	const props = defineProps<{ tabconfigData : { title : string, imgSrc : string }, currentType : string, defineFunctions : DefineFunc }>()
	const UserStore = useUserStore()
	const text = ref('')
	const desceptions = [
		{ title: '什么是AIGC检测算法？', desc: 'AIGC检测可有效识别文本是否部分或全部由AI模型生成，检测结果与论文质量无关、仅表示论文中内容片段存在AI生成可能性的概率。根据《中华人民共和国学位法（草案）》第六章第三十三条之规定，已经获得学位者，在获得学位过程中如有人工智能代写等学术不端行为，经学位评定委员会审议决定，可由学位授予单位撤销学位证书。' },
		{ title: '对AI生成内容降低特征码适用于什么场景？', desc: '对一些利用AI辅助撰写后的文本进行特征码消除后，可提升在各种平台上通过的检测率。如常见的百家号、头条号、短视频平台等。' },
	]
	// 基本案列数据
	const radiolist1 = reactive([
		{
			name: '粘贴文本',
			disabled: false,
		},
		{
			name: '上传文件',
			disabled: false,
		}
	]);
	// 新增图片
	const afterRead = async (event : { file : any; }) => {
		let fileName = ''
		let formdata : any = null
		let response
		// #ifdef H5
		fileName = event.file[0].name
		formdata = new FormData()
		formdata.append('text', event.file[0].file)
		// #endif
		// #ifdef MP-WEIXIN
		fileName = event.file[0].name
		formdata = { text: event.file[0].url }
		// #endif
		if (!checkFileType(fileName)) {
			uni.$u.toast('只支持上传视频格式docx！');
			return
		}
		const signApires = await $api.get('api/v1/app/getAigcM', {}, {})
		// #ifdef H5
		response = await $api.post('https://appc.1foo.com/api/app/aigc/files/upload', formdata, null, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
		// #endif
		// #ifdef MP-WEIXIN
		response = await $api.post('https://appc.1foo.com/api/app/aigc/files/upload', formdata, true, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time }, null, true)
		// #endif
		console.log(response)
		if (typeof response == 'string') {
			response = JSON.parse(response)
		}

		if (response.code !== 200) {
			uni.$u.toast(response.msg);
		} else {
			uni.$u.toast('上传文档成功！');
			currentPage.value = 2
		}

	};
	const currentPage = ref(0)
	const radiovalue1 = ref('粘贴文本');

	function checkFileType(fileName : string) {
		// 定义允许上传的文件扩展名
		const allowedExtensions = ['docx'];
		// 获取文件的扩展名	
		const fileExtension = fileName.split('.').pop().toLowerCase();
		// 检查文件扩展名是否在允许的列表中
		if (allowedExtensions.includes(fileExtension)) {
			return true;
		} else {
			return false;
		}
	}

	const radioChange = (n) => {
		radiovalue1.value = n
	};
	const changeTabs = ({ index }) => {
		currentPage.value = index

	}

	const isChecked = ref(false)
	const submitTest = async () => {
		if (!text.value) {
			uni.$u.toast('请先填写粘贴文章后再继续提交检测！');
			return
		}
		const signApires = await $api.get('api/v1/app/getAigcM')
		if (signApires.code == 200) {
			const ListsRes = await $api.post('https://appc.1foo.com/api/app/aigc/files/upload', { str_text: text.value }, null, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
			if (ListsRes.code == 200 || ListsRes.code == 300) {
				uni.$u.toast('提交检测成功,正在检测文档,请稍等！');
				const TaskCheckres = await props.defineFunctions.aigcTaskCheck({
					file_id: ListsRes.data.file_id,
					rewrite_sw: isChecked ? 1 : 0,
					score: 30
				}, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
				if (TaskCheckres.code == 300) {
					currentPage.value = 2
					uni.$u.toast(TaskCheckres.msg);
				} else {
					uni.$u.toast(TaskCheckres.msg);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ArtistTest {
		&_headerTitle {
			display: flex;
			justify-content: center;

		}

		&_desc {
			font-size: 27rpx;
			color: #ccc;
			padding: 24rpx;
			text-align: center;
		}
	}


	.ArtistTestMain {
		margin: 15rpx;
		border: 3rpx solid $aichat-border-color;
		padding: 15rpx;
		border-radius: 15rpx;

		&_items {
			&_title {
				color: #3c9cff;
				padding: 15rpx 0;
				font-weight: 800;
				font-size: 25rpx;
			}

			&_desc {
				font-size: 25rpx;
			}
		}

		&_articlesBox {
			padding: 15rpx;
			display: flex;
			height: max-content;
		}

		&_textAreaBox {
			margin: 15rpx;

			&_content {
				border: 1rpx solid #ccc;
				border-radius: 10rpx;

			}

			&_buttom {
				padding: 15rpx;
				display: flex;
				flex-direction: column;

				&_items {
					font-size: 27rpx;
					padding: 15rpx 0;
				}
			}
		}
	}

	.allButtonBox {
		margin: 30rpx;
		display: flex;
		justify-content: center;
	}

	.uploadFile {
		&_images {
			padding: 40rpx;
			display: flex;
			justify-content: center;

			&_img {
				width: 200rpx;
				height: 200rpx;

			}
		}

		&_desc1 {
			font-size: 27rpx;
			text-align: center;
			padding: 10rpx;
		}

		&_desc2 {
			font-size: 27rpx;
			text-align: center;
			color: #ccc;
			padding-bottom: 20rpx;
		}
	}
</style>