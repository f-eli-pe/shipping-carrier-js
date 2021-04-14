/*jshint esversion: 6 */

(function() {

    const $ = jQuery;

    //debug info
    const SHOW_VALIDATION_STATUS = true; //set to true to show green arrow
    const SHOW_LINK_WHEN_VALID   = false; //set to true to make link active

    // =========================================================================

    /**
     * Contructor
     *
     * @param jQuery Element $el  Input element
     * @param jQuery Element $out Output element
     */
    var _ = function($el, $out) {
        var self = this;

        this.$el = $el;
        this.$out = $out;
        this.$ac = null;

        this.hideTimeout = null;

        this.$el.on("focus keyup", function(e) {
            // When focusing or typing in field, we show the dropdown and
            // status on the field (ok/ko)
            self.show();
            self.status();
        }).on("blur", function(e) {
            // When bluring the field, we hide the dropdown (with a small
            // delay to manage the click on items)
            self.hide(); 
        });

        // We hide the output element
        /*this.$out
            .hide()
            .removeClass("hidden");*/
    };

    // -------------------------------------------------------------------------

    /**
     * Show the dropdown based on the result of this.items()
     */
    _.prototype.show = function() {
        var self = this;

        this.hide(true);

        var items = this.items(this.$el.val());
        if (!items.length) {
            return;
        }

        var pos = this.$el.position();

        this.$ac = $("<div/>")
            .addClass("ac-list resoult-tab")
            .css({
                left: pos.left + "px",
                
                width: this.$el.outerWidth(true) + "px",
            })
            .insertAfter(this.$el);

        var $ul = $("<ul/>")
            .appendTo(this.$ac);

        items.forEach(function(item) {
            if(item.freight == "true"){
                var badge = $('<span />')
                    .addClass('badge badge-pill badge-info')
                    .text('Freight');
            }
            var $opt = $("<li/>")
                .text(item.short_name)
                .append(badge)
                .data({ info: item })
                .appendTo($ul)
                .click(function(e) {
                    self.select($(this));
                });

            if(items.length == 1){
                $opt.click();
                self.hide();
            }
        });
        
    };

    /**
     * Hide the dropdown with a little delay
     *
     * @param Boolean immediate Skip the delay, hide immediately
     */
    _.prototype.hide = function(immediate) {
        var self = this;

        if (immediate === undefined) {
            immediate = false;
        }

        if (this.hideTimeout !== null) {
            window.clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        if (this.$ac === null) {
            return;
        }

        var d = function() {
            self.$ac.remove();
            self.$ac = null;

            self.hideTimeout = null;
        };

        if (immediate) {
            d();
            return;
        }

        this.hideTimeout = window.setTimeout(function() {
            d();
        }, 200);
    };

    /**
     * Update the status of the field (none/ok/ko), depending on the exact
     * match of the ID
     */
    _.prototype.status = function() {
        if (!SHOW_VALIDATION_STATUS) {
            return;
        }

        var parent = this.$el.parent();
        parent.removeClass("valid-ok valid-ko has-link");

        var id = this.$el.val().trim();
        if (!id) {
            return;
        }

        var info = ShippingCarrier.exec(id);
        parent.addClass("valid-" + (info ? "ok" : "ko"));
    };

    /**
     * Select an item in the dropdown
     *
     * @param jQuery Element $item Selected item
     */
    _.prototype.select = function($item) {
        var v = $item.data("info").name;
        var url = $item.data("info").url;

        this.$out
            .unbind("click")
            .removeClass("clickable");

        if (SHOW_LINK_WHEN_VALID && url) {
            this.$out
                .data({ url: url })
                .addClass("clickable")
                .click(function(e) {
                    e.preventDefault();
                    window.open(url);
                });
        }

        this.$out
            .val(v);
    };

    /**
     * Retrieve dropdown items (using ShippingCarrier)
     *
     * @param  string q Query (tracking ID)
     * @return Array
     */
    _.prototype.items = function(q) {
        q = q.trim();

        if (!q) {
            return [];
        }

        return ShippingCarrier.all(q);
    };

    // =========================================================================

    $(function() {
        $("[data-shipping-autocomplete]").each(function() {
            var $el = $(this);
            var $out = $($el.data("shipping-autocomplete"));
            new _($el, $out);
        });
    });

    // =========================================================================

    window.ShippingAutocomplete = _;

    // =========================================================================

})();

// var info = ShippingCarrier.exec(id);

// "Carrier UID" info.uid
// "Short Name"  info.short_name
// "Name"        info.name
// "ID"          info.id
// "URL"         info.url, true
