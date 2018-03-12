# 踩坑心得



## Element-UI



#### MessageBox 组件自定义显示内容

有时候我们希望确认弹窗的提示内容可进一步自定义，比如显示一个列表，显示不同的颜色及字体大小等等。

这时候需要用到MessageBox.confirm方法，该方法有三个参数，分别是message,title和options，其中，message是必填的，但可以options中覆盖其内容，下面是代码演示：

```javascript
const h = this.$createElement
MessageBox.confirm('该信息不会被显示', {
  title: `归档确认`,
  message: h('div', {'class': 'confirm-con'}, [
    h('h4', {'class': 'tit'}, warning),
    h('div', {'class': 'msg'}, `确认归档这6位客户?`)
  ]),
  confirmButtonText: '确定',
  cancelButtonText: '取消'
})
```



#### Form 表单验证

1. 如果form绑定的数据为动态生成，那么rules（验证规则）必须在其之后声明；
2. 我们项目中要注意表单字段（attr）对应的validate的属性值，同个字段后端可能传来不一样的值，配置验证的时候要注意


#### 组件命名冲突

在工单详情中有个“工单进展”组件，随手命名为 `Progress` ，然后发现浏览器报了一个错误：`Do not use built-in or reserved HTML elements as component id: Progress`。原因是Element-UI中也有个 `Progress`组件，而这个组件是全局注册的，从而导致了组件命名冲突。

关于组件的命名规范，可以看一下这篇拓展阅读：[聊聊 Vue 组件命名那些事](http://cnodejs.org/topic/5816aabdcf18d0333412d323)



#### 引入组件路径，注意区分大小写

1. 如果路径中错写了大小写，具体表现为组建加载正常，但是修改组件内容不会触发更新；
2. Linux中严格区分大小写，如果项目中错写了大小写路径，发布到线上后会导致引用错误。



## Javascript





## Vuejs

#### 父子组件之间的传参

1. 如果父组件传给子组件的值是数组或对象，即使把参数赋给子组件的一个变量，子组件的变量变也会影响父组件，如果不想影响父组件，最好在赋值前对参数进行深度拷贝，方法有JSON.parse(JSON.stringify())。字符串、数字类型和布尔值不会变。
2. 父子组件之间传参，如果参数是数组和对象，最好用工厂函数来设置默认值。




## Vuex





## Vue-router



## 项目页面坑点
（列表页）
 如果是新增一个列表页：
1.需要在'src/config/list_config'至少设置一项最小列宽，正常来说一般关于名称的都会设置个宽度，毕竟默认的宽度很窄，以待采购列表为例，
在list_config 里的COLMUN_WIDTH这个对象里添加一个对象，对象名waitPurchaseApi为模块名，对象里每个属性与列表项的attr名对应，后面的是宽度值
  // 待采购
	```
  waitPurchaseApi: {
		productUnit: 80,
		supplierJoinName: 180
  }
	```
  
 2.操作列的按钮需要在'src/config/common_config'里配置好，这里要注意后端传过来的每条数据里的listPermissionSet值，它是个数组，用来告诉你每条数据会用到的操作按钮，比如```listPermissionSet:["offline", "edit", "del"]```，然后common_config里menuType对象里没有offline的话就往里面加一个关于offline的对象，对象里会包含：name（按钮名称），type按钮样式（element UI）
 ```
  offline: {
    name: '下架',
    type: 'warning'
  }
	```
 之所以记录下这个问题是因为我当时在common_config添加了但是页面还是报错，最后才发现后端这个数据传的有问题。





