/* global bag, $, ws*/
/* global escapeHtml, toTitleCase, formatDate, known_companies, transfer_marble, record_company, show_tx_step, refreshHomePanel, auditingMarble*/
/* exported build_marble, record_company, build_user_panels, build_company_panel, build_notification, populate_users_marbles*/
/* exported build_a_tx, marbles */

var marbles = {};

// =================================================================================
//	UI Building
// =================================================================================
//build a marble
function build_marble(marble) {
	var html = '';
	var colorClass = '';
	var size = 'largeMarble';
	var auditing = '';

	marbles[marble.id] = marble;

	marble.id = escapeHtml(marble.id);
	marble.color = escapeHtml(marble.color);
	marble.owner.id = escapeHtml(marble.owner.id);
	marble.owner.username = escapeHtml(marble.owner.username);
	marble.owner.company = escapeHtml(marble.owner.company);
	var full_owner = escapeHtml(marble.owner.username.toLowerCase() + '.' + marble.owner.company);

	// console.log('[ui] building marble: ', marble.color, full_owner, marble.id.substring(0, 4) + '...');
	if (marble.size == 16) size = 'smallMarble';
	if (marble.color) colorClass = marble.color.toLowerCase() + 'bg';
	// size = "largeMarble";
	// colorClass = 'greenbg';

	if (auditingMarble && marble.id === auditingMarble.id) auditing = 'auditingMarble';

	html += '<span id="' + marble.id + '" class="ball ' + size + ' ' + colorClass + ' ' + auditing + ' title="' + marble.id + '"';
	html += ' username="' + marble.owner.username + '" company="' + marble.owner.company + '" owner_id="' + marble.owner.id + '"></span>';

	$('.marblesWrap[owner_id="' + marble.owner.id + '"]').find('.innerMarbleWrap').prepend(html);
	$('.marblesWrap[owner_id="' + marble.owner.id + '"]').find('.noMarblesMsg').hide();
	return html;
}

//redraw the user's marbles
function populate_users_marbles(msg) {

	//reset
	console.log('[ui] clearing marbles for user ' + msg.owner_id);
	$('.marblesWrap[owner_id="' + msg.owner_id + '"]').find('.innerMarbleWrap').html('<i class="fa fa-plus addMarble"></i>');
	$('.marblesWrap[owner_id="' + msg.owner_id + '"]').find('.noMarblesMsg').show();

	for (var i in msg.marbles) {
		build_marble(msg.marbles[i]);
	}
}

//crayp resize - dsh to do, dynamic one
function size_user_name(name) {
	var style = '';
	if (name.length >= 10) style = 'font-size: 22px;';
	if (name.length >= 15) style = 'font-size: 18px;';
	if (name.length >= 20) style = 'font-size: 15px;';
	if (name.length >= 25) style = 'font-size: 11px;';
	return style;
}

