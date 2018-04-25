# El-Table组件自定义

### 一、需求

![mage-20180425095724](https://github.com/xbb-web/Conclusion/blob/master/%E9%A1%B9%E7%9B%AE%E6%80%BB%E7%BB%93/imgs/201804250957243.png)

如图，在table-head和table-body之间新增一行，用来展示部分列的筛选控件，并且可通过一个开关来控制这一行的显示与隐藏。

本来这个需求并不复杂，但偏偏Element的Table组件是按列渲染的，如果需要增加一行，那就需要在每一列的开头新增一个字段，隐藏时就要再删除这个字段。而且筛选字段的内容和展示内容并不一样，因此还需要根据判断条件来使用不同的渲染方法。每当刷新Table组件和翻页时，都需要再次重复上面的操作。



### 二、解决方能

#### 方案一

使用两个Table组件，一个用来展示table-head和筛选部分，另一个用来展示table-body，并隐藏该Table的head部分。

**优点：**实现简单，无需二次开发Table组件

**缺点：**两个Table之间无法联动，不支持表头固定，列宽调整等功能



#### 方案二

 弃用el-table组件，自己重写一套新的table组件，以满足业务需求

**优点：**自由灵活，可根据业务去定制组件

**缺点：**技术难度大、开发周期较长，且无法享受element更新所带来的新特性



#### 方案三（已选）

在el-table组件的基础上进行二次开发，通过传入props参数，来实现筛选过滤的需求

**优点：**原有el-table组件的特性可继续使用，开发成本相对较低

**缺点：**在Safari下有一些兼容性问题，每次el-table组件更新都需要去手动更新相关代码



### 三、实现过程

#### 将el-table移植出来

1. 复制`element-ui/packages/table/`到`src/custom/`目录下；

2. 编辑`src/main.js`，删掉原有的Table组件的引入方式，并新增如下代码：

   ```javascript
   import Table from 'src/custom/table'
   import 'element-ui/packages/theme-chalk/lib/table.css'
   ```

3. 此时会发现项目开始报错，然后将`element-ui/src/utils/resize-event.js`复制到`src/custom`目录下；然后打开`src/custom/table/table-body.js`，注释掉第4行和第15行：

   ```javascript
   import { getCell, getColumnByCell, getRowIdentity } from './util';
   import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
   import ElCheckbox from 'element-ui/packages/checkbox';
   // import ElTooltip from 'element-ui/packages/tooltip';
   import debounce from 'throttle-debounce/debounce';
   import LayoutObserver from './layout-observer';

   export default {
     name: 'ElTableBody',

     mixins: [LayoutObserver],

     components: {
       ElCheckbox
       // ElTooltip
     },
   ```

4. 至此，el-table已经被移植出来，并替换掉了原有的el-table组件。



#### 二次开发

1. 大概看了下table.vue的代码，发现其主要由table-head、table-body和table-foot三部分组成。在此基础之上，我在table-head和table-body中间，新增了一个table-filter组件，用来实现筛选需求。除此之外，由于Table组件新增了一行，会导致一些样式问题，因此部分样式计算方法需要进行修改：

   ```html
   <!-- 自定义筛选区域 start -->
   <div class="v-table-filter" ref="filterWrapper">
     <table-filter
       v-if="advanced"
       :store="store"
       :layout="layout"
       :border="border"
       :filter-data="newFilterHead"
       :default-sort="defaultSort"
       :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
       <template slot-scope="props" slot="filter">
         <slot name="table-filter" :item="props.item"></slot>
       </template>
     </table-filter>
   </div>
   <!-- 自定义筛选区域 end -->
   ```

   ```javascript
   // props 中新增
   props: {
       advanced: Boolean // 是否开启高级筛选
   }

   // computed 中新增
   computed: {
     // 固定列样式
     fixedStyle() {
       let style = {};
       let n = this.advanced ? 45 : 0;

       if (this.height) {
         style = {
           height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight - n + 'px' : '',
           top: this.layout.headerHeight + n + 'px'
         };
       } else if (this.maxHeight) {
         let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

         if (this.showHeader) {
           maxHeight -= this.layout.headerHeight;
         }

         style = {
           'max-height': maxHeight + 'px'
         };
       }

       return style;
     },

     // 如果左侧有操作按钮，则向该数组开头插入一个空字符串
     newFilterHead() {

       // 筛选过滤
       let arr = this.filterHead.filter(item => {
         return this.filterArray.indexOf(item.attr) === -1;
       });
       if (this.hasListMenu) {
         arr.unshift('');
       }

       // 如果是产品列表页，左侧会有展开的箭头，所以要加一列
       if (this.isProduct) {
         arr.unshift('');
       }

       return arr;
     }
   }
   ```

   ​

2. 接下来便是书写table-filter的代码了，这里可以偷个懒，直接把table-foot的内容复制过来，做下简单修改就可以了，具体修改内容如下：

   ```javascript
   // 64行
   <div class={ ['cell', column.labelClassName] }>
     {
     	// this.summaryMethod ? this.summaryMethod({ columns: this.columns, data: this.store.states.data })[cellIndex] : sums[cellIndex]
       this.newFilterData[cellIndex].searchItem && this.$scopedSlots.filter ? this.$scopedSlots.filter({ item: this.newFilterData[cellIndex] }) : ''
     }
   </div>

   // props 中新增
   props: {
   	filterData: Array
   }

   // computed 中新增
   computed： {
       newFilterData () {
         let arr = [{}]
         return arr.concat(this.filterData)
       }
   }
   ```

3. 至此，table-filter已经添加好，现在可以通过传入advanced参数来控制table-filter的显示与隐藏。



#### 版本更新

由于Element-ui版本迭代频繁，因此当我们更新了element-ui的版本后，也需要检查el-table是否也需要更新。

1. 首先访问element-ui的github资源：[https://github.com/ElemeFE/element/tree/dev/packages/table/src](https://github.com/ElemeFE/element/tree/dev/packages/table/src)，![mage-20180425135401](https://raw.githubusercontent.com/xbb-web/Conclusion/master/%E9%A1%B9%E7%9B%AE%E6%80%BB%E7%BB%93/imgs/201804251354017.png)

观察table目录下，各个文件的更新时间，近期被更新过的文件，就是我们要同步更新的文件。

2. 可使用 Beyond Compare等文件比对工具，将最新版本的文件与本地文件进行比对，然后通过更新过的代码。

