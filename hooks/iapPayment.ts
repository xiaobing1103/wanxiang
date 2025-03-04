// iapPayment.js - iOS内购支付管理模块
import {
	computed,
	ref
} from 'vue';
import {
	useScreenStore,
	useUserStore
} from '../store';
import { useGlobalProperties } from './useGlobalHooks';

export interface transactionType {
	payment : any,
	transactionReceipt : any,
	transactionState : any,
	transactionIdentifier,
	productId : number
}
// 创建支付管理模块
export function useIAPPayment() {
	const iapChannel = ref(null); // 保存应用内支付对象
	const UserStore = useUserStore()
	const ScreenStore = useScreenStore()
	const { $api } = useGlobalProperties()
	// 把对应的apple 商品id 和 对应后端表id 进行映射
	const bianjieVipId = ScreenStore.IsRise ? {
		58: 'com.yfoo.ai.chat2_Rise58',
		52: 'com.yfoo.ai.chat2_Rise52',
		120: 'com.yfoo.ai.chat2_Rise120',
		152: 'com.yfoo.ai.chat2_Rise152',
		53: 'com.yfoo.ai.chat2_Rise53',
		78: 'com.yfoo.ai.chat2_Rise78',
		79: 'com.yfoo.ai.chat2_Rise79'
	} : {
		58: 'com.yfoo.ai.chat2_Num58',
		52: 'com.yfoo.ai.chat2_Num52',
		120: 'com.yfoo.ai.chat2_Num120',
		152: 'com.yfoo.ai.chat2_Num152',
		53: 'com.yfoo.ai.chat2_Num53',
		78: 'com.yfoo.ai.chat2_Num78',
		79: 'com.yfoo.ai.chat2_Num79'
	}


	// 初始化支付通道
	const initIAPChannel = async () => {
		uni.showLoading({
			title: '获取iap通道中...',
			mask: false
		});
		return new Promise((resolve, reject) => {

			plus.payment.getChannels(channels => {
				for (let i in channels) {
					if (channels[i].id === 'appleiap') {
						iapChannel.value = channels[i];
						console.log('获取IAP支付通道成功');
						uni.hideLoading()
						resolve(iapChannel.value);
						return;
					}
				}
				const error = new Error('未找到IAP支付通道');
				uni.hideLoading()
				reject(error);
			}, err => {
				uni.hideLoading()
				console.error('获取支付通道失败：' + JSON.stringify(err));
				reject(err);
			});
		});
	};

	// 获取商品信息
	const getProducts = (productIds : string[]) => {
		console.log(productIds)
		return new Promise((resolve, reject) => {
			try {
				if (!iapChannel.value) {
					const err = new Error('IAP支付通道未初始化');
					reject(err);
					return;
				}
				uni.showLoading({
					title: "获取appstore商品信息中..."
				})
				iapChannel.value.requestOrder(productIds, products => {
					uni.hideLoading()
					resolve(products);
				}, err => {
					uni.hideLoading()
					reject(err);
				});
			} catch (err) {
				uni.hideLoading()
				reject(err);
			}
		});
	};
	// 关闭订单
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
	const requestPayment = (productId : string, orderId : string) : Promise<any> => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				reject(err);
				return;
			}
			uni.showLoading({
				title: '拉起苹果支付中...'
			})
			const orderInfo = {
				productid: productId,
				username: UserStore.userInfo.nick || '',
				manualFinishTransaction: true,
				userId: UserStore.userInfo.id,
				appId: UserStore.userInfo.appid,
				vipLevel: UserStore.userInfo.vip,
				userToken: UserStore.userInfo.token,
				timestamp: Date.now(),
				orderId
			};

			plus.payment.request(iapChannel.value, orderInfo, result => {
				// 将用户信息添加到结果中，以便后续处理
				const enrichedResult = {
					...result,
					userId: UserStore.userInfo.id,
					appId: UserStore.userInfo.appid,
					vipLevel: UserStore.userInfo.vip,
					userNick: UserStore.userInfo.nick,
					userToken: UserStore.userInfo.token,
					orderId
				};
				console.log('支付成功：' + JSON.stringify(enrichedResult));
				uni.hideLoading()
				resolve(enrichedResult);
			}, err => {
				if (err.code == 2) {
					uni.$u.toast('支付失败：' + '用户取消支付!');
					return
				}
				uni.$u.toast('支付失败：' + err.message);
				uni.hideLoading()
				reject(err);
			});
		});
	};


	// 改进恢复购买逻辑
	function restoreIAPPurchases(AppleOrderId ?: string) {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				reject(err);
				return;
			}
			uni.showLoading({
				title: '正在查询是否有恢复的订单...'
			})
			iapChannel.value.restoreCompletedTransactions({
				manualFinishTransaction: true, // 手动关闭订单
				username: ''
			}, (results) => {
				results.map(async (items) => {
					if (items.transactionState !== '1') {
						finishTransaction(items)
					}
					//如果状态为已完成的状态
					if (items.transactionState == '1') {
						console.log("去恢复订单", items);
						const verifyResult = await verifyAndProcessReceipt(items, AppleOrderId)
						if (verifyResult) {

							createOrderTable(createOrderTable)
						}
					}
				})
				uni.hideLoading()
				uni.$u.toast('查询完成！');
			}, (err) => {
				uni.hideLoading()
				uni.$u.toast('恢复购买失败', err);
				reject(err);
			});
		});
	}

	// 创建或更新订单记录
	const createOrderTable = (result : any) => {
		// 获取当前订单记录
		const currentOrderHistory = UserStore.iosOrderHistory || [];
		// 查找是否存在相同订单号的记录
		const existingOrderIndex = currentOrderHistory.findIndex(
			order => order.transactionIdentifier === result.transactionIdentifier ||
				order.order_no === result.order_no
		);
		if (existingOrderIndex !== -1) {
			// 如果找到相同订单号，更新该记录
			currentOrderHistory[existingOrderIndex] = {
				...currentOrderHistory[existingOrderIndex],
				...result
			};
			// 更新store中的订单历史
			UserStore.setIosOrderHistory([...currentOrderHistory]);
		} else {
			// 如果没有找到相同订单号，添加新记录
			UserStore.setIosOrderHistory([...currentOrderHistory, result]);
		}
	}


	// 关闭订单
	const finishTransaction = (transaction) => {
		return new Promise((resolve, reject) => {
			if (!iapChannel.value) {
				const err = new Error('IAP支付通道未初始化');
				reject(err);
				return;
			}

			iapChannel.value.finishTransaction(transaction, success => {
				console.log('关闭订单成功');
				resolve(success);
			}, fail => {
				console.error('关闭订单失败：' + JSON.stringify(fail));
				reject(fail);
			});
		});
	};
	function getStateDescription(state) {
		const descriptions = {
			'0': '正在购买',
			'1': '已购买',
			'2': '失败',
			'3': '已恢复',
			'4': '延期/待定'
		};
		return descriptions[state] || '未知状态';
	}
	const verifyAndProcessReceipt = async (transaction : transactionType, AppleOrderId : string) : Promise<any> => {
		try {
			console.log('开始验证收据:', transaction);
			// 检查交易状态 - 添加状态'4'的检查
			// 检查交易状态
			const validStates = ['1', '3']; // 仅将购买成功和恢复购买视为有效状态
			if (!validStates.includes(transaction.transactionState)) {
				console.log(`非有效交易状态: ${transaction.transactionState}，状态描述: ${getStateDescription(transaction.transactionState)}`);
				// 对于状态'4'(延期)，可能需要特殊处理
				if (transaction.transactionState === '4') {
					console.log('交易处于延期状态，可能需要家长批准或其他操作');
				}
				// 关闭无效交易
				await finishTransaction(transaction);
				return false;
			}

			const requestData = {
				transactionReceipt: transaction.transactionReceipt,
				transactionState: transaction.transactionState,
				transactionIdentifier: transaction.transactionIdentifier,
				product_id: transaction.productId,
				user_id: UserStore.userInfo.id,
				app_id: UserStore.userInfo.appid,
				vip_level: UserStore.userInfo.vip,
				user_nike: UserStore.userInfo.nick,
				user_token: UserStore.userInfo.token,
				order_no: AppleOrderId
			}

			const verifyResult = await $api.post('https://api.ai1foo.com/api/v1/pay/apple.verify', requestData);
			console.log('验证收据结果:', verifyResult);
			if (verifyResult.code === 200) {
				// 无论验证成功与否，都关闭交易
				await finishTransaction(transaction);
				return requestData;
			} else {
				uni.$u.toast('验证失败:', verifyResult.msg);
				return false;
			}
		} catch (apiError) {
			console.error('API调用失败:', apiError);
			await finishTransaction(transaction);
			return false;
		}

	};

	return {
		iapChannel,
		initIAPChannel,
		getProducts,
		requestPayment,
		restoreIAPPurchases,
		finishTransaction,
		getUnfinishedTransactions,
		bianjieVipId,
		verifyAndProcessReceipt,
		createOrderTable
	};
}