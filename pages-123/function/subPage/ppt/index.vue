<template>
	<stepTemplate @next="onNextStep" v-if="currentStep == stepEnum.STEP_TEMPLATE"></stepTemplate>
	<createContent @next="onNextStep" v-else-if="currentStep == stepEnum.CREATE_CONTENT" />
	<updateContent v-model="createForm.content" @next="onNextStep" v-else-if="currentStep == stepEnum.UPDATE_CONTENT" />
	<selectTheme @next="onNextStep" v-else-if="currentStep == stepEnum.SELECT_THEME" />
	<previewResult @download="onDwonLoad" @preview="onPreview" v-else-if="currentStep == stepEnum.PREVIEW_RESULT" />
</template>

<script setup lang="ts">
	import { ref, nextTick } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks.ts'
	import { useUserStore } from '@/store/index'
	import stepTemplate from './components/stepTemplate.vue'
	import selectTheme from './components/selectTheme.vue'
	import createContent from './components/createContent.vue'
	import previewResult from './components/previewResult.vue'
	import updateContent from './components/updateContent.vue'
	import APP_CONFIG from '@/config/config.ts'
	import { AppName } from '@/http'
	import { toCopyText } from '@/utils'

	enum stepEnum {
		'STEP_TEMPLATE' = 0,
		'CREATE_CONTENT' = 1,
		'UPDATE_CONTENT' = 2,
		'SELECT_THEME' = 3,
		'PREVIEW_RESULT' = 4
	}
	const { $api } = useGlobalProperties()
	const userStore = useUserStore()
	const previewRef = ref()
	//当前步骤
	const currentStep = ref(stepEnum.STEP_TEMPLATE)
	//任务_id
	const taskId = ref('')
	//内容
	const createForm = ref({
		id: '',
		content: '',
		type: ''
	})
	//创建一个PPT
	const createPpt = () : Promise<string> => {
		return new Promise(async (reslove, reject) => {
			try {
				const res = await $api.post('api/v1/ppt/create', createForm.value)
				reslove(res.data.task_id)
			} catch (err) {
				reject()
			}
		})
	}

	const fileNameEscape = (filename) => {
		if (uni.getSystemInfoSync().platform == "ios") {
			filename = escape(filename);
		}
		return filename;
	}

	const saveFile = (tempFilePath) => {
		let fileName = `${new Date().getTime()}.pptx`; // 目标文件名
		// 通过URL参数获取目录对象或文件对象
		let targetDir = null;
		if (uni.getSystemInfoSync().platform === 'android') {
			// 获取安卓下载目录
			targetDir = plus.android.invoke(plus.android.runtimeMainActivity(), 'getExternalFilesDir', 'download').getAbsolutePath();
		} else if (uni.getSystemInfoSync().platform === 'ios') {
			// iOS 没有直接的通用下载目录，使用 app 的 Documents 目录
			targetDir = plus.io.convertLocalFileSystemURL('documents://');
		}
		const targetFilePath = targetDir + '/' + fileName;

		uni.saveFile({
			tempFilePath: targetFilePath,
			success: (res) => {
				console.log('保存文件成功：', res);
				// 需要保存的文件的临时路径
				let tempFilePath = res.savedFilePath;
				plus.io.resolveLocalFileSystemURL(tempFilePath, (entry) => {
					plus.io.resolveLocalFileSystemURL('_doc/', (root) => {
						// 创建或打开当前目录下指定的文件
						root.getFile(fileName, {
							create: true
						}, (file) => {
							// 删除、拷贝目录
							file.remove(() => {
								entry.copyTo(root, fileName, (entry) => {
									console.log('拷贝目录成功：', entry.fullPath);
									// 调用第三方程序打开指定的文件
									plus.runtime.openFile(entry.fullPath);

								}, (err) => {
									console.log('拷贝目录失败：', err);
								});
							});
						}, (err) => {
							console.log('获取文件失败', err);
						});
					});
				});
			},
			fail: (err) => {
				console.log('保存文件失败', err);
			}
		});
	}


	//小程序下载
	const wechatDownLoad = async () => {
		const requestUrl = `https://ai1foo.com/api/v1/ppt/down?id=` + taskId.value
		const userInfo = userStore.userInfo;
		const header = {
			'Access-Token': userInfo?.access_token,
			'App': userInfo?.appid,
			'Token': userInfo?.token,
			'Vt': userInfo?.vip || '0',
			'Uid': userInfo?.id,
			'App-Name': AppName,
		}
		// #ifdef APP
		// saveFile(res.tempFilePath)
		toCopyText(requestUrl, '复制成功，请粘贴到浏览器下载此ppt文件！')
		// #endif

		// #ifndef APP
		uni.downloadFile({
			url: `https://ai1foo.com/api/v1/ppt/down?id=` + taskId.value,
			// url: 'https://api.idocv.com/doc/download/obUYlcp?url=http%3a%2f%2fapi.idocv.com%2fdata%2fdoc%2ftest.pptx',
			header,
			success(res) {
				console.log(res, '---------------------')
				uni.openDocument({
					filePath: res.tempFilePath,
					fileType: 'pptx',
					showMenu: true,
					success(res) {
						console.log(res, "res")
					},
					fail(err) {
						console.log(err, "err")
					}
				})

			},
			fail(err) {
				console.log(err, "err")
			}
		})
		// #endif
	}
	//h5下载
	const h5Download = async () => {
		uni.showLoading({
			title: '正在下载...',
			icon: 'none'
		})
		try {
			const res = await $api.get('api/v1/ppt/down?id=' + taskId.value, null, {
				'Content-Type': 'application/x-www-form-urlencoded'
			})
			console.log(res, 'APP')
			// #ifdef APP
			const filePath = uni.env.USER_DATA_PATH + '/PDF文件下载_' + new Date().getTime() + '.pptx';
			console.log(filePath, 'filePath')
			uni.downloadFile({
				url: 'data:application/octet-stream;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(res.data))),
				filePath: filePath,
				success: (res1) => {
					if (res1.statusCode === 200) {
						// 下载成功后，可以选择打开文件
						uni.openDocument({
							filePath: res1.filePath,
							success: function (openRes) {
								console.log('打开文件成功', openRes);
							},
							fail: function (err) {
								console.log('打开文件失败', err);
							}
						});
					}
				},
				fail: (err) => {
					console.log('下载文件失败', err);
				}
			});
			// #endif


			// #ifndef APP
			const bl = new Blob([res], {
				type: "application/octet-stream;charset=utf-8",
			});
			const url = window.URL.createObjectURL(bl);
			const a = document.createElement("a");
			a.href = url;
			a.download = "PDF文件下载_" + new Date().getTime() + ".pptx";
			document.body.appendChild(a); // 添加到DOM中以触发下载
			a.click();
			a.remove(); // 然后从DOM中移除
			window.URL.revokeObjectURL(url);
			uni.hideLoading()
			// #endif

		} catch (err) {
			uni.hideLoading()
		}
	}
	//下载ppt·
	const onDwonLoad = async () => {
		// #ifdef MP-WEIXIN  || APP
		wechatDownLoad()
		// #endif
		// #ifdef H5 
		h5Download()
		// #endif
	}
	const convertHttpToHttps = (url : string) => {
		return url.replace(/http:\/\/(.*?)\/?/gi, 'https://$1/');
	}
	//预览ppt
	const onPreview = async () => {
		const res = await $api.post('api/v1/ppt/createNewPPT', createForm.value)
		console.log(res, "res.data")


		if (res.data) {
			const url = convertHttpToHttps(res.data.url)
			uni.navigateTo({
				url: '/pages/function/subPage/webview/index?url=' + url
			})
		}
	}
	//下一个步骤
	const onNextStep = async (val ?: any) => {
		switch (currentStep.value) {
			case stepEnum.STEP_TEMPLATE:
				currentStep.value++
				break;
			case stepEnum.CREATE_CONTENT:
				createForm.value.content = val.content
				createForm.value.type = val.type
				currentStep.value++
				break;
			case stepEnum.UPDATE_CONTENT:
				currentStep.value++
				break;
			case stepEnum.SELECT_THEME:
				createForm.value.id = val
				const res = await createPpt()
				taskId.value = res
				currentStep.value++
				break;
			case stepEnum.PREVIEW_RESULT:
				break;
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		padding: 28rpx;
	}

	.btn {
		padding: 28rpx;
	}
</style>