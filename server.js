const express = require('express');
const app = express();
var User = require('./app/models/user');
const bodyparser = require('body-parser'); 
var mongoose = require('mongoose');
const session = require('express-session');
var cors = require('cors');
const path = require('path');
var sess;
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(session({
    secret: 'hieuhihi',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 600000
     }
  }));
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './public/supplier.html')));




// blockchain Ethereum setup
const Web3 = require('web3');
const prc = require('./build/contracts/PRC.json');
const bac = require('./build/contracts/BAC.json');
const tuc = require('./build/contracts/TUC.json');
const contract = require('truffle-contract');
var prcAddress ='0x5d8b3d5d4aa10e09b9e3ab049383d412b2f0d396';
const address = '0xc7E6227f8129D5DC7caB0A0c98ECF573fbb37e15';
const receive = '0x2E40A74D82d1CfDC0A67C08C2bA6A81F5729232d';
// var newTUC;
// var newBAC;
// var bacAddress;
// var tucAddress;
// var PRC;
// var BAC;
// var TUC;
var defaultGas = 4700000;
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const Bac = contract(bac);
Bac.setProvider(web3.currentProvider);  


 
const Prc = contract(prc);
Prc.setProvider(web3.currentProvider);    
       
const Tuc = contract(tuc);      
Tuc.setProvider(web3.currentProvider) ;






app.listen(8880,function()
{
    console.log('Server is running on port 8880');
})

  app.post('/registerMaterial',function (req,res)
  {
      var prcInstance;
      var newBAC;
      //console.log(req.body);
      var materialName = req.body.materialName;
      var materialCode = req.body.materialCode;
      var materialFarm = req.body.materialFarm;
      Bac.new({
        from: address,
        gas: defaultGas
    }).then(function(instance)
    {
        console.log("BAC CREATED");
       newBAC = instance.address; 
       console.log(newBAC);
    }).then(function()
    {
        Prc.at(prcAddress).then(function(instance) {
            //console.log(instance);
            prcInstance = instance;
            //console.log("Get PRC address Success")
            return  prcInstance.materialRegister(materialName, materialCode, materialFarm, newBAC, {
                from: address,
                gas: defaultGas
              });
      }).then(function(txReceipt) {
          console.log(txReceipt);
          res.send({
            BACaddress: newBAC
          });
          // var BACaddress = { BACaddress : newBAC}
          // var datasend = JSON.stringify(BACaddress);
          // res.send(datasend);
  });
  });
  })
  function getTotalMaterial()
{
    var prcInstance;
    return  Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getNumberOfMaterials.call()
      }).then(function(total) {
        return total;
      });
}
function getRegisterMaterial(id)
{
    var prcInstance;
    return Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getMaterialOfId.call(id).then(function(product) {
          console.log(product);
          var a = new Date(product[3] * 1000);
          var year = a.getFullYear();
          var month = a.getMonth();
          var date = a.getDate();
          var time = date + '/' + month + '/' + year;
          
          
          return {
            id: id,
            name: product[0],
            code: product[1],
            owner: product[2],
            time: time,
            BACaddr: product[4]
          }
        })
      });
}
app.post('/showMaterial',async function(req, res)
{
    let products = [];
    console.log(req.body.farmName)
    let total = await getTotalMaterial();
    console.log(total)
    for (let i = 1; i <= total; i++) {
        let product = await getRegisterMaterial(i);
        console.log(product)
        if(product.owner === req.body.farmName)
        {
        products.push(product);
        }
      }
      console.log(products);
      // var datasend = JSON.stringify(products);
      res.send(products);

})
app.post('/addBatchMaterial',async function(req,res)
{
    console.log(req.body);
    var prcInstance;
    var bacAddress;
    var newTUC;
      //console.log(req.body);
      var materialBatch = req.body.materialBatch;
      var materialCode = req.body.materialCode;
      var materialFarm = req.body.materialFarm;
      var materialCheckList = req.body.materialCheckList;
      var materialWeight = req.body.materialWeight;
      await Prc.at(prcAddress).then(async function(instance) {
        prcInstance = instance;
        return await prcInstance.getIdOfMaterialCode.call(materialCode);
      }).then(async function(idd) {
        id = idd;
        console.log(id);
        return await prcInstance.getMaterialOfId.call(id);
      }).then(async function(product) {
        bacAddress = await product[4];
      })
      Tuc.new({
        from: address,
        gas: defaultGas
      }).then(function(instance) {
        newTUC = instance.address;
      }).then(function() {
        console.log(bacAddress);
        Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.addBatch(materialBatch, materialCode,materialWeight,materialCheckList,materialFarm,newTUC, {
            from: address,
            gas: defaultGas
          });
        }).then(function(txReceipt) {
          console.log(txReceipt);
          res.send(
            {
              status:"Thêm lô Nguyên liệu thành công",
              transactionHash: txReceipt.receipt.transactionHash,
              tucAddress:newTUC,
              transactionID: txReceipt.tx
          }
            );
        });
      });
})
function getBatch(id,bacAddress) {
    var bacInstance;
    return Bac.at(bacAddress).then(function(instance) {
      bacInstance = instance;
      return bacInstance.getBatchOfId.call(id).then(function(batch) {
        console.log(batch)
        var a = new Date(batch[5] * 1000);
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var time = date + '/' + month + '/' + year;
        return {
          id: id,
          batch: batch[0],
          codeMaterial: batch[1],
          farm: batch[2],
          checklist: batch[3],
          weight: batch[6],
          TUCaddr: batch[4],
          time: time
        }
      })
    });
  }
  
  // The number of all added batches
  function getTotalMaterialBatch(bacAddress) {
    var bacInstance;
    return Bac.at(bacAddress).then(function(instance) {
      bacInstance = instance;
      return bacInstance.getNumberOfBatchs.call()
    }).then(function(total) {
      return total;
    });
  }
