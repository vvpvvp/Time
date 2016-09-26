var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        Data.init();
        $(".globalloadding").hide();
        FastClick.attach(document.body);
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        MainPage.init();
    }
};

var MainPage = {
    content:null,
    myScroll:null,
    page:{},
    init:function(){
        this.content = $(".template.app").clone();
        this.content.removeClass("template")
        $("body").append(this.content);
        this.initEvents();
        this.refreshView();
    },
    refreshView:function(){
        var _this = this;
        this.page = {
            pageNo:0,
            pageSize:10
        }
        $(".list>div",_this.content).not(".createButton").remove();
        this.loadData();
        this.setUnPosed();
    },
    setUnPosed(){
        var _this = this;
        Data.getUnPosed(function(data){
            if(data.length>0){
                var t = $("<div class='unPosedTip'>您有"+data.length+"条数据未同步，点击<span class='link'>同步</span></div>");
                $("span",t).on("click",function(){
                    for (var i = data.length - 1; i >= 0; i--) {
                        Request.postData(data[i]);
                    }
                    t.remove();
                });
                $(".list",_this.content).prepend(t);
            }
        });
    },
    loadData(){
        var _this = this;
        this.page.pageNo++;
        Data.list(this.page,function(data){
            var html = "";
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                var m = moment(data[i].updateAt);
                html += '<div><div class="calarder"><span class="date">'+m.date()+'</span>&nbsp;&nbsp;<span class="month">'+m.month()+'月</span></div>';
                if(d.urls.length==0){
                    html += '<div class="images empty"><div>空</div></div>';
                }else{
                    html += '<div class="images"><div class="img" style="background-image:url('+d.urls[0].src+')"></div></div>';
                }
                html += '<div class="content"><div class="word">'+d.content+'</div><div class="desc">'+d.address+'</div></div></div>';
            }
            $(".list",_this.content).append(html);
            $(".pullDown,.pullUp",this.content).removeClass("flip loading");
            _this.myScroll.refresh();
        });
    },
    initEvents(){
        var _this = this;
        $(".empty.add",_this.content).on("click", function() {
            CreatePage.init();
        });
        var pullDownEl = $(".pullDown",this.content);
        var pullUpEl = $(".pullUp",this.content);
        this.myScroll = new iScroll(this.content[0], {
            scrollbarClass: 'myScrollbar', /* 重要样式 */
            useTransition: true, /* 此属性不知用意，本人从true改为false */
            topOffset: 0,
            onRefresh: function () {
                // if (pullDownEl.className.match('loading')) {
                //     pullDownEl.className = '';
                //     pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                // } else if (pullUpEl.className.match('loading')) {
                //     pullUpEl.className = '';
                //     pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                // }
            },
            onScrollMove: function () {
                // if (this.y > 5 && !pullDownEl.className.match('flip')) {
                //     pullDownEl.className = 'flip';
                //     pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                //     this.minScrollY = 0;
                // } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                //     pullDownEl.className = '';
                //     pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                //     this.minScrollY = -pullDownOffset;
                // } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                //     pullUpEl.className = 'flip';
                //     pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                //     this.maxScrollY = this.maxScrollY;
                // } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                //     pullUpEl.className = '';
                //     pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                //     this.maxScrollY = pullUpOffset;
                // }
                if (this.y > 5 && !pullDownEl.hasClass('flip')) {
                    pullDownEl.addClass("flip");
                    this.minScrollY = 0;
                }  else if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
                    pullUpEl.addClass("flip");
                    this.maxScrollY = this.maxScrollY;
                }
            },
            onScrollEnd: function () {
                if (pullDownEl.hasClass('flip')&&!pullDownEl.hasClass('loading')) {
                    pullDownEl.addClass('loading');
                    this.refresh();
                    this.scrollTo(0,0,0);
                    _this.refreshView();
                } else if (pullUpEl.hasClass('flip')&&!pullUpEl.hasClass('loading')) {
                    pullUpEl.addClass('loading'); 
                    this.refresh();
                    this.scrollTo(0,this.maxScrollY,0);
                    _this.loadData();
                }
            }
        });
    }
}


