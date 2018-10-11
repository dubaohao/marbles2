/* global $, window, document */
/* global toTitleCase, connect_to_server, refreshHomePanel, closeNoticePanel, openNoticePanel, show_tx_step, marbles*/
/* global pendingTxDrawing:true */
/* exported record_company, autoCloseNoticePanel, start_up, block_ui_delay*/
///弹珠修改为证书，若使用弹珠，需要修改注释掉的行数，选择其一（248,249）（399,400）
var ws = {};
var bgcolors = ['whitebg', 'blackbg', 'redbg', 'greenbg', 'bluebg', 'purplebg', 'pinkbg', 'orangebg', 'yellowbg'];
var autoCloseNoticePanel = null;
var known_companies = {};
var start_up = true;
var lsKey = 'marbles';
var fromLS = {};
var block_ui_delay = 15000; 								//default, gets set in ws block msg
var auditingMarble = null;

// =================================================================================
// On Load
// =================================================================================
$(document).on('ready', function () {
	fromLS = window.localStorage.getItem(lsKey);
	if (fromLS) fromLS = JSON.parse(fromLS);
	else fromLS = { story_mode: false };					//dsh todo remove this
	console.log('from local storage', fromLS);

	connect_to_server();

	// =================================================================================
	// jQuery UI Events
	// =================================================================================
	$('#createMarbleButton').click(function () {
		console.log('creating marble');
		var obj = {
			type: 'create',
			color: $('.colorSelected').attr('color'),
			size: $('select[name="size"]').val(),
			username: $('select[name="user"]').val(),
			company: $('input[name="company"]').val(),
			owner_id: $('input[name="owner_id"]').val(),
			v: 1
		};
		console.log('creating marble, sending', obj);
		$('#createPanel').fadeOut();
		// $('#createCertificates').fadeOut();
		$('#tint').fadeOut();

		show_tx_step({ state: 'building_proposal' }, function () {
			ws.send(JSON.stringify(obj));

			refreshHomePanel();
			$('.colorValue').html('Color');											//reset
			for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//reset
			$('.createball').css('border', '2px dashed #fff');						//reset
		});

		return false;
	});
//dubaohao-------修改弹珠
// function UpdateMarble(that){
	
	$('#updateMarbleButton').click(function () {
		// var marbleId = $(that).attr('id');
		// MarbleID=marbleId;
		console.log('update marbleInfo');
		var obj = {
			type: 'update_marbleInfo',
			color: $('.colorSelected').attr('color'),
			size: $('select[name="size"]').val(),
			username: $('select[name="user"]').val(),
			company: $('input[name="company"]').val(),
			owner_id: $('input[name="owner_id"]').val(),
			v: 1
		};
		// console.log(marbleId);
		console.log(auditingMarble.id);
		console.log('update marbleInfo, sending',obj);
		update_marbleInfo(auditingMarble.id,obj.color,obj.size,obj.owner_id);
		$('#createPanel').fadeOut();
		// $('#createCertificates').fadeOut();
		$('#tint').fadeOut();

		// show_tx_step({ state: 'building_proposal' }, function () {
		// 	ws.send(JSON.stringify(obj));

			refreshHomePanel();
		// 	$('.colorValue').html('Color');											//reset
		// 	for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//reset
		// 	$('.createball').css('border', '2px dashed #fff');						//reset
		// });

		return false;
		// return true;
	});
// }

//dubaohao-----------新增和更新证书---------------------------------------------------------------------
$('#createCertButton').click(function () {
	console.log('creating cert');
	var obj = {
		type: 'createCert',
		data1: $('input[name="1"]').val(),
		data2: $('input[name="2"]').val(),
		data3: $('input[name="3"]').val(),
		data4: $('input[name="4"]').val(),
		data5: $('input[name="5"]').val(),
		data6: $('input[name="6"]').val(),
		data7: $('input[name="7"]').val(),
		data8: $('input[name="8"]').val(),
		data9: $('input[name="9"]').val(),
		data10: $('input[name="10"]').val(),

		data11: $('input[name="11"]').val(),
		data12: $('input[name="12"]').val(),
		data13: $('input[name="13"]').val(),
		data14: $('input[name="14"]').val(),
		data15: $('input[name="15"]').val(),
		data16: $('input[name="16"]').val(),
		data17: $('input[name="17"]').val(),
		data18: $('input[name="18"]').val(),
		data19: $('input[name="19"]').val(),
		data20: $('input[name="20"]').val(),

		data21: $('input[name="21"]').val(),
		data22: $('input[name="22"]').val(),
		data23: $('input[name="23"]').val(),
		data24: $('input[name="24"]').val(),
		data25: $('input[name="25"]').val(),
		data26: $('input[name="26"]').val(),
		data27: $('input[name="27"]').val(),
		data28: $('input[name="28"]').val(),
		data29: $('input[name="29"]').val(),
		data30: $('input[name="30"]').val(),

		data31: $('input[name="31"]').val(),
		data32: $('input[name="32"]').val(),
		data33: $('input[name="33"]').val(),
		data34: $('input[name="34"]').val(),
		data35: $('input[name="35"]').val(),
		data36: $('input[name="36"]').val(),
		data37: $('input[name="37"]').val(),
		data38: $('input[name="38"]').val(),
		// data39: $('input[name="39"]').val(),
		// data40: $('input[name="40"]').val(),
		username: $('select[name="user"]').val(),
		company: $('input[name="company"]').val(),
		owner_id: $('input[name="owner_id"]').val(),
		v: 1
	};
	console.log('creating cert, sending', obj)
	$('#createCertificates').fadeOut();
	$('#tint').fadeOut();

	show_tx_step({ state: 'building_proposal' }, function () {
		ws.send(JSON.stringify(obj));

		refreshHomePanel();
		// $('.colorValue').html('Color');											//reset
		// for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//reset
		// $('.createball').css('border', '2px dashed #fff');						//reset
	});

	return false;
});
//更新证书
$('#updateCertButton').click(function () {
	console.log('update marbleInfo');
	var obj = {
		type: 'update_certInfo',
		// username: $('select[name="user"]').val(),
		// company: $('input[name="company"]').val(),
		owner_id: $('input[name="owner_id"]').val(),
		data1: $('input[name="01"]').val(),
		data2: $('input[name="02"]').val(),
		data3: $('input[name="03"]').val(),
		data4: $('input[name="04"]').val(),
		data5: $('input[name="05"]').val(),
		data6: $('input[name="06"]').val(),
		data7: $('input[name="07"]').val(),
		data8: $('input[name="08"]').val(),
		data9: $('input[name="09"]').val(),
		data10: $('input[name="010"]').val(),

		data11: $('input[name="011"]').val(),
		data12: $('input[name="012"]').val(),
		data13: $('input[name="013"]').val(),
		data14: $('input[name="014"]').val(),
		data15: $('input[name="015"]').val(),
		data16: $('input[name="016"]').val(),
		data17: $('input[name="017"]').val(),
		data18: $('input[name="018"]').val(),
		data19: $('input[name="019"]').val(),
		data20: $('input[name="020"]').val(),

		data21: $('input[name="021"]').val(),
		data22: $('input[name="022"]').val(),
		data23: $('input[name="023"]').val(),
		data24: $('input[name="024"]').val(),
		data25: $('input[name="025"]').val(),
		data26: $('input[name="026"]').val(),
		data27: $('input[name="027"]').val(),
		data28: $('input[name="028"]').val(),
		data29: $('input[name="029"]').val(),
		data30: $('input[name="030"]').val(),

		data31: $('input[name="031"]').val(),
		data32: $('input[name="032"]').val(),
		data33: $('input[name="033"]').val(),
		data34: $('input[name="034"]').val(),
		data35: $('input[name="035"]').val(),
		data36: $('input[name="036"]').val(),
		data37: $('input[name="037"]').val(),
		data38: $('input[name="038"]').val(),
		v: 1
	};
	// console.log(marbleId);
	console.log(auditingMarble.id);
	console.log('update certInfo, sending',obj);
	update_certInfo(auditingMarble.id,obj);
	$('#updateCertificates').fadeOut();
	$('#tint').fadeOut();
		refreshHomePanel();
	return false;
});
//----------------------------------------------------------------------------

	//fix marble owner panel (don't filter/hide it)
	$(document).on('click', '.marblesFix', function () {
		if ($(this).parent().parent().hasClass('marblesFixed')) {
			$(this).parent().parent().removeClass('marblesFixed');
		}
		else {
			$(this).parent().parent().addClass('marblesFixed');
		}
	});

	//marble color picker
	$(document).on('click', '.colorInput', function () {
		$('.colorOptionsWrap').hide();											//hide any others
		$(this).parent().find('.colorOptionsWrap').show();
	});
	$(document).on('click', '.colorOption', function () {
		var color = $(this).attr('color');
		var html = '<span class="fa fa-circle colorSelected ' + color + '" color="' + color + '"></span>';

		$(this).parent().parent().find('.colorValue').html(html);
		$(this).parent().hide();

		for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//remove prev color
		$('.createball').css('border', '0').addClass(color + 'bg');				//set new color
	});

	//username/company search
	$('#searchUsers').keyup(function () {
		var count = 0;
		var input = $(this).val().toLowerCase();
		for (var i in known_companies) {
			known_companies[i].visible = 0;
		}

		//reset - clear search
		if (input === '') {
			$('.marblesWrap').show();
			count = $('#totalUsers').html();
			$('.companyPanel').fadeIn();
			for (i in known_companies) {
				known_companies[i].visible = known_companies[i].count;
				$('.companyPanel[company="' + i + '"]').find('.companyVisible').html(known_companies[i].visible);
				$('.companyPanel[company="' + i + '"]').find('.companyCount').html(known_companies[i].count);
			}
		}
		else {
			var parts = input.split(',');
			console.log('searching on', parts);

			//figure out if the user matches the search
			$('.marblesWrap').each(function () {												//iter on each marble user wrap
				var username = $(this).attr('username');
				var company = $(this).attr('company');
				if (username && company) {
					var full = (username + company).toLowerCase();
					var show = false;

					for (var x in parts) {													//iter on each search term
						if (parts[x].trim() === '') continue;
						if (full.indexOf(parts[x].trim()) >= 0 || $(this).hasClass('marblesFixed')) {
							count++;
							show = true;
							known_companies[company].visible++;								//this user is visible
							break;
						}
					}

					if (show) $(this).show();
					else $(this).hide();
				}
			});

			//show/hide the company panels
			for (i in known_companies) {
				$('.companyPanel[company="' + i + '"]').find('.companyVisible').html(known_companies[i].visible);
				if (known_companies[i].visible === 0) {
					console.log('hiding company', i);
					$('.companyPanel[company="' + i + '"]').fadeOut();
				}
				else {
					$('.companyPanel[company="' + i + '"]').fadeIn();
				}
			}
		}
		//user count
		$('#foundUsers').html(count);
	});

	//login events
	$('#whoAmI').click(function () {													//drop down for login
		if ($('#userSelect').is(':visible')) {
			$('#userSelect').fadeOut();
			$('#carrot').removeClass('fa-angle-up').addClass('fa-angle-down');
		}
		else {
			$('#userSelect').fadeIn();
			$('#carrot').removeClass('fa-angle-down').addClass('fa-angle-up');
		}
	});

	//open create marble panel
	$(document).on('click', '.addMarble', function () {
		$('#tint').fadeIn();
		// $('#createPanel').fadeIn();
		$('#createCertificates').fadeIn();
		var company = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('company');
		var username = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('username');
		var owner_id = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('owner_id');
		$('select[name="user"]').html('<option value="' + username + '">' + toTitleCase(username) + '</option>');
		$('input[name="company"]').val(company);
		$('input[name="owner_id"]').val(owner_id);
	});

	// //dubaohao------open update marble panel
	// $(document).on('click', '.updateMarble', function () {
	// 	// console.log('dubaohao',JSON.stringify($(this)));
	// 	//left click audits marble
	// 	$('#tint').fadeIn();
	// 	$('#createPanel').fadeIn();
	// 	var company = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('company');
	// 	var username = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('username');
	// 	var owner_id = $(this).parents('.innerMarbleWrap').parents('.marblesWrap').attr('owner_id');
	// 	$('select[name="user"]').html('<option value="' + username + '">' + toTitleCase(username) + '</option>');
	// 	$('input[name="company"]').val(company);
	// 	$('input[name="owner_id"]').val(owner_id);
	// });

	//close create marble panel
	$('#tint').click(function () {
		if ($('#startUpPanel').is(':visible')) return;
		if ($('#txStoryPanel').is(':visible')) return;
		$('#createPanel, #tint, #settingsPanel').fadeOut();
		$('#createCertificates, #tint, #settingsPanel').fadeOut();
		$('#updateCertificates, #tint, #settingsPanel').fadeOut();
	});

	//notification drawer
	$('#notificationHandle').click(function () {
		if ($('#noticeScrollWrap').is(':visible')) {
			closeNoticePanel();
		}
		else {
			openNoticePanel();
		}
	});

	//hide a notification
	$(document).on('click', '.closeNotification', function () {
		$(this).parents('.notificationWrap').fadeOut();
	});

	//settings panel
	$('#showSettingsPanel').click(function () {
		$('#settingsPanel, #tint').fadeIn();
	});
	$('#closeSettings').click(function () {
		$('#settingsPanel, #tint').fadeOut();
	});

//-dubaohao-------------- 教育
	// $('#createCertificatesButton').click(function () {
	// 	$('#tint').fadeIn();
	// 	$('#createCertificates').fadeIn();
	// 	// $('#createCertificates, #tint').fadeIn();
	// });
	// $('#closeCreateCerts').click(function () {
	// 	$('#createCertificates, #tint').fadeOut();
	// });

	// $('#personInfo').click(function () {
	// 	$('#personInfo, #tint').fadeIn();
	// });
	// $('#personInfo').click(function () {
	// 	$('#personInfo, #tint').fadeOut();
	// });

	// $('#showCertificates').click(function () {
	// 	$('#showCertificates, #tint').fadeIn();
	// });
	// $('#showCertificates').click(function () {
	// 	$('#showCertificates, #tint').fadeOut();
	// });

	// $('#testCertificates').click(function () {
	// 	$('#testCertificates, #tint').fadeIn();
	// });
	// $('#testCertificates').click(function () {
	// 	$('#testCertificates, #tint').fadeOut();
	// });

	// $('#inquireUpInfo').click(function () {
	// 	$('#inquireUpInfo, #tint').fadeIn();
	// });
	// $('#inquireUpInfo').click(function () {
	// 	$('#inquireUpInfo, #tint').fadeOut();
	// });

	// $('#dateTrace').click(function () {
	// 	$('#dateTrace, #tint').fadeIn();
	// });
	// $('#dateTrace').click(function () {
	// 	$('#dateTrace, #tint').fadeOut();
	// });

	// $('#dateTrace').click(function () {
	// 	$('#dateTrace, #tint').fadeIn();
	// });
	// $('#dateTrace').click(function () {
	// 	$('#dateTrace, #tint').fadeOut();
	// });

	// $('#checkConsistency').click(function () {
	// 	$('#dateTrace, #tint').fadeIn();
	// });
	// $('#checkConsistency').click(function () {
	// 	$('#dateTrace, #tint').fadeOut();
	// });
//dubaohao-----------------baiduMap
	$('#createCertificatesButton').click(function () {
		console.log("chenchenhchcenheh");
		window.location.href="/views/baiduMap.html";
		console.log(window.location);
	});

	//story mode selection
	$('#disableStoryMode').click(function () {
		set_story_mode('off');
	});
	$('#enableStoryMode').click(function () {
		set_story_mode('on');
	});

	//close create panel
	$('#closeCreate').click(function () {
		$('#createPanel, #tint').fadeOut();
		// $('#createCertificates, #tint').fadeOut();
	});

	// dubaohao---------close create cert
	$('#closeCreateCert').click(function () {
		$('#createCertificates, #tint').fadeOut();

	});
	$('#closeUpdateCert').click(function () {
		$('#updateCertificates, #tint').fadeOut();
	});
	//-------------------------------------------


	//change size of marble
	$('select[name="size"]').click(function () {
		var size = $(this).val();
		if (size === '16') $('.createball').animate({ 'height': 150, 'width': 150 }, { duration: 200 });
		else $('.createball').animate({ 'height': 250, 'width': 250 }, { duration: 200 });
	});

	//right click opens audit on marble
	$(document).on('contextmenu', '.ball', function () {
		auditMarble(this, true);
		return false;
	});

	//left click audits marble
	$(document).on('click', '.ball', function () {
		//console.log('点击的弹珠属性值为：',$(this));
		auditMarble(this, false);
		// auditUpdateMarble(this,false);
		auditUpdateCert(this,false);
		// $(this)='';
		//UpdateMarble(this,false);
		//console.log('核查this',this)
	});

	// function auditMarble(that, open) {
	// 	// console.log('点击audits button的this：',$(that));
	// 	// var marble_id = $(that).attr('id');
	// 	// console.log('dududududdduud',marble_id);
	// 	auditMarble(this, false);
	// };

	function auditMarble(that, open) {
		var marble_id = $(that).attr('id');
		$('.auditingMarble').removeClass('auditingMarble');

		if (!auditingMarble || marbles[marble_id].id != auditingMarble.id) {//different marble than before!
			for (var x in pendingTxDrawing) clearTimeout(pendingTxDrawing[x]);
			$('.txHistoryWrap').html('');										//clear
		}

		auditingMarble = marbles[marble_id];
		console.log('\nuser clicked on marble', marble_id);

		if (open || $('#auditContentWrap').is(':visible')) {
			$(that).addClass('auditingMarble');
			$('#auditContentWrap').fadeIn();
			$('#marbleId').html(marble_id);
			$('#ImgPath').html('"/imgs/2.jpg"');//////弹珠换成人物头像照片
			var color = marbles[marble_id].color;
			// console.log('!!!!!!!!',color)
			// for (var i in bgcolors) $('.auditMarble').removeClass(bgcolors[i]);	//reset
			// $('.auditMarble').addClass(color.toLowerCase() + 'bg');

			$('#rightEverything').addClass('rightEverythingOpened');
			$('#leftEverything').fadeIn();

			var obj2 = {
				type: 'audit',
				marble_id: marble_id
			};
			//console.log('读报好',JSON.stringify(obj2));
			ws.send(JSON.stringify(obj2));
		}
			//console.log('dubaohao 查看当前 that值：',$(that));

	}
//dubaohao----------------------------------------------------------------------------
//弹珠-----------------------open update marble panel--------------------
	function auditUpdateMarble(that,open) {
		// console.log('[点击audits button的this[：',$(that));
		var marble_id = $(that).attr('id');
		marbleID=marble_id;
		// console.log('[marble_id]',marble_id);
		//$(document).on('click', '.updateMarble', function () {
		$('.updateMarble').click(function(){
			 //console.log('dubaohao',$(this).attr('color'));
			//left click audits marble
			$('#tint').fadeIn();
			$('#createPanel').fadeIn();
			// $('#createCertificates').fadeIn();
			//初始化ball的颜色，大小
			var color = marbles[marbleID].color;
			var size = marbles[marbleID].size;
			console.log('id',marbleID,'color:',color,'size:',size);
			//ball的颜色和表单填写
				var html = '<span class="fa fa-circle colorSelected ' + color + '" color="' + color + '"></span>';
				$('.colorValue').html(html);
				for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//remove prev color
					$('.createball').css('border', '0').addClass(color + 'bg');				//set new color
			//ball的大小 添加使ball的大小可以根据文本框里的值，不点击时自动同步
			// $('select[name="size"]').val(size[size.length-1]);
			// $('select[name="size"]').val(marbles[marble_id].size);
			$('select[name="size"]').val(size);
			//change size of marble
			$('select[name="size"]').is(function () {
				var size = $(this).val();
				if (size === '16') $('.createball').animate({ 'height': 150, 'width': 150 }, { duration: 200 });
				else $('.createball').animate({ 'height': 250, 'width': 250 }, { duration: 200 });
			}); 
			var company = $(that).attr('company');
			var username = $(that).attr('username');
			var owner_id = $(that).attr('owner_id');
			//$('select[name="size"]').val(size);
			$('select[name="user"]').html('<option value="' + username + '">' + toTitleCase(username) + '</option>');
			$('input[name="company"]').val(company);
			$('input[name="owner_id"]').val(owner_id);
		});
	}
//证书
	function auditUpdateCert(that,open) {
		// console.log('[点击audits button的this[：',$(that));
		var marble_id = $(that).attr('id');
		marbleID=marble_id;
		// console.log('[marble_id]',marble_id);
		// console.log('marble_info',marbles[marbleID]);
		$('.updateMarble').click(function(){
			 //console.log('dubaohao',$(this).attr('color'));
			//left click audits marble
			$('#tint').fadeIn();
			// $('#createPanel').fadeIn();
			$('#updateCertificates').fadeIn();
			//初始化ball的颜色，大小
			// var color = marbles[marbleID].color;
			// var size = marbles[marbleID].size;
			// console.log('id',marbleID,'color:',color,'size:',size);
			//ball的颜色和表单填写
				// var html = '<span class="fa fa-circle colorSelected ' + color + '" color="' + color + '"></span>';
				// $('.colorValue').html(html);
				// for (var i in bgcolors) $('.createball').removeClass(bgcolors[i]);		//remove prev color
				// 	$('.createball').css('border', '0').addClass(color + 'bg');				//set new color
			//ball的大小 添加使ball的大小可以根据文本框里的值，不点击时自动同步
			// $('select[name="size"]').val(size);
			// //change size of marble
			// $('select[name="size"]').is(function () {
			// 	var size = $(this).val();
			// 	if (size === '16') $('.createball').animate({ 'height': 150, 'width': 150 }, { duration: 200 });
			// 	else $('.createball').animate({ 'height': 250, 'width': 250 }, { duration: 200 });
			// }); 
			var data1 =marbles[marbleID].data1;
			var data2 =marbles[marbleID].data2;
			var data3 =marbles[marbleID].data3;
			var data4 =marbles[marbleID].data4;
			var data5 =marbles[marbleID].data5;
			var data6 =marbles[marbleID].data6;
			var data7 =marbles[marbleID].data7;
			var data8 =marbles[marbleID].data8;
			var data9 =marbles[marbleID].data9;
			var data10 =marbles[marbleID].data10;
			var data11 =marbles[marbleID].data11;
			var data12 =marbles[marbleID].data12;
			var data13 =marbles[marbleID].data13;
			var data14 =marbles[marbleID].data14;
			var data15 =marbles[marbleID].data15;
			var data16 =marbles[marbleID].data16;
			var data17 =marbles[marbleID].data17;
			var data18 =marbles[marbleID].data18;
			var data19 =marbles[marbleID].data19;
			var data20 =marbles[marbleID].data20;
			var data21 =marbles[marbleID].data21;
			var data22 =marbles[marbleID].data22;
			var data23 =marbles[marbleID].data23;
			var data24 =marbles[marbleID].data24;
			var data25 =marbles[marbleID].data25;
			var data26 =marbles[marbleID].data26;
			var data27 =marbles[marbleID].data27;
			var data28 =marbles[marbleID].data28;
			var data29 =marbles[marbleID].data29;
			var data30 =marbles[marbleID].data30;
			var data31 =marbles[marbleID].data31;
			var data32 =marbles[marbleID].data32;
			var data33 =marbles[marbleID].data33;
			var data34 =marbles[marbleID].data34;
			var data35 =marbles[marbleID].data35;
			var data36 =marbles[marbleID].data36;
			var data37 =marbles[marbleID].data37;
			var data38 =marbles[marbleID].data38;
			// var data39 =marbles[marbleID].data39;
			var company = $(that).attr('company');
			var username = $(that).attr('username');
			var owner_id = $(that).attr('owner_id');
			//$('select[name="size"]').val(size);
			$('input[name="01"]').val(data1);
			$('input[name="02"]').val(data2);
			$('input[name="03"]').val(data3);
			$('input[name="04"]').val(data4);
			$('input[name="05"]').val(data5);
			$('input[name="06"]').val(data6);
			$('input[name="07"]').val(data7);
			$('input[name="08"]').val(data8);
			$('input[name="09"]').val(data9);
			$('input[name="010"]').val(data10);
			$('input[name="011"]').val(data11);
			$('input[name="012"]').val(data12);
			$('input[name="013"]').val(data13);
			$('input[name="014"]').val(data14);
			$('input[name="015"]').val(data15);
			$('input[name="016"]').val(data16);
			$('input[name="017"]').val(data17);
			$('input[name="018"]').val(data18);
			$('input[name="019"]').val(data19);
			$('input[name="020"]').val(data20);
			$('input[name="021"]').val(data21);
			$('input[name="022"]').val(data22);
			$('input[name="023"]').val(data23);
			$('input[name="024"]').val(data24);
			$('input[name="025"]').val(data25);
			$('input[name="026"]').val(data26);
			$('input[name="027"]').val(data27);
			$('input[name="028"]').val(data28);
			$('input[name="029"]').val(data29);
			$('input[name="030"]').val(data30);
			$('input[name="031"]').val(data31);
			$('input[name="032"]').val(data32);
			$('input[name="033"]').val(data33);
			$('input[name="034"]').val(data34);
			$('input[name="035"]').val(data35);
			$('input[name="036"]').val(data36);
			$('input[name="037"]').val(data37);
			$('input[name="038"]').val(data38);
			// $('input[name="039"]').val(data9);
			// $('input[name="040"]').val(data10);
			$('select[name="user"]').html('<option value="' + username + '">' + toTitleCase(username) + '</option>');
			$('input[name="company"]').val(company);
			$('input[name="owner_id"]').val(owner_id);
		});
	}
	// -----------------------------------------------

	$('#auditClose').click(function () {
		$('#auditContentWrap').slideUp(500);
		$('.auditingMarble').removeClass('auditingMarble');												//reset
		for (var x in pendingTxDrawing) clearTimeout(pendingTxDrawing[x]);
		setTimeout(function () {
			$('.txHistoryWrap').html('<div class="auditHint">Click a Marble to Audit Its Transactions</div>');//clear
		}, 750);
		$('#marbleId').html('-');
		auditingMarble = null;

		setTimeout(function () {
			$('#rightEverything').removeClass('rightEverythingOpened');
		}, 500);
		$('#leftEverything').fadeOut();
	});

	$('#auditButton').click(function () {
		$('#auditContentWrap').fadeIn();
		$('#rightEverything').addClass('rightEverythingOpened');
		$('#leftEverything').fadeIn();
	});

	let selectedOwner = null;
	// show dialog to confirm if they want to disable the marble owner
	$(document).on('click', '.disableOwner', function () {
		$('#disableOwnerWrap, #tint').fadeIn();
		selectedOwner = $(this).parents('.marblesWrap');
	});

	// disable the marble owner
	$('#removeOwner').click(function () {
		var obj = {
			type: 'disable_owner',
			owner_id: selectedOwner.attr('owner_id')
		};
		ws.send(JSON.stringify(obj));
		selectedOwner.css('opacity', 0.4);
	});

	$('.closeDisableOwner, #removeOwner').click(function () {
		$('#disableOwnerWrap, #tint').fadeOut();
	});
});

//toggle story mode
function set_story_mode(setting) {
	if (setting === 'on') {
		fromLS.story_mode = true;
		$('#enableStoryMode').prop('disabled', true);
		$('#disableStoryMode').prop('disabled', false);
		$('#storyStatus').addClass('storyOn').html('on');
		window.localStorage.setItem(lsKey, JSON.stringify(fromLS));		//save
	}
	else {
		fromLS.story_mode = false;
		$('#disableStoryMode').prop('disabled', true);
		$('#enableStoryMode').prop('disabled', false);
		$('#storyStatus').removeClass('storyOn').html('off');
		window.localStorage.setItem(lsKey, JSON.stringify(fromLS));		//save
	}
}
