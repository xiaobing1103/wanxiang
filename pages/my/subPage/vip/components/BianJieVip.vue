<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'linear-gradient(to bottom, rgb(250,234,210), rgb(235, 214, 186))', padding: '0' }">
		<view class="header">
			<view class="header_weixin-header" :style="{marginTop:ScreenStore.navBarHeight + 'px'}">
				<up-icon @click="backview" name="arrow-left" size="20"></up-icon>
				<view class="header_btngrp">
					<view class="buchajia" @click="buChaJiaModal = true">
						<image class="buchajia_image"
							src="http://file.1foo.com/2024/03/12/1a8bd8642a2892e02a4d822cd5c33116.png" mode="">
						</image> 补差价升级
					</view>
					<view class="buchajia" @click="jiHuoMaModal = true">
						<image class="buchajia_image"
							src="http://file.1foo.com/2024/03/12/014e42e0370a6eaeaba022e69f368d6d.png" mode="">
						</image>使用激活码激活
					</view>
				</view>

			</view>
		</view>
		<view class="backGroundImages">
			<image class="backGroundImages_images"
				src="http://file.1foo.com/2024/09/18/a1f9093bbc81ef51347a0e41038e9913.png" mode=""></image>
		</view>
		<view class="imagesBox">
			<view class="imagesBox_avatar">
				<up-avatar class="imagesBox_avatar_images" :src="UserStore.userInfo?.avatar" :size="40"></up-avatar>
				<view class="imagesBox_rightBox">
					<view class="imagesBox_avatar_topText">
						{{UserStore.userInfo?.nick}}
					</view>
					<view class="imagesBox_avatar_bottomText">
						<image class="imagesBox_avatar_bottomText_img"
							:style="{display:UserStore.userInfo?.vip == 0 ? 'none' : 'block'}" :src="$assets.vipIcon"
							mode=""></image>
						<text>{{UserStore.userInfo?.vipType}}</text>
					</view>
				</view>

			</view>
		</view>

		<view class="vipTptySeleted">
			<view @click="changeItems(0,58)" :class="{
			'vipTptySeleted_items': true,
			 'activeVipItems': activeItems === 0}">
				热门推荐
			</view>
			<view @click="changeItems(1,78)" :class="{
			'vipTptySeleted_items': true,  
			'activeVipItems1': activeItems === 1}">
				办公会员
			</view>
		</view>

		<template v-if="activeItems == 0">
			<HotVips @changeVipId="changeVipId" :vipDatas="HotVipDatas" />
		</template>
		<template v-if="activeItems == 1">
			<OfficeWorkVips @changeVipId="changeVipId" :vipDatas="OfficeWorkVipDatas" />
		</template>
		<MiddleVipView />
		<!-- #ifndef APP -->
		<PayItemView :payMode='payMode' :seletedVipIds="seletedVipIds" />
		<!-- #endif -->


		<!-- #ifdef APP -->
		<view class="container">
			<view class="header">
				<text class="title">会员中心</text>
			</view>

			<!-- 添加日志显示开关 -->
			<view class="log-toggle">
				<button size="mini" @click="showLogs = !showLogs">
					{{ showLogs ? '隐藏日志' : '显示日志' }}
				</button>
			</view>

			<!-- 日志显示区域 -->
			<view v-if="showLogs" class="logs-container">
				<view class="logs-header">
					<text class="logs-title">控制台日志</text>
					<view class="logs-actions">
						<button size="mini" @click="copyLogs">复制</button>
						<button size="mini" @click="clearLogs">清除</button>
					</view>
				</view>
				<scroll-view scroll-y class="logs-content">
					<view v-for="(log, index) in consoleLogs" :key="index" class="log-item" :class="log.type">
						<text class="log-time">{{log.time}}</text>
						<text class="log-content">{{log.content}}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 原有的商品列表 -->
			<view class="products-list" v-if="products.length > 0">
				<view v-for="(product, index) in products" :key="index" class="product-item">
					<view class="product-info">
						<text class="product-title">{{ product.title }}</text>
						<text class="product-description">{{ product.description }}</text>
						<text class="product-price">{{ product.price }}</text>
					</view>
					<button class="buy-btn" @click="purchaseProduct(product.productid)">购买</button>
				</view>
			</view>
			<view v-else class="loading-products">
				<text>正在加载会员商品...</text>
			</view>

			<view class="action-buttons">
				<button class="restore-btn" @click="restorePurchases">恢复购买</button>
			</view>

			<view v-if="loading" class="loading-overlay">
				<view class="loading-content">
					<text>处理中...</text>
				</view>
			</view>

			<view v-if="error" class="error-message">
				<text>{{ typeof error === 'string' ? error : (error.message || JSON.stringify(error)) }}</text>
				<button size="mini" @click="error = null">关闭</button>
			</view>
		</view>
		<!-- #endif -->
		<VipNumberSteps :seletedVipIds="seletedVipIds" v-model:buChaJiaModal="buChaJiaModal" />

		<up-modal :show="buChaJiaModal" :showConfirmButton='false'>
			<view class="buChaJiaModal">
				<view class="buChaJiaModal_header">
					联系客服
				</view>
				<view class="buChaJiaModal_main">
					<view class="buChaJiaModal_main_topText">
						使用微信扫一扫，联系您的专属客服
					</view>
					<view class="buChaJiaModal_main_middleText">
						<image class="buChaJiaModal_main_middleText_image"
							src="//file.1foo.com/2023/10/28/bab81d65016a5d265a1a01a2b898371b.png" mode=""></image>
					</view>
					<view class="buChaJiaModal_main_bottomText">
						客服邮箱:202829657@qq.com
					</view>
					<view class="buChaJiaModal_main_bottomText">
						工作日9:00-12:00 14:00-18:00 20:00-22:30
					</view>

					<view class="buChaJiaModal_main_bottomText">
						休息时间不定时处理消息
					</view>
				</view>
				<view class="buChaJiaModal_footer">
					<view class="buChaJiaModal_footer_button1" @click="buChaJiaModal = false">
						取消
					</view>
					<view class="buChaJiaModal_footer_button2" @click="toCopyText('wuww9879')">
						复制微信号
					</view>
				</view>
			</view>
		</up-modal>
		<up-modal :customClass="'buChaJiaModal'" :show="jiHuoMaModal" showCancelButton @confirm="jihuoCode"
			@cancel="jiHuoMaModal=false">
			<view class="buChaJiaModal">
				<view class="buChaJiaModal_header">
					激活码激活
				</view>
				<view class="buChaJiaModal_main">
					<up-input fontSize="11" :customStyle="{width:'100%',padding:'0'}" class="buChaJiaModal_main_input"
						placeholder="请输入激活码" v-model="code"></up-input>
				</view>

			</view>
		</up-modal>
	</z-paging>
