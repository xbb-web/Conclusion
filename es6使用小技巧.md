### 1.使用扩展运算符复制数组（浅复制，只对一维数组起作用，相当于slice()）
  let a = [...b]

### 2.数组去重(Set类似于数组，但它的值都是唯一的)
  let a = Array.from(new Set([1,1,2,3,4,3,2]))
  a: [1, 2, 3, 4]

### 3.解构赋值
  const arr = [1,2,3]
  const [first, second] = arr

### 4.字符串去掉最后一个字符
  '1,2,3,'.slice(0,-1)
  "1,2,3"

### 5.以一定规则补足字符串
  '1,2,3,'.repeat(3)
  "1,2,3,1,2,3,1,2,3,"

  'x'.padStart(3, 'y')
  "yyx"

  'x'.padEnd(3, 'y')
  "xyy"

### 6.转换 Number.parseInt - 将字符串或数字转换为整数 Number.parseFloat - 将字符串或数字转换为浮点数

Number.parseInt, Number.parseFloat 与 parseInt, parseFloat 功能一致，在ES6中，推荐使用 Number. 的方式进行调用，这么做的目的是为了让代码的使用方式尽可能减少全局性方法，使用得语言逐步模块化

### 7.遍历数组

.keys() - 获得数组中所有元素的键名（实际上就是下标索引号）

.values() - 获得数组中所有元素的数据

.entries() - 获得数组中所有数据的键名和数据

### 8.对象内容合并

> let a = {a:1,b:2}, b = {b:3}, c = {b:4,c:5};
>
> let d = Object.assign(a, b, c);
>
> console.log(d);//{a:1,b:4,c:5}
>
> console.log(a);//{a:1,b:4}
>
> //上面的合并方式会同时更新 a 对象的内容，a 的属性如果有多次合并会被更新数据，
>
> //但自身没有的属性，其它对象有的属性不会被添加到 a 身上；
>
> //参数列中的对象只会影响第一个，后面的参数对象不会被修改数据
>
> //推荐使用这种方式进行对象数据合并
>
> let a = {a:1,b:2}, b = {b:3}, c = {b:4,c:5};
>
> let d = Object.assign({}, a, b, c);//第一个参数增加一个空对象，在合并时让它被更新，不影响实际的对象变量内容
>
> console.log(d);//{a:1,b:4,c:5}//与上面的方式合并结果一致，使用这种方式, a 对象的内容就不会被影响了

对象内容合并的方向是从参数顺序的后向前合并

### 9.**对象内容集合**

Object.keys() - 获得对象中所有的键名，以数组的形式返回

![img](https://mmbiz.qpic.cn/mmbiz_png/dkwuWwLoRKicvJBaXGdL0JrznhczB5I8W4zqCfiant7JTtYFr5FBxLOPibaqp2XSKxzogRzGMibeqLEriaTrKcTniaeg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

Object.values() - 获得对象中所有的值内容，以数组的形式返回

![img](https://mmbiz.qpic.cn/mmbiz_png/dkwuWwLoRKicvJBaXGdL0JrznhczB5I8WibqzgJvfPod1xcl28Y7mjbzBNHk4GzzUVplhYp58qicNeicxCPUdXSfMw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

Object.entries() - 获得对象中所有的成员数据，以数组的形式返回，成员的内容也是数组形式

![img](https://mmbiz.qpic.cn/mmbiz_png/dkwuWwLoRKicvJBaXGdL0JrznhczB5I8WSrqob50VIbnGUDibxngFSiaaQGBg4tdHwibPeoHicMOvJtRYYE20k6VBgw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

其实观察可发现，Object.keys(), Object.values(), Object.entries()，与 Java 的 MAP 中的方法是一致的，不论是方法名还是具体的用法，这也可以帮忙理解这些功能 API

### **10实例使用场景**

![img](https://mmbiz.qpic.cn/mmbiz_png/dkwuWwLoRKicvJBaXGdL0JrznhczB5I8Wk1ibfIWXnIMbz2jrFyib0NsIZw2rYSafXXPRxRhGzZqXwLdBN61GK1FA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

以上简单的实例就两个脚本文件举例说明了两个文件在实际使用，可以进行互相引用，并获得目标文件中的数据；我们可以认为一个脚本文件就是一个 模块，那么在实际开发过程中，可以将业务处理内容，或是数据处理过程 抽象 在一个文件中，在需要使用时，由其它模块引入并使用其中的数据
