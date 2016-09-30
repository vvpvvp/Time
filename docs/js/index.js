$(function() {
    $(".globalloadding").hide();
    FastClick.attach(document.body);
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    MainPage.init();
});

var MainPage = {
    content: null,
    myScroll: null,
    page: {},
    isLoadEnd: false,
    loadding: false,
    data: [],
    init: function() {
        this.content = $(".app");
        this.initEvents();
        this.refreshView();
    },
    refreshView: function() {
        var _this = this;
        this.page = {
            pageNo: 0,
            pageSize: 10
        }
        _this.isLoadEnd = false;
        _this.data = [];
        $(".pullUp", _this.content).show();
        $(".list>div", _this.content).not(".createButton").remove();
        this.loadData();
    },
    loadData() {
        var D = Data;
        var _this = this;
        if (_this.loadding || _this.isLoadEnd) {
            return false;
        }
        _this.loadding = true;
        this.page.pageNo++;
        Request.list(this.page.pageNo).then(function(data) {
            var html = "";
            data = D.parse(data);
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                var m = moment(data[i].updateAt),
                    show = Utils.getShowTime(m);
                // if(d.urls.length==0){
                //     html += '<div class="images empty"><div>空</div></div>';
                // }else{
                //     html += '<div class="images"><div class="img" style="background-image:url('+d.urls[0].src+')"></div></div>';
                // }
                html += '<div v-index="' + (_this.data.length + i) + '"><div class="word"><pre>' + d.content + '</pre></div><div class="imgContainer">';
                // if(i%2==1){
                //     d.urls = [
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FmdzHoHKrg61R_azF5Y4JYMv14Ma",type:"audio"},
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FgShjwQG8x1BDUjuIo00ytBz3MCB",type:"img"},
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FkohLPR86y6lvYPwLWSXvmmK-qPQ",type:"img"},
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FmdzHoHKrg61R_azF5Y4JYMv14Ma",type:"audio"},
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FgShjwQG8x1BDUjuIo00ytBz3MCB",type:"img"},
                //         {src:"http://7xpm14.com1.z0.glb.clouddn.com/FkohLPR86y6lvYPwLWSXvmmK-qPQ",type:"img"}
                //     ];
                // }
                d.show = show;
                for (var j = 0; j < d.urls.length; j++) {
                    var url = d.urls[j];
                    if (url.type == "img") {
                        html += '<div class="images" v-index="' + j + '" v-type="img" style="background-image:url(' + url.src + '?imageView2/1/w/400/h/400)" src="' + url.src + '"></div>';
                    } else {
                        html += '<div class="images audio" v-index="' + j + '" v-type="audio" src="' + url.src + '"><span class="icon-mic"></span></div>';
                    }
                }
                html += '</div><div class="font14 time">' + show.s + '<span class="gray font12"> · ' + show.v + '</span></div><div class="desc">' + d.address + '</div></div>';
            }
            $(".list", _this.content).append(html);
            $(".pullDown,.pullUp", this.content).removeClass("flip loading");
            _this.myScroll.refresh();
            if (data.length < 10) {
                $(".pullUp", _this.content).hide();
                _this.isLoadEnd = true;
            }
            _this.data = _this.data.concat(data);
            _this.loadding = false;
        });
    },
    initEvents() {
        var _this = this;
        $(".createButton", _this.content).on("click", function() {
            CreatePage.init();
        });
        _this.content.on("click", ".images", function(event) {
            var _t = $(event.currentTarget);
            var j = parseInt(_t.attr("v-index"));
            var i = parseInt(_t.parent().parent().attr("v-index"));
            console.log("i:" + i + ",j:" + j);
            previewAllPage.init(i, j);
        });
        var pullDownEl = $(".pullDown", this.content);
        var pullUpEl = $(".pullUp", this.content);
        this.myScroll = new iScroll(this.content[0], {
            scrollbarClass: 'myScrollbar',
            /* 重要样式 */
            useTransition: true,
            /* 此属性不知用意，本人从true改为false */
            topOffset: 0,
            onRefresh: function() {
                // log(this);
                if (this.scrollerH < _this.content.height()) {
                    pullUpEl.hide();
                } else {
                    pullUpEl.show();
                }
                // if (pullDownEl.className.match('loading')) {
                //     pullDownEl.className = '';
                //     pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                // } else if (pullUpEl.className.match('loading')) {
                //     pullUpEl.className = '';
                //     pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                // }
            },
            onScrollMove: function() {
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
                } else if (this.y <= this.maxScrollY && !_this.loadding && !_this.isLoadEnd) {
                    _this.loadData();
                    this.maxScrollY = this.maxScrollY;
                }
            },
            onScrollEnd: function() {
                if (pullDownEl.hasClass('flip') && !pullDownEl.hasClass('loading')) {
                    pullDownEl.addClass('loading');
                    this.refresh();
                    this.scrollTo(0, 0, 0);
                    _this.refreshView();
                }else if (this.y <= this.maxScrollY && !_this.loadding && !_this.isLoadEnd) {
                    _this.loadData();
                }
            }
        });
    }
};

