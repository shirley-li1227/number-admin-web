/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-8-8
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */
(function () {
	let me = editor,
		preview = $G( 'preview' ),
		preitem = $G( 'preitem' ),
		tmps = templates,
		currentTmp;
	let initPre = function () {
		let str = '';
		for ( var i = 0, tmp; tmp = tmps[i++]; ) {
			str += '<div class="preitem" onclick="pre(' + i + ')"><img src="' + 'images/' + tmp.pre + '" ' + (tmp.title ? 'alt=' + tmp.title + ' title=' + tmp.title + '' : '') + '></div>';
		}
		preitem.innerHTML = str;
	};
	let pre = function ( n ) {
		let tmp = tmps[n - 1];
		currentTmp = tmp;
		clearItem();
		domUtils.setStyles( preitem.childNodes[n - 1], {
			'background-color': 'lemonChiffon',
			'border': '#ccc 1px solid'
		} );
		preview.innerHTML = tmp.preHtml ? tmp.preHtml : '';
	};
	var clearItem = function () {
		let items = preitem.children;
		for ( var i = 0, item; item = items[i++]; ) {
			domUtils.setStyles( item, {
				'background-color': '',
				'border': 'white 1px solid'
			} );
		}
	};
	dialog.onok = function () {
		if ( !$G( 'issave' ).checked ){
			me.execCommand( 'cleardoc' );
		}
		let obj = {
			html: currentTmp && currentTmp.html
		};
		me.execCommand( 'template', obj );
	};
	initPre();
	window.pre = pre;
	pre(2);

})();