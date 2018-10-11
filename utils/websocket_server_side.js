// ==================================
// Websocket Server Side Code
// ==================================

module.exports = function (cp, fcw, logger) {
	var ws_server = {};
	var known_everything = {};
	var marbles_lib = {};
	var wss = {};
	var known_height = 0;
	var checkPeriodically = null;
	var enrollInterval = null;
	var start_up_states = {												//Marbles Startup Steps
		checklist: { state: 'waiting', step: 'step1' },					// Step 1 - check config files for somewhat correctness
		enrolling: { state: 'waiting', step: 'step2' },					// Step 2 - enroll the admin
		find_chaincode: { state: 'waiting', step: 'step3' },			// Step 3 - find the chaincode on the channel
		register_owners: { state: 'waiting', step: 'step4' },			// Step 4 - create the marble owners
	};

	//--------------------------------------------------------
	// Setup WS Module
	//--------------------------------------------------------
	ws_server.setup = function (l_wss, l_marbles_lib) {
		marbles_lib = (l_marbles_lib) ? l_marbles_lib : marbles_lib;
		wss = (l_wss) ? l_wss : wss;

		// --- Keep Alive  --- //
		clearInterval(enrollInterval);
		enrollInterval = setInterval(function () {						//to avoid REQUEST_TIMEOUT errors we periodically re-enroll
			let enroll_options = cp.makeEnrollmentOptions(0);
			fcw.enroll(enroll_options, function (err, enrollObj2) { });	//this seems to be safe 3/27/2017
		}, cp.getKeepAliveMs());										//timeout happens at 5 minutes, so this interval should be faster than that
	};

	// Message to client to communicate where we are in the start up
	ws_server.build_state_msg = function () {
		return {
			msg: 'app_state',
			state: start_up_states,
		};
	};

	// record new app state
	ws_server.record_state = function (change_state, outcome) {
		start_up_states[change_state].state = outcome;
	};

	// Send to all connected clients
	ws_server.broadcast_state = function () {
		try {
			wss.broadcast(ws_server.build_state_msg());						//tell client our app state
		} catch (e) { }														//this is expected to fail for "checking"
	};

	//--------------------------------------------------------
	// Process web socket messages - blockchain code is near. "marbles_lib"
	//--------------------------------------------------------
	ws_server.process_msg = function (ws, data) {
		const channel = cp.getChannelId();
		const first_peer = cp.getFirstPeerName(channel);
		var options = {
			peer_urls: [cp.getPeersUrl(first_peer)],
			ws: ws,
			endorsed_hook: endorse_hook,
			ordered_hook: orderer_hook
		};
		if (marbles_lib === null) {
			logger.error('marbles lib is null...');				//can't run in this state
			return;
		}

		// create a new marble
		if (data.type === 'create') {
			logger.info('[ws] create marbles req');
			options.args = {
				color: data.color,
				size: data.size,
				marble_owner: data.username,
				owners_company: data.company,
				owner_id: data.owner_id,
				auth_company: process.env.marble_company,
			};

			marbles_lib.create_a_marble(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

		// dubaohao---------create a new cert
		if (data.type === 'createCert') {
			logger.info('[ws] create cert req');
			// console.log("websocker server side",data);
			options.args = {
				data1: data.data1,
			data2: data.data2,
			data3: data.data3,
			data4: data.data4,
			data5: data.data5,
			data6: data.data6,
			data7: data.data7,
			data8: data.data8,
			data9: data.data9,
			data10: data.data10,

			data11: data.data11,
			data12: data.data12,
			data13: data.data13,
			data14: data.data14,
			data15: data.data15,
			data16: data.data16,
			data17: data.data17,
			data18: data.data18,
			data19: data.data19,
			data20: data.data20,

			data21: data.data21,
			data22: data.data22,
			data23: data.data23,
			data24: data.data24,
			data25: data.data25,
			data26: data.data26,
			data27: data.data27,
			data28: data.data28,
			data29: data.data29,
			data30: data.data30,

			data31: data.data31,
			data32: data.data32,
			data33: data.data33,
			data34: data.data34,
			data35: data.data35,
			data36: data.data36,
			data37: data.data37,
			data38: data.data38,
			// data39: data.data39,
			// data40: data.data40,

				marble_owner: data.username,
				owners_company: data.company,
				owner_id: data.owner_id,
				auth_company: process.env.marble_company,
				
			};

			marbles_lib.create_a_cert(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

		// transfer a marble
		else if (data.type === 'transfer_marble') {
			console.log("transfer进入server了！！！");
			logger.info('[ws] transferring req');
			options.args = {
				marble_id: data.id,
				owner_id: data.owner_id,
				auth_company: process.env.marble_company
			};

			marbles_lib.set_marble_owner(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

//dubaohao----------- update a marble
		else if (data.type === 'update_marbleInfo') {
			console.log("update进入server了！！！");
			logger.info('[ws] updating req');
			options.args = {
				marble_id: data.id,
				color:data.color,
				size:data.size,
				owner_id: data.owner_id,
				company: process.env.marble_company
				
			};
		
			marbles_lib.update_marble_Info(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

//dubaohao----------- update a cert
		else if (data.type === 'update_certInfo') {
			console.log("update进入server了！！！");
			logger.info('[ws] updating req');
			options.args = {
				marble_id: data.id,
				data1: data.data1,
			data2: data.data2,
			data3: data.data3,
			data4: data.data4,
			data5: data.data5,
			data6: data.data6,
			data7: data.data7,
			data8: data.data8,
			data9: data.data9,
			data10: data.data10,

			data11: data.data11,
			data12: data.data12,
			data13: data.data13,
			data14: data.data14,
			data15: data.data15,
			data16: data.data16,
			data17: data.data17,
			data18: data.data18,
			data19: data.data19,
			data20: data.data20,

			data21: data.data21,
			data22: data.data22,
			data23: data.data23,
			data24: data.data24,
			data25: data.data25,
			data26: data.data26,
			data27: data.data27,
			data28: data.data28,
			data29: data.data29,
			data30: data.data30,

			data31: data.data31,
			data32: data.data32,
			data33: data.data33,
			data34: data.data34,
			data35: data.data35,
			data36: data.data36,
			data37: data.data37,
			data38: data.data38,
			// data39: data.data39,
			// data40: data.data40,
				owner_id: data.owner_id,
				company: process.env.marble_company
				
			};
		
			marbles_lib.update_cert_Info(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

		// delete marble
		else if (data.type === 'delete_marble') {
			logger.info('[ws] delete marble req');
			options.args = {
				marble_id: data.id,
				auth_company: process.env.marble_company
			};

			marbles_lib.delete_marble(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
			});
		}

		// get all owners, marbles, & companies
		else if (data.type === 'read_everything') {
			logger.info('[ws] read everything req');
			// console.log("杜保皓websocker_sever_side_read_everything",data);
			ws_server.check_for_updates(ws);
		}

		// get history of marble
		else if (data.type === 'audit') {
			if (data.marble_id) {
				logger.info('[ws] audit history');
				options.args = {
					id: data.marble_id,
				};
				marbles_lib.get_history(options, function (err, resp) {
					if (err != null) send_err(err, resp);
					else options.ws.send(JSON.stringify({ msg: 'history', data: resp }));
				});
			}
		}

		// disable marble owner
		else if (data.type === 'disable_owner') {
			if (data.owner_id) {
				logger.info('[ws] disable owner');
				options.args = {
					owner_id: data.owner_id,
					auth_company: process.env.marble_company
				};
				marbles_lib.disable_owner(options, function (err, resp) {
					if (err != null) send_err(err, resp);
					else options.ws.send(JSON.stringify({ msg: 'tx_step', state: 'finished' }));
				});
			}
		}

		// send transaction error msg
		function send_err(msg, input) {
			sendMsg({ msg: 'tx_error', e: msg, input: input });
			sendMsg({ msg: 'tx_step', state: 'committing_failed' });
		}

		// send a message, socket might be closed...
		function sendMsg(json) {
			if (ws) {
				try {
					ws.send(JSON.stringify(json));
				}
				catch (e) {
					logger.debug('[ws error] could not send msg', e);
				}
			}
		}

		// endorsement stage callback
		function endorse_hook(err) {
			if (err) sendMsg({ msg: 'tx_step', state: 'endorsing_failed' });
			else sendMsg({ msg: 'tx_step', state: 'ordering' });
		}

		// ordering stage callback
		function orderer_hook(err) {
			if (err) sendMsg({ msg: 'tx_step', state: 'ordering_failed' });
			else sendMsg({ msg: 'tx_step', state: 'committing' });
		}
	};

	// sch next periodic check
	function sch_next_check() {
		clearTimeout(checkPeriodically);
		checkPeriodically = setTimeout(function () {
			try {
				ws_server.check_for_updates(null);
			}
			catch (e) {
				console.log('');
				logger.error('Error in sch next check\n\n', e);
				sch_next_check();
				ws_server.check_for_updates(null);
			}
		}, cp.getBlockDelay() + 2000);
	}

	// --------------------------------------------------------
	// Check for Updates to Ledger
	// --------------------------------------------------------
	ws_server.check_for_updates = function (ws_client) {
		marbles_lib.channel_stats(null, function (err, resp) {
			var newBlock = false;
			if (err != null) {
				var eObj = {
					msg: 'error',
					e: err,
				};
				if (ws_client) ws_client.send(JSON.stringify(eObj)); 									//send to a client
				else wss.broadcast(eObj);																//send to all clients
			} else {
				if (resp && resp.height && resp.height.low) {
					if (resp.height.low > known_height || ws_client) {
						if (!ws_client) {
							console.log('');
							logger.info('New block detected!', resp.height.low, resp);
							known_height = resp.height.low;
							newBlock = true;
							logger.debug('[checking] there are new things, sending to all clients');
							wss.broadcast({ msg: 'block', e: null, block_height: resp.height.low });	//send to all clients
						} else {
							logger.debug('[checking] on demand req, sending to a client');
							var obj = {
								msg: 'block',
								e: null,
								block_height: resp.height.low,
								block_delay: cp.getBlockDelay()
							};
							ws_client.send(JSON.stringify(obj)); 										//send to a client
						}
					}
				}
			}

			if (newBlock || ws_client) {
				read_everything(ws_client, function () {
					sch_next_check();						//check again
				});
			} else {
				sch_next_check();							//check again
			}
		});
	};

	// read complete state of marble world
	function read_everything(ws_client, cb) {
		const channel = cp.getChannelId();
		const first_peer = cp.getFirstPeerName(channel);
		var options = {
			peer_urls: [cp.getPeersUrl(first_peer)],
		};

		marbles_lib.read_everything(options, function (err, resp) {
			if (err != null) {
				console.log('');
				logger.debug('[checking] could not get everything:', err);
				var obj = {
					msg: 'error',
					e: err,
				};
				if (ws_client) ws_client.send(JSON.stringify(obj)); 								//send to a client
				else wss.broadcast(obj);																//send to all clients
				if (cb) cb();
			}
			else {
				var data = resp.parsed;
				console.log("杜保皓websocket_server_side_read_everything",data.marbles);
				if (data && data.owners && data.marbles) {
					console.log('');
					logger.debug('[checking] number of owners:', data.owners.length);
					logger.debug('[checking] number of marbles:', data.marbles.length);
				}

				data.owners = organize_usernames(data.owners);
				data.marbles = organize_marbles(data.marbles);
				var knownAsString = JSON.stringify(known_everything);			//stringify for easy comparison (order should stay the same)
				var latestListAsString = JSON.stringify(data);

				if (knownAsString === latestListAsString) {
					logger.debug('[checking] same everything as last time');
					if (ws_client !== null) {									//if this is answering a clients req, send to 1 client
						logger.debug('[checking] sending to 1 client');
						ws_client.send(JSON.stringify({ msg: 'everything', e: err, everything: data }));
					}
				}
				else {															//detected new things, send it out
					logger.debug('[checking] there are new things, sending to all clients');
					known_everything = data;
					//  console.log("杜保皓websocket_server_side",known_everything.marbles.amy.marbles);
					wss.broadcast({ msg: 'everything', e: err, everything: data });	//sent to all clients
				}
				if (cb) cb();
			}
		});
	}

	// organize the marble owner list
	function organize_usernames(data) {
		var ownerList = [];
		var myUsers = [];
		for (var i in data) {						//lets reformat it a bit, only need 1 peer's response
			var temp = {
				id: data[i].id,
				username: data[i].username,
				company: data[i].company
			};
			if (temp.company === process.env.marble_company) {
				myUsers.push(temp);					//these are my companies users
			}
			else {
				ownerList.push(temp);				//everyone else
			}
		}

		ownerList = sort_usernames(ownerList);
		ownerList = myUsers.concat(ownerList);		//my users are first, bring in the others
		return ownerList;
	}

	//
	function organize_marbles(allMarbles) {
		var ret = {};
		for (var i in allMarbles) {
			if (!ret[allMarbles[i].owner.username]) {
				ret[allMarbles[i].owner.username] = {
					owner_id: allMarbles[i].owner.id,
					username: allMarbles[i].owner.username,
					company: allMarbles[i].owner.company,
					marbles: []
				};
			}
			ret[allMarbles[i].owner.username].marbles.push(allMarbles[i]);
		}
		return ret;
	}

	// alpha sort everyone else
	function sort_usernames(temp) {
		temp.sort(function (a, b) {
			var entryA = a.company + a.username;
			var entryB = b.company + b.username;
			if (entryA < entryB) return -1;
			if (entryA > entryB) return 1;
			return 0;
		});
		return temp;
	}

	return ws_server;
};