//build all user panels
function build_user_panels(data) {
	console.log("杜保皓building_data",data);

	//reset
	console.log('[ui] clearing all user panels');
	$('.ownerWrap').html('');
	for (var x in known_companies) {
		known_companies[x].count = 0;
		known_companies[x].visible = 0;							//reset visible counts
	}

	for (var i in data) {
		var html = '';
		var colorClass = '';
		data[i].id = escapeHtml(data[i].id);
		data[i].username = escapeHtml(data[i].username);
		data[i].company = escapeHtml(data[i].company);
		record_company(data[i].company);
		known_companies[data[i].company].count++;
		known_companies[data[i].company].visible++;

		console.log('[ui] building owner panel ' + data[i].id);

		let disableHtml = '';
		if (data[i].company  === escapeHtml(bag.marble_company)) {
			disableHtml = '<span class="fa fa-trash disableOwner" title="Disable Owner"></span>';
		}

		html += `<div id="user` + i + `wrap" username="` + data[i].username + `" company="` + data[i].company +
			`" owner_id="` + data[i].id + `" class="marblesWrap ` + colorClass + `">
					<div class="legend" style="` + size_user_name(data[i].username) + `">
						` + toTitleCase(data[i].username) + `
						<span class="fa fa-thumb-tack marblesFix" title="Never Hide Owner"></span>
						` + disableHtml + `
					</div>
					<div class="innerMarbleWrap"><i class="fa fa-plus addMarble"></i></div>
					<div class="noMarblesMsg hint">none table</div>
				</div>`;

		$('.companyPanel[company="' + data[i].company + '"]').find('.ownerWrap').append(html);
		$('.companyPanel[company="' + data[i].company + '"]').find('.companyVisible').html(known_companies[data[i].company].visible);
		$('.companyPanel[company="' + data[i].company + '"]').find('.companyCount').html(known_companies[data[i].company].count);
	}

	//drag and drop marble
	$('.innerMarbleWrap').sortable({ connectWith: '.innerMarbleWrap', items: 'span' }).disableSelection();
	$('.innerMarbleWrap').droppable({
		drop:
		function (event, ui) {
			var marble_id = $(ui.draggable).attr('id');

			//  ------------ Delete Marble ------------ //
			if ($(event.target).attr('id') === 'trashbin') {
				console.log('removing marble', marble_id);
				show_tx_step({ state: 'building_proposal' }, function () {
					var obj = {
						type: 'delete_marble',
						id: marble_id,
						v: 1
					};
					ws.send(JSON.stringify(obj));
					$(ui.draggable).addClass('invalid bounce');
					b ();
				});
			}

			//  ------------ Transfer Marble ------------ //
			else {
				var dragged_owner_id = $(ui.draggable).attr('owner_id');
				var dropped_owner_id = $(event.target).parents('.marblesWrap').attr('owner_id');

				console.log('dropped a marble', dragged_owner_id, dropped_owner_id);
				if (dragged_owner_id != dropped_owner_id) {										//only transfer marbles that changed owners
					$(ui.draggable).addClass('invalid bounce');
					transfer_marble(marble_id, dropped_owner_id);
					return true;
				}
			}
		}
	});

	//user count
	$('#foundUsers').html(data.length);
	$('#totalUsers').html(data.length);
}

//build company wrap
function build_company_panel(company) {
	company = escapeHtml(company);
	console.log('[ui] building company panel ' + company);

	var mycss = '';
	if (company === escapeHtml(bag.marble_company)) mycss = 'myCompany';

	var html = `<div class="companyPanel" company="` + company + `">
					<div class="companyNameWrap ` + mycss + `">
					<span class="companyName">` + company + `&nbsp;-&nbsp;</span>
					<span class="companyVisible">0</span>/<span class="companyCount">0</span>`;
	if (company === escapeHtml(bag.marble_company)) {
		html += '<span class="fa fa-exchange floatRight"></span>';
	} else {
		html += '<span class="fa fa-long-arrow-left floatRight"></span>';
	}
	html += `	</div>
				<div class="ownerWrap"></div>
			</div>`;
	$('#allUserPanelsWrap').append(html);
}

//build a notification msg, `error` is boolean
function build_notification(error, msg) {
	var html = '';
	var css = '';
	var iconClass = 'fa-check';
	if (error) {
		css = 'warningNotice';
		iconClass = 'fa-minus-circle';
	}

	html += `<div class="notificationWrap ` + css + `">
				<span class="fa ` + iconClass + ` notificationIcon"></span>
				<span class="noticeTime">` + formatDate(Date.now(), `%M/%d %I:%m:%s`) + `&nbsp;&nbsp;</span>
				<span>` + escapeHtml(msg) + `</span>
				<span class="fa fa-close closeNotification"></span>
			</div>`;
	return html;
}


