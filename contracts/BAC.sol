pragma solidity ^0.4.23;

contract BAC {

  // Mapping from user address to boolean type
  mapping(address => bool) isAuthorized;

  // Define struct
  struct batch {
    string _materialBatch;
    string _urlCheckList;
    string _materialCode;
    string _materialWeight;
    string _materialFarm;
    address _TUCAddress;
    uint _addTime;
  }

  mapping(uint => batch) _batchs;

  mapping(string => address) _batchToAddress;

  mapping(address => string) _addressToBatch;

  uint _numberOfBatchs;

  address _productAdmin;

  // As a prerequisite for some functions
  modifier onlyAdmin {
    require(msg.sender == _productAdmin);
    _;
  }

  modifier onlyAuthorized(address addr) {
    require(isAuthorized[addr] == true);
    _;
  }

  // Constructor function
  constructor() public {
    _productAdmin = msg.sender;
    _numberOfBatchs = 1;
  }

  // Add production batch information
  function addBatch( string materialBatch, string materialCode, string materialWeight,string urlCheckList, string materialFarm, address TUCAddress) public onlyAdmin {

    require(_batchToAddress[materialBatch] == address(0));
    require(bytes(_addressToBatch[TUCAddress]).length == 0);

    //require(bytes(productBatch).length == 12);

    _batchs[_numberOfBatchs]._materialBatch = materialBatch;
    _batchs[_numberOfBatchs]._materialCode = materialCode;
     _batchs[_numberOfBatchs]._urlCheckList = urlCheckList;
      _batchs[_numberOfBatchs]._materialFarm = materialFarm;
      _batchs[_numberOfBatchs]._materialWeight = materialWeight;
    _batchs[_numberOfBatchs]._TUCAddress = TUCAddress;
    _batchs[_numberOfBatchs]._addTime = now;

    _batchToAddress[materialBatch] = TUCAddress;

    _numberOfBatchs++;

  }

  // Get batch information by id
  function getBatchOfId(uint id) constant public returns( string materialBatch,string materialCode, string materialFarm,string urlCheckList, address TUCAddress, uint addTime) {

    // productBatch = _batchs[id]._productBatch;
    materialBatch = _batchs[id]._materialBatch;
    materialCode = _batchs[id]._materialCode;
    materialFarm = _batchs[id]._materialFarm;
    urlCheckList = _batchs[id]._urlCheckList;
    TUCAddress = _batchs[id]._TUCAddress;
    addTime = _batchs[id]._addTime;

  }

  // Get the number of batches
  function getNumberOfBatchs() constant public returns(uint numberOfBatchs) {
    numberOfBatchs = _numberOfBatchs - 1;
  }

  function getAddressOfBatch(string productBatch) constant public returns(address addr) {
    addr = _batchToAddress[productBatch];
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
  function deleteContract() onlyAdmin public {
    selfdestruct(_productAdmin);
  }

}
