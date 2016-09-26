var Utils = {
    isObject: function(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    },
    isArray: function(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    },
    isDate: function(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    },
    isNumber: function(input) {
        return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
    },
    isString: function(input) {
        return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
    },
    isBoolean: function(input) {
        return typeof input == "boolean";
    },
    isFunction: function(input) {
        return typeof input == "function";
    },
    isNull: function(input) {
        return input === undefined || input === null;
    },
    isUri: function(value) {
        return (value && value.trim() && uriReg.test(value.trim()));
    },
    getList: function(list, idName) {
        idName = idName === undefined ? "id" : idName;
        var _list = [];
        if (list && list.length) {
            list.forEach(function(n, i) {
                if (n[idName])
                    _list.push(n[idName]);
            });
        }
        return _list;
    },
    getDict: function(list, idName,titleName) {
        idName = idName === undefined ? "id" : idName;
        titleName = titleName === undefined ? "name" : titleName;
        var o = {};
        if (list && list.length) {
            for(l of list){
                o[l[idName]] = l[titleName];
            }
        }
        return o;
    },
    mergeArray: function(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) {
                    arr1.splice(i, 1);
                }
            }
        }
        for (var i = 0; i < arr2.length; i++) {
            arr1.push(arr2[i]);
        }
        return arr1;
    },
    deepCopy(data) {
        var copyOne = null;
        if (this.isObject(data)) {
            copyOne = {};
            for (var key in data) {
                copyOne[key] = this.deepCopy(data[key]);
            }
        } else if (this.isArray(data)) {
            copyOne = [];
            for (var index of data) {
                copyOne.push(this.deepCopy(index));
            }
        } else {
            copyOne = data;
        }
        return copyOne;
    },
    toArray: function(object, idName, titleName) {
        idName = idName === undefined ? "id" : idName;
        var list = [];
        $.each(object, function(key, value) {
            var n = {};
            if (idName) n[idName] = key;
            n[titleName] = value;
            list.push(n);
        });
        return list;
    },
    toObject: function(list, idName, hasNum) {
        hasNum = hasNum === undefined ? false : hasNum;
        idName = idName === undefined ? "id" : idName;
        var listO = {};
        $.each(list, function(i, n) {
            if (idName == "count") {
                listO[i] = n;
            } else {
                listO[n[idName]] = n;
                if (hasNum) {
                    listO[n[idName]].count = i;
                }
            }
        });
        return listO;
    },
    wordBreak: function(s) {
        return s.replace(/\r\n/g, "<BR/>").replace(/\n/g, "<BR/>");
    },
    getImage: function(url, w, h) {
        if (!url) return '';
        if (w == undefined && h == undefined) return url;
        if (w == undefined) w = h;
        if (h == undefined) h = w;
        return url+"?imageView2/1/w/"+w+"/h/"+h;
    }
};