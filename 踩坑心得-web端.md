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

#### 动态引入图片

img标签动态绑定静态src地址时，图片不能正常显示，解决办法用require引入地址（做应用中心轮播时有碰到）

	<img :src='imgUrl'>
	...
	data() {
	  return {
	    imgUrl: require('./img.png')
	  }
	}

#### 对象响应式

Vue中的属性如果是Object，或者是数组，数组中有Object，那么这些Object最好在最开始就把所有需要用到的属性都定义一遍，如果在运行中重新添加属性，这个属性并不是响应式的，就不会实现双向绑定，例如：
	const vm = new Vue({
	  data: {
	    a: {
	      text: 'aaa'
	    }
	  }
	})
	vm.a.b = 'ccc'
这样的情况，a的b属性不是响应式的，所以不会双向绑定（）
（之前在给列表另外加属性控制列表的展开和收起的时候，是在一开始拿到数据的时候就遍历一遍，把属性加上，不然动态改变这个属性是没有用的）

#### ref问题(新建的时候如果同样的控件多次使用，用到$refs时需要遍历)
	<ul>
	  <li ref="text">dfj</li>
	  <li ref="text">dfj</li>
	  <li ref="text">dfj</li>
	</ul>
这样写的话this.$refs.text获取的是最后一个li

	<ul>
	  <li ref="text" v-for="i in arr">dfj</li>
	</ul>
这样写的话this.$refs.text获取的是数组

**化繁为简的Watchers**

场景还原：

> created(){
>
>     this.fetchPostList()
>
> },
>
> watch: {
>
>     searchInputValue(){
>
>         this.fetchPostList()
>
>     }
>
> }

组件创建的时候我们获取一次列表，同时监听input框，每当发生变化的时候重新获取一次筛选后的列表这个场景很常见，有没有办法优化一下呢？

招式解析：

首先，在watchers中，可以直接使用函数的字面量名称；其次，声明immediate:true表示创建组件时立马执行一次。

> watch: {
>
>     searchInputValue:{
>
>         handler: 'fetchPostList',
>
>         immediate: true
>
>     }
>
> }

**一劳永逸的组件注册**（以后我们做表单控件的时候可以用到）

场景还原：

> <BaseInput
>
>   v-model="searchText"
>
>   @keydown.enter="search"
>
> />
>
> <BaseButton @click="search">
>
>   <BaseIcon name="search"/>
>
> </BaseButton>

我们写了一堆基础UI组件，然后每次我们需要使用这些组件的时候，都得先import，然后声明components，很繁琐！秉持能偷懒就偷懒的原则，我们要想办法优化！

招式解析：

我们需要借助一下神器webpack，使用 require.context() 方法来创建自己的（模块）上下文，从而实现自动动态require组件。这个方法需要3个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。

我们在components文件夹添加一个叫global.js的文件，在这个文件里借助webpack动态将需要的基础组件统统打包进来。

> import Vue from 'vue'
>
>  
>
> function capitalizeFirstLetter(string) {
>
>   return string.charAt(0).toUpperCase() + string.slice(1)
>
> }
>
>  
>
> const requireComponent = require.context(
>
>   '.', false, /\.vue$/
>
>    //找到components文件夹下以.vue命名的文件
>
> )
>
>  
>
> requireComponent.keys().forEach(fileName => {
>
>   const componentConfig = requireComponent(fileName)
>
>  
>
>   const componentName = capitalizeFirstLetter(
>
>     fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
>
>     //因为得到的filename格式是: './baseButton.vue', 所以这里我们去掉头和尾，只保留真正的文件名
>
>   )
>
>  
>
>   Vue.component(componentName, componentConfig.default || componentConfig)
>
> })

最后我们在main.js中import 'components/global.js'，然后我们就可以随时随地使用这些基础组件，无需手动引入了。

**无所不能的render函数**

场景还原:

vue要求每一个组件都只能有一个根元素，当你有多个根元素时，vue就会给你报错

> <template>
>
>   <li
>
>     v-for="route in routes"
>
>     :key="route.name"
>
>   >
>
>     <router-link :to="route">
>
>       {{ route.title }}
>
>     </router-link>
>
>   </li>
>
> </template>
>
>  
>
>  
>
> ERROR - Component template should contain exactly one root element.
>
>     If you are using v-if on multiple elements, use v-else-if
>
>     to chain them instead.

招式解析:

那有没有办法化解呢，答案是有的，只不过这时候我们需要使用render()函数来创建HTML，而不是template。其实用js来生成html的好处就是极度的灵活功能强大，而且你不需要去学习使用vue的那些功能有限的指令API，比如v-for, v-if。（reactjs就完全丢弃了template）