var CreatePage = {
    content:null,
    init:function(){
        var _this = this;
        this.content = $(".template.create").clone();
        this.content.removeClass("template");
        $("body").append(this.content);
        setTimeout(function() {
            _this.content.addClass("show");
        }, 0);
        this.getGeolocation();
        this.initEvents();
    },
    destroy(){
        var _this = this;
        this.content.removeClass("show");
        setTimeout(function() {
            _this.content.remove();
        }, 500);
    },
    getGeolocation:function() {
        D.geo = {};
        var _this = this;
        $(".location-desc",_this.content).text("正在加载地址");
        navigator.geolocation.getCurrentPosition(function(position) {
            var coords = D.coords = GPS.gcj_encrypt(position.coords.latitude,position.coords.longitude);
            // var coords = D.coords = GPS.gcj_encrypt(100.015907,9.517026);
            position.location = (coords.lon) + "," + (coords.lat);
            position.googleLocation = (coords.lat) + "," + (coords.lon);
            D.geo = position;
            // console.log(position.googleLocation);
            $(".location-desc",_this.content).text("已获取坐标");
            Address.getAddress(function(l){
                D.geo.address = l;
                $(".location-desc",_this.content).text(l);
            });
        }, function(error) {
        }, { maximumAge: 3000, timeout: 100000, enableHighAccuracy: true });
    },
    initEvents(){
        var _this = this;
        
        $(".cancelCreate",_this.content).on("click", function() {
            _this.destroy();
        });

        $(".location",_this.content).on("click", function() {
            if (!D.geo.location) {
                return false;
            }
            locationSectionPage.init();

        });

        $("#send",_this.content).on("click",function(){
            var srcs = [],param = {};
            $(".img-picker [src]",_this.content).each(function(i,n) {
                // console.log($(n).attr("src"));
                var _n = $(n);
                srcs.push({src:_n.attr("src"),type:_n.attr("v-type"),isPosed:false});
            })
            var content = $("textarea",_this.content).val();
            if(srcs.length==0&&content==""){
                _this.destroy();
            }
            var time = (new Date()).getTime();
            var param = {
                id:time,
                urls:srcs,
                position:D.geo,
                address:D.geo.address,
                content:content,
                updateAt:time,
                isPosed:0
            };
            Data.save(param,function(){
                MainPage.refreshView();
                _this.destroy();
            });
            // Op.refreshApp();
            Request.postData(param);
        });


        $(".takePicture",_this.content).on("click", function() {
            menuControl([
                {
                    op:"拍照",
                    trigger:function(){
                        Op.takePicture();
                    }
                },
                {
                    op:"从手机相册选择",
                    trigger:function(){
                        Op.getPicture();
                    }
                },{
                    op:"录音",
                    trigger:function(){
                        Op.captureAudio();
                    }
                }
            ]);
        });
    }
};

var locationSectionPage = {
    content:null,
    init:function(){
        var _this = this;
        this.content = $(".template.locationSection").clone();
        this.content.removeClass("template");
        $("body").append(this.content);
        setTimeout(function() {
            _this.content.addClass("show");
        }, 0);
        this.getLocations();
        this.initEvents();
    },
    destroy(){
        var _this = this;
        this.content.removeClass("show");
        setTimeout(function() {
            _this.content.remove();
        }, 500);
    },
    getLocations:function() {
        var _this = this;
        $(".listloadding",_this.content).show();
        $(".locationList",_this.content).empty();

        Address.getPOI(function(locations){
            var html = "";
            for(var i = 0; i < locations.length; i++){
                var loc = locations[i];
                html += '<li>';
                html += '<p class="word">'+loc.title+'</p>';
                if(loc.description)html += '<p class="font12 gray1">'+loc.description+'</p>';
                html += '</li>';
            }
            $(".locationList",_this.content).append(html);
            $(".listloadding",_this.content).hide();
            $(".locationList li",_this.content).on("click",function(){
                var l = $(".word",this).text();
                D.geo.address = l;
                $(".location-desc",CreatePage.content).text(l);
                _this.destroy();
            });
        });
        return true;
    },
    initEvents(){
        var _this = this;
        $(".cancelCreate",_this.content).on("click", function() {
            _this.destroy();
        });
    }
};
var D = {
    geo: {},
    locations: [],
    from:"gaode"
};