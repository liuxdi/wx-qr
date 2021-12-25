import { DEFAULT_SIZE } from "./util";
import type { ComponentOptions } from './lib/awesome-qr'
export enum canvasContainer {
    qrMainContainer = 'qrMainContainer',
    qrBgContainer = 'qrBgContainer',
}
export const qrTypes: WechatMiniprogram.Component.PropertyOption = {
    text: {
        type: String,
        value: ''
    },
    qid: {
        type: String
    },
    correctLevel: {
        type: Number,
        value: 0
    },
    size: {
        type: String,
        optionalTypes: [Number],
        value: DEFAULT_SIZE
    },
    margin: {
        type: Number,
        value: 0
    },
    colorDark: {
        type: String,
        value: "#000000"
    },
    colorLight: {
        type: String,
        value: "#FFFFFF"
    },
    bgSrc: {
        type: String,
        value: undefined
    },
    background: {
        type: String,
        value: "rgba(0,0,0,0)"
    },
    backgroundDimming: {
        type: String,
        value: "rgba(0,0,0,0)"
    },
    logoSrc: {
        type: String,
        value: undefined
    },
    logoBackgroundColor: {
        type: String,
        value: "rgba(255,255,255,1)"
    },
    gifBgSrc: {
        type: String,
        value: undefined
    },
    logoScale: {
        type: Number,
        value: 0.2
    },
    logoMargin: {
        type: Number,
        value: 0
    },
    logoCornerRadius: {
        type: Number,
        value: 8
    },
    whiteMargin: {
        type: Boolean,
        optionalTypes: [String],
        value: true
    },
    dotScale: {
        type: Number,
        value: 1

    },
    autoColor: {
        type: Boolean,
        optionalTypes: [String],
        value: true
    },
    binarize: {
        type: Boolean,
        optionalTypes: [String],
        value: false
    },
    binarizeThreshold: {
        type: Number,
        value: 128
    },
    // callback: {
    //     type: Function,
    //     optionalTypes: [],
    // },
    bindElement: {
        type: Boolean,
        value: true
    },
    backgroundColor: {
        type: String,
        value: "#FFFFFF"
    },
    components: {
        type: Object,
        value: {}
    }

}