> functional: true,
>
> render(h, { props }) {
>
>   return props.routes.map(route =>
>
>     <li key={route.name}>
>
>       <router-link to={route}>
>
>         {route.title}
>
>       </router-link>
>
>     </li>
>
>   )
>
> }

**无招胜有招的高阶组件**

划重点：这一招威力无穷，请务必掌握

当我们写组件的时候，通常我们都需要从父组件传递一系列的props到子组件，同时父组件监听子组件emit过来的一系列事件。举例子：

> //父组件
>
> <BaseInput
>
>     :value="value"
>
>     label="密码"
>
>     placeholder="请填写密码"
>
>     @input="handleInput"
>
>     @focus="handleFocus>
>
> </BaseInput>
>
>  
>
> //子组件
>
> <template>
>
>   <label>
>
>     {{ label }}
>
>     <input
>
>       :value="value"
>
>       :placeholder="placeholder"
>
>       @focus=$emit('focus', $event)"
>
>       @input="$emit('input', $event.target.value)"
>
>     >
>
>   </label>
>
> </template>

有下面几个优化点：

1.每一个从父组件传到子组件的props,我们都得在子组件的Props中显式的声明才能使用。这样一来，我们的子组件每次都需要申明一大堆props, 而类似placeholer这种dom原生的property我们其实完全可以直接从父传到子，无需声明。方法如下：

> <input
>
>    :value="value"
>
>    v-bind="$attrs"
>
>    @input="$emit('input', $event.target.value)"
>
> \>

$attrs包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 v-bind=”$attrs” 传入内部组件——在创建更高层次的组件时非常有用。

2.注意到子组件的@focus=$emit('focus', $event)"其实什么都没做，只是把event传回给父组件而已，那其实和上面类似，我完全没必要显式地申明：

> <input
>
>     :value="value"
>
>     v-bind="$attrs"
>
>     v-on="listeners"
>
> \>
>
>  
>
> computed: {
>
>   listeners() {
>
>     return {
>
>       ...this.$listeners,
>
>       input: event =>
>
>         this.$emit('input', event.target.value)
>
>     }
>
>   }
>
> }

$listeners包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on=”$listeners” 传入内部组件——在创建更高层次的组件时非常有用。

3.需要注意的是，由于我们input并不是BaseInput这个组件的根节点，而默认情况下父作用域的不被认作 props 的特性绑定将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。所以我们需要设置inheritAttrs:false，这些默认行为将会被去掉, 以上两点的优化才能成功。

## Vuex





## Vue-router

一.路由传参  query 与 params 区别（应用于跳转界面并传参）
1.用法上
this.$router.push({
    path: 'jxcAddPage',
    query: {
      moduleName: 'purchase',
      id: ''
    }
})
this.$router.push({
    name: 'jxcAddPage',
    params: {
      moduleName: 'purchase',
      id: '',
    }
})
接收参数都是类似的，分别是...this.$route.query.name...和...this.$route.params.name...
注意接收参数的时候，已经是...$route...而不是...$router...了

2.展示上
query传参会在浏览器地址栏中显示参数，params则不显示
...http://localhost:8080/#/jxcAddPage?moduleName=instock&id=395...
...http://localhost:8080/#/jxcAddPage...

二.**釜底抽薪的router key**（可以解决我们详情页样式相同的tab栏切换问题）

------

场景还原：

下面这个场景真的是伤透了很多程序员的心…先默认大家用的是Vue-router来实现路由的控制。

假设我们在写一个博客网站，需求是从/post-page/a，跳转到/post-page/b。然后我们惊人的发现，页面跳转后数据竟然没更新？！原因是vue-router”智能地”发现这是同一个组件，然后它就决定要复用这个组件，所以你在created函数里写的方法压根就没执行。通常的解决方案是监听$route的变化来初始化数据，如下：

> data() {
>
>   return {
>
>     loading: false,
>
>     error: null,
>
>     post: null
>
>   }
>
> },
>
> watch: {
>
>   '$route': {
>
>     handler: 'resetData',
>
>     immediate: true
>
>   }
>
> },
>
> methods: {
>
>   resetData() {
>
>     this.loading = false
>
>     this.error = null
>
>     this.post = null
>
>     this.getPost(this.$route.params.id)
>
>   },
>
>   getPost(id){
>
>  
>
>   }
>
> }

bug是解决了，可每次这么写也太不优雅了吧？秉持着能偷懒则偷懒的原则，我们希望代码这样写：

