# 踩坑心得-CSS篇

一直都觉得css简单，没什么好写的，不过在实践中，还是会遇到一些奇葩问题，值得记录一下。



### 1. transform的使用，会对子节点的样式造成诸多影响。

具体影响可以参考这篇文章[CSS3 transform对普通元素的N多渲染影响](http://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/) ，

结论：如果一定要使用transform，尽量使用在没有子节点的dom上。

### 2. 背景图片的路径要从该css文件所在路径做为相对路径找起
### 3. 页面抖动
  1.box-sizing: border-box;在谷歌的一些版本上会造成元素抖动，因为如果元素的宽高确定，浏览器在计算边框时会存在边框除不尽的情况，就会造成元素晃动
  2.当首页文章很少，打开文章后BODY,HTML高度变化时，HTML网页的高度刚好够一个屏幕，但是又没有超出屏幕的边缘，这时候，如果一个元素多了1px，那么就会出现网页无缘无故的抖动，很是影响用户体验。
  可以使用以下CSS代码解决
    html,body{ overflow-y:scroll;}
    html,body{ overflow:scroll; min-height:101%;}
    html{ overflow:-moz-scrollbars-vertical;}
    主要原因还是滚动条显示/隐藏造成的。
  3.Chrome版本 32.0.1664.3 m Aura，该版本的Chrome每次打开页面滚动页面对于position:fixed的元素会抖动，然而在重新应用position:fixed，抖动就不存在了，或者F5刷新页面后也不会抖动
    解决方法：
      第一种，给fixed的元素添加css的样式。
        -webkit-transform: translateZ(0);
      第二种，设置css。
        html, body {height:100%;overflow:auto;margin: 0;}
### 4.CSS3动画几个实用的属性
  1.steps(number_of_steps, direction)
    a. 第一个参数指定了时间函数中的间隔数量（必须是正整数），这个间隔数量作用用于两个关键帧之间，也就是form与30%之间、30%与to之间。
    b. 第二个参数可选，接受 start 和 end 两个值，指定在每个间隔的起点或是终点发生阶跃变化，默认为 end。
      animation: drive 4s steps(4, end) infinite;
    也就是一步一步动画，而如果不设置，那其实里面就会有多步操作，就会出现影子
  2.animation-direction: normal/alternate（交替)/reverse（反向）
    使用alternate动画明显要流畅很多，而normal的动画在完成100%以后就直接跳回到0%的状态，中间衔接不流畅
  3.贝塞尔辅助工具
    a.在easings.net这个网页上，可以查看各种缓动的效果
    b.在cubic-bezier.com中，可以在线制作，拖动红色或蓝色的那两个点，可以自动显示相应的参数
    
 
