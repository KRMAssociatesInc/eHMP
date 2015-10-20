var hasClass = function(elem, className){
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

var addClass = function(elem, className){
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
};

var removeClass = function(elem, className){
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
};

function getOffset(el) {
    var _x = 0,
        _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


var easing = {
    linear: function (t) {
        return t;
    },
    easeInQuad: function (t) {
        return t*t;
    },
    easeOutQuad: function (t) {
        return t*(2-t);
    },
    easeInOutQuad: function (t) {
        return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    },
    easeInCubic: function (t) {
        return t*t*t;
    },
    easeOutCubic: function (t) {
        return (--t)*t*t+1;
    },
    easeInOutCubic: function (t) {
        return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
    },
    easeInQuart: function (t) {
        return t*t*t*t;
    },
    easeOutQuart: function (t) {
        return 1-(--t)*t*t*t;
    },
    easeInOutQuart: function (t) {
        return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
    },
    easeInQuint: function (t) {
        return t*t*t*t*t;
    },
    easeOutQuint: function (t) {
        return 1+(--t)*t*t*t*t;
    },
    easeInOutQuint: function (t) {
        return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
    }
};

if ('querySelector' in document && 'addEventListener' in window && Array.prototype.forEach){
    document.addEventListener('DOMContentLoaded', function(){
        
        var backtotop = document.getElementById('backtotop'),
            titlebar = document.getElementById('titlebar'),
            titlebar_container = document.getElementById('titlebar-container'),
            titlebar_height = titlebar.offsetHeight;
        
        // titlebar isn't fixed without javascript
        // we know we have javascript enabled now, so set the titlebar as fixed, and offset the body with padding to match
        addClass(titlebar_container, 'fixed');
        document.body.style.padding = titlebar_height+"px 0 0";
        
        // jumplinks
        var subnavlinks = document.querySelectorAll('.toc a');
        [].forEach.call(subnavlinks, function(l){
            l.addEventListener('click', function(e){
                e.preventDefault();
                var target = l.getAttribute('data-target');
                goToJumpLink(target);
            }, false);
        });
        
        // if the user comes to this screen with a hash in the url, attempt to jump to that section
        var url = location.href;
        var anchorPos = url.indexOf("#");
        if (anchorPos !== -1){
            target = url.substr(anchorPos+1);
            goToJumpLink(target);
        }
        
        // back-to-top button
        backtotop.addEventListener('click', function(e){
            goToJumpLink('top');
        }, false);
        
        var listener = function () {
            var y = window.pageYOffset;

            if (y >= titlebar_height) {
                addClass(backtotop, 'active');
            } else {
                removeClass(backtotop, 'active');
            }
        };
        window.addEventListener('scroll', listener, false);
        
        // animate to a particualr anchor on the page
        function goToJumpLink(el){
            var jump = document.getElementById(el),
                t = getOffset(jump).top,
                scrolltop = document.body.scrollTop,
                newscrolltop = (t-(titlebar_height-2))+scrolltop;

            window.scroll(0, newscrolltop);
        }
    });     
}
