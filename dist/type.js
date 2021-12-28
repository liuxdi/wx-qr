import { DEFAULT_SIZE } from "./util";
export var canvasContainer;
(function (canvasContainer) {
    canvasContainer["qrMainContainer"] = "qrMainContainer";
})(canvasContainer || (canvasContainer = {}));
export const qrTypes = {
    text: {
        type: String,
        value: "",
    },
    size: {
        type: String,
        optionalTypes: [Number],
        value: DEFAULT_SIZE,
    },
    /**
     * 是否以canvas展示二维码
     */
    canvasMode: {
        type: Boolean,
        value: false,
    },
    /**
     * [canvasMode=false]情况下
     * 是否支持长按二维码展示菜单
     */
    showMenuByLongpress: {
        type: Boolean,
        value: true,
    },
    margin: {
        type: Number,
        optionalTypes: [String],
        value: 10,
    },
    correctLevel: {
        type: Number,
        value: 0,
    },
    maskPattern: {
        type: null,
        optionalTypes: [Number],
        value: null,
    },
    version: {
        type: null,
        optionalTypes: [Number],
        value: null,
    },
    components: {
        type: Object,
        value: {},
    },
    colorDark: {
        type: String,
        value: "#000000",
    },
    colorLight: {
        type: String,
        value: "#FFFFFF",
    },
    autoColor: {
        type: Boolean,
        value: true,
    },
    backgroundImage: {
        type: String,
        value: undefined,
    },
    /**
     * 背景图上掩膜的颜色
     */
    backgroundDimming: {
        type: String,
        value: "rgba(0,0,0,0)",
    },
    /**
     * 如果有margin的话是否展示白色的边
     */
    whiteMargin: {
        type: Boolean,
        optionalTypes: [String],
        value: false,
    },
    /**
     * logo地址
     */
    logoImage: {
        type: String,
        value: undefined,
    },
    /**
     * logo占整个二维码比例
     */
    logoScale: {
        type: Number,
        value: 0.2,
    },
    /**
     * logo外边距大小
     */
    logoMargin: {
        type: Number,
        optionalTypes: [String],
        value: 0,
    },
    /**
     * logo的角半径
     */
    logoCornerRadius: {
        type: Number,
        value: 8,
    },
    /**
     * 每个二维码块的比例
     */
    dotScale: {
        type: Number,
        value: 1,
    },
};
