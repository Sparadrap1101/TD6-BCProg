pragma solidity >=0.6.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract MyErc721Contract is IERC721
{
    mapping (address => uint256) public balances; // Number of ERC721 of an address
    mapping (uint256 => address) public owners; // Owner address of an ID Token
    mapping (uint256 => Animal) public animals; // ID of the Animal
    mapping (address => bool) public breeders; // List if an address is breeder
    mapping (address => mapping (uint256 => uint256)) collectionsIndex; // Token ID of an address by index (index => ID Token)
    mapping (address => mapping (uint256 => uint256)) collectionsID; // index of an address by Token ID (ID Token => index)

    string public _nameContract;
    string public _symbolContract;
    uint256 public _compteur;

    struct Animal {
        string name;
        bool wings;
        uint legs;
        uint sex;
        bool forSale;
        uint price;
        uint parent1;
        uint parent2;
        bool canReproduce;
        uint reproducePrice;
    }

    constructor(string memory name_, string memory symbol_) public {
        _nameContract = name_;
        _symbolContract = symbol_;
        _compteur = 0;
    }

	function isBreeder(address account) external view returns (bool) {
        return breeders[account];
    }

	function registrationPrice() external pure returns (uint256) {
        return 1000000000000;
    }

	function registerMeAsBreeder() external payable {
        require(msg.value == 1000000000000);
        breeders[msg.sender] = true;
    }

    function registerEvaluator2AsBreeder(address evaluator2) external {
        breeders[evaluator2] = true;
    }

	function canReproduce(uint animalNumber) external view returns (bool) {
        return animals[animalNumber].canReproduce;
    }

	function reproductionPrice(uint animalNumber) external view returns (uint256) {
        return animals[animalNumber].reproducePrice;
    }

	function offerForReproduction(uint animalNumber) external payable {
        require(owners[animalNumber] == msg.sender);
        animals[animalNumber].canReproduce = true;
        animals[animalNumber].reproducePrice = msg.value;
    }

	function declareAnimal(uint sex, uint legs, bool wings, string calldata name) external returns (uint256) {
        require(breeders[msg.sender]);
        _compteur++;
        Animal memory animal = Animal(name, wings, legs, sex, false, 0, 0, 0, false, 0);
        animals[_compteur] = animal;
        owners[_compteur] = msg.sender;
        collectionsIndex[msg.sender][balances[msg.sender]] = _compteur;
        collectionsID[msg.sender][_compteur] = balances[msg.sender];
        balances[msg.sender]++;

        return _compteur;
    }

	function declareAnimalWithParents(uint sex, uint legs, bool wings, string calldata name, uint parent1, uint parent2) external returns (uint256) {
        require(breeders[msg.sender]);
        _compteur++;
        Animal memory animal = Animal(name, wings, legs, sex, false, 0, parent1, parent2, false, 0);
        animals[_compteur] = animal;
        owners[_compteur] = msg.sender;
        collectionsIndex[msg.sender][balances[msg.sender]] = _compteur;
        collectionsID[msg.sender][_compteur] = balances[msg.sender];
        balances[msg.sender]++;

        return _compteur;
    }

    function getParents(uint animalNumber) external view returns (uint parent1, uint parent2) {
        parent1 = animals[animalNumber].parent1;
        parent2 = animals[animalNumber].parent2;

        return (parent1, parent2);
    }

	function getAnimalCharacteristics(uint animalNumber) external view returns (string memory name, bool wings, uint legs, uint sex) {
        name = animals[animalNumber].name;
        wings = animals[animalNumber].wings;
        legs = animals[animalNumber].legs;
        sex = animals[animalNumber].sex;

        return (name, wings, legs, sex);
    }

	function declareDeadAnimal(uint animalNumber) external {
        require(owners[animalNumber] == msg.sender);
        balances[msg.sender]--;

        uint lastID = collectionsIndex[msg.sender][balances[msg.sender]];
        uint newIndex = collectionsID[msg.sender][animalNumber];
        collectionsIndex[msg.sender][newIndex] = lastID;
        collectionsID[msg.sender][lastID] = newIndex;
        collectionsID[msg.sender][animalNumber] = 99999;
        collectionsIndex[msg.sender][balances[msg.sender]] = 0;

        owners[animalNumber] = address(0);

        animals[animalNumber].name = "";
        animals[animalNumber].wings = false;
        animals[animalNumber].legs = 0;
        animals[animalNumber].sex = 0;
        animals[animalNumber].forSale = false;
        animals[animalNumber].price = 0;
        animals[animalNumber].parent1 = 0;
        animals[animalNumber].parent2 = 0;
        animals[animalNumber].canReproduce = false;
        animals[animalNumber].reproducePrice = 0;
    }

	function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256) {
        return collectionsIndex[owner][index];
    }

	function isAnimalForSale(uint animalNumber) external view returns (bool) {
        return animals[animalNumber].forSale;
    }

	function animalPrice(uint animalNumber) external view returns (uint256) {
        return animals[animalNumber].price;
    }

	function buyAnimal(uint animalNumber) external payable {
        require(animals[animalNumber].forSale);
        require(animals[animalNumber].price == msg.value);

        address lastOwner = owners[animalNumber];
        owners[animalNumber] = msg.sender;

        balances[lastOwner]--; // We manage indexes and IDs as they reset and fill in the gaps (same as safeTransferFrom function)
        collectionsIndex[lastOwner][collectionsID[lastOwner][animalNumber]] = collectionsIndex[lastOwner][balances[lastOwner]];
        collectionsID[lastOwner][collectionsIndex[lastOwner][balances[lastOwner]]] = collectionsID[lastOwner][animalNumber];
        collectionsIndex[lastOwner][balances[lastOwner]] = 0;
        collectionsID[lastOwner][animalNumber] = 99999;

        collectionsIndex[msg.sender][balances[msg.sender]] = animalNumber;
        collectionsID[msg.sender][animalNumber] = balances[msg.sender];
        balances[msg.sender]++;
    }

	function offerForSale(uint animalNumber, uint price) external {
        require(owners[animalNumber] == msg.sender);
        animals[animalNumber].forSale = true;
        animals[animalNumber].price = price;
    }
    
    function balanceOf(address _owner) external override view returns (uint256) {
        return balances[_owner];
    }

    function ownerOf(uint256 _tokenId) external override view returns (address) {
        return owners[_tokenId];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external override {

    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external override {
        require(msg.sender == _from);
        require(owners[_tokenId] == _from);
        owners[_tokenId] = _to;

        balances[_from]--; // We manage indexes and IDs as they reset and fill in the gaps
        collectionsIndex[_from][collectionsID[_from][_tokenId]] = collectionsIndex[_from][balances[_from]];
        collectionsID[_from][collectionsIndex[_from][balances[_from]]] = collectionsID[_from][_tokenId];
        collectionsIndex[_from][balances[_from]] = 0;
        collectionsID[_from][_tokenId] = 99999;

        collectionsIndex[_to][balances[_to]] = _tokenId;
        collectionsID[_to][_tokenId] = balances[_to];
        balances[_to]++;
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external override {

    }

    function approve(address _approved, uint256 _tokenId) external override {

    }

    function setApprovalForAll(address _operator, bool _approved) external override {

    }

    function getApproved(uint256 _tokenId) external override view returns (address) {
        
    }

    function isApprovedForAll(address _owner, address _operator) external override view returns (bool) {

    }

    function supportsInterface(bytes4 interfaceId) external override view returns (bool) {

    }

    function mintNFT(address luckyAddress_, string memory _name, bool _wings, uint _legs, uint _sex) public {
        _compteur++;
        Animal memory animal = Animal(_name, _wings, _legs, _sex, false, 0, 0, 0, false, 0);
        animals[_compteur] = animal;
        owners[_compteur] = luckyAddress_;
        collectionsIndex[luckyAddress_][balances[luckyAddress_]] = _compteur;
        collectionsID[luckyAddress_][_compteur] = balances[luckyAddress_];
        balances[luckyAddress_]++;
    }
}