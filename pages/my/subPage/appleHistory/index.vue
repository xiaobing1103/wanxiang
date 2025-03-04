<template>
	<z-paging :show-scrollbar="false" ref="srollRef" :pagingStyle="{ background: 'rgb(250,234,210)', padding: '0' }">
		<template #top>
			<CommonHeader noBackGround />
		</template>
		<view class="appleHistory">
			<!-- 横向滑动区域 -->
			<scroll-view scroll-x="true" class="table-scroll-view" show-scrollbar="false">
				<view class="table-container" :style="{ width: tableWidth + 'px' }">
					<!-- 表头 -->
					<view class="table-header">
						<view class="table-cell" v-for="(item, index) in tableCols" :key="index"
							:style="{ width: item.width + 'px' }">
							{{ item.title }}
						</view>
					</view>

					<!-- 表格内容 -->
					<view class="table-row" v-for="(row, rowIndex) in UserStore.iosOrderHistory" :key="rowIndex">
						<view class="table-cell" v-for="(col, colIndex) in tableCols" :key="colIndex"
							:style="{ width: col.width + 'px' }">
							<template v-if="col.key === 'transactionState'">
								<u-tag :text="getStatusText(row[col.key])"
									:type="row[col.key] == '1' ? 'success' : 'warning'" size="mini" />
							</template>
							<template v-else-if="col.key === 'action'">
								<u-button type="primary" size="mini" @click="handleRestoreOrder(row)"
									v-if="needRestore(row)">
									恢复订单
								</u-button>
								<text v-else>--</text>
							</template>
							<template v-else>
								<text class="cell-text"
									:class="{'text-ellipsis': col.ellipsis}">{{ row[col.key] }}</text>
							</template>
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 空数据提示 -->
			<u-empty v-if="!UserStore.iosOrderHistory || UserStore.iosOrderHistory.length === 0" mode="data"
				text="暂无订单数据" margin-top="60"></u-empty>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { useUserStore } from '@/store';
	import CommonHeader from '@/components/CommonHeader.vue'
	import { onMounted, ref, computed } from 'vue';
	import { useIAPPayment } from '@/hooks/iapPayment';

	const UserStore = useUserStore();
	const { restoreIAPPurchases, initIAPChannel } = useIAPPayment();

	// 表格列定义 - 添加action操作列
	const tableCols = [
		{ key: 'user_id', title: '用户ID', width: 100 },
		{ key: 'app_id', title: '应用ID', width: 100 },
		{ key: 'transactionIdentifier', title: '收据单号', width: 150, ellipsis: true },
		{ key: 'transactionState', title: '收据状态', width: 100 },
		{ key: 'vip_level', title: 'vipID', width: 80 },
		{ key: 'user_nike', title: '用户昵称', width: 120 },
		{ key: 'order_no', title: '订单ID', width: 150, ellipsis: true },
		{ key: 'action', title: '操作', width: 100 }  // 新增操作列
	];

	// 计算表格总宽度
	const tableWidth = computed(() => {
		return tableCols.reduce((total, col) => total + col.width, 0);
	});

	// 获取状态文本
	const getStatusText = (state) => {
		const statusMap = {
			'1': '支付成功',
			'3': '已恢复',
			'0': '未处理'
		};
		return statusMap[state] || '未知';
	};

	// 判断订单是否需要恢复功能
	const needRestore = (order) => {
		// 根据业务逻辑判断订单是否需要恢复
		// 例如：只有特定状态的订单需要恢复，或者有特定标记的订单需要恢复
		// 这里假设只有状态为"1"(支付成功)的订单可以恢复
		return order.transactionState === '1';
	};

	// 处理恢复订单
	const handleRestoreOrder = async (order) => {
		try {
			uni.showLoading({
				title: '准备恢复订单...'
			});

			// 确保IAP通道已初始化
			await initIAPChannel();

			// 只恢复指定的订单
			uni.showModal({
				title: '恢复订单',
				content: `确定恢复订单 ${order.order_no} 吗？,如果恢复订单有可能会覆盖当前的会员状态请知悉！`,
				success: async (res) => {
					if (res.confirm) {
						try {
							// 调用恢复订单API，传入要恢复的订单ID
							const result = await restoreIAPPurchases(order.order_no);
							if (result) {
								uni.showToast({
									title: '订单恢复成功',
									icon: 'success'
								});
							}
						} catch (error) {
							console.error('恢复订单失败:', error);
							uni.showToast({
								title: '恢复订单失败',
								icon: 'none'
							});
						} finally {
							uni.hideLoading();
						}
					} else {
						uni.hideLoading();
					}
				}
			});
		} catch (error) {
			console.error('初始化IAP通道失败:', error);
			uni.hideLoading();
			uni.showToast({
				title: '初始化支付通道失败',
				icon: 'none'
			});
		}
	};

	onMounted(async () => {
		console.log('UserStore', UserStore.iosOrderHistory);
		// 预先初始化IAP通道
		try {
			await initIAPChannel();
		} catch (error) {
			console.error('初始化IAP通道失败:', error);
		}
	});
</script>

<style lang="scss" scoped>
	.appleHistory {
		padding: 10px;

		.table-scroll-view {
			width: 100%;
			white-space: nowrap;
		}

		.table-container {
			display: inline-block;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		}

		.table-header {
			display: flex;
			background-color: #f8f8f8;
			border-bottom: 1px solid #eaeaea;
			border-radius: 8px 8px 0 0;

			.table-cell {
				font-weight: bold;
				color: #333;
				font-size: 14px;
				padding: 12px 8px;
				text-align: center;
			}
		}

		.table-row {
			display: flex;
			background-color: #fff;
			border-bottom: 1px solid #f5f5f5;

			&:last-child {
				border-bottom: none;
				border-radius: 0 0 8px 8px;
			}
		}

		.table-cell {
			padding: 12px 8px;
			text-align: center;
			font-size: 13px;
			color: #666;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.cell-text {
			width: 100%;
		}

		.text-ellipsis {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>