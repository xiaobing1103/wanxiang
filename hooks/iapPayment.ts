// iapPayment.js - iOS内购支付管理模块
import {
	ref
} from 'vue';
import {
	useUserStore
} from '../store';

// 创建支付管理模块
export function useIAPPayment() {
	const iapChannel = ref(null); // 保存应用内支付对象
	const isInitialized = ref(false);
	const loading = ref(false);
	const error = ref(null);
	const UserStore = useUserStore()
	const orderQueue = ref({});
	// 初始化支付通道
	const initIAPChannel = async () => {
		// await checkSandboxEnvironment();
		return new Promise((resolve, reject) => {
			loading.value = true;
			error.value = null;
			loadOrderQueue();
			plus.payment.getChannels(channels => {
				for (let i in channels) {
					if (channels[i].id === 'appleiap') {
						iapChannel.value = channels[i];
						isInitialized.value = true;
						console.log('获取IAP支付通道成功');
						loading.value = false;
						resolve(iapChannel.value);
						return;
					}
				}
				error.value = new Error('未找到IAP支付通道');
				loading.value = false;
				reject(error.value);
			}, err => {
				console.error('获取支付通道失败：' + JSON.stringify(err));
				error.value = err;
				loading.value = false;
				reject(err);
			});
		});
	};

	// 获取商品信息
	const getProducts = (productIds) => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				error.value = err;
				reject(err);
				return;
			}
			loading.value = true;
			iapChannel.value.requestOrder(productIds, products => {
				console.log('获取商品信息成功：' + JSON.stringify(products));
				loading.value = false;
				resolve(products);
			}, err => {
				console.error('获取商品信息失败：' + JSON.stringify(err));
				error.value = err;
				loading.value = false;
				reject(err);
			});
		});
	};

	const getUnfinishedTransactions = () => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				console.error('IAP支付通道未初始化');
				resolve([]);
				return;
			}
			// 使用正确的API: restoreComplateRequest
			iapChannel.value.restoreComplateRequest({
				manualFinishTransaction: true  // 设置为true以便手动关闭交易
			}, (transactions) => {
				console.log('获取未完成订单:', transactions);
				if (transactions && transactions.length > 0) {
					resolve(transactions);
				} else {
					resolve([]);
				}
			}, (err) => {
				console.error('获取未完成订单失败:', err);
				reject(err);
			});
		});
	};

	// 发起支付
	const requestPayment = (productId, orderId, username = '') => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				error.value = err;
				reject(err);
				return;
			}
			loading.value = true;
			// 设置超时处理
			const timeoutId = setTimeout(() => {
				// 标记需要检查订单状态
				const timeoutOrders = uni.getStorageSync('timeout_orders') || [];
				timeoutOrders.push({
					orderId,
					productId,
					timestamp: Date.now()
				});
				uni.setStorageSync('timeout_orders', timeoutOrders);
				// 提示用户
				uni.showToast({
					title: '支付请求超时，稍后将自动检查',
					icon: 'none',
					duration: 3000
				});

				// 拒绝Promise
				reject(new Error('支付请求超时'));
			}, 30000); // 30秒超时

			const orderInfo = {
				productid: productId,
				username: username || UserStore.userInfo.nick || '',
				manualFinishTransaction: true,
				userId: UserStore.userInfo.id,
				appId: UserStore.userInfo.appid,
				vipLevel: UserStore.userInfo.vip,
				userToken: UserStore.userInfo.token,
				timestamp: Date.now()
			};
			plus.payment.request(iapChannel.value, orderInfo, result => {
				// 将用户信息添加到结果中，以便后续处理
				const enrichedResult = {
					...result,
					userId: UserStore.userInfo.id,
					appId: UserStore.userInfo.appid,
					vipLevel: UserStore.userInfo.vip,
					userNike: UserStore.userInfo.nick,
					userToken: UserStore.userInfo.token
				};
				// 清除超时
				clearTimeout(timeoutId);
				console.log('支付成功：' + JSON.stringify(enrichedResult));
				loading.value = false;
				resolve(enrichedResult);
			}, err => {
				// 清除超时
				clearTimeout(timeoutId);
				console.error('支付失败：' + JSON.stringify(err));
				error.value = err;
				loading.value = false;
				reject(err);
			});
		});
	};
	// 添加队列管理函数
	const addToOrderQueue = (productId : string, orderId : string) => {
		if (!orderQueue.value[productId]) {
			orderQueue.value[productId] = [];
		}
		// 避免重复添加
		if (!orderQueue.value[productId].includes(orderId)) {
			orderQueue.value[productId].push(orderId);
			// 持久化存储
			uni.setStorageSync('iap_order_queue', orderQueue.value);
		}
	};

	const removeFromOrderQueue = (productId, orderId) => {
		if (orderQueue.value[productId]) {
			const index = orderQueue.value[productId].indexOf(orderId);
			if (index > -1) {
				orderQueue.value[productId].splice(index, 1);
				// 持久化存储
				uni.setStorageSync('iap_order_queue', orderQueue.value);
			}
		}
	};

	// 初始化时加载队列
	const loadOrderQueue = () => {
		const savedQueue = uni.getStorageSync('iap_order_queue');
		if (savedQueue) {
			orderQueue.value = savedQueue;
		}
	};


	// 改进恢复购买逻辑
	function restoreIAPPurchases() {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				error.value = err;
				reject(err);
				return;
			}
			loading.value = true;
			console.log('开始恢复购买');
			iapChannel.value.restoreCompletedTransactions({
				manualFinishTransaction: true, // 手动关闭订单
				username: UserStore.userInfo?.nick || 'guest'
			}, (results) => {
				loading.value = false;
				console.log('恢复购买成功:', results);
				if (results && results.length > 0) {
					const validTransactions = results.filter(transaction =>
						transaction.transactionState === '1' ||
						transaction.transactionState === '3' ||
						transaction.transactionState === '4'
					);
					if (validTransactions.length > 0) {
						resolve(validTransactions);
					} else {
						console.log('没有找到有效的恢复交易');
						resolve([]);
					}
				} else {
					console.log('没有找到可恢复的购买');
					resolve([]);
				}
			}, (err) => {
				loading.value = false;
				console.error('恢复购买失败:', err);
				error.value = err;
				reject(err);
			});
		});
	}

	// 关闭订单
	const finishTransaction = (transaction) => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				error.value = err;
				reject(err);
				return;
			}

			iapChannel.value.finishTransaction(transaction, success => {
				console.log('关闭订单成功');
				resolve(success);
			}, fail => {
				console.error('关闭订单失败：' + JSON.stringify(fail));
				error.value = fail;
				reject(fail);
			});
		});
	};

	return {
		iapChannel,
		isInitialized,
		loading,
		error,
		initIAPChannel,
		getProducts,
		requestPayment,
		restoreIAPPurchases,
		finishTransaction,
		getUnfinishedTransactions,
		removeFromOrderQueue,
		addToOrderQueue
	};
}