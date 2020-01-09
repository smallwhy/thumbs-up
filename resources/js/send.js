/**
 * 实现效果：
 * 每隔10s请求一次点赞总数，请求回来后，每200ms飘一个心，5s内未飘完的话，5s处自动飘一个心，不计入总数；飘不完的话，5s内不飘心
 */

// 当前点击数
var sendFlowData = {
    sendNum: 0, // 点赞总数
    intervalObj: null,
    iconArrayData: [
        'resources/img/1.png',
        'resources/img/2.png',
        'resources/img/3.png',
        'resources/img/4.png',
        'resources/img/5.png',
    ],
    probability: [6, 3, 1, 1, 1], // 对应图片出现的概率
    percentIconArrayData: [] // 根据概率重新组合图标数组
};

// 初始化送花特效
function sendFLowEvent() {
    // 初始化对象
    new SendFlow({
        iconArray: sendFlowData.percentIconArrayData,
		jqDomID: 'send-flow-icon',
		canvasWidth: 140,
        canvasHeight: 300,
        initDomFinish: function(bubbleHeart, currentIcon) { // DOM(画布、图片)初始化完成
            // 每隔十秒请求一次
            sendFlowNum(bubbleHeart, currentIcon);
            setInterval(function(){
                // 请求接口获取点赞数
                sendFlowNum(bubbleHeart, currentIcon);
            }, 10000);
        },
		click: function(bubbleHeart, currentIcon){
            // 送花特效
            bubbleHeart.bubble(currentIcon[getIconArrayRandom()]);
        }
    });
}

// 请求后台接口获取点赞数
function getSendFlowNum() {
    return new Promise(function(resolve) {
        resolve(sendFlowData.sendNum+10);
    });
}
function sendFlowNum(sendFlowObj, currentIcon) {
    getSendFlowNum().then(function(num) {
        if ((parseInt(num) - parseInt(sendFlowData.sendNum)) > 0) { // 新增了点赞数
            var allNum = (parseInt(num) - parseInt(sendFlowData.sendNum));
            sendFlowObj.intervalObj = setInterval(function() {
                if (parseInt(allNum) > 0) {
                    sendFlowObj.bubble(currentIcon[getIconArrayRandom()]);
                    allNum--;
                } else {
                    clearInterval(sendFlowObj.intervalObj);
                }
            }, 200);
           // 小于25， 5s后送
           if ((Number(num) - Number(sendFlowData.sendNum)) < 25) {
               setTimeout(function(){
                   sendFlowObj.bubble(currentIcon[getIconArrayRandom()]);
               }, 5000);
           }
        } else {
            sendFlowObj.intervalObj && clearInterval(sendFlowObj.intervalObj);
        }
        sendFlowData.sendNum = num;
    });
}

// 初始化概率数组
function initPercentData() {
	var iconData = [];
	sendFlowData.probability.forEach(function(value, index, array) {
		var newAry=new Array(parseInt(value)).fill(sendFlowData.iconArrayData[index]);
		iconData = iconData.concat(newAry);
    });
    sendFlowData.percentIconArrayData = sendFlowData.percentIconArrayData.concat(iconData);
}

// 获取数组随机数
function getIconArrayRandom() {
    return Math.floor((Math.random()*sendFlowData.percentIconArrayData.length))
}

$(function(){
    // 初始化概率数组；
    initPercentData();

    // 初始化送花特效
    sendFLowEvent();
});