const live2d_settings = {
    'baseUrl': '/',
    // 基本设置
    'modelUrl': 'live2d', // 存放模型的文件夹路径，末尾不需要斜杠
    // 模型设置
    'modelName': 'nianoa_ver5_0101', // 默认加载的模型名称，仅在无本地记录的情况下有效
    'preLoadMotion': true, // 是否预载动作数据，只对 model3 模型有效，不预载可以提高 model3 模型的加载速度，但可能导致首次触发动作时卡顿
    'tryWebp': true, // 如果浏览器支持 WebP 格式，将优先加载 WebP 格式的贴图，例如默认贴图文件为 klee.8192/texture_00.png，
    // 启用后将优先加载 klee.8192/texture_00.png.webp，文件不存在会自动 fallback
    //看板娘样式设置
    'live2dHeight': 380, // 看板娘高度，不需要单位  
    'live2dWidth': 250, // 看板娘宽度，不需要单位
    'waifuMinWidth': '1040px', // 页面小于宽度小于指定数值时隐藏看板娘，例如 'disable'(禁用)，推荐 '1040px'
    'waifuEdgeSide': 'right: 10', // 看板娘贴边方向，例如 'left:0'(靠左 0px)，'right:30'(靠右 30px)，可以被下面的模型设置覆盖
}

/****************************************************************************************************/

const $$ = (selector) => {
    try {
        const e = document.querySelectorAll(selector);
        if (e.length === 1) {
            return e[0];
        } else
            return Array.from(e);
    } catch (e) {
        console.error(e);
        return null;
    }
}
const live2dId4 = 'live2d4';

function testWebP() {
    return new Promise(res => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () => {
            res(webP.height === 2);
        };
    })
}

const getSS = (k) => {
    try {
        return sessionStorage.getItem(k);
    } catch (e) {
        return null
    }
}

function initModel() {
    /* Load style sheet */
    addStyle(waifuStyle);

    $$(`#${live2dId4}`).setAttribute('height', live2d_settings.live2dHeight);
    $$(`#${live2dId4}`).setAttribute('width', live2d_settings.live2dWidth);

    window.waifuResize = () => {
        if (getSS('waifuHide') !== '1')
            window.innerWidth <= Number(live2d_settings.waifuMinWidth.replace('px', '')) ? waifu.classList.add('hide') : waifu.classList.remove('hide');
    };

    if (live2d_settings.waifuMinWidth !== 'disable') {
        waifuResize();
        window.addEventListener('resize', waifuResize)
    }

    let modelName = live2d_settings.modelName;

    window.live2dv4.setPreLoadMotion(live2d_settings.preLoadMotion);
    if (live2d_settings.tryWebp) {
        testWebP().then(r => window.webpReady = r).then(() => {
            if (window.webpReady === true)
                console.log("[WaifuTips] Your browser support WebP format. Try to load WebP texture first.");
            else
                console.log("[WaifuTips] Your browser do not support WebP format.");
            loadModel(modelName);
        });
    } else {
        loadModel(modelName);
    }
}

function loadModel(modelName) {
    $$(`#${live2dId4}`).style.display = 'block';
    window.live2dv4.load(live2dId4, `${live2d_settings.baseUrl}${live2d_settings.modelUrl}/${modelName}`, `${modelName}.model3.json`);
}

const addStyle = (() => {
    const style = document.createElement('style');
    document.head.append(style);
    return (styleString) => style.textContent = styleString;
})();

const waifuStyle = `
#waifu {
    ${live2d_settings.waifuEdgeSide}px;
    position:fixed;
    bottom:0;
    z-index:0;
}

#live2d4 {
    position:relative;
    display:none;
    z-index:1
}

#waifu:hover{
    display:block
}

.hide {
    display: none !important;
}
`;
initModel();
window.initModel = initModel;
export { initModel }