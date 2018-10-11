//-------------------------------------------------------------------
// Marbles Chaincode Library
// - this contains the most interesting code pieces of marbles.
// - each function is using the FCW library to communicate to the peer/orderer
// - from here we can interact with our chaincode.
//   - the cc_function is the chaincode function we will call
//   - the cc_args are the arguments to pass to your chaincode function
//-------------------------------------------------------------------

module.exports = function (enrollObj, g_options, fcw, logger) {
	var marbles_chaincode = {};

	// Chaincode -------------------------------------------------------------------------------

	//check if chaincode exists
	marbles_chaincode.check_if_already_instantiated = function (options, cb) {
		console.log('');
		logger.info('Checking for chaincode...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['selftest']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {  // send a request to our peer
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null || isNaN(resp.parsed)) {	 //if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	//check chaincode version
	marbles_chaincode.check_version = function (options, cb) {
		console.log('');
		logger.info('Checking chaincode and ui compatibility...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['marbles_ui']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null) {							//if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};


	// Marbles -------------------------------------------------------------------------------

	//create a marble
	marbles_chaincode.create_a_marble = function (options, cb) {
		console.log('');
		logger.info('Creating a marble...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_marble',
			cc_args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.color,
				options.args.size,
				options.args.owner_id,
				options.args.auth_company
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];			//pass marble id back
				cb(err, resp);
			}
		});
	};

		//create a marble
	marbles_chaincode.create_a_marble = function (options, cb) {
		console.log('');
		logger.info('Creating a marble...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_marble',
			cc_args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.color,
				options.args.size,
				options.args.owner_id,
				options.args.auth_company
			],
		};
		// console.log("杜保皓cc_lib_init_marble",opts);
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];			//pass marble id back
				cb(err, resp);
			}
		});
	};

	//dubaohao--------------------------create a cert
	marbles_chaincode.create_a_cert = function (options, cb) {
		console.log('');
		logger.info('Creating a cert...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_cert',
			cc_args: [
				'm' + leftPad(Date.now() + randStr(5), 19),
				options.args.owner_id,
				options.args.auth_company,

				options.args.data1,
				options.args.data2,
				options.args.data3,
				options.args.data4,
				options.args.data5,
				options.args.data6,
				options.args.data7,
				options.args.data8,
				options.args.data9,
				options.args.data10,

				options.args.data11,
				options.args.data12,
				options.args.data13,
				options.args.data14,
				options.args.data15,
				options.args.data16,
				options.args.data17,
				options.args.data18,
				options.args.data19,
				options.args.data20,

				options.args.data21,
				options.args.data22,
				options.args.data23,
				options.args.data24,
				options.args.data25,
				options.args.data26,
				options.args.data27,
				options.args.data28,
				options.args.data29,
				options.args.data30,

				options.args.data31,
				options.args.data32,
				options.args.data33,
				options.args.data34,
				options.args.data35,
				options.args.data36,
				options.args.data37,
				options.args.data38,
				// options.args.data39,
				// options.args.data40,

			],
		};
		// console.log("杜保皓cc_lib_init_cert",opts);
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];			//pass marble id back
				cb(err, resp);
			}
		});
	};

	//get marble
	marbles_chaincode.get_marble = function (options, cb) {
		logger.info('fetching marble ' + options.marble_id + ' list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read',
			cc_args: [options.args.marble_id]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// //dubaohao-------------------get marble
	// marbles_chaincode.get_cert = function (options, cb) {
	// 	logger.info('fetching marble ' + options.marble_id + ' list...');

	// 	var opts = {
	// 		peer_urls: g_options.peer_urls,
	// 		peer_tls_opts: g_options.peer_tls_opts,
	// 		channel_id: g_options.channel_id,
	// 		chaincode_version: g_options.chaincode_version,
	// 		chaincode_id: g_options.chaincode_id,
	// 		cc_function: 'read',
	// 		cc_args: [options.args.marble_id]   ////后期可能修改这个值为cert_id
	// 	};
	// 	fcw.query_chaincode(enrollObj, opts, cb);
	// };

	//set marble owner
	marbles_chaincode.set_marble_owner = function (options, cb) {
		console.log('');
		console.log('1set_owner进入marbles_lib文件了!!');
		logger.info('Setting marble owner...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'set_owner',
			cc_args: [
				options.args.marble_id,
				options.args.owner_id,
				options.args.auth_company
			],
		};
		//console.log('set',enrollObj,cb);
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

//dubaohao ---------update marble owner
		marbles_chaincode.update_marble_Info = function (options, cb) {
			console.log('');
			console.log('2update进入marbles_lib文件了!!');
			logger.info('updatting marble info...');
	
			var opts = {
				peer_urls: g_options.peer_urls,
				peer_tls_opts: g_options.peer_tls_opts,
				channel_id: g_options.channel_id,
				chaincode_id: g_options.chaincode_id,
				chaincode_version: g_options.chaincode_version,
				event_urls: g_options.event_urls,
				endorsed_hook: options.endorsed_hook,
				ordered_hook: options.ordered_hook,
				cc_function: 'update_marbleInfo',
				cc_args: [
					options.args.marble_id,
					options.args.color,
					options.args.size,
					options.args.owner_id,
					options.args.company
				],
			};
			//console.log('update',enrollObj,cb);
			fcw.invoke_chaincode(enrollObj, opts, cb);
		};

//dubaohao ---------update cert
marbles_chaincode.update_cert_Info = function (options, cb) {
	console.log('');
	console.log('2update进入marbles_lib文件了!!');
	logger.info('updatting cert info...');

	var opts = {
		peer_urls: g_options.peer_urls,
		peer_tls_opts: g_options.peer_tls_opts,
		channel_id: g_options.channel_id,
		chaincode_id: g_options.chaincode_id,
		chaincode_version: g_options.chaincode_version,
		event_urls: g_options.event_urls,
		endorsed_hook: options.endorsed_hook,
		ordered_hook: options.ordered_hook,
		cc_function: 'update_certInfo',
		cc_args: [
			options.args.marble_id,
			options.args.owner_id,
			options.args.company,
			options.args.data1,
				options.args.data2,
				options.args.data3,
				options.args.data4,
				options.args.data5,
				options.args.data6,
				options.args.data7,
				options.args.data8,
				options.args.data9,
				options.args.data10,

				options.args.data11,
				options.args.data12,
				options.args.data13,
				options.args.data14,
				options.args.data15,
				options.args.data16,
				options.args.data17,
				options.args.data18,
				options.args.data19,
				options.args.data20,

				options.args.data21,
				options.args.data22,
				options.args.data23,
				options.args.data24,
				options.args.data25,
				options.args.data26,
				options.args.data27,
				options.args.data28,
				options.args.data29,
				options.args.data30,

				options.args.data31,
				options.args.data32,
				options.args.data33,
				options.args.data34,
				options.args.data35,
				options.args.data36,
				options.args.data37,
				options.args.data38,
				// options.args.data39,
				// options.args.data40,
		],
	};
	console.log('cc_lib_update_cert',opts);
	fcw.invoke_chaincode(enrollObj, opts, cb);
};

	//delete marble
	marbles_chaincode.delete_marble = function (options, cb) {
		console.log('');
		logger.info('Deleting a marble...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'delete_marble',
			cc_args: [options.args.marble_id, options.args.auth_company],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	//get history for key
	marbles_chaincode.get_history = function (options, cb) {
		logger.info('Getting history for...', options.args);

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'getHistory',
			cc_args: [options.args.id]
		};
		// console.log("杜保皓git_history",opts);
		fcw.query_chaincode(enrollObj, opts, cb);
		// console.log("杜保皓git_history",enrollObj);
	};

	//get multiple marbles/owners by start and stop ids
	marbles_chaincode.get_multiple_keys = function (options, cb) {
		logger.info('Getting marbles between ids', options.args);

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'getMarblesByRange',
			cc_args: [options.args.start_id, options.args.stop_id]
		};
		console.log("杜保皓cc_lib_get_multiple_keys",opts);
		fcw.query_chaincode(enrollObj, opts, cb);
	};


	// Owners -------------------------------------------------------------------------------

	//register a owner/user
	marbles_chaincode.register_owner = function (options, cb) {
		console.log('');
		logger.info('Creating a marble owner...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'init_owner',
			cc_args: [
				'o' + leftPad(Date.now() + randStr(5), 19),
				options.args.marble_owner,
				options.args.owners_company
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];				//pass owner id back
				cb(err, resp);
			}
		});
	};

	//get a owner/user
	marbles_chaincode.get_owner = function (options, cb) {
		var full_username = build_owner_name(options.args.marble_owner, options.args.owners_company);
		console.log('');
		logger.info('Fetching owner ' + full_username + ' list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: [full_username]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//get the owner list
	marbles_chaincode.get_owner_list = function (options, cb) {
		console.log('');
		logger.info('Fetching owner index list...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['_ownerindex']
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// disable a marble owner
	marbles_chaincode.disable_owner = function (options, cb) {
		console.log('');
		logger.info('Disabling a marble owner...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_urls: g_options.event_urls,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'disable_owner',
			cc_args: [
				options.args.owner_id,
				options.args.auth_company
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
			if (cb) {
				if (!resp) resp = {};
				resp.id = opts.cc_args[0];				//pass owner id back
				cb(err, resp);
			}
		});
	};

	//build full name
	marbles_chaincode.build_owner_name = function (username, company) {
		return build_owner_name(username, company);
	};


	// All ---------------------------------------------------------------------------------

	//build full name
	marbles_chaincode.read_everything = function (options, cb) {
		console.log('');
		logger.info('Fetching EVERYTHING...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'read_everything',
			cc_args: ['']
		};
		// console.log("杜保皓read_everythig",opts);
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// get block height of the channel
	marbles_chaincode.channel_stats = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts
		};
		fcw.query_channel(enrollObj, opts, cb);
	};


	// Other -------------------------------------------------------------------------------

	// Format Owner's Actual Key Name
	function build_owner_name(username, company) {
		return username.toLowerCase() + '.' + company;
	}

	// random string of x length
	function randStr(length) {
		var text = '';
		var possible = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
		for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	// left pad string with "0"s
	function leftPad(str, length) {
		for (var i = str.length; i < length; i++) str = '0' + String(str);
		return str;
	}

	return marbles_chaincode;
};