app.post('/getBatchMaterial',async function(req,res)
{
    var materialCode = req.body.materialCode;
    var prcInstance;
    var bacAddress;
    let batchs = [];
    await Prc.at(prcAddress).then(async function(instance) {
        prcInstance = instance;
        return await prcInstance.getIdOfMaterialCode.call(materialCode);
      }).then(async function(idd) {
        id = idd;
        console.log(id);
        return await prcInstance.getMaterialOfId.call(id);
      }).then(async function(product) {
        bacAddress = await product[4];
      })
      let total = await getTotalMaterialBatch(bacAddress);
      console.log(total);
      for (let i = 1; i <= total; i++) {
        let batch = await getBatch(i,bacAddress);
        batchs.push(batch);
      }
      console.log(batchs);
      // var datasend = JSON.stringify(batchs);
      res.send(batchs);
})
app.post('/createTransactionBatch',async function(req,res)
{
    console.log(req.body);
    var materialCode = req.body.materialCode;
    var materialBatch = req.body.materialBatch;
    var manufacture = req.body.manufacture;
    var materialFarm = req.body.materialFarm;
    var bacAddress;
    var tucAddress;
    await Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getAddressOfMaterialCode.call(materialCode);
      }).then(function(a) {
        bacAddress = a;
        return Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.getAddressOfBatch.call(materialBatch);
        }).then(function(b) {
          tucAddress = b;
        });
})
var transaction = await web3.eth.sendTransaction({
    from: address,
    to: receive,
    gas: defaultGas
  });
  console.log(transaction)
  var transactionHash =transaction.transactionHash ;
  Tuc.at(tucAddress).then(function(instance) {
    tucInstance = instance;
    return tucInstance.addTr(transactionHash,manufacture,materialFarm,{
      from: address,
      gas: defaultGas
    });
  }).then(function(txReceipt) {
      res.send({
        transactionID : transactionHash,
        transactionHash : txReceipt.receipt.transactionHash
  })
    console.log(txReceipt);
  })
})
app.post('/checkTransactionBatch',async function(req,res)
{
    var materialCode = req.body.materialCode;
    var materialBatch = req.body.materialBatch;
    var bacAddress;
    var tucAddress;
    await Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getAddressOfMaterialCode.call(materialCode);
      }).then(function(a) {
        bacAddress = a;
        return Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.getAddressOfBatch.call(materialBatch);
        }).then(function(b) {
          tucAddress = b;
        });
})
Tuc.at(tucAddress).then(function(instance) {
    tucInstance = instance;
    return tucInstance.getTrOfId.call(1).then(function(tr) {
      console.log(tr);
        var a = new Date(tr[3] * 1000);
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var minute = a.getMinutes();
        var time = hour+ ":" +  minute + " "+ date + '/' + month + '/' + year;
     res.send({
      TUC : tucAddress,
    transactionID: tr[0],
      se: tr[1],
      re: tr[2],
      time: time
     })
    })
  });
})
app.post('/registerProduct',function (req,res)
  {
      var prcInstance;
      var newBAC;
      //console.log(req.body);
      var productName = req.body.productName;
      var productCode = req.body.productCode;
      var factoryName = req.body.factoryName;
      Bac.new({
        from: address,
        gas: defaultGas
    }).then(function(instance)
    {
        console.log("BAC CREATED");
       newBAC = instance.address; 
       console.log(newBAC);
    }).then(function()
    {
        Prc.at(prcAddress).then(function(instance) {
            //console.log(instance);
            prcInstance = instance;
            //console.log("Get PRC address Success")
            return  prcInstance.productRegister(productName, productCode, factoryName, newBAC, {
                from: address,
                gas: defaultGas
              });
      }).then(function(txReceipt) {
          console.log(txReceipt);
          res.send(
            { 
              BACaddress: newBAC
            });
          // var BACaddress = { BACaddress : newBAC}
          // var datasend = JSON.stringify(BACaddress);
          // res.send(datasend);
  });
  });
  })
  function getTotalProduct()
{
    var prcInstance;
    return  Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getNumberOfProducts.call()
      }).then(function(total) {
        return total;
      });
}
function getRegisterProduct(id)
{
    var prcInstance;
    return Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getProductOfId.call(id).then(function(product) {
          console.log(product);
          var a = new Date(product[3] * 1000);
          var year = a.getFullYear();
          var month = a.getMonth();
          var date = a.getDate();
          var time = date + '/' + month + '/' + year;
          
          
          return {
            id: id,
            name: product[0],
            code: product[1],
            owner: product[2],
            time: time,
            BACaddr: product[4]
          }
        })
      });
}
app.post('/showProduct',async function(req, res)
{
    let products = [];
    console.log(req.body.factoryName)
    let total = await getTotalProduct();
    console.log(total)
    for (let i = 1; i <= total; i++) {
        let product = await getRegisterProduct(i);
        console.log(product)
        if(product.owner === req.body.factoryName)
        {
        products.push(product);
        }
      }
      console.log(products);
      // var datasend = JSON.stringify(products);
      res.send(products);
})
app.post('/addBatchProduct',async function(req,res)
{
    //console.log(req.body);
    var prcInstance;
    var bacAddress;
    var newTUC;
      //console.log(req.body);
      var productBatch = req.body.productBatch;
      var productCode = req.body.productCode;
      var productFactory = req.body.productFactory;
      // var materialCheckLis = req.body.materialCheckList;
      var productNumber  = req.body.productNumber;
      await Prc.at(prcAddress).then(async function(instance) {
        prcInstance = instance;
        return await prcInstance.getIdOfCode.call(productCode);
      }).then(async function(idd) {
        id = idd;
        console.log(id);
        return await prcInstance.getProductOfId.call(id);
      }).then(async function(product) {
        bacAddress = await product[4];
      })
      Tuc.new({
        from: address,
        gas: defaultGas
      }).then(function(instance) {
        newTUC = instance.address;
      }).then(function() {
        console.log(bacAddress);
        Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.addProductBatch(productBatch, productCode,productNumber,productFactory,newTUC,{
            from: address,
            gas: defaultGas
          });
        }).then(function(txReceipt) {
          console.log(txReceipt);
          res.send(
            {
              status:"Thêm lô Sản phẩm thành công",
              transactionHash: txReceipt.receipt.transactionHash,
              tucAddress:newTUC,
              transactionID: txReceipt.tx
          }
            );
        });
      });
})
function getProductBatch(id,bacAddress) {
  var bacInstance;
  return Bac.at(bacAddress).then(function(instance) {
    bacInstance = instance;
    return bacInstance.getproBatchOfId.call(id).then(function(batch) {
      console.log(batch)
      var a = new Date(batch[5] * 1000);
      var year = a.getFullYear();
      var month = a.getMonth();
      var date = a.getDate();
      var time = date + '/' + month + '/' + year;
      return {
        id: id,
        batch: batch[0],
        codeMaterial: batch[1],
        farm: batch[2],
        numberProduct: batch[3],
        weight: batch[6],
        TUCaddr: batch[4],
        time: time
      }
    })
  });
}

