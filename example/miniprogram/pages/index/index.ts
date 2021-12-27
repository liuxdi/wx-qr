import type { ComponentOptions } from '../../wx-qr/lib/awesome-qr';
const options: ComponentOptions = {
  data: {
    scale: 1,
  },
}
Component({
  data: {
    text: 'https://gitee.com/liu_di/wx-qrhttps://gitee.com/liu_di/wx-qr',
    // text: 'https://gitee.com/liu_di/wx-qr',
    ComponentOptions: options
  },
})
