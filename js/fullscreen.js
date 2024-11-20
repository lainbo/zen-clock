// 状态管理
const state = {
    notice: null,
    hideTimer: null
};

// 初始化状态
const initState = () => {
    state.notice = document.querySelector('#notice');
};

// 检查是否处于全屏状态
const isFullscreen = () => {
    const fullscreenElement = 
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        document.webkitDisplayingFullscreen;
        
    return !!fullscreenElement || 
           !!document.webkitIsFullScreen || 
           !!document.mozFullScreen || 
           !!document.msFullscreenElement ||
           window.innerHeight === screen.height;
};

// 显示提示
const showNotice = () => {
    if (state.hideTimer) {
        clearTimeout(state.hideTimer);
    }
    state.notice.classList.add('show');
    state.hideTimer = setTimeout(() => state.notice.classList.remove('show'), 3000);
};

// 检查全屏API支持情况
const getFullscreenAPI = () => {
    const doc = document;
    const el = doc.documentElement;
    
    // 进入全屏
    const enterFS = [
        'requestFullscreen',
        'webkitRequestFullscreen',
        'webkitEnterFullscreen', // iOS Safari
        'webkitEnterFullScreen',
        'mozRequestFullScreen',
        'msRequestFullscreen'
    ].find(method => method in el);
        
    // 退出全屏
    const exitFS = [
        'exitFullscreen',
        'webkitExitFullscreen',
        'webkitExitFullScreen',
        'webkitCancelFullScreen',
        'mozCancelFullScreen',
        'msExitFullscreen'
    ].find(method => method in doc);
        
    return { enterFS, exitFS };
};

// 切换全屏状态
const toggleFullscreen = () => {
    const { enterFS, exitFS } = getFullscreenAPI();
    
    if (!isFullscreen()) {
        if (enterFS) {
            document.documentElement[enterFS]();
        }
    } else {
        if (!document.fullscreenElement) {
            showNotice();
        } else if (exitFS) {
            document[exitFS]();
        }
    }
};

// 事件处理函数
const handleKeydown = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        toggleFullscreen();
    }
};

// 初始化函数
const init = () => {
    initState();
    
    // 添加事件监听
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', toggleFullscreen);
    
    // 返回清理函数
    return () => {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', toggleFullscreen);
    };
};

export { init }; 