var previewAllPage = {
    content: null,
    showData: {},
    init: function(i, j) {
        var _this = this;
        this.content = $(".template.previewAllSection").clone();
        this.content.removeClass("template");
        $("body").append(this.content);
        setTimeout(function() {
            _this.content.addClass("show");
        }, 0);
        setTimeout(function() {
            _this.initContent(i, j);
            _this.initEvents();
        }, 500);
    },
    destroy: function() {
        var _this = this;
        _this.gallery.destroy();
        this.content.removeClass("show");
        setTimeout(function() {
            _this.content.remove();
        }, 500);
    },
    initContent: function(i, j) {
        var _this = this;
        this.initAudioControl();
        var p1 = this.initPreviewContent(i, j, -1);
        var p2 = this.initPreviewContent(i, j, 0);
        var p3 = this.initPreviewContent(i, j, 1);
        var list = [],
            index = 1;
        if (p1) {
            list.push(p1);
        } else {
            index = 0;
        }
        list.push(p2);
        if (p3) list.push(p3);
        var _c = $(".swiper-container", this.content);
        var isInit = index == 0;
        var setNow = function(m) {
            var nowPosition = _this.getNextPosition(i, j, m);
            if (!nowPosition) return false;
            i = nowPosition.i;
            j = nowPosition.j;
            var data = MainPage.data[i];
            // console.log(data);
            $(".title", _this.content).html('<span>' + moment(data.updateAt).format("kk") + '</span>');
            $(".bottomContent pre", _this.content).html(data.content);
            $(".bottomContent div", _this.content).html(data.address);
        }
        this.gallery = new Swiper(_c[0], {
            onSlideNextStart: function(s) {
                if (!isInit) {
                    isInit = true;
                    return true;
                }
                setNow(1);
                if (s.activeIndex == s.slides.length - 1) {
                    var p = _this.initPreviewContent(i, j, 1);
                    if (!p) {
                        return true;
                    }
                    console.log("appendRight");
                    s.appendSlide(p);
                }
            },
            onSlidePrevStart: function(s) {
                setNow(-1);
            },
            onSlidePrevEnd: function(s) {
                if (s.activeIndex == 0) {
                    var p = _this.initPreviewContent(i, j, -1);
                    if (!p) {
                        return true;
                    }
                    console.log("appendLeft");
                    s.prependSlide(p);
                }
            },

            nextButton: $(".swiper-button-next", _this.content),
            prevButton: $(".swiper-button-prev", _this.content)
        });
        this.gallery.appendSlide(list);
        this.gallery.slideTo(index, 0);
        setNow(0);

    },
    getNextPosition: function(i, j, direction) {
        var data = MainPage.data[i];
        if (data.urls.length <= (j + direction)) {
            if (i == MainPage.data.length - 1) {
                return false;
            }
            i++;
            j = 0;
        } else if (j + direction < 0) {
            if (i == 0) {
                return false;
            }
            i--;
            data = MainPage.data[i];
            j = data.urls.length - 1;
        } else {
            j += direction;
        }
        return { i: i, j: j };
    },
    initPreviewContent: function(i, j, direction) {
        var _this = this;
        var data = MainPage.data[i];
        var p = this.getNextPosition(i, j, direction);
        if (!p) {
            return false;
        }
        data = this.showData = MainPage.data[p.i];
        if (data.urls.length == 0) {
            return '<div class="swiper-slide empty" v-type="empty"><pre>' + data.content + '<pre></div>'
        }
        data.url = data.urls[p.j];
        var html = "";

        if (data.url.type == "img") {
            html += '<div class="swiper-slide" v-type="img" style="background-image:url(' + data.url.src + ')"></div>';
        } else {
            html += '<div class="swiper-slide" v-type="audio" src="' + data.url.src + '"><div class="audioControl"><span class="icon-play"></span><span class="icon-pause"></span></div></div>';
        }

        return html;

        // $(".imgPreview",this.content).append(con);
    },
    initAudioControl: function() {
        var _this = this;
        _this.content.on('click', "[v-type='audio']", function(event) {
            var _n = $(event.currentTarget),
                _content = _n.children();
            if (!_content.hasClass("play")) {
                $(".audioControl", _this.content).removeClass("play");
                // if(_this.media){
                //     _this.media.stop();
                // }
                _this.media = new Media(_n.attr("src"), function() {
                    _content.removeClass("play");
                });

                _content.addClass("play");
                _this.media.play();

            } else {
                _content.removeClass("play");
                _this.media.pause();
            }
        })
    },
    initEvents: function() {
        var _this = this;
        $(".cancelCreate", _this.content).on("click", function() {
            _this.destroy();
        });
    }
};
