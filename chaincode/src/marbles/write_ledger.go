/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// write() - genric write variable into ledger
//
// Shows Off PutState() - writting a key/value into the ledger
//
// Inputs - Array of strings
//    0   ,    1
//   key  ,  value
//  "abc" , "test"
// ============================================================================================================================
func write(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, value string
	var err error
	fmt.Println("starting write")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2. key of the variable and value to set")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0] //rename for funsies
	value = args[1]
	err = stub.PutState(key, []byte(value)) //write the variable into the ledger
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end write")
	return shim.Success(nil)
}

// ============================================================================================================================
// delete_marble() - remove a marble from state and from marble index
//
// Shows Off DelState() - "removing"" a key/value from the ledger
//
// Inputs - Array of strings
//      0      ,         1
//     id      ,  authed_by_company
// "m999999999", "united marbles"
// ============================================================================================================================
func delete_marble(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("starting delete_marble")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// input sanitation
	err := sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	authed_by_company := args[1]

	// get the marble
	marble, err := get_marble(stub, id)
	if err != nil {
		fmt.Println("Failed to find marble by id " + id)
		return shim.Error(err.Error())
	}

	// check authorizing company (see note in set_owner() about how this is quirky)
	if marble.Owner.Company != authed_by_company {
		return shim.Error("The company '" + authed_by_company + "' cannot authorize deletion for '" + marble.Owner.Company + "'.")
	}

	// remove the marble
	err = stub.DelState(id) //remove the key from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	fmt.Println("- end delete_marble")
	return shim.Success(nil)
}

// ============================================================================================================================
// Init Marble - create a new marble, store into chaincode state
//
// Shows off building a key's JSON value manually
//
// Inputs - Array of strings
//      0      ,    1  ,  2  ,      3          ,       4
//     id      ,  color, size,     owner id    ,  authing company
// "m999999999", "blue", "35", "o9999999999999", "united marbles"
// ============================================================================================================================
func init_marble(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_marble")

	// if len(args) != 5 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 5")
	// }

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	// id := args[0]
	// color := strings.ToLower(args[1])
	// size, err := strconv.Atoi(args[2])
	// owner_id := args[3]
	// authed_by_company := args[4]
	id := args[0]
	// color := strings.ToLower(args[1])
	// size, err := strconv.Atoi(args[2])
	owner_id := args[1]
	authed_by_company := args[2]

	data1 := args[3] //data1
	data2 := args[4]
	data3 := args[5]
	data4 := args[6]
	data5 := args[7]
	data6 := args[8]
	data7 := args[9]
	data8 := args[10]
	data9 := args[11]
	data10 := args[12]

	data11 := args[13] //data11
	data12 := args[14]
	data13 := args[15]
	data14 := args[16]
	data15 := args[17]
	data16 := args[18]
	data17 := args[19]
	data18 := args[20]
	data19 := args[21]
	data20 := args[22]

	data21 := args[23] //data21
	data22 := args[24]
	data23 := args[25]
	data24 := args[26]
	data25 := args[27]
	data26 := args[28]
	data27 := args[29]
	data28 := args[30]
	data29 := args[31]
	data30 := args[32]

	data31 := args[33] //data31
	data32 := args[34]
	data33 := args[35]
	data34 := args[36]
	data35 := args[37]
	data36 := args[38]
	data37 := args[39]
	data38 := args[40]
	// data39 := args[11]
	// data40 := args[12]

	if err != nil {
		return shim.Error("3rd argument must be a numeric string")
	}

	//check if new owner exists
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		fmt.Println("Failed to find owner - " + owner_id)
		return shim.Error(err.Error())
	}

	//check authorizing company (see note in set_owner() about how this is quirky)
	if owner.Company != authed_by_company {
		return shim.Error("The company '" + authed_by_company + "' cannot authorize creation for '" + owner.Company + "'.")
	}

	//check if marble id already exists
	marble, err := get_marble(stub, id)
	if err == nil {
		fmt.Println("This marble already exists - " + id)
		fmt.Println(marble)
		return shim.Error("This marble already exists - " + id) //all stop a marble by this id exists
	}

	//build the marble json string manually
	// str := `{
	// 	"docType":"marble",
	// 	"id": "` + id + `",
	// 	"color": "` + color + `",
	// 	"size": ` + strconv.Itoa(size) + `,
	// 	"owner": {
	// 		"id": "` + owner_id + `",
	// 		"username": "` + owner.Username + `",
	// 		"company": "` + owner.Company + `"
	// 	}
	// }`
	str := `{
		"docType":"marble", 
		"id": "` + id + `", 
		"data1": "` + data1 + `", 
		"data2": "` + data2 + `", 
		"data3": "` + data3 + `",
		"data4": "` + data4 + `",
		"data5": "` + data5 + `",
		"data6": "` + data6 + `",
		"data7": "` + data7 + `",
		"data8": "` + data8 + `",
		"data9": "` + data9 + `",
		"data10": "` + data10 + `",
		"data11": "` + data11 + `", 
		"data12": "` + data12 + `", 
		"data13": "` + data13 + `",
		"data14": "` + data14 + `",
		"data15": "` + data15 + `",
		"data16": "` + data16 + `",
		"data17": "` + data17 + `",
		"data18": "` + data18 + `",
		"data19": "` + data19 + `",
		"data20": "` + data20 + `",
		"data21": "` + data21 + `", 
		"data22": "` + data22 + `", 
		"data23": "` + data23 + `",
		"data24": "` + data24 + `",
		"data25": "` + data25 + `",
		"data26": "` + data26 + `",
		"data27": "` + data27 + `",
		"data28": "` + data28 + `",
		"data29": "` + data29 + `",
		"data30": "` + data30 + `",
		"data31": "` + data31 + `", 
		"data32": "` + data32 + `", 
		"data33": "` + data33 + `",
		"data34": "` + data34 + `",
		"data35": "` + data35 + `",
		"data36": "` + data36 + `",
		"data37": "` + data37 + `",
		"data38": "` + data38 + `",
		"owner": {
			"id": "` + owner_id + `", 
			"username": "` + owner.Username + `", 
			"company": "` + owner.Company + `"
		}	
	}`
	err = stub.PutState(id, []byte(str)) //store marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_marble")
	return shim.Success(nil)
}

