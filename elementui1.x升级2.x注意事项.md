# element-ui升级的一些改动



###  一、非兼容性的改动

1. **Icon** 属性需要传入完整的图标名，input的icon属性需要改成prefix-icon或者suffix-icon，
2. **Dialog** 弹框移除了size属性，现在由width和fullscreen控制宽度和是否遮罩，移除了通过v-model控制显示和隐藏，现在由:visible来控制
3. **Rate** 评分 text-template 改成了 score-template
4. **Dropdown** 下拉框menu-align改成了 placement，show-timeout和hide-timeout仅在trigger为hover时生效
5. **Transfer** 穿梭框footer-format改为format
6. **Switch** on-和off- 类别属性分别改为active-和inactive-，active-text和inactive-text不再有默认
7. **Input** 移除了on-icon-click和click事件，后面的清除图标现在可以用clear事件代替，clearable属性显示清除图标
8. **Autocomplete** 移除了custom-item和props属性
9. **steps** 移除了center
10. **DatePicker** change事件参数为组件绑定，格式由value-format控制，数据格式为数组，不需要额外处理，只会在value真正改变时触发，type值为daterange时，placeholder换成start-placeholder和end-placeholder两个，input框变成了两个
11. **Table** 移除了inline-template自定义模板，sort-method要求返回一个数字，append slot移至tbody之外，expend改为了expand-change，多选checkbox不再触发rou-click，width属性全部指定时按照指定，不指定的自行分配。
12. 待添加。。。。











###  二、其它新增属性不影响现在代码的以后使用时参考官方文档

