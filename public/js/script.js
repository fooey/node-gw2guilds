$(function(){

	$('form.guildSearch').on('submit', function(e){
		e.preventDefault();
		var $form = $(this);

		window.location = '/guilds/' + $form.find('input.guildName').val();
	});
});