// ============================================================================================================================
// Init Cert - create a new cert, store into chaincode state
//
// Shows off building a key's JSON value manually
//
// Inputs - Array of strings
//      0      ,    1  ,  2  ,      3          ,       4
//     id      ,  color, size,     owner id    ,  authing company
// "m999999999", "blue", "35", "o9999999999999", "united marbles"
// ============================================================================================================================
func init_cert(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_cert")

	// if len(args) != 5 {
	// 	// return shim.Error("Incorrect number of arguments. Expecting 5")
	// 	return shim.Error("args")
	// }

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	// color := strings.ToLower(args[1])
	// size, err := strconv.Atoi(args[2])
	owner_id := args[1]
	authed_by_company := args[2]

	data1 := args[3] //data1
	data2 := args[4]
	data3 := args[5]
	data4 := args[6]
	data5 := args[7]
	data6 := args[8]
	data7 := args[9]
	data8 := args[10]
	data9 := args[11]
	data10 := args[12]

	data11 := args[13] //data11
	data12 := args[14]
	data13 := args[15]
	data14 := args[16]
	data15 := args[17]
	data16 := args[18]
	data17 := args[19]
	data18 := args[20]
	data19 := args[21]
	data20 := args[22]

	data21 := args[23] //data21
	data22 := args[24]
	data23 := args[25]
	data24 := args[26]
	data25 := args[27]
	data26 := args[28]
	data27 := args[29]
	data28 := args[30]
	data29 := args[31]
	data30 := args[32]

	data31 := args[33] //data31
	data32 := args[34]
	data33 := args[35]
	data34 := args[36]
	data35 := args[37]
	data36 := args[38]
	data37 := args[39]
	data38 := args[40]
	// data39 := args[11]
	// data40 := args[12]

	if err != nil {
		return shim.Error("3rd argument must be a numeric string")
	}

	//check if new owner exists
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		fmt.Println("Failed to find owner - " + owner_id)
		return shim.Error(err.Error())
	}

	//check authorizing company (see note in set_owner() about how this is quirky)
	if owner.Company != authed_by_company {
		return shim.Error("The company '" + authed_by_company + "' cannot authorize creation for '" + owner.Company + "'.")
	}

	//check if marble id already exists
	marble, err := get_marble(stub, id)
	if err == nil {
		fmt.Println("This marble already exists - " + id)
		fmt.Println(marble)
		return shim.Error("This marble already exists - " + id) //all stop a marble by this id exists
	}

	//build the marble json string manually
	///共计写20个data属性值，改写color和size
	str := `{
		"docType":"marble", 
		"id": "` + id + `", 
		"data1": "` + data1 + `", 
		"data2": "` + data2 + `", 
		"data3": "` + data3 + `",
		"data4": "` + data4 + `",
		"data5": "` + data5 + `",
		"data6": "` + data6 + `",
		"data7": "` + data7 + `",
		"data8": "` + data8 + `",
		"data9": "` + data9 + `",
		"data10": "` + data10 + `",
		"data11": "` + data11 + `", 
		"data12": "` + data12 + `", 
		"data13": "` + data13 + `",
		"data14": "` + data14 + `",
		"data15": "` + data15 + `",
		"data16": "` + data16 + `",
		"data17": "` + data17 + `",
		"data18": "` + data18 + `",
		"data19": "` + data19 + `",
		"data20": "` + data20 + `",
		"data21": "` + data21 + `", 
		"data22": "` + data22 + `", 
		"data23": "` + data23 + `",
		"data24": "` + data24 + `",
		"data25": "` + data25 + `",
		"data26": "` + data26 + `",
		"data27": "` + data27 + `",
		"data28": "` + data28 + `",
		"data29": "` + data29 + `",
		"data30": "` + data30 + `",
		"data31": "` + data31 + `", 
		"data32": "` + data32 + `", 
		"data33": "` + data33 + `",
		"data34": "` + data34 + `",
		"data35": "` + data35 + `",
		"data36": "` + data36 + `",
		"data37": "` + data37 + `",
		"data38": "` + data38 + `",
		"owner": {
			"id": "` + owner_id + `", 
			"username": "` + owner.Username + `", 
			"company": "` + owner.Company + `"
		}	
	}`
	err = stub.PutState(id, []byte(str)) //store marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_cert")
	return shim.Success(nil)
}

