mfHtmlEditorRender = {
	modulesCount: 0,
	modulesLoaded: 0,
	init: function(options){
		var self = this;
		self.loadAllImmediately = true;
	  	$(window).scroll(function()
		{
			self.checkScroll();		    
		});
		if(!this.loadAllImmediately)
		{
			$(document).ajaxSuccess(function() {
				self.checkScroll();
			});
		}
		$(document).on('ready', function(){
			self.checkScroll();
		})
		self.checkScroll();
    },
    checkScroll: function(){
    	var self = this;
		var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();

	    $('.mmc-modules').find('.module').each(function(index)
	    {
	    	var module = $(this);
	    	if(module.data('scroll-loaded')) return;
	    	
	    	var elemTop = module.offset().top;

	    	if(self.loadAllImmediately || elemTop <= docViewBottom)
	    	{
	    		module.data('scroll-loaded', true)
	    		var type = module.attr('data-type');
	    		var options_str = module.attr('data-options');
	    		var options = self.URLToArray(options_str);

	    		// fix editor error
	    		/*if(type == 'texttitle' && (!$(module).find('h2').length || $(module).find('h2').html() == '' ))
	    		{
	    			$(module).find('h2').remove();
	    			module.append('<div class="module-content"><h2>'+options.title+'</h2></div>');
	    		}*/

	    		if(type != 'text')
	    		{
	    			var url = Routing.generate('editor.module', {'type': type, 'options_str': options_str});
	    			self.modulesCount += 1;
	    			$.get(url, function(data){
	    				module.html(data);
	    				self.modulesLoaded += 1;
	    				if(self.modulesLoaded >= self.modulesCount)
	    				{
	    					if(window.mfEvents) window.mfEvents.dispatchEvent('htmlEditorRenderComplete', {});
	    				}
	    			})
	    		}


	    	}
	    });
    },
    URLToArray: function(url) {
	  var request = {};
	  if(!url) return request;
	  var pairs = url.substring(url.indexOf('?') + 1).split('&');
	  for (var i = 0; i < pairs.length; i++) {
	    var pair = pairs[i].split('=');
	    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return request;
	}
}