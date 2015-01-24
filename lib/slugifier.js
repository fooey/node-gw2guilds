
/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	slugify: slugify,
	deslugify: deslugify,
};



function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}

function deslugify(str) {
	return decodeURIComponent(str).replace(/-/g, ' ');
}