// ============================================================================================================================
// Init Owner - create a new owner aka end user, store into chaincode state
//
// Shows off building key's value from GoLang Structure
//
// Inputs - Array of Strings
//           0     ,     1   ,   2
//      owner id   , username, company
// "o9999999999999",     bob", "united marbles"
// ============================================================================================================================
func init_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_owner")

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 31")
	}

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var owner Owner
	owner.ObjectType = "marble_owner"
	owner.Id = args[0]
	owner.Username = strings.ToLower(args[1])
	owner.Company = args[2]
	owner.Enabled = true
	fmt.Println(owner)

	//check if user already exists
	_, err = get_owner(stub, owner.Id)
	if err == nil {
		fmt.Println("This owner already exists - " + owner.Id)
		return shim.Error("This owner already exists - " + owner.Id)
	}

	//store user
	ownerAsBytes, _ := json.Marshal(owner)      //convert to array of bytes
	err = stub.PutState(owner.Id, ownerAsBytes) //store owner by its Id
	if err != nil {
		fmt.Println("Could not store user")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_owner marble")
	return shim.Success(nil)
}

// ============================================================================================================================
// Set Owner on Marble
//
// Shows off GetState() and PutState()
//
// Inputs - Array of Strings
//       0     ,        1      ,        2
//  marble id  ,  to owner id  , company that auth the transfer
// "m999999999", "o99999999999", united_mables"
// ============================================================================================================================
func set_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting set_owner")

	// this is quirky
	// todo - get the "company that authed the transfer" from the certificate instead of an argument
	// should be possible since we can now add attributes to the enrollment cert
	// as is.. this is a bit broken (security wise), but it's much much easier to demo! holding off for demos sake

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 32")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var marble_id = args[0]
	var new_owner_id = args[1]
	var authed_by_company = args[2]
	fmt.Println(marble_id + "->" + new_owner_id + " - |" + authed_by_company)

	// check if user already exists
	owner, err := get_owner(stub, new_owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + new_owner_id)
	}

	// get marble's current state
	marbleAsBytes, err := stub.GetState(marble_id)
	if err != nil {
		return shim.Error("Failed to get marble")
	}
	res := Marble{}
	json.Unmarshal(marbleAsBytes, &res) //un stringify it aka JSON.parse()

	// check authorizing company
	// if res.Owner.Company != authed_by_company {
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// transfer the marble
	res.Owner.Id = new_owner_id //change the owner
	res.Owner.Username = owner.Username
	res.Owner.Company = owner.Company
	jsonAsBytes, _ := json.Marshal(res)       //convert to array of bytes
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end set owner")
	return shim.Success(nil)
}

