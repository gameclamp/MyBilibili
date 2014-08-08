// ==UserScript==
// @name        MyBilibili
// @author      9尾雪狐
// @namespace   https://github.com/gameclamp/MyBilibili
// @include     http://bilibili.kankanews.com/video/*
// @include     http://www.bilibili.com/video/*
// @version     1
// @updateURL   https://github.com/gameclamp/MyBilibili/raw/master/MyBilibili.user.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==
var center = document.querySelector('.center');
if (center !== null) {
    center.style.cssText = 'position:static;left:0;margin:auto;width:auto;'
}
var obj;
var aid = unsafeWindow.aid || parseInt(unsafeWindow.url.match(/\d+/));
if (unsafeWindow.pageno) {
        var page = unsafeWindow.pageno
}
console.log(aid);
var embed = document.querySelector('#bofqi embed');
var tar = document.querySelector('div.tminfo');
var on404 = document.querySelector('.errmsg');
var apiUrl = 'http://api.bilibili.com/view?platform=android&appkey=0a99fa1d87fdd38c&type=json&batch=1&id=' + aid + '&check_area=1';
var div = document.createElement('div');
div.style.cssText = 'margin-top:3px;';
console.log(apiUrl);
if (embed) {
    console.log('1')
    var cid = document.querySelector('#bofqi embed') .attributes['flashvars'].value.match(/cid=(\d+)/) [1];
    var title = document.querySelector('.info h2') .title;
    console.log(cid);
    var myarr = makeA(cid, title,1);
    div.appendChild(myarr[0]);
    div.appendChild(myarr[1]);
    tar.appendChild(div);
} else {
    bannedView();
}
function bannedView() {
    GM_xmlhttpRequest({
        url: apiUrl,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 BiliDroid/2.6.4 (bbcallen@gmail.com)',
            'Accept-Encoding': 'gzip, deflate',
        },
        onload: function (res) {
            obj = eval('(' + res.responseText + ')');
            console.log(obj)
            var list = obj.list;
            for (var x in list) {
                console.log(list[x].cid)
                var myarr = makeA(list[x].cid, obj.title, list[x].page);
                div.appendChild(myarr[0]);
                div.appendChild(myarr[1]);
            }
            //if(on404 == null){
            //	var tar = document.querySelector('div.tminfo');
            //	tar.appendChild(div);
            //}else{

            if (tar) {
                tar.appendChild(div);
            } else {
            }
            document.querySelector('.center') .insertBefore(div, on404);
            var a3 = document.createElement('a');
            a3.href = 'javascript:void(0)';
            a3.innerHTML = '播放器死出来';
            a3.style.cssText = 'margin-left:13px;';
            a3.addEventListener('click', player);
            div.appendChild(a3);
            //}
        }
    })
}
function player() {
    //https://secure.bilibili.tv/secure,cid=1440901&aid=996612
    var ifr = document.createElement('iframe');
    ifr.src = 'https://secure.bilibili.tv/secure,cid=' + obj.list[0].cid + '&aid=' + aid;
    ifr.width = '950';
    ifr.height = '482';
    if (document.querySelector('iframe')) {
        document.querySelector('iframe') .remove();
    } else {
        document.querySelector('img') .remove();
    }
    document.querySelector('.center') .insertBefore(ifr, on404);
}
function makeA(cid, title, page) {
    var a1 = document.createElement('a');
    a1.href = 'b://aid=' + aid + ',cid=' + cid + ',h1=' + title
    //+'('+page+')';
    a1.innerHTML = '辅助地址' + page;
    var a2 = document.createElement('a');
    a2.href = 'http://comment.bilibili.com/' + cid + '.xml';
    a2.innerHTML = '弹幕地址' + page;
    a2.style.cssText = 'margin:auto 13px;';
    return [a1,
    a2]
}
