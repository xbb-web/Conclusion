# 踩坑心得-CSS篇

一直都觉得css简单，没什么好写的，不过在实践中，还是会遇到一些奇葩问题，值得记录一下。



### 1. transform的使用，会对子节点的样式造成诸多影响。

具体影响可以参考这篇文章[CSS3 transform对普通元素的N多渲染影响](http://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/) ，

结论：如果一定要使用transform，尽量使用在没有子节点的dom上。