// ============================================================================================================================
// dubaohao -----update info on Marble
//
// Shows off GetState() and PutState()
//
// Inputs - Array of Strings
//       0     ,        1      ,        2                      ,  3   ,  4
//  marble id  ,  owner id  , company that auth the transfer, color,size
// "m999999999", "o99999999999", united_mables"                ,"red" ,large
// ============================================================================================================================
func update_marbleInfo(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting updates_marbleInfo")

	// this is quirky
	// todo - get the "company that authed the transfer" from the certificate instead of an argument
	// should be possible since we can now add attributes to the enrollment cert
	// as is.. this is a bit broken (security wise), but it's much much easier to demo! holding off for demos sake

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	color := strings.ToLower(args[1])
	owner_id := args[3]
	authed_by_company := args[4]
	size, err := strconv.Atoi(args[2])
	fmt.Println(id + "->" + id + " - |" + authed_by_company + color)

	// check if user already exists
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + owner_id)
	}

	// // get marble's current state
	//marbleAsBytes, err := stub.GetState(id)
	// if err != nil {
	// 	return shim.Error("Failed to get marble")
	// }
	// res := Marble{}
	// json.Unmarshal(marbleAsBytes, &res) //un stringify it aka JSON.parse()

	// // check authorizing company
	// if res.Owner.Company != authed_by_company {
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// transfer the marble
	res := `{
		"docType":"marble",
		"id": "` + id + `",
		"color": "` + color + `",
		"size": ` + strconv.Itoa(size) + `,
		"owner": {
			"id": "` + owner_id + `",
			"username": "` + owner.Username + `",
			"company": "` + owner.Company + `"
		}
	}`

	err = stub.PutState(args[0], []byte(res)) //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end set marbleInfo")
	return shim.Success(nil)

}

// ============================================================================================================================
// dubaohao -----update info on cert
//
// Shows off GetState() and PutState()
//
// Inputs - Array of Strings
//       0     ,        1      ,        2                      ,  3   ,  4
//  marble id  ,  owner id  , company that auth the transfer, color,size
// "m999999999", "o99999999999", united_mables"                ,"red" ,large
// ============================================================================================================================
func update_certInfo(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting updates_marbleInfo")

	// this is quirky
	// todo - get the "company that authed the transfer" from the certificate instead of an argument
	// should be possible since we can now add attributes to the enrollment cert
	// as is.. this is a bit broken (security wise), but it's much much easier to demo! holding off for demos sake

	// if len(args) != 6 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 6")
	// }

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	owner_id := args[1]
	authed_by_company := args[2]

	data1 := args[3] //data1
	data2 := args[4]
	data3 := args[5]
	data4 := args[6]
	data5 := args[7]

	data6 := args[8]
	data7 := args[9]
	data8 := args[10]
	data9 := args[11]
	data10 := args[12]

	data11 := args[13]
	data12 := args[14]
	data13 := args[15]
	// data14 := args[16]
	// data15 := args[17]

	// data16 := args[18]
	// data17 := args[19]
	// data18 := args[20]
	// data19 := args[21]
	// data20 := args[22] //data20

	fmt.Println(id + "->" + id + " - |" + authed_by_company)

	// check if user already exists
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + owner_id)
	}

	// // get marble's current state
	//marbleAsBytes, err := stub.GetState(id)
	// if err != nil {
	// 	return shim.Error("Failed to get marble")
	// }
	// res := Marble{}
	// json.Unmarshal(marbleAsBytes, &res) //un stringify it aka JSON.parse()

	// // check authorizing company
	// if res.Owner.Company != authed_by_company {
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// transfer the marble
	///共计写20个data属性值，改写color和size
	res := `{
		"docType":"marble", 
		"id": "` + id + `", 
		"data1": "` + data1 + `", 
		"data2": "` + data2 + `", 
		"data3": "` + data3 + `",
		"data4": "` + data4 + `",
		"data5": "` + data5 + `",
		"data6": "` + data6 + `",
		"data7": "` + data7 + `",
		"data8": "` + data8 + `",
		"data9": "` + data9 + `",
		"data10": "` + data10 + `",
		"data11": "` + data11 + `",
		"data12": "` + data12 + `",
		"data13": "` + data13 + `",
		"owner": {
			"id": "` + owner_id + `", 
			"username": "` + owner.Username + `", 
			"company": "` + owner.Company + `"
		}	
	}`

	err = stub.PutState(args[0], []byte(res)) //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end set marbleInfo")
	return shim.Success(nil)

}

// ============================================================================================================================
// Disable Marble Owner
//
// Shows off PutState()
//
// Inputs - Array of Strings
//       0     ,        1
//  owner id       , company that auth the transfer
// "o9999999999999", "united_mables"
// ============================================================================================================================
func disable_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting disable_owner")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var owner_id = args[0]
	var authed_by_company = args[1]

	// get the marble owner data
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + owner_id)
	}

	// check authorizing company
	if owner.Company != authed_by_company {
		return shim.Error("The company '" + authed_by_company + "' cannot change another companies marble owner")
	}

	// disable the owner
	owner.Enabled = false
	jsonAsBytes, _ := json.Marshal(owner)     //convert to array of bytes
	err = stub.PutState(args[0], jsonAsBytes) //rewrite the owner
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end disable_owner")
	return shim.Success(nil)
}