// The number of all added batches
function getTotalProductBatch(bacAddress) {
  var bacInstance;
  return Bac.at(bacAddress).then(function(instance) {
    bacInstance = instance;
    return bacInstance.getNumberOfproBatchs.call()
  }).then(function(total) {
    return total;
  });
}
app.post('/getBatchProduct',async function(req,res)
{
  var productCode = req.body.productCode;
  var prcInstance;
  var bacAddress;
  let batchs = [];
  await Prc.at(prcAddress).then(async function(instance) {
      prcInstance = instance;
      return await prcInstance.getIdOfCode.call(productCode);
    }).then(async function(idd) {
      id = idd;
      console.log(id);
      return await prcInstance.getProductOfId.call(id);
    }).then(async function(product) {
      bacAddress = await product[4];
    })
    let total = await getTotalProductBatch(bacAddress);
    console.log(total);
    for (let i = 1; i <= total; i++) {
      let batch = await getProductBatch(i,bacAddress);
      batchs.push(batch);
    }
    console.log(batchs);
    // var datasend = JSON.stringify(batchs);
    res.send(batchs);
})
app.post('/createTransactionBatchProduct',async function(req,res)
{
    console.log(req.body);
    var productCode = req.body.productCode;
    var productBatch = req.body.productBatch;
    var market = req.body.market;
    var productFactory = req.body.productFactory;
    var bacAddress;
    var tucAddress;
    await Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getAddressOfCode.call(productCode);
      }).then(function(a) {
        bacAddress = a;
        return Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.getAddressOfproBatch.call(productBatch);
        }).then(function(b) {
          tucAddress = b;
        });
})
var transaction = await web3.eth.sendTransaction({
    from: address,
    to: receive,
    gas: defaultGas
  });
  console.log(transaction)
  var transactionHash =transaction.transactionHash ;
  Tuc.at(tucAddress).then(function(instance) {
    tucInstance = instance;
    return tucInstance.addTr(transactionHash,market,productFactory,{
      from: address,
      gas: defaultGas
    });
  }).then(function(txReceipt) {
      res.send({
        transactionID : transactionHash,
        transactionHash : txReceipt.receipt.transactionHash
  })
    console.log(txReceipt);
  })
})
app.post('/checkTransactionBatchProduct',async function(req,res)
{
    var productCode = req.body.productCode;
    var productBatch = req.body.productBatch;
    var bacAddress;
    var tucAddress;
    await Prc.at(prcAddress).then(function(instance) {
        prcInstance = instance;
        return prcInstance.getAddressOfCode.call(productCode);
      }).then(function(a) {
        bacAddress = a;
        return Bac.at(bacAddress).then(function(instance) {
          bacInstance = instance;
          return bacInstance.getAddressOfproBatch.call(productBatch);
        }).then(function(b) {
          tucAddress = b;
        });
})
Tuc.at(tucAddress).then(function(instance) {
    tucInstance = instance;
    return tucInstance.getTrOfId.call(1).then(function(tr) {
      console.log(tr);
        var a = new Date(tr[3] * 1000);
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var minute = a.getMinutes();
        var time = hour+ ":" +  minute + " "+ date + '/' + month + '/' + year;
     res.send({
      TUC : tucAddress,
      transactionID: tr[0],
      se: tr[1],
      re: tr[2],
      time: time
     })
    })
  });
})