// ==UserScript==
// @name         Chuiyao next-page prefetcher
// @namespace    https://github.com/Jeni4/Chuiyao-next-page-prefetcher/
// @version      1.0.1.1
// @description  Prefetches the next page when viewing a manhua chapter on chuixue.com so the surfing experience is percived much more smoothly.
// @author       Jeni4
// @match        http://www.chuiyao.com/manhua/*/*.html*
// @grant        none
// @downloadURL  https://github.com/Jeni4/Chuiyao-next-page-prefetcher/raw/master/chuiyao-next-page-prefetcher.user.js
// @updateURL    https://github.com/Jeni4/Chuiyao-next-page-prefetcher/raw/master/chuiyao-next-page-prefetcher.user.js
// @license
// @copyright
// ==/UserScript==

/* Static Variables */
var Base64={
    _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode:function(e){
        var t="";
        var n,r,i,s,o,u,a;
        var f=0;
        e=Base64._utf8_encode(e);
        while(f<e.length){
            n=e.charCodeAt(f++);
            r=e.charCodeAt(f++);
            i=e.charCodeAt(f++);
            s=n>>2;
            o=(n&3)<<4|r>>4;
            u=(r&15)<<2|i>>6;
            a=i&63;
            if(isNaN(r)){
                u=a=64;
            }
            else if(isNaN(i)){
                a=64;
            }
            t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);
        }
        return t;
    },
    decode:function(e){
        var t="";
        var n,r,i;
        var s,o,u,a;
        var f=0;
        e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
        while(f<e.length){
            s=this._keyStr.indexOf(e.charAt(f++));
            o=this._keyStr.indexOf(e.charAt(f++));
            u=this._keyStr.indexOf(e.charAt(f++));
            a=this._keyStr.indexOf(e.charAt(f++));
            n=s<<2|o>>4;
            r=(o&15)<<4|u>>2;
            i=(u&3)<<6|a;
            t=t+String.fromCharCode(n);
            if(u!=64){
                t=t+String.fromCharCode(r);
            }
            if(a!=64){
                t=t+String.fromCharCode(i);
            }
        }
        t=Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode:function(e){
        e=e.replace(/\r\n/g,"\n");
        var t="";
        for(var n=0;
            n<e.length;
            n++){
            var r=e.charCodeAt(n);
            if(r<128){
                t+=String.fromCharCode(r);
            }
            else if(r>127&&r<2048){
                t+=String.fromCharCode(r>>6|192);
                t+=String.fromCharCode(r&63|128);
            }
            else{
                t+=String.fromCharCode(r>>12|224);
                t+=String.fromCharCode(r>>6&63|128);
                t+=String.fromCharCode(r&63|128);
            }
        }
        return t;
    },
    _utf8_decode:function(e){
        var t="";
        var n=0;
        var r=c1=c2=0;
        while(n<e.length){
            r=e.charCodeAt(n);
            if(r<128){
                t+=String.fromCharCode(r);
                n++;
            }
            else if(r>191&&r<224){
                c2=e.charCodeAt(n+1);
                t+=String.fromCharCode((r&31)<<6|c2&63);
                n+=2;
            }
            else{
                c2=e.charCodeAt(n+1);
                c3=e.charCodeAt(n+2);
                t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
                n+=3;
            }
        }
        return t;
    }
};

/* Dynamic Variables */
var currentPage = document.querySelector( '#qTcms_CurentPage1' );
var last = document.querySelector( '#qTcms_TotalPage1' );
var nextPage = Number (currentPage.innerHTML) + 1;
var lastPage = Number (last.innerHTML);
var chURL = location.protocol + '//' + location.hostname + location.pathname;
var pageDiff = Number (lastPage - nextPage);
var images = Base64.decode( qTcms_S_m_murl_e ).split( '$qingtiandy$' );

/**/
if      (pageDiff < 0) var max = 0;
else if (pageDiff < 1) var max = 1;
else if (pageDiff < 2) var max = 2;
else                   var max = 3;

/* Prefetch the next 2 images before the pages gets prerendered/prefetched. */
for (var i=0; i<max; i++) {
    var nextImage = document.createElement( 'link' );
    var number = nextPage+i-1;
    nextImage.setAttribute( 'rel', 'prefetch' );
    /*
	nextImage.setAttribute( 'n', number );
	nextImage.setAttribute( 'page', number+1 );
	*/
    if (i<2) {
        nextImage.href = images[number];
        document.getElementsByTagName( 'head' )[0].appendChild( nextImage );
    }
}

/* Prerender next page and prefetch two pages after the next page. */
for (var j=0; j<max; j++) {
    var preLink = document.createElement( 'link' );
    var number = nextPage+j;

    if (j<1) preLink.setAttribute( 'rel', 'prerender' );
    else     preLink.setAttribute( 'rel', 'prefetch' );

    preLink.href = chURL + '?p=' + number;
    document.getElementsByTagName( 'head' )[0].appendChild( preLink );
}

querySelector( 'body > div:nth-child(15)' )[0].style.display = 'none';
querySelector( 'body > div:nth-child(16)' )[0].style.display = 'none';
querySelector( 'body > div:nth-child(25)' )[0].style.display = 'none';

