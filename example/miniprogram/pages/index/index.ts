import type { ComponentOptions } from '../../wx-qr/lib/awesome-qr';
const options: ComponentOptions = {
  data: {
    scale: 0.3,
  },
  // timing: {
  //   scale: 0.2,
  //   protectors: true
  // },
  // alignment: {
  //   scale: 0.2
  // },
  // cornerAlignment: {
  //   scale: 0.2
  // }
}
Component({
  data: {
    text: 'https://gitee.com/liu_di/wx-qrhttps://gitee.com/liu_di/wx-qr',
    // text: 'https://gitee.com/liu_di/wx-qr',
    ComponentOptions: options
  },
  methods: {
    onLoad() {
      // setInterval(() => {
      //   let { text } = this.data;
      //   text += Math.random().toFixed(16).substring(2)
      //   this.setData({
      //     text
      //   })
      //   // console.log('更新了')
      // }, 2000)
    }
  }
})
