const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");
var myErc721Contract = artifacts.require("MyErc721Contract.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        //await setPermissionsAndRandomValues(deployer, network, accounts); 
        //await deployRecap(deployer, network, accounts);
		await deployMyErc721(deployer, network, accounts);
		//await submitExercice(deployer, network, accounts);
		//await deployExo1(deployer, network, accounts);
		//await deployExo2(deployer, network, accounts);
		//await deployExo3(deployer, network, accounts);
		//await deployExo4(deployer, network, accounts);
		//await deployExo5(deployer, network, accounts);
		//await deployExo61(deployer, network, accounts);
		//await deployExo62(deployer, network, accounts);
		//await submitExercice2(deployer, network, accounts);
		await deployExo71(deployer, network, accounts);
		await deployExo72(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	//TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
	TDToken = await TDErc20.at("0x8B7441Cb0449c71B09B96199cCE660635dE49A1D")
}

async function deployEvaluator(deployer, network, accounts) {
	//Evaluator = await evaluator.new(TDToken.address)
	//Evaluator2 = await evaluator2.new(TDToken.address)
	Evaluator = await evaluator.at("0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E") 
	Evaluator2 = await evaluator.at("0x4f82f7A130821F61931C7675A40fab723b70d1B8")
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*5))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	//console.log(randomNames)
	//console.log(randomLegs)
	//console.log(randomSex)
	//console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
	console.log("Evaluator2 " + Evaluator2.address)
	console.log("\n-------------------------------------------------------------\n");
}

async function deployMyErc721(deployer, network, accounts) {
	//MyErc721Collection = await myErc721Contract.new("Ubris", "UBR");
	MyErc721Collection = await myErc721Contract.at("0x01228abD0d5984d505F6b4eD1eC7364eCaAcb542");
}

async function submitExercice(deployer, network, accounts) {
	console.log("\n> Submit: ", await Evaluator.exerciceProgression(accounts[0], 0));
	await Evaluator.submitExercice(MyErc721Collection.address);
	console.log("> Submit: ", await Evaluator.exerciceProgression(accounts[0], 0));
}

