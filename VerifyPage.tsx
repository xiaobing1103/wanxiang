import React, { useEffect } from 'react';

const VerifyPage: React.FC = () => {
    // 判断是否在 uniapp 环境中
    const isUniapp = navigator.userAgent.includes('uni-app');

    // 向 uniapp 发送消息
    const sendMessageToUniapp = (type: string, data: any) => {
        if (window.uni) {
            // @ts-ignore
            uni.postMessage({
                data: {
                    type,
                    data
                }
            });
            console.log('消息已发送到 uniapp:', type, data);
        }
    };

    // 处理验证成功
    const handleVerificationSuccess = () => {
        sendMessageToUniapp('verificationSuccess', {
            token: 'your_token_here',
            timestamp: Date.now()
        });
    };

    // 处理验证失败
    const handleVerificationFailed = () => {
        sendMessageToUniapp('verificationFailed', {
            reason: '验证失败原因',
            timestamp: Date.now()
        });
    };

    // 监听来自 uniapp 的消息
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // 只处理来自 uniapp 的消息
            if (event.data?.type === 'customEvent') {
                console.log('收到 uniapp 消息：', event.data);
                // 处理消息...
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div className="verify-page">
            <h1>验证页面</h1>
            <div>
                <p>当前环境: {isUniapp ? 'Uniapp Webview' : '普通浏览器'}</p>
                
                {/* 验证相关的 UI 组件 */}
                <button 
                    onClick={handleVerificationSuccess}
                    style={{ 
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    验证成功
                </button>
                
                <button 
                    onClick={handleVerificationFailed}
                    style={{ 
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    验证失败
                </button>
            </div>
        </div>
    );
};

export default VerifyPage; 