> data() {
>
>   return {
>
>     loading: false,
>
>     error: null,
>
>     post: null
>
>   }
>
> },
>
> created () {
>
>   this.getPost(this.$route.params.id)
>
> },
>
> methods () {
>
>   getPost(postId) {
>
>     // ...
>
>   }
>
> }

招式解析:

那要怎么样才能实现这样的效果呢，答案是给router-view添加一个unique的key，这样即使是公用组件，只要url变化了，就一定会重新创建这个组件。（虽然损失了一丢丢性能，但避免了无限的bug）。同时，注意我将key直接设置为路由的完整路径，一举两得。

> <router-view :key="$route.fullpath"></router-view>

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

## 函数多参数情况下将参数作为一个对象传入比较好
当一个函数既有必选参数(type,id)，又有可选参数(isEdit等)，在定义函数时，我们可能采取的方式是：无论参数是可选参数还是必选参数，都将参数罗列下来（通常按照先必选再可选的顺序），但是这样会有一个问题，当第三个开始之后都为可选参数时候，从第三个参数开始就变得不好处理，比如你第四个参数传递之前你还得正确传递第三个参数。
```
function handleTransfer (type, id, isEdit，...) {}
```
## 小数精度出炉方法---对输入值的小数位超过限制部分进行了截断
decimalPrecision：小数要精确的位数
```
onInput (item) {
      var value = this.form[item.attr].toString()
      if (value.indexOf('.') !== -1) {
        var precisionLen = value.split('.')[1].length // 获取input输入小数位的长度
        if (precisionLen > item.decimalPrecision) {
          // 如果小数位超出，则保留有效小数位
          this.form[item.attr] = value.substr(0, value.indexOf('.') + item.decimalPrecision + 1)
        }
      }
}
```
## 待采购待入库待出库回退列表的翻页优化
由于进销存相关模块的新建编辑页面是跳转到新页面的，而不是像当前路由下打开一个弹框，所以保存或者取消回列表页的时候需要回到跳转前面页面，于是做了"**进行操作之后返回操作之前所在页面**"的处理
使用了**VUEX**将页码和左上角的分类存了起来。
1.监听页码,更新vuex中的页码和分类
```
    currentPage (old, number) {
      let updateVuexObj = {
        currentPage: this.currentPage,
        belongerType: this.belonger.belongerType
      }
      this.updateVuexPage(updateVuexObj)
    }
```
2.更新vuexPageObj
```
vuexPageObj: {}, // 列表页码分类存入这个对象
[types.UPDATE_VUEXPAGE] (state, obj) {
    state.vuexPageObj = obj
}
```
3.在需要的时候再获取（进入跳转的页面后通过VUEX里面定义的```getPage```获取页码```currentPage```和分类在保存或者取消的时候再通过路由带出去进行其他处理）
```
this.$router.push({name: roterName, params: {page: this.getPage.currentPage, belongerType: this.getPage.belongerType, watchPage: true}})
```
## VUE递归组件的应用---BOM结构图
[![SC4HVLC0JJ1HKBWKTK.png](http://www.z4a.net/images/2018/08/21/SC4HVLC0JJ1HKBWKTK.png)](http://www.z4a.net/image/7IuknT)

因为BOM物料是**多层级**的，所以展示它的数据也是一个**嵌套关系**的数据结构图，但是层级有限，而且样式有设计，而且考虑到以后的拓展性（比如做成树状展开收起），于是采用了递归组件的方式来实现上图效果。
主要代码如下：
```
<structure :structureList="structureList"></structure>
```
```
structure: {
      name: 'gs',
      template: `
      <ul class="level-one">
        <li v-for="it in structureList">
          <div class="level-out">
            <div class="level-left">
              <h1>{{it.name}}</h1>
              <p>规格：{{it.specification}}</p>
            </div>
            <div class="level-right">
              <span>{{it.num}}/{{it.unit}}</span>
            </div>
          </div>
          <gs :structureList="it.children" v-if="it.children && it.children.length"></gs>
        </li>
      </ul>`,
      props: ['structureList'],
      data () {
        return {
          show: false
        }
      }
    }
```
**注意**：递归调用是条件性的,防止进入死循环
## element表格自定义表头，加入element组件,组件上的属性加在props里
比如在==render-header==属性中定义的方法里加入一个Tooltip 文字提示，return h方法里的内容是你要自定义的东西
```
h(
      'el-tooltip',
      {
        'props': {placement: 'top', effect: 'light', content: '提示内容'}
      [
        h(
          'span',
          {
            'class': 'icon el-icon-question',
            'style': 'color:#666'
          }
        )
      ]
    )
```
