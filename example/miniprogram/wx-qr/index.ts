import { AwesomeQR } from "./lib/index";
import {qrTypes} from "./type";
import { COMPONENT_NAME, DEFAULT_SIZE } from "./util";

function toBoolean(data: any) {
    return Boolean(data)
}

Component({
    properties: qrTypes,
    data: {
        imgSrc: "",
        canvasSize: DEFAULT_SIZE
    },
    observers: {
        size(newVal) {
            let size = newVal;
            if (typeof newVal === 'number') {
                size = newVal + 'rpx';
            }
            this.setData({
                canvasSize: size
            })
        }
    },
    attached() {
        this.render();
    },
    // : [WechatMiniprogram.Canvas, WechatMiniprogram.CanvasContext] 
    methods: {
        getCanvasAndContext(): Promise<WechatMiniprogram.Canvas[]> {
            return new Promise((reslove, reject) => {
                try {
                    const query = this.createSelectorQuery();
                    query.selectAll('.qr-canvas').fields({ node: true, size: true, id: true }).exec(res => {
                        const canvasList = res[0].map(((item: { node: WechatMiniprogram.Canvas; }) => {
                            const canvas: WechatMiniprogram.Canvas = item.node;
                            const ctx: WechatMiniprogram.CanvasContext = canvas.getContext('2d');
                            const dpr = wx.getSystemInfoSync().pixelRatio
                            canvas.width = res[0].width * dpr
                            canvas.height = res[0].height * dpr
                            ctx.scale(dpr, dpr);
                            return canvas
                        }))
                        reslove(canvasList)
                    })
                } catch (error) {
                    console.error(`${COMPONENT_NAME} 组件获取canvas时报错`, error)
                    reject(error)
                }
            })
        },
        async render(): Promise<void> {
            const [qrOutContainer, qrMainContainer, qrBakContainer, qrBgContainer] = await this.getCanvasAndContext();
            const {
                text,
                size,
                margin,
                colorDark,
                colorLight,
                backgroundColor,
                backgroundDimming,
                logoScale,
                logoBackgroundColor,
                correctLevel,
                logoMargin,
                logoCornerRadius,
                dotScale,
                bgImg,
                logoSrc,
                whiteMargin,
                autoColor,
            } = this.data;


            new AwesomeQR({
                text: text,
                size: size,
                margin: margin,
                colorDark: colorDark,
                colorLight: colorLight,
                // backgroundColor: backgroundColor,
                backgroundImage: bgImg,
                backgroundDimming: backgroundDimming,
                logoImage: logoSrc,
                logoScale: logoScale,
                // logoBackgroundColor: logoBackgroundColor,
                correctLevel: correctLevel,
                logoMargin: logoMargin,
                logoCornerRadius: logoCornerRadius,
                whiteMargin: toBoolean(whiteMargin),
                dotScale: dotScale,
                autoColor: toBoolean(autoColor),
                canvasContainer: { qrOutContainer, qrMainContainer, qrBakContainer, qrBgContainer }
            }).draw().then(rsp => {
                console.log(rsp)
            }).catch(err => {
                console.log(err);

            })
        }
    }
})
