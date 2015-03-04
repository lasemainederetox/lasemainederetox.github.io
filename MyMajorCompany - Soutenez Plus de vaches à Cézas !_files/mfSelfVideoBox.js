$.fn.mfSelfVideoBox = function(){
	return $(this).each(function()
	{
		if($(this).data('video-box-parsed')) return;

		$(this).data('video-box-parsed', true);

		$(this).on('click', function() {
		    var embed = $(this).attr('href');
		    var width = $(this).width();
		    var height = $(this).height();

		    if(!width) width = $(this).parent().width();
		    if(!height) height = $(this).parent().height();

		    if(!width) width = 500;
		    if(!height) height = 300;
		    var iframe = $('<iframe allowtransparency="yes" style="z-index:1;position:relative" src="' + embed + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
		    $(this).replaceWith(iframe);
		    return false;
		});
	})
};