// 配置常量
const IDLE_TIMEOUT = 1500; // 1.5秒无操作视为空闲
const IDLE_EVENTS = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];

// 状态管理
const state = {
    idleTimer: null,
    isIdle: false
};

// 检查是否处于空闲状态
const isIdle = () => state.isIdle;

// 设置光标状态
const setCursorState = (shouldHide) => {
    if (shouldHide) {
        document.body.classList.add('hide-cursor');
    } else {
        document.body.classList.remove('hide-cursor');
    }
};

// 重置空闲状态
const resetIdle = () => {
    clearTimeout(state.idleTimer);
    
    // 如果当前是空闲状态，恢复光标
    if (state.isIdle) {
        state.isIdle = false;
        setCursorState(false);
    }
    
    // 设置新的定时器
    state.idleTimer = setTimeout(() => {
        state.isIdle = true;
        setCursorState(true);
    }, IDLE_TIMEOUT);
};

// 处理可见性变化
const handleVisibilityChange = () => {
    if (!document.hidden) {
        resetIdle();
    }
};

// 初始化函数
const init = () => {
    // 添加所有事件监听
    IDLE_EVENTS.forEach(event => {
        window.addEventListener(event, resetIdle, { passive: true });
    });

    // 监听文档可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 初始化空闲检测
    resetIdle();

    // 返回清理函数
    return () => {
        clearTimeout(state.idleTimer);
        IDLE_EVENTS.forEach(event => {
            window.removeEventListener(event, resetIdle);
        });
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
};

export { init }; 
