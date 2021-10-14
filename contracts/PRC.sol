pragma solidity ^ 0.4.23;

contract PRC {

  // Mapping from user address to boolean type
  mapping(address => bool) isAuthorized;

  // Define struct
  struct product {
    string _productName;
    string _productCode;
    string _productOwner;
    uint _timestamp;
    address _BACAddress;
  }
  struct material {
    string _materialName;
    string _materialCode;
    string _materialFarm;
    uint _timestamp;
    address _BACAddress;
  }

  mapping(uint => product) _products;
  mapping(uint => material) _materials;

  mapping(string => uint) _productCodeToId;
  mapping(string => uint) _materialCodeToId;

  uint _numberOfProducts;
  uint _numberOfMaterials;

  address _admin;

  mapping(string => string) _productCodeToName;
  mapping(string => string) _materialCodeToName;
  mapping(string => address) _productCodeToBACAddress;
 mapping(string => address) _materialCodeToBACAddress;

  // As a prerequisite for some functions
  modifier onlyAdmin {
    require(msg.sender == _admin);
    _;
  }

  modifier onlyAuthorized(address addr) {
    require(isAuthorized[addr] == true);
    _;
  }

  // Constructor function
  constructor() public {
    _admin = msg.sender;
    _numberOfProducts = 1;
    _numberOfMaterials =1;
  }

  // Register product information
  function productRegister(string productName, string productCode, string factoryName, address BACAddress) public onlyAdmin {

    require(bytes(_productCodeToName[productCode]).length == 0);


    _productCodeToName[productCode] = productName;
    _productCodeToId[productCode] = _numberOfProducts;
    _productCodeToBACAddress[productCode] = BACAddress;

    _products[_numberOfProducts]._productName = productName;
    _products[_numberOfProducts]._productCode = productCode;
    _products[_numberOfProducts]._productOwner = factoryName;
    _products[_numberOfProducts]._timestamp = now;
    _products[_numberOfProducts]._BACAddress = BACAddress;

    _numberOfProducts++;

  }

  // Register raw material information
  function materialRegister(string materialName, string materialCode, string materialFarm, address BACAddress) public onlyAdmin {

    require(bytes(_materialCodeToName[materialCode]).length == 0);

    require(bytes(materialName).length >= 3 && bytes(materialName).length <= 64);

    _materialCodeToName[materialCode] = materialName;
    _materialCodeToId[materialCode] = _numberOfMaterials;
    _materialCodeToBACAddress[materialCode] = BACAddress;

    _materials[_numberOfMaterials]._materialName = materialName;
    _materials[_numberOfMaterials]._materialCode = materialCode;
    _materials[_numberOfMaterials]._materialFarm = materialFarm;
    _materials[_numberOfMaterials]._timestamp = now;
    _materials[_numberOfMaterials]._BACAddress = BACAddress;

    _numberOfMaterials++;

  }

  // Get the number of products
  function getNumberOfProducts() constant public returns(uint numberOfProducts) {
    numberOfProducts = _numberOfProducts - 1;
  }
  function getNumberOfMaterials() constant public returns(uint numberOfMaterials) {
    numberOfMaterials = _numberOfMaterials - 1;
  }

  // Get product information by id
  function getProductOfId(uint id) constant public returns(string productName, string productCode,  string factoryName, uint timestamp, address BACAddress) {

    productName = _products[id]._productName;
    productCode = _products[id]._productCode;
    factoryName = _products[id]._productOwner;
    timestamp = _products[id]._timestamp;
    BACAddress = _products[id]._BACAddress;
  }
  function getMaterialOfId(uint id) constant public returns(string materialName, string materialCode, string materialFarm, uint timestamp, address BACAddress) {

    materialName = _materials[id]._materialName;
    materialCode = _materials[id]._materialCode;
    materialFarm = _materials[id]._materialFarm;
    timestamp = _materials[id]._timestamp;
    BACAddress = _materials[id]._BACAddress;
  }

  function getIdOfCode(string productCode) constant public returns(uint id) {
    id = _productCodeToId[productCode];
  }

  function getAddressOfCode(string productCode) constant public returns(address addr) {
    addr = _productCodeToBACAddress[productCode];
  }

 function getIdOfMaterialCode(string materialCode) constant public returns(uint id) {
    id = _materialCodeToId[materialCode];
  }

  function getAddressOfMaterialCode(string materialCode) constant public returns(address addr) {
    addr = _materialCodeToBACAddress[materialCode];
  }
  // Add user to authorization list
  function addUser(address addr) public onlyAdmin {
    isAuthorized[addr] = true;
  }

  // Remove user
  function removeUser(address addr) public onlyAdmin {
    isAuthorized[addr] = false;
  }

  // Check if the user is authorized
  function checkUser(address addr) constant public returns(bool result) {
    result = isAuthorized[addr];
  }

  // Destroy the contract
  function deleteContract() public onlyAdmin {
    selfdestruct(_admin);
  }

}
