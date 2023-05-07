CAPS.SCHEDULE = {

    // 延迟执行回调函数
    postpone: function (callback, context, wait) {

        return function () {
            setTimeout(function () {
                callback.apply(context, arguments);
            }, wait);
        };

    },

    // 延迟执行节流函数
    deferringThrottle: function (callback, context, wait) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

        var execute = function (arguments) {
            callback.apply(context, arguments);
            setTimeout(function () {
                if (deferredCalls) {
                    deferredCalls = false;
                    execute(args);
                } else {
                    blocked = false;
                }
            }, wait);
        };

        var blocked = false; // 标志是否已经有一个执行在等待
        var deferredCalls = false; // 标志是否有调用被推迟
        var args = undefined; // 推迟调用时的参数

        return function () {
            if (blocked) {
                args = arguments;
                deferredCalls = true;
                return;
            } else {
                blocked = true;
                deferredCalls = false;
                execute(arguments);
            }
        };

    }

};
