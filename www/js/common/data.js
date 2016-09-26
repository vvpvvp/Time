var Data = {
    init:function(){
        var db = this.open();
        var _this = this;
        db.transaction(function(tx){
            // tx.executeSql('DROP TABLE IF EXISTS daily');
            tx.executeSql('CREATE TABLE IF NOT EXISTS daily (id unique, urls,position,address,content,type,updateAt,isPosed)');
        });
    },
    open:function(){
        return window.openDatabase("Database", "1.0", "Time", 200000);
    },
    save:function(param,callback){
        this.execute(param,"insert",callback);
    },
    list:function(page,callback){
        var db = this.open();
        var _this = this;
        var start = (page.pageNo-1)*page.pageSize;
        var end = start + page.pageSize;
        db.transaction(function(tx){
            tx.executeSql("select * from daily order by updateAt desc limit " +start+","+end,[],function(tx,result){
                if(Utils.isFunction(callback)){
                    if(result.rows){
                        callback.call(null,_this.parse(result.rows));
                    }
                }
            });
        });
    },
    update:function(param,callback){
        this.execute(param,"update",callback);
    },
    getUnPosed:function(callback){
        var db = this.open();
        var _this = this;
        db.transaction(function(tx){
            var now = (new Date()).getTime()-3*1000*60;
            tx.executeSql("select * from daily where isPosed = 0 and updateAt <= "+now+" order by updateAt",[],function(tx,result){
                if(Utils.isFunction(callback)){
                    if(result.rows){
                        callback.call(null,_this.parse(result.rows));
                    }
                }
            });
        });
    },
    updateStatus:function(data){
        var db = this.open();
        db.transaction(function(tx){
            tx.executeSql("update daily set isPosed = 1 where id = " + data.id);
        });
    },
    dispose:function(data){
        data = Utils.deepCopy(data);
        if(data.position){
            data.position = JSON.stringify(data.position);
        }
        if(data.urls){
            data.urls = JSON.stringify(data.urls);
        }
        return data;
    },
    parse:function(data){
        var list = [];
        for (var i = 0; i < data.length; i++) {
            var d = Utils.deepCopy(data.item(i));
            if(d.position){
                try{
                    d.position = JSON.parse(d.position);
                }catch(e){
                    d.position = {};
                }
            }
            if(d.urls){
                try{
                    d.urls = JSON.parse(d.urls);
                }catch(e){
                    d.urls = [];
                }
            }
            list.push(d);
        }
        return list;
    },
    execute:function(data,type,callback){
        data = this.dispose(data);
        var list = [],title = [];
        for (var d in data) {
            title.push(d);
            var v = data[d];
            if(v==undefined){
                v = "";
            }
            v = Utils.isString(v)?("'"+v+"'"):v;
            list.push(v);
        }
        var  sql = 'insert into daily ('+title.join(",")+') values ('+list.join(",")+')';
        var db = this.open();
        if(type == "insert"){
            db.transaction(function(tx){
                tx.executeSql(sql);
                if(Utils.isFunction(callback)){
                    callback.call(null);
                }
            });
        }else{
            db.transaction(function(tx){
                // tx.executeSql("delete from daily where id = "+data.id);
                // tx.executeSql(sql);
                tx.executeSql("update daily set urls = '"+data.urls+"' where id = " + data.id);

            });
        }
    },
    saveLocal: function(name, value) {
        if (window.localStorage && JSON && name && value) {
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            window.localStorage[name] = value;
            return true;
        }
        return false;
    },
    getLocal: function(name, type) {
        if (window.localStorage && JSON && name) {
            var data = window.localStorage[name];
            if (type && type == "json" && data !== undefined) {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.error("取数转换json错误" + e);
                    return "";
                }
            } else {
                return data;
            }
        }
        return null;
    },
    removeLocal:function(name){
        if (window.localStorage && JSON && name) {
            window.localStorage[name] = null;
        }
        return null;
    },
    saveCookie: function(name, value, minSec, path) {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (name && cookieEnabled) {
            path = path || "/";
            if (typeof value == "object") {
                value = JSON.stringify(value);
            }
            var exp;
            if (minSec) {
                exp = new Date(); //new Date("December 31, 9998");  
                exp.setTime(exp.getTime() + minSec * 1000);
            }

            document.cookie = name + "=" + escape(value) + (minSec ?
                (";expires=" + exp.toGMTString()) : ""
            ) + ";path=" + path;
            return true;
        }
        return false;
    },
    getCookie: function(name) {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (name && cookieEnabled) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
        }
        return null;
    },
    removeCookie: function(name, path) {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (name && cookieEnabled) {
            var exp = new Date();
            path = path || "/";
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=" + path;
            return true;
        }
        return false;
    }
};
