/**
 * Namespace Object
 */
var NERD = NERD || {};

/**
 * Pass reference to jQuery and Namespace
 */
(function($, APP) {
    /**
     * DOM Ready Function
     */
    $(function() {
        APP.BreakpointChangeNotifier.init();
        APP.MainMenuToggler.init();
    });

/**
 * Event system that publishes when a user resizes window
 * across responsive breakpoint threshholds. Reads CSS for
 * content: '' attribute on body:after psuedo element.
 * 
 * @class BreakpointChangeNotifier
 * @static
 */
APP.BreakpointChangeNotifier = {
    /**
     * @property previousSize
     * @type String
     */
    previousSize: null,
    /**
     * @property currentSize
     * @type String
     */
    currentSize: null,
    /**
     * @property BREAKPOINT_CHANGE_EVENT
     * @type String
     * @final
     */
    BREAKPOINT_CHANGE_EVENT: 'onBreakpointChange',
    /**
     * @property SMALL
     * @type String
     * @final
     */
    SMALL: 'small',
    /**
     * @property MEDIUM
     * @type String
     * @final
     */
    MEDIUM: 'medium',
    /**
     * @property LARGE
     * @type String
     * @final
     */
    LARGE: 'large',
    /**
     * @method init
     */
    init: function() {
        if (window.getComputedStyle) {
            this.currentSize = this.getCurrentSize();
            this.bindResize();
        }
    },
    /**
     * @method bindResize
     */
    bindResize: function() {
        var self = this;
        $(window).resize(function() {
            var currentSize = self.getCurrentSize();
            self.handleResize(currentSize);
        });
    },
    /**
     * @method getCurrentSize
     */
    getCurrentSize: function() {
        return window.getComputedStyle(document.body,':after').getPropertyValue('content').replace(/"/g, "");
    },
    /**
     * @method handResize
     * @param {String} currentSize The current size detected from CSS
     */
    handleResize: function(currentSize) {
        if (this.currentSize !== currentSize) {
            this.previousSize = this.currentSize;
            this.currentSize = currentSize;
            this.notifyChange({currentSize: this.currentSize, previousSize: this.previousSize});
        }
    },
    /**
     * @method notifyChange
     * @param {Object} params Object holds attributes for previous and current breakpoint values
     */
    notifyChange: function(params) {
        var BREAKPOINT_CHANGE_EVENT = this.BREAKPOINT_CHANGE_EVENT;
        $(document).trigger(BREAKPOINT_CHANGE_EVENT, [params]);
    }
};

/**
 * @class MainMenuToggler
 * @static
 */
APP.MainMenuToggler = {
    /**
     * $mainMenu
     * @type {Object}
     */
    $mainMenu: null,
    /**
     * $menuToggler
     * @type {Object}
     */
    $menuToggler: null,
    /**
     * @method init
     */
    init: function() {
        var $mainMenu  = $(document.getElementById('js-navMain'));
        if ($mainMenu.length === 0)
            return
        this.$mainMenu = $mainMenu;

        var $menuToggler  = $('<i class="navToggler">toggle menu</i>');
        $mainMenu.before($menuToggler);
        
        this.$menuToggler = $menuToggler;

        if (APP.BreakpointChangeNotifier.currentSize === APP.BreakpointChangeNotifier.SMALL) {
            this.enable();
        }
        this.bindListener();
    },
    /**
     * @method bindListener
     */
    bindListener: function() {
        var self = this;
        $(document).on(APP.BreakpointChangeNotifier.BREAKPOINT_CHANGE_EVENT, function(e, params) {
            if (params.previousSize === APP.BreakpointChangeNotifier.SMALL) {
                self.disable();
            }
            if (params.currentSize === APP.BreakpointChangeNotifier.SMALL) {
                self.enable();
            }
        });
    },
    /**
     * @method enable
     */
    enable: function() {
        var self = this;
        this.$menuToggler.show().on('click', function() {
            self.toggleMenu();
        });
        this.$mainMenu.hide();
    },
    /**
     * @method disable
     */
    disable: function() {
        this.$menuToggler.hide().off();
        this.$mainMenu.show();
    },
    /**
     * @method toggleMenu
     */
    toggleMenu: function() {
        this.$mainMenu.slideToggle();
    }
};

}(jQuery, NERD));