</template>

<script setup lang="ts">
	import { computed, onActivated, onMounted, onUnmounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { toCopyText } from '@/utils';
	import { useCounterStore, useScreenStore, useUserStore } from '@/store';
	import HotVips from './HotVips.vue';
	import OfficeWorkVips from './OfficeWorkVips.vue';
	import VipNumberSteps from './VipNumberSteps.vue';
	import PayItemView from './PayItemView.vue';
	import MiddleVipView from './MiddleVipView.vue';
	import { storeToRefs } from "pinia"
	import { vipTypes, vipDatasType, payModeType } from "../data"
	import { useIAPPayment } from '@/hooks/iapPayment';
	const ScreenStore = useScreenStore()
	const activeItems = ref(0)
	const UserStore = useUserStore()
	const { $assets, $api } = useGlobalProperties();
	const HotVipDatas = computed(() => {
		return vipDatas.value.slice(0, 5)
	})

	const buChaJiaModal = ref(false)
	const jiHuoMaModal = ref(false)
	const code = ref('')
	const seletedVipIds = ref(200)
	const changeVipId = (index : number) => {
		seletedVipIds.value = index
	}
	const refreshInfo = async () => {
		const users = await $api.get('api/v1/user/info')
		if (users.code == 200) {
			UserStore.userInfo = users.data;
			uni.$u.toast('支付成功！');
		}
	}
	const jihuoCode = async () => {
		const codeRes = await $api.post('api/v1/vip/cardActive', { card: code.value })
		if (codeRes.code == 200) {
			uni.$u.toast('激活码激活会员成功！');
			jiHuoMaModal.value = false
			refreshInfo()
		} else {
			uni.$u.toast(codeRes.msg);
		}
	}

	const OfficeWorkVipDatas = computed(() => {
		return vipDatas.value.slice(5, 7)
	})

	const changeItems = (index : number, vipIds : number) => {
		activeItems.value = index
		seletedVipIds.value = vipIds
	}
	// #ifdef APP

	const {
		loading,
		isInitialized,
		initIAPChannel,
		getProducts,
		requestPayment,
		restoreIAPPurchases,
		finishTransaction,
		// verifyReceipt,
		getUnfinishedTransactions,
		removeFromOrderQueue,
		addToOrderQueue
	} = useIAPPayment();

	// 状态
	const products = ref([]);
	const error = ref(null);
	const processedTransactions = ref([]);
	// 添加日志相关状态
	const consoleLogs = ref([]);
	const showLogs = ref(false);
	const maxLogs = 100; // 最多显示的日志数量

	// 添加日志的函数
	const addLog = (type, ...args) => {
		const now = new Date();
		const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

		let content = '';
		try {
			content = args.map(arg => {
				if (typeof arg === 'object') {
					return JSON.stringify(arg, null, 2);
				}
				return String(arg);
			}).join(' ');
		} catch (e) {
			content = String(args);
		}

		consoleLogs.value.unshift({
			time: timeString,
			type: type,
			content: content
		});

		// 限制日志数量
		if (consoleLogs.value.length > maxLogs) {
			consoleLogs.value = consoleLogs.value.slice(0, maxLogs);
		}
	};

	// 复制日志
	const copyLogs = () => {
		const logText = consoleLogs.value
			.map(log => `[${log.time}][${log.type}] ${log.content}`)
			.join('\n\n');

		uni.setClipboardData({
			data: logText,
			success: () => {
				uni.showToast({
					title: '已复制到剪贴板',
					icon: 'success'
				});
			}
		});
	};

	// 清除日志
	const clearLogs = () => {
		consoleLogs.value = [];
	};

	// 重写console方法来捕获日志
	const originalConsoleLog = console.log;
	const originalConsoleError = console.error;
	const originalConsoleWarn = console.warn;
	const originalConsoleInfo = console.info;

	console.log = function (...args) {
		originalConsoleLog.apply(console, args);
		addLog('log', ...args);
	};

	console.error = function (...args) {
		originalConsoleError.apply(console, args);
		addLog('error', ...args);
	};

	console.warn = function (...args) {
		originalConsoleWarn.apply(console, args);
		addLog('warn', ...args);
	};

	console.info = function (...args) {
		originalConsoleInfo.apply(console, args);
		addLog('info', ...args);
	};

	// 初始化支付
	const initPayment = async () => {
		try {
			loading.value = true;
			error.value = null;
			console.log('开始初始化支付通道');
			// 初始化支付通道
			await initIAPChannel();
			console.log('支付通道初始化成功');
			// 获取商品信息
			console.log('开始获取商品信息');
			const productIds = ['52', '53', '58', '120', '152'];
			const productsList = await getProducts(productIds);
			console.log('获取商品信息成功', productsList);

			// 处理商品信息，确保显示正确
			products.value = productsList.map(product => {
				return {
					...product,
					title: product.title,
					description: product.description
				};
			});
			console.log('商品列表加载成功:', products.value);
			// 检查未完成的交易 - 在初始化后立即检查
			await checkLostOrders();
		} catch (err) {
			// ... existing code ...
		}
	};

	// 购买商品
	const purchaseProduct = async (productId) => {
		// 生成唯一订单ID
		const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
		try {
			loading.value = true;
			error.value = null;
			console.log('开始购买商品:', productId, '订单ID:', orderId);
			// 添加到订单队列
			addToOrderQueue(productId, orderId);

			// 发起支付
			const result = await requestPayment(productId, orderId, UserStore.userInfo?.nick || 'guest');
			console.log('支付结果:', result);
			// 验证收据
			if (result) {
				const verifyResult = await verifyAndProcessReceipt(result);
				if (verifyResult) {
					console.log('验证收据成功，订单完成:', orderId);
					// 从队列中移除
					removeFromOrderQueue(productId, orderId);
					// 刷新用户信息
					await refreshInfo();
					return true;
				} else {
					console.warn('验证收据失败，可能需要后续处理');
					// 标记为需要检查的订单
					const pendingOrders = uni.getStorageSync('pending_verify_orders') || [];
					pendingOrders.push({
						orderId,
						productId,
						transactionId: result.transactionIdentifier,
						timestamp: Date.now()
					});
					uni.setStorageSync('pending_verify_orders', pendingOrders);
					return false;
				}

			}
		} catch (err) {
			error.value = err;
			console.error('购买过程出错:', err);
			// 用户取消不显示错误提示
			if (err.code === 2 || (err.message && err.message.includes('cancel'))) {
				console.log('用户取消购买');
				// 从队列中移除
				removeFromOrderQueue(productId, orderId);
			} else if (err.message && err.message.includes('timeout')) {
				console.log('支付请求超时，将在下次启动时检查');
				// 保留在队列中，等待后续检查
			} else {
				uni.showToast({
					title: '购买失败: ' + (err.message || '未知错误'),
					icon: 'none'
				});
				// 从队列中移除
				removeFromOrderQueue(productId, orderId);
			}
			return false;
		} finally {
			loading.value = false;
		}
	};

	// 恢复购买
	const restorePurchases = async () => {
		try {
			loading.value = true;
			error.value = null;
			console.log('开始恢复购买');
			const results = await restoreIAPPurchases();
			console.log('恢复购买结果:', results);
			if (results && results.length > 0) {
				// 处理恢复的购买
				for (let i = 0; i < results.length; i++) {
					await verifyAndProcessReceipt(results[i]);
				}
				uni.showToast({
					title: '恢复购买成功',
					icon: 'success'
				});
				// 刷新用户信息
				// await refreshInfo();
			} else {
				uni.showToast({
					title: '没有可恢复的购买',
					icon: 'none'
				});
			}
		} catch (err) {
			error.value = err;
			console.error('恢复购买失败:', err);
			uni.showToast({
				title: '恢复购买失败: ' + (err.message || '未知错误'),
				icon: 'none'
			});
		} finally {
			loading.value = false;
		}
	};

	const verifyAndProcessReceipt = async (transaction) => {
		try {
			console.log('开始验证收据:', transaction);

			// 检查交易状态 - 添加状态'4'的检查
			if (transaction.transactionState !== '1' && transaction.transactionState !== '3' && transaction.transactionState !== '4') {
				console.log('非有效交易状态:', transaction.transactionState);
				// 对所有无效状态都关闭交易
				await finishTransaction(transaction);
				return false;
			}
			const transactionId = transaction.transactionIdentifier;
			const processedTransactions = uni.getStorageSync('processedTransactions') || [];

			// 检查是否已处理
			if (processedTransactions.includes(transactionId)) {
				console.log('收据已验证过，跳过重复验证:', transactionId);
				// 已处理的交易也需要关闭
				await finishTransaction(transaction);
				return false;
			}

			try {
				// 验证收据
				const verifyResult = await $api.post('https://api.ai1foo.com/api/v1/pay/ios.verify.receipt', {
					receipt: transaction.transactionReceipt,
					transaction_id: transaction.transactionIdentifier,
					product_id: transaction.productId,
					user_id: UserStore.userInfo.id,
					app_id: UserStore.userInfo.appid,
					vip_level: UserStore.userInfo.vip,
					user_nike: UserStore.userInfo.nick,
					user_token: UserStore.userInfo.token
				});
				console.log('验证收据结果:', verifyResult);
				// 无论验证结果如何，都记录这个交易已被处理
				processedTransactions.push(transactionId);
				uni.setStorageSync('processedTransactions', processedTransactions);
				// 无论验证成功与否，都关闭交易
				await finishTransaction(transaction);
				if (verifyResult.code === 200) {
					return true;
				} else {
					console.error('验证失败:', verifyResult.msg);
					return false;
				}
			} catch (apiError) {
				// API调用失败，也关闭交易并记录为已处理
				console.error('API调用失败:', apiError);
				await finishTransaction(transaction);

				// 记录为已处理，防止重复验证
				processedTransactions.push(transactionId);
				uni.setStorageSync('processedTransactions', processedTransactions);

				return false;
			}
		} catch (err) {
			// 确保任何情况下都关闭交易
			try {
				await finishTransaction(transaction);
			} catch (finishErr) {
				console.error('关闭交易失败:', finishErr);
			}

			console.error('验证收据过程中发生错误:', err);
			throw err;
		}
	};
	// 检测丢单
	const checkLostOrders = async () => {
		try {
			console.log('检查是否有未完成的订单');
			// 获取未完成的订单
			const unfinishedTransactions = await getUnfinishedTransactions();
			if (unfinishedTransactions && unfinishedTransactions.length > 0) {
				console.log('检测到未完成的订单，数量:', unfinishedTransactions.length);
				// 处理每个未完成的订单
				for (const transaction of unfinishedTransactions) {
					console.log('处理未完成订单:', transaction);
					// 检查交易状态
					if (transaction.transactionState === '1') { // 购买成功
						console.log('订单状态为购买成功，验证收据');
						// 查找关联的订单号
						const receiptMap = uni.getStorageSync('receipt_to_order_map') || {};
						const orderId = receiptMap[transaction.transactionReceipt];
						if (orderId) {
							console.log('找到关联的订单号:', orderId);
							try {
								// 验证收据
								const verifyResult = await verifyAndProcessReceipt(transaction);
								console.log('验证收据结果:', verifyResult);
								if (verifyResult) {
									// 验证成功，关闭订单
									await finishTransaction(transaction);
									console.log('订单关闭成功');
									// 从队列中移除
									const productId = transaction.productId;
									removeFromOrderQueue(productId, orderId);
									// 从映射中移除
									delete receiptMap[transaction.transactionReceipt];
									uni.setStorageSync('receipt_to_order_map', receiptMap);
								}
							} catch (err) {
								console.error('验证收据或关闭订单失败:', err);
							}
						} else {
							console.log('未找到关联的订单号，尝试直接验证');
							try {
								await verifyAndProcessReceipt(transaction);
							} catch (err) {
								console.error('处理未关联订单失败:', err);
							}
						}
					} else if (transaction.transactionState === '2') { // 已取消
						console.log('订单状态为已取消，直接关闭');
						await finishTransaction(transaction);
					} else if (transaction.transactionState === '3' || transaction.transactionState === '4') { // 已恢复
						console.log('订单状态为已恢复，验证收据');
						await verifyAndProcessReceipt(transaction);
					} else {
						console.log('未知订单状态:', transaction.transactionState, '直接关闭');
						await finishTransaction(transaction);
					}
				}
				// 刷新用户信息
				// await refreshInfo();
			} else {
				console.log('没有检测到未完成的订单');
			}
		} catch (err) {
			console.error('检测丢单失败:', err);
		}
	};
	// #endif

	// 组件卸载时恢复原始console方法
	onUnmounted(() => {
		// #ifdef APP-PLUS
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
		console.warn = originalConsoleWarn;
		console.info = originalConsoleInfo;
		document.removeEventListener('plusready', initPayment);
		// #endif
	});
	const backview = () => {
		uni.navigateBack()
	}
	const vipDatas = ref<vipDatasType[] | []>([])
	const payMode = ref<payModeType[] | []>([])
	// 页面激活时检测丢单
	onActivated(() => {
		// #ifdef APP
		checkLostOrders();
		// #endif
	});
	onMounted(() => {
		// #ifdef APP-PLUS
		const savedTransactions = uni.getStorageSync('processedTransactions') || [];
		processedTransactions.value = savedTransactions;
		// 检查是否有未完成的事务
		// 修改这里的初始化逻辑
		if (typeof plus !== 'undefined') {
			// plus 已经准备好
			initPayment();
		} else {
			// 等待 plusready 事件
			document.addEventListener('plusready', initPayment);
		}
		// #endif

		// 获取会员数据的代码保持不变
		$api.get('api/v1/vip/getShops').then(vipRes => {
			if (vipRes.code == 200) {
				payMode.value = vipRes.payMode as payModeType[]
				vipDatas.value = vipRes.shops as vipDatasType[]
				changeItems(0, 58)
			} else {
				uni.$u.toast(vipRes.msg);
			}
		});
	})
</script>

<style scoped lang="scss">
	.header {
		width: 100%;
		height: 40rpx;
		margin: 20rpx 0;
		padding: 0 30rpx;

		&_weixin-header {
			display: flex;
			justify-content: flex-start;

		}

		&_btngrp {
			display: flex;
			z-index: 2;

		}
	}

	.vipBox {
		&_header {
			display: flex;
			flex-direction: column;
			padding: 25rpx 0;

			&_top {
				font-weight: 700;

			}

			&_bottom {
				font-size: 25rpx;
				padding: 20rpx 0;
			}
		}
	}

	.backGroundImages {
		position: absolute;
		top: -100rpx;
		right: -200rpx;

		&_images {
			width: 500rpx;
			height: 400rpx;

		}
	}

	.buchajia {
		background-color: #FFF9F0;
		border-radius: 10rpx;
		padding: 10rpx;
		font-size: 25rpx;
		color: $aichat-golbal-vipText;
		margin-left: 20rpx;
		display: flex;
		align-items: center;

		&_image {
			width: 30rpx;
			margin-right: 10rpx;
			height: 26rpx;
		}
	}

	.imagesBox {
		padding: 25rpx 30rpx;

		&_rightBox {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
		}

		&_avatar {
			display: flex;

			&_topText {
				display: flex;
				color: $aichat-golbal-vipText;
				align-items: center;
				font-size: 27rpx;
				font-weight: 700;

				&_imgs {
					width: 35rpx;
					height: 35rpx;
					margin-right: 10rpx;
				}
			}

			&_bottomText {
				color: $aichat-golbal-vipText;
				display: flex;
				align-items: center;
				font-size: 27rpx;

				&_img {
					width: 30rpx;
					height: 40rpx;
					margin-right: 13rpx;
				}
			}

			&_images {

				// border: 4rpx solid #FFF9F0;
			}
		}
	}

	.vipTptySeleted {
		width: 100%;
		display: flex;
		z-index: 2;
		position: relative;
		background: url('http://file.1foo.com/2024/09/19/a408ac7528e5bf182ac45b896b5846c4.png');
		background-size: cover;

		&_items {
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			width: 50%;
			background-size: cover;
			font-size: 27rpx;

		}

	}

	.activeVipItems {
		background: url('http://file.1foo.com/2024/09/19/993d94ed834b1b86df933e5a47d0e50f.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.activeVipItems1 {
		background: url('http://file.1foo.com/2024/09/19/d811c39a85ef80ef8e730616ff85ecdc.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.noActiveVipItems {}


	.buChaJiaModal {
		font-size: 27rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&_header {
			font-weight: 800;
			width: 100%;
			font-size: 30rpx;
		}

		&_main {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1rpx solid #ccc;
			border-radius: 10rpx;
			padding: 6rpx 9rpx;
			margin: 20rpx 0;

			&_input {}

			&_topText {
				padding: 20rpx 0;
			}

			&_middleText {

				&_image {
					width: 500rpx;
					height: 500rpx;
				}

			}

			&_bottomText {
				display: flex;
				width: 100%;
				font-size: 24rpx;
				padding: 5rpx 0;
				color: $uni-color-primary;
				flex-direction: column;
				justify-content: flex-start;
			}
		}

		&_footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 25rpx;

			&_button1 {
				padding: 15rpx 20rpx;
				background-color: #ccc;
				border-radius: 15rpx;
				margin-right: 15rpx;
				color: #FFF9F0;
			}

			&_button2 {
				padding: 15rpx 20rpx;
				background-color: $uni-color-primary;
				border-radius: 15rpx;
				color: #FFF9F0;
			}
		}
	}










	/* #ifdef APP */
	.container {
		padding: 20px;
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.header {
		margin-bottom: 20px;
		text-align: center;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
	}

	.products-list {
		margin-bottom: 20px;
	}

	.product-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-radius: 10px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.product-info {
		flex: 1;
	}

	.product-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		margin-bottom: 5px;
		display: block;
	}

	.product-description {
		font-size: 14px;
		color: #666;
		margin-bottom: 5px;
		display: block;
	}

	.product-price {
		font-size: 16px;
		color: #f56c6c;
		font-weight: bold;
		display: block;
	}

	.buy-btn {
		background-color: #409eff;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 0 15px;
		height: 36px;
		line-height: 36px;
		margin-left: 15px;
	}

	.action-buttons {
		margin-top: 20px;
	}

	.restore-btn {
		background-color: #67c23a;
		color: #fff;
		border: none;
		border-radius: 5px;
		width: 100%;
		height: 40px;
		line-height: 40px;
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.loading-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		text-align: center;
	}

	.error-message {
		background-color: #fef0f0;
		padding: 15px;
		border-radius: 10px;
		margin-top: 20px;
		color: #f56c6c;
		text-align: center;
	}

	.loading-products {
		text-align: center;
		padding: 30px 0;
		color: #909399;
	}

	/* 添加日志显示相关样式 */
	.log-toggle {
		margin: 10px 0;
		text-align: right;
	}

	.logs-container {
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 8px;
		margin-bottom: 15px;
		padding: 10px;
		max-height: 300px;
	}

	.logs-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.logs-title {
		color: #fff;
		font-weight: bold;
	}

	.logs-actions {
		display: flex;
		gap: 5px;
	}

	.logs-content {
		height: 250px;
	}

	.log-item {
		padding: 5px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.log-time {
		color: #888;
		font-size: 12px;
		margin-right: 5px;
	}

	.log-content {
		color: #fff;
		font-size: 12px;
		font-family: monospace;
		white-space: pre-wrap;
		word-break: break-all;
	}

	.log-item.error .log-content {
		color: #ff6b6b;
	}

	.log-item.warn .log-content {
		color: #feca57;
	}

	.log-item.info .log-content {
		color: #54a0ff;
	}

	/* #endif */
</style>