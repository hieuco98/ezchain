var xhr = new XMLHttpRequest();
  const form = document.querySelector('form');
 function registerMaterial()
 {
    var nameMaterial = $("#nameMaterialA").val();
    var codeMaterial = $("#codeMaterialA").val();
    var farmMaterial = $("#farmMaterialA").val();
    var material =
    {
        materialName : nameMaterial,
        materialCode : codeMaterial,
        materialFarm : farmMaterial
    }
    xhr.open('POST','/registerMaterial',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
      {
        console.log(xhr.responseText);
        $("#transactionIDA").html(xhr.responseText);
      
        //alert(xhr.responseText)
}
    // create and send the reqeust
    
    xhr.send(JSON.stringify(material));
 }
 function getAllRegister() {
    let products = [];
    var nameFarm = $("#nameFarmA").val()
    var farm = 
    {
      farmName:nameFarm
    }
      xhr.open('POST','/showMaterial',true);
      xhr.setRequestHeader('content-type','application/json');
      
     xhr.onload = function()
         {
             //console.log(xhr.responseText);
             products = JSON.parse(xhr.responseText);
             console.log(products);
             showAllRegister(products);
             //console.log(products)
         }
         xhr.send(JSON.stringify(farm));
      //return products;
    }
    
    // Show all registered products on the page
    function showAllRegister(list) {
          console.log(list)
        $("#registerListA").html('');
        list.forEach(function(item, index) {
          if(item !== null)
          {
          $("#registerListA").append("<tr><td>" + item.id + "</td><td>" + item.name + "</td><td>" + item.code + "</td><td>" + item.owner + "</td><td>" + item.addr + "</td><td>" + item.time + "</td></tr>");
          }
        });
      }
function addBatchMaterial()
{
  var materialBatch = $("#materialBatchB").val();
  var materialCode = $("#materialCodeCheckB").val();
  var materialCheckList = $("#materialCheckListB").val();
  var materialWeight = $("#materialWeightB").val();
  var nameFarm = $("#nameFarmB").val();
  var newBatchMaterial ={
    materialBatch : materialBatch,
    materialCode : materialCode,
    materialCheckList : materialCheckList,
    materialWeight :materialWeight,
    materialFarm : nameFarm
  }
  console.log(newBatchMaterial)
  xhr.open('POST','/addBatchMaterial',true);
  xhr.setRequestHeader('content-type','application/json');
  xhr.onload = function()
    {
      var result = JSON.parse(xhr.responseText)
      alert(result.status);
      $("#transactionIDA").html(result.transactionHash);
      
      //alert(xhr.responseText)
}
  // create and send the reqeust
  
  xhr.send(JSON.stringify(newBatchMaterial));
}
function getBatchMaterial()
{
  var materialCode = $("#materialCodeB").val();
  var materialCodeCheck = {
    materialCode: materialCode
  }
  xhr.open('POST','/getBatchMaterial',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
  {
    //console.log(xhr.responseText);
    var data = JSON.parse(xhr.responseText)
    console.log(data);
    showAllBatch(data)
  }
  xhr.send(JSON.stringify(materialCodeCheck));
}
function showAllBatch(list) {
  console.log(list)
$("#batchListB").html('');
list.forEach(function(item, index) {
  if(item !== null)
  {
  $("#batchListB").append("<tr><td>" + item.id + "</td><td>" + item.batch + "</td><td>" + item.codeMaterial + "</td><td>" + item.farm + "</td><td>" + item.checklist + "</td><td>" + item.addr + "</td><td>" + item.time + "</td></tr>");
  }
});
}
function updateTransaction()
{
  var materialCode = $("#materialCodeCheckC").val();
  var materialBatch = $("#materialBatchCheckC").val();
  var manufacture = $("#manufactureC").val();
  var transDetail = 
  {
    materialCode : materialCode,
    materialBatch : materialBatch,
    manufacture : manufacture
  }
  xhr.open('POST','/createTransactionBatch',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
      {
        alert(xhr.responseText);
        //alert(xhr.responseText)
}
    // create and send the reqeust
    
    xhr.send(JSON.stringify(transDetail));

}
function checkTransaction()
{
  var materialCode = $("#materialCodeC").val();
  var materialBatch = $("#materialBatchC").val();
  var checkTransaction =
  {
    materialCode : materialCode,
    materialBatch : materialBatch
  }
  xhr.open('POST','/checkTransactionBatch',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
      {
        var result = JSON.parse(xhr.responseText)
        $("#batchAddressC").html(result.TUC);
        $("#manufactureNameC").html(result.re);
        $("#timeTransactionC").html(result.time);
        $("#transactionHashC").html(result.currentTx);
        //alert(xhr.responseText)
}
    // create and send the reqeust
    
    xhr.send(JSON.stringify(checkTransaction));

}
window.onload = function() {
    //getAllRegister();
    $("#registerMaterialBtnA").click(function() {
        registerMaterial();
        //getAllContract();
        // getAllRegister()
      });

      $("#checkMaterialA").click(function() {
        // registerMaterial();
        //getAllContract();
         getAllRegister()
      });
      
      $("#addBatchMaterialB").click(function(e) {
        e.preventDefault();
       addBatchMaterial();
        //getAllContract();
      });
      $("#checkBatchMaterialB").click(function(e) {
        e.preventDefault();
       getBatchMaterial();
        //getAllContract();
      });
      $("#updateTransactionC").click(function(e) {
        e.preventDefault();
        updateTransaction();
        //getAllContract();
      });
      $("#checkTransactionC").click(function(e) {
        e.preventDefault();
        checkTransaction();
        //getAllContract();
      });
      }