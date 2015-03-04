$.fn.mfMobileTabs = function(options){
	return $(this).each(function(){
		var originalTabs = $(this);
		var $wrapper = $('<div class="padded mobile"></div>');

		$mobileTabs = $('<div class="dropdown"></div>');
		$list = $('<ul class="dropdown-menu" role="menu"></ul>');

		$('li', originalTabs).each(function(index){
			var $tab = $(this);
			if($tab.hasClass('active'))
			{
				$mobileTabs.append('<a role="button" data-toggle="dropdown" data-target="#" href="#" class="dropdown-toggle btn btn-primary btn-lg btn-block btn-icon">'+$tab.find('a').html()+' <i class="fa fa-angle-down"></i></a>');
			}
			else
			{
				$list.append('<li><a href="'+$tab.find('a').attr('href')+'">'+$tab.find('a').html()+'</a></li>');
			}
		});

		if(!$('li.active', originalTabs).length)
		{
			var $tab = $('#project-tabs li').first();
			$mobileTabs.append('<a role="button" data-toggle="dropdown" data-target="#" href="#" class="dropdown-toggle btn btn-primary btn-lg btn-block btn-icon">'+$tab.find('a').html()+' <i class="fa fa-angle-down"></i></a>');
		}

		$mobileTabs.append($list);
		$wrapper.append($mobileTabs);
		originalTabs.after($wrapper);
	});
};