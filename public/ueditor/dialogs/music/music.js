function Music() {
	this.init();
}
(function () {
	let pages = [],
		panels = [],
		selectedItem = null;
	Music.prototype = {
		total: 70,
		pageSize: 10,
		dataUrl: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.search.common',
		playerUrl: 'http://box.baidu.com/widget/flash/bdspacesong.swf',

		init: function () {
			let me = this;
			domUtils.on($G('J_searchName'), 'keyup', function (event) {
				let e = window.event || event;
				if (e.keyCode == 13) {
					me.dosearch();
				}
			});
			domUtils.on($G('J_searchBtn'), 'click', function () {
				me.dosearch();
			});
		},
		callback: function (data) {
			let me = this;
			me.data = data.song_list;
			setTimeout(function () {
				$G('J_resultBar').innerHTML = me._renderTemplate(data.song_list);
			}, 300);
		},
		dosearch: function () {
			let me = this;
			selectedItem = null;
			let key = $G('J_searchName').value;
			if (utils.trim(key) == '')return false;
			key = encodeURIComponent(key);
			me._sent(key);
		},
		doselect: function (i) {
			let me = this;
			if (typeof i === 'object') {
				selectedItem = i;
			} else if (typeof i === 'number') {
				selectedItem = me.data[i];
			}
		},
		onpageclick: function (id) {
			let me = this;
			for (let i = 0; i < pages.length; i++) {
				$G(pages[i]).className = 'pageoff';
				$G(panels[i]).className = 'paneloff';
			}
			$G('page' + id).className = 'pageon';
			$G('panel' + id).className = 'panelon';
		},
		listenTest: function (elem) {
			let me = this,
				view = $G('J_preview'),
				is_play_action = (elem.className == 'm-try'),
				old_trying = me._getTryingElem();

			if (old_trying) {
				old_trying.className = 'm-try';
				view.innerHTML = '';
			}
			if (is_play_action) {
				elem.className = 'm-trying';
				view.innerHTML = me._buildMusicHtml(me._getUrl(true));
			}
		},
		_sent: function (param) {
			let me = this;
			$G('J_resultBar').innerHTML = '<div class="loading"></div>';

			utils.loadFile(document, {
				src: me.dataUrl + '&query=' + param + '&page_size=' + me.total + '&callback=music.callback&.r=' + Math.random(),
				tag: 'script',
				type: 'text/javascript',
				defer: 'defer'
			});
		},
		_removeHtml: function (str) {
			let reg = /<\s*\/?\s*[^>]*\s*>/gi;
			return str.replace(reg, '');
		},
		_getUrl: function (isTryListen) {
			let me = this;
			let param = 'from=tiebasongwidget&url=&name=' + encodeURIComponent(me._removeHtml(selectedItem.title)) + '&artist='
                + encodeURIComponent(me._removeHtml(selectedItem.author)) + '&extra='
                + encodeURIComponent(me._removeHtml(selectedItem.album_title))
                + '&autoPlay='+isTryListen+'' + '&loop=true';
			return me.playerUrl + '?' + param;
		},
		_getTryingElem: function () {
			let s = $G('J_listPanel').getElementsByTagName('span');

			for (let i = 0; i < s.length; i++) {
				if (s[i].className == 'm-trying')
					return s[i];
			}
			return null;
		},
		_buildMusicHtml: function (playerUrl) {
			let html = '<embed class="BDE_try_Music" allowfullscreen="false" pluginspage="http://www.macromedia.com/go/getflashplayer"';
			html += ' src="' + playerUrl + '"';
			html += ' width="1" height="1" style="position:absolute;left:-2000px;"';
			html += ' type="application/x-shockwave-flash" wmode="transparent" play="true" loop="false"';
			html += ' menu="false" allowscriptaccess="never" scale="noborder">';
			return html;
		},
		_byteLength: function (str) {
			return str.replace(/[^\u0000-\u007f]/g, '\u0061\u0061').length;
		},
		_getMaxText: function (s) {
			let me = this;
			s = me._removeHtml(s);
			if (me._byteLength(s) > 12)
				return s.substring(0, 5) + '...';
			if (!s) s = '&nbsp;';
			return s;
		},
		_rebuildData: function (data) {
			let me = this,
				newData = [],
				d = me.pageSize,
				itembox;
			for (let i = 0; i < data.length; i++) {
				if ((i + d) % d == 0) {
					itembox = [];
					newData.push(itembox);
				}
				itembox.push(data[i]);
			}
			return newData;
		},
		_renderTemplate: function (data) {
			let me = this;
			if (data.length == 0)return '<div class="empty">' + lang.emptyTxt + '</div>';
			data = me._rebuildData(data);
			let s = [], p = [], t = [];
			s.push('<div id="J_listPanel" class="listPanel">');
			p.push('<div class="page">');
			for (var i = 0, tmpList; tmpList = data[i++];) {
				panels.push('panel' + i);
				pages.push('page' + i);
				if (i == 1) {
					s.push('<div id="panel' + i + '" class="panelon">');
					if (data.length != 1) {
						t.push('<div id="page' + i + '" onclick="music.onpageclick(' + i + ')" class="pageon">' + (i ) + '</div>');
					}
				} else {
					s.push('<div id="panel' + i + '" class="paneloff">');
					t.push('<div id="page' + i + '" onclick="music.onpageclick(' + i + ')" class="pageoff">' + (i ) + '</div>');
				}
				s.push('<div class="m-box">');
				s.push('<div class="m-h"><span class="m-t">' + lang.chapter + '</span><span class="m-s">' + lang.singer
                    + '</span><span class="m-z">' + lang.special + '</span><span class="m-try-t">' + lang.listenTest + '</span></div>');
				for (var j = 0, tmpObj; tmpObj = tmpList[j++];) {
					s.push('<label for="radio-' + i + '-' + j + '" class="m-m">');
					s.push('<input type="radio" id="radio-' + i + '-' + j + '" name="musicId" class="m-l" onclick="music.doselect(' + (me.pageSize * (i-1) + (j-1)) + ')"/>');
					s.push('<span class="m-t">' + me._getMaxText(tmpObj.title) + '</span>');
					s.push('<span class="m-s">' + me._getMaxText(tmpObj.author) + '</span>');
					s.push('<span class="m-z">' + me._getMaxText(tmpObj.album_title) + '</span>');
					s.push('<span class="m-try" onclick="music.doselect(' + (me.pageSize * (i-1) + (j-1)) + ');music.listenTest(this)"></span>');
					s.push('</label>');
				}
				s.push('</div>');
				s.push('</div>');
			}
			t.reverse();
			p.push(t.join(''));
			s.push('</div>');
			p.push('</div>');
			return s.join('') + p.join('');
		},
		exec: function () {
			let me = this;
			if (selectedItem == null) return;
			$G('J_preview').innerHTML = '';
			editor.execCommand('music', {
				url: me._getUrl(false),
				width: 400,
				height: 95
			});
		}
	};
})();



