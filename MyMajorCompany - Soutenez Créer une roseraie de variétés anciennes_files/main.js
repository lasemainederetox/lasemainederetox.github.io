require.config(requireConfig);

require(['jQuery', 'moment', 'boostrapDropdown'], function ($, moment) {
    
    if(window.mfLoaded) return false; // <<< hack. do not remove !

    window.mfLoaded = true;

    $(document).on('click', '.image-box', function() {
        if($(this).attr('disabled') == 'disabled') return false;
        var button = $(this);
        var href = $(this).attr('href');

        if(href.match(/(.*)\.(jpg|jpeg|png|gif)/g))
        {
            require(['fancybox'], function () {
                $.fancybox.open(button);
            });
            return false;
        }
    });

    $(document).on('click', '.dialog-box', function() {
        if($(this).attr('disabled') == 'disabled') return false;
    	var button = $(this);
    	require(['fancybox', 'mfEvents'], function () {
	        var hash = button.attr('href').split('#')[1];
            var dialogType = (hash) ? 'inline' : 'ajax';

	        $.fancybox.open(button, {

                openEffect : 'none',
                closeEffect : 'none',
                nextEffect : 'elastic',
                prevEffect : 'elastic',
                title : null,
                type : dialogType,
                padding : 0,
                autoSize : true,

		        type: (hash) ? 'inline' : 'ajax',
                padding: 0,
                closeBtn: false,
                showCloseButton: false,
		        afterClose : function() {
                    window.mfEvents.dispatchEvent('fancybox_closed' , {});
		        }
		    });
	        $.fancybox.update();
	    });
        return false;
    });

    $(document).on('click', '.fancybox-close', function() {
        require(['fancybox'], function () {
            $.fancybox.close();
        });
        return false;
    });

    $(document).on('click', '.async-box', function() {
        if($(this).attr('disabled') == 'disabled') return false;
        var selector = $(this).attr('data-target');
        var target = $(this).closest(selector);
        if(!target.length) target = $(this).closest('.async-container');
        if(!target.length) target = $(this).closest('div');
        if(!target.length) target = $(this).parent();

        
        $.get($(this).attr('href'), {}, function(data){
            target.html(data);
        });
        return false;
    });


    $(document).on('submit', 'form', function(){
        $('button, input[type="submit"]', this).each(function(){
            if(!$(this).hasClass('no-disable')) $(this).attr('disabled', 'disabled');
        });
    });

    $(document).on('click', '.toggle-div', function(){
        var selector = ($(this).attr('data-div')) ? $(this).attr('data-div') : $(this).attr('href');
        var $targets = $(selector);
        $targets.removeClass('hidden');
        $(this).addClass('hidden');
        return false;
    });

    $(document).on('submit', '.async-form', function() {

        var message = $(this).data('message') || undefined;
        var form = $(this);

        var selector = $(this).attr('data-target');
        var target = $(this).closest(selector);
        if(!target.length) target = $(this).closest('.async-container');
        if(!target.length) target = $(this).closest('div');
        if(!target.length) target = $(this).parent();

        require(['jqueryForm'], function () {
            form.ajaxSubmit({
                cache : false,
                dataType : "html",
                success : function(data) {
                    if (message == undefined) {
                        target.html(data);
                    } else {
                        $(message.selector).val(message.message);
                    }
                }
            });
        });
        return false;
    });

    $(document).on('submit', '.dialog-form', function() {
    	var form = $(this);

    	require(['fancybox', 'jqueryForm', 'mfEvents'], function () {
	        form.ajaxSubmit({
	            cache : false,
	            dataType : "html",
	            success : function(data) {
                    $.fancybox.open({
                        openEffect : 'none',
                        closeEffect : 'none',
                        nextEffect : 'elastic',
                        prevEffect : 'elastic',
                        type : 'ajax',
                        padding : 0,
                        autoSize : true,

                        content : data,
                        type : 'ajax',
                        closeBtn: false,
                        showCloseButton: false,
                        afterClose : function() {
                            window.mfEvents.dispatchEvent('fancybox_closed' , {});
                        }
                    });
                    $.fancybox.update();
	            }
	        });
	    });
        return false;
    });

    if($('.form-tooltip').length)
    {
        require(['jQuery','mfTooltips'], function($){
            $('.form-tooltip').mfTooltips();
        });
    }

    var lang = ($('html').attr('lang') != '') ? $('html').attr('lang') : 'en';
    moment.lang(lang);
    setInterval(function(){
      $('.moment-time-future').each(function(index) {
        current = $(this);
        current.html(moment(current.attr("data-attribute")).endOf('second').fromNow());
        moment(current.attr("data-attribute")).endOf('second').fromNow();
      });
    },1000);
});