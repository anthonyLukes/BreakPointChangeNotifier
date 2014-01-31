/* ---------------------------------------------------------------------
Global JavaScript

Target Browsers: All
Authors: Anthony Lukes
------------------------------------------------------------------------ */

// Namespace Object
var NERD = NERD || {};

// Pass reference to jQuery and Namespace
(function($, APP) {

    // DOM Ready Function
    $(function() {
        APP.BreakpointChangeNotifier.init();
        APP.MainMenuToggler.init();
    });

/* ---------------------------------------------------------------------
BreakpointChangeNotifier
Author: Anthony Lukes

------------------------------------------------------------------------ */
APP.BreakpointChangeNotifier = {
    previousSize: null,
    currentSize: null,
    BREAKPOINT_CHANGE_EVENT: 'onBreakpointChange',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    init: function() {
        if (window.getComputedStyle) {
            this.currentSize = this.getCurrentSize();
            this.bindResize();
        }
    },
    bindResize: function() {
        var self = this;
        $(window).resize(function() {
            var currentSize = self.getCurrentSize();
            self.handleResize(currentSize);
        });
    },
    getCurrentSize: function() {
        return window.getComputedStyle(document.body,':after').getPropertyValue('content');
    },
    handleResize: function(currentSize) {
        if (this.currentSize !== currentSize) {
            this.previousSize = this.currentSize;
            this.currentSize = currentSize;
            this.notifyChange({currentSize: this.currentSize, previousSize: this.previousSize});
        }
    },
    notifyChange: function(params) {
        var BREAKPOINT_CHANGE_EVENT = this.BREAKPOINT_CHANGE_EVENT;
        $(document).trigger(BREAKPOINT_CHANGE_EVENT, [params]);
    }
};

/* ---------------------------------------------------------------------
MainMenuToggler
Author: Anthony Lukes

------------------------------------------------------------------------ */
APP.MainMenuToggler = {
    $mainMenu: null,
    $menuToggler: null,
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
    enable: function() {
        var self = this;
        this.$menuToggler.show().on('click', function() {
            self.toggleMenu();
        });
        this.$mainMenu.hide();
    },
    disable: function() {
        this.$menuToggler.hide().off();
        this.$mainMenu.show();
    },
    toggleMenu: function() {
        this.$mainMenu.slideToggle();
    }
};

}(jQuery, NERD));