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
        $(".loadding").hide();
        $(".app").show();

        FastClick.attach(document.body);
        Op.refreshView();

        $(".app .empty.add").on("click", function() {
            $(".create").addClass("show");
            Op.getGeolocation();
        });

        $(".create .cancelCreate").on("click", function() {
            $(".create").removeClass("show");
        });

        $(".locationSection .cancelCreate").on("click", function() {
            $(".locationSection").removeClass("show");
        });

        $(".create .location").on("click", function() {
            var l = Op.getLocations();
            if (l) {
                $(".locationSection").addClass("show");
            } else {
                // navigator.notification.alert("正在加载位置");
            }

        });

        $(".create #send").on("click",function(){
            var srcs = [],param = {};
            $(".create .img-picker [src]").each(function(i,n) {
                // console.log($(n).attr("src"));
                var _n = $(n);
                srcs.push({src:_n.attr("src"),type:_n.attr("v-type"),isPosed:false});
            })
            var content = $(".create textarea").val();
            if(srcs.length==0&&content==""){
                $(".create").removeClass("show");
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
                Op.refreshView();
                $(".create").removeClass("show");
            });
            // Op.refreshApp();
            Request.postData(param);
        });


        $(".create .takePicture").on("click", function() {
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
var D = {
    geo: {},
    locations: [],
    from:"gaode"
};