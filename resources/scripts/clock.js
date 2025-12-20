/* Real-time clock (client-side). Lightweight, respects simple config attributes on #cf-clock */
(function(){
    function pad(n){return n < 10 ? ('0' + n) : String(n);}

    function is12Hour(fmt){
        if(!fmt) return false;
        // treat lowercase 'hh' as 12-hour only when uppercase 'HH' is absent
        return fmt.indexOf('hh') !== -1 && fmt.indexOf('HH') === -1;
    }

    function formatDate(d, fmt){
        var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
        if(is12Hour(fmt)){
            var ampm = h < 12 ? 'AM' : 'PM';
            var hh = h % 12 || 12;
            return (('0' + hh).slice(-2)) + ':' + pad(m) + ':' + pad(s) + ' ' + ampm;
        }
        return (('0' + h).slice(-2)) + ':' + pad(m) + ':' + pad(s);
    }

    document.addEventListener && document.addEventListener('DOMContentLoaded', function(){
        var el = document.getElementById('cf-clock');
        if(!el) return;
        var fmt = el.getAttribute('data-format') || 'HH:mm:ss';
        var tz = (el.getAttribute('data-timezone') || 'local').toLowerCase();

        function nowForTz(date, tzMode){
            if(tzMode === 'utc'){
                return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            }
            return date;
        }

        function update(){
            var d = nowForTz(new Date(), tz);
            el.textContent = formatDate(d, fmt);
        }

        update();
        var timer = setInterval(update, 1000);
        window.addEventListener('unload', function(){ clearInterval(timer); });
    });
})();
