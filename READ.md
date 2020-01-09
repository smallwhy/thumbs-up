### 效果
实现类似`抖音`、`淘宝直播`的点赞效果

### thumbs-up.js中SendFlow对象属性介绍

|序号|属性|功能|
|:--|:--|:--|
|1.|iconArray|点赞需要显示的图标数组，如果有出现概率，构造出概率数组(类似于send.js中的sendFlowData.percentIconArrayData)|
|2.|jqDomID|点击的图标的ID|
|3.|canvasWidth|画布的宽|
|4.|canvasHeight|画布的高|
|5.|initDomFinish|canvas画布及图标加载完之后，执行的方法|
|6.|click|点击id为jqDOMID的元素后，执行的方法|

### thumbs-up.js中SendFlow对象使用：

```
new SendFlow({
    iconArray: [],
    jqDomID: '',
    canvasWidth: 100,
    canvasHeight: 200,
    initDomFinish: function(bubbleHeart, currentIcon) { 
        // DOM(画布、图片)初始化完成
    },
    click: function(bubbleHeart, currentIcon){
        // 点击JQDOM特效
    }
});

```