//build a tx history div
function build_a_tx(data, pos) {
	var html = '';
	var username = '-';
	var company = '-';
	var id = '-';
	var data1 ='-';
	var data2 ='-';
	var data3 ='-';
	var data4 ='-';
	var data5 ='-';
	var data6 ='-';
	var data7 ='-';
	var data8 ='-';
	var data9 ='-';
	var data10 ='-';
	var data11 ='-';
	var data12 ='-';
	var data13 ='-';
	// var data ='-';
	// var data ='-';
	// var data ='-';
	// var data ='-';
	if (data && data.value && data.value.owner && data.value.owner.username) {
		username = data.value.owner.username;
		company = data.value.owner.company;
		id = data.value.owner.id;
		data1=data.value.data1;
		data2=data.value.data2;
		data3=data.value.data3;
		data4=data.value.data4;
		data5=data.value.data5;
		data6=data.value.data6;
		data7=data.value.data7;
		data8=data.value.data8;
		data9=data.value.data9;
		data10=data.value.data10;
		
		data11=data.value.data11;
		data12=data.value.data12;
		data13=data.value.data13;
		data14=data.value.data14;
		data15=data.value.data15;
		data16=data.value.data16;
		data17=data.value.data17;
		data18=data.value.data18;
		data19=data.value.data19;
		data20=data.value.data20;

		data21=data.value.data21;
		data22=data.value.data22;
		data23=data.value.data23;
		data24=data.value.data24;
		data25=data.value.data25;
		data26=data.value.data26;
		data27=data.value.data27;
		data28=data.value.data28;
		data29=data.value.data29;
		data30=data.value.data30;

		data31=data.value.data31;
		data32=data.value.data32;
		data33=data.value.data33;
		data34=data.value.data34;
		data35=data.value.data35;
		data36=data.value.data36;
		data37=data.value.data37;
		data38=data.value.data38;
		// data39=data.value.data39;
		// data10=data.value.data10;
	}

	// html += `<div class="txDetails">
	// 			<div class="txCount">TX ` + (Number(pos) + 1) + `</div>
	// 			<p>
	// 				<div class="marbleLegend">Transaction: </div>
	// 				<div class="marbleName txId">` + data.txId.substring(0, 14) + `...</div>
	// 			</p>
	// 			<p>
	// 				<div class="marbleLegend">Owner: </div>
	// 				<div class="marbleName">` + username + `</div>
	// 			</p>
	// 			<p>
	// 				<div class="marbleLegend">Company: </div>
	// 				<div class="marbleName">` + company + `</div>
	// 			</p>
	// 			<p>
	// 				<div class="marbleLegend">Ower Id: </div>
	// 				<div class="marbleName">` + id + `</div>
	// 			</p>
	// 		</div>`;
	// html +=`<div class="certs">
	// 			<table>
	// 				<tr background-color="green">
	// 					<th height="50" width="80">中考科目</th>
	// 					<th  width="500">成绩</th>
	// 		 		</tr>
	// 		 		<tr class="odd">
	// 					<td height="30">语文</td>
	// 					<td id="cyw"></td>
	// 				</tr>
	// 				<tr>
	// 					<td height="30">数学</td>
	// 					<td id="csx"></td>
	// 				</tr>
	// 				<tr class="odd">
	// 					<td height="30">英语</td>
	// 					<td id="cyy"></td>
	// 				</tr>
	// 				<tr>
	// 					<td height="30">物理</td>
	// 					<td id="cwl"></td>
	// 				<tr class="odd">
	// 					<td height="30">化学</td>
	// 					<td id="chx"></td>
	// 				</tr>
	// 				<tr>
	// 					<td height="30">总分</td>
	// 					<td id="czf"></td>
	// 				</tr>
	// 			</table>
	// 			<table>
	// 				<tr>
    // 					<th height="50" width="80">高考科目</th>
	// 					<th width="500">成绩</th>
	// 				</tr>
	// 				<tr class="odd">
    // 					<td height="30">语文</td>
	// 					<td id="hyw"></td>
	// 				</tr>
	// 				<tr>
    // 					<td height="30">数学</td>
	// 					<td id="hsx"></td>
	// 				</tr>
	// 				<tr class="odd">
	// 					<td height="30">英语</td>
	// 					<td id="hyy"></td>
	// 				</tr>
	// 				<tr>
    // 					<td height="30">物理</td>
	// 					<td id="hwl"></td>
	// 				<tr class="odd">
    // 					<td >生物</td>
	// 					<td id="hsw"></td>
	// 				</tr>
	// 				<tr>
 	// 				   <td height="30">化学</td>
	// 					<td id="hhx"></td>
	// 				</tr>
   	// 				 <tr class="odd">
    // 					<td height="30">政治</td>
	// 					<td id="hzz"></td>
	// 				</tr>
	// 				<tr>
  	// 					<td height="30">历史</td>
	// 					<td id="hls"></td>
	// 				</tr>
	// 				<tr class="odd">
    // 					<td height="30">地理</td>
	// 					<td id="hdl"></td>
	// 				</tr>
	// 				<tr>
    // 					<td height="30">总分</td>
	// 					<td id="hzf"></td>
	// 				</tr>
	// 			</table>

	// 		</div>`;

	html+=`	<div style="border:ridge 5px rgb(46, 185, 214);">
			<div class="txDetails">
				<div class="txCount">TX ` + (Number(pos) + 1) + `</div>
				<p>
					<div class="marbleLegend">Transaction: </div>
					<div class="marbleName txId">` + data.txId.substring(0, 14) + `...</div>
				</p>
				<p>
					<div class="marbleLegend">Timestamp: </div>
					<div class="marbleName txId">` + data.timestamp + `</div>
				</p>
				<p>
					<div class="marbleLegend">company: </div>
					<div class="marbleName">` + username + `</div>
				</p>
				<p>
					<div class="marbleLegend">company Id: </div>
					<div class="marbleName">` + id + `</div>
				</p>
			</div>
			
			<div>
				<table class="auditcerts">
					<tr>
	 					<td align=center>被审计单位：</td>
						<td>`+data1+`</td>
						<td align=center>索引号</td>
	 					<td colspan="3">`+data2+`</td>
	 				</tr>
	 				<tr>
	 					<td align=center>项目</td>
	 					<td>`+data3+`</td>
	 					<td align=center>财务报表截止日/期间</td>
	 					<td colspan="3">`+data4+`</td>
	 				</tr>
	 				<tr>
	 					<td align=center>编制</td>
	 					<td>`+data5+`</td>
	 					<td align=center>复核</td>
	 					<td colspan="3">`+data6+`</td>
	 				</tr>
	 				<tr>
	 					<td align=center>日期</td>
	 					<td>`+data7+`</td>
	 					<td align=center>日期</td>
	 					<td colspan="3">`+data8+`</td>	
	 				</tr>
	 				<tr>
						 <td align=center colspan="3">审计工作</td>
						 <td>是/否/不适用</td>
					 	<td align=center>备注</td>
					 	<td colspan="2">索引号</td>
					</tr>
	 				<tr>
						 <td colspan="3">1．是否执行业务承接或保持的相关程序？</td>
						 <td>`+data9+`</td>
						<td>`+data10+`</td>
						<td>`+data11+`</td>
					</tr>
					<tr>
						 <td colspan="3">2．是否签订审计业务约定书？</td>
						 <td>`+data12+`</td>
						<td>`+data13+`</td>
						<td>`+data14+`</td>
					</tr>
					<tr>
						 <td colspan="3">3．是否制定总体审计策略？</td>
						 <td>`+data15+`</td>
						<td>`+data16+`</td>
						<td>`+data17+`</td>
					</tr>
					<tr>
						 <td colspan="3">4．审计计划制定过程中，是否了解被审计单位及其环境并评估重大错报风险，包括舞弊风险？</td>
						 <td>`+data18+`</td>
						<td>`+data19+`</td>
						<td>`+data20+`</td>
					</tr>
					<tr>
						 <td colspan="3">5.是否召开项目组会议？</td>
						 <td>`+data21+`</td>
						<td>`+data22+`</td>
						<td>`+data23+`</td>
					</tr>
					<tr>
						 <td colspan="3">6．审计计划是否经适当人员批准？</td>
						 <td>`+data24+`</td>
						<td>`+data25+`</td>
						<td>`+data26+`</td>
					</tr>
					<tr>
						 <td colspan="3">7．是否与被审计单位就审计计划进行沟通？</td>
						 <td>`+data27+`</td>
						<td>`+data28+`</td>
						<td>`+data29+`</td>
					</tr>
					<tr>
						 <td colspan="3">8．计划的审计程序是否得到较好执行，对计划的修改是否得到记录？</td>
						 <td>`+data30+`</td>
						<td>`+data31+`</td>
						<td>`+data32+`</td>
					</tr>
					<tr>
						 <td colspan="3">9．是否已获取所有必要的来自银行、律师、债权人、债务人、持有存货的第三方等外部机构的询证函回函或确认函？</td>
						 <td>`+data33+`</td>
						<td>`+data34+`</td>
						<td>`+data35+`</td>
					</tr>
					<tr>
						 <td colspan="3">10．所有重要实物资产是否均已实施监盘？</td>
						 <td>`+data36+`</td>
						<td>`+data37+`</td>
						<td>`+data38+`</td>
					</tr>

				</table>
			</div>
			<hr>
			<div>`;
	// html +=`<div>
	// 			<ul class='cbp_tmtimeline'>
	// 				<li> 
	// 			 		<time class='cbp_tmtime' datetime='2018-04-10 18:30'>
	// 			 			<span>4/10/2018</span> <span>18:30</span>
	// 					 </time> 
	// 			 		<div class='cbp_tmicon cbp_tmicon-phone'>  </div>                    
	// 			 		<div class='cbp_tmlabel'>   
	// 			 			<p> 查阅人：张海<br>区块链节点:北邮<br>
	// 							区块号：63f373dee2b627da0873756008f1318d<br>103654eed9419398e372ab54c5c4b3d5<br>
	// 			 				中考科目.语文：85 <br>
	// 							 中考科目.总分：380  
	// 						</p> 
	// 			 		</div> 
	// 			</li> 
	// 			<li> 
	// 				<time class='cbp_tmtime' datetime='2018-04-11T12:04'>                        
	// 					 <span>6/11/2018</span> <span>12:04</span>
	// 				</time>                    
	// 				<div class='cbp_tmicon cbp_tmicon-screen'></div>                    
	// 				<div class='cbp_tmlabel'>       
	// 					修改人：李大德<br>
	// 					区块链节点:北邮<br>区块号：0f44ed1b304f124e032a10998222a5f3<br>cf0cb47b5c72951b9bf671fd84b58ebf<br>
	// 					<p style='background-color: #FF0000;'>
	// 						中考科目.英语：95-->94 <br>
	// 						中考科目.总分：380-->379   
	// 					</p>                     
	// 				</div>                
	// 			</li>                
	// 			<li>                    
	// 				<time class='cbp_tmtime' datetime='2018-07-3 05:36'>                        
	// 					<span>7/3/2018</span> <span>05:36</span>
	// 				</time>                    
	// 				<div class='cbp_tmicon cbp_tmicon-mail'> </div>                    
	// 				<div class='cbp_tmlabel'>                        
	// 					<p> 查阅人：王重<br>
	// 						区块链节点:北邮<br>
	// 						区块号：f4ef53713c46226a2808cfc50dbc23bb<br>7b70bcde8177c7ef8f58d8f9f7794b4a<br>
	// 						中考科目.数学：98 <br>中考科目.总分：379  
	// 					</p>               
	// 				</div>                
	// 			</li>                
	// 			<li>                   
	// 				<time class='cbp_tmtime' datetime='2013-04-15 13:15'>                       
	// 					<span>7/4/2018</span> <span>13:15</span>
	// 				</time>                    
	// 				<div class='cbp_tmicon cbp_tmicon-phone'>  </div>                    
	// 				<div class='cbp_tmlabel'>                        
	// 					<p> 查阅人：刘谋<br>
	// 						区块链节点:北邮<br>
	// 						区块号：76ec53715d46226a3808cfc35wbc12bb7<br>b70zxcv6532c7ef9u58d8f9f7815sew<br>
	// 						中考科目.物理：47 <br>
	// 						中考科目.总分：379  
	// 					</p>               
	// 				</div>                
	// 			</li>                         
	// 		</ul>
	// </div>`;

	// html +=`<div>
	// 			<ul class='cbp_tmtimeline'>
	// 				<li> 
	// 			 		<time class='cbp_tmtime' datetime='2018-04-10 18:30'>
	// 			 			<span>4/10/2018</span> <span>18:30</span>
	// 					 </time> 
	// 			 		<div class='cbp_tmicon cbp_tmicon-phone'>  </div>                    
	// 			 		<div class='cbp_tmlabel'>   
	// 			 			<p> 查阅人：张海<br>区块链节点:北邮<br>
	// 							区块号：63f373dee2b627da0873756008f1318d<br>103654eed9419398e372ab54c5c4b3d5<br>
	// 			 				中考科目.语文：85 <br>
	// 							中考科目.总分：380  
	// 						</p> 
	// 			 		</div> 
	// 				</li>                 		                         
	// 			</ul>
	// 		</div>`;

	return html;
}


//百度地图