async function deployExo1(deployer, network, accounts) {
	console.log("\n> Exo1: ", await Evaluator.exerciceProgression(accounts[0], 1));
	console.log(">>  Balance before Mint: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	await MyErc721Collection.mintNFT(Evaluator.address, "Zebra", true, 2, 1);
	console.log(">>  Balance after Mint: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	await Evaluator.ex1_testERC721();
	console.log(">>  Balance after send back: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	console.log("> Exo1: ", await Evaluator.exerciceProgression(accounts[0], 1));
}

async function deployExo2(deployer, network, accounts) {
	console.log("\n> Exo2: ", await Evaluator.exerciceProgression(accounts[0], 2));
	await Evaluator.ex2a_getAnimalToCreateAttributes();
	const name = await Evaluator.readName(accounts[0]);
	const wings = await Evaluator.readWings(accounts[0]);
	const legs = await Evaluator.readLegs(accounts[0]);
	const sex = await Evaluator.readSex(accounts[0]);
	console.log(">>  New name:", name);
	console.log(">>  New wings:", wings);
	console.log(">>  New legs:", legs.toString());
	console.log(">>  New sex:", sex.toString());
	await MyErc721Collection.mintNFT(Evaluator.address, name, wings, legs, sex);
	await Evaluator.ex2b_testDeclaredAnimal(await MyErc721Collection._compteur());
	console.log("> Exo2: ", await Evaluator.exerciceProgression(accounts[0], 2));
}

async function deployExo3(deployer, network, accounts) {
	console.log("\n> Exo3: ", await Evaluator.exerciceProgression(accounts[0], 3));
	//Evaluator.sendTransaction({from:accounts[0],value:100000000000000000});
	console.log(">>  Is breeder: ", await MyErc721Collection.breeders(Evaluator.address));
	await Evaluator.ex3_testRegisterBreeder();
	console.log(">>  Is breeder: ", await MyErc721Collection.breeders(Evaluator.address));
	console.log("> Exo3: ", await Evaluator.exerciceProgression(accounts[0], 3));
}

async function deployExo4(deployer, network, accounts) {
	console.log("\n> Exo4: ", await Evaluator.exerciceProgression(accounts[0], 4));
	console.log(">>  Balance before declare: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	await Evaluator.ex4_testDeclareAnimal();
	console.log(">>  Balance after declare: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	console.log("> Exo4: ", await Evaluator.exerciceProgression(accounts[0], 4));
}

async function deployExo5(deployer, network, accounts) {
	console.log("\n> Exo5: ", await Evaluator.exerciceProgression(accounts[0], 5));
	console.log(">>  Balance before kill: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	await Evaluator.ex5_declareDeadAnimal();
	console.log(">>  Balance after kill: ", (await MyErc721Collection.balanceOf(Evaluator.address)).toString());
	console.log("> Exo5: ", await Evaluator.exerciceProgression(accounts[0], 5));
}

async function deployExo61(deployer, network, accounts) {
	console.log("\n> Exo6.1: ", await Evaluator.exerciceProgression(accounts[0], 61));
	const idAnimal = await MyErc721Collection.tokenOfOwnerByIndex(Evaluator.address, 0);
	console.log(">>  Animal for sale: ", await MyErc721Collection.isAnimalForSale(idAnimal));
	await Evaluator.ex6a_auctionAnimal_offer();
	console.log(">>  Animal for sale: ", await MyErc721Collection.isAnimalForSale(idAnimal));
	console.log("> Exo6.1: ", await Evaluator.exerciceProgression(accounts[0], 61));
}

async function deployExo62(deployer, network, accounts) {
	console.log("\n> Exo6.2: ", await Evaluator.exerciceProgression(accounts[0], 62));
	console.log(">>  Owner before buy: ", await MyErc721Collection.owners(1));
	await MyErc721Collection.offerForSale(1, 0);
	await Evaluator.ex6b_auctionAnimal_buy(1);
	console.log(">>  Owner after buy: ", await MyErc721Collection.owners(1));
	console.log("> Exo6.2: ", await Evaluator.exerciceProgression(accounts[0], 62));
}

async function submitExercice2(deployer, network, accounts) {
	await Evaluator2.submitExercice(MyErc721Collection.address);
}

async function deployExo71(deployer, network, accounts) {
	console.log("\n> Exo7.1: ", await Evaluator2.exerciceProgression(accounts[0], 71));
	console.log(">>  Balance before declare: ", (await MyErc721Collection.balanceOf(Evaluator2.address)).toString());
	await Evaluator2.ex2a_getAnimalToCreateAttributes();
	await MyErc721Collection.registerEvaluator2AsBreeder(Evaluator2.address);
	const lastAnimal = await MyErc721Collection._compteur();
	await Evaluator2.ex7a_breedAnimalWithParents(lastAnimal, lastAnimal - 2);
	console.log(">>  Balance after declare: ", (await MyErc721Collection.balanceOf(Evaluator2.address)).toString());
	console.log("> Exo7.1: ", await Evaluator2.exerciceProgression(accounts[0], 71));
}

async function deployExo72(deployer, network, accounts) {
	console.log("\n> Exo7.2: ", await Evaluator2.exerciceProgression(accounts[0], 72));
	const IDanimal = await MyErc721Collection.tokenOfOwnerByIndex(Evaluator2.address, 0);
	console.log(IDanimal.toString());
	console.log(">>  Reproduce before: ", await MyErc721Collection.canReproduce(IDanimal));
	await Evaluator2.ex7b_offerAnimalForReproduction();
	console.log(">>  Reproduce after: ", await MyErc721Collection.canReproduce(IDanimal));
	console.log("> Exo7.2: ", await Evaluator2.exerciceProgression(accounts[0], 72));
}