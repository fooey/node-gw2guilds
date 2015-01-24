
var slugifier = require('../../../lib/slugifier.js');


/*
*
*   DEFINE EXPORT
*
*/

module.exports = function init($form) {
	$form.on('submit', search);
};



function search(e) {
	e.preventDefault();

	var guildName = $(this).find('input.guildName').val();
	var guildNameUrl = slugifier.slugify(guildName);
	var guildUrl = '/guilds/' + guildNameUrl;

	window.location = guildUrl;
}
