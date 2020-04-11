let express = require('express');
let router = express.Router();

let Zombie=require("../models/Zombie"); //modelo
let Cerebro=require("../models/Cerebro"); //modelo
let Usuario=require("../models/Usuario"); //modelo
let PedidoCerebro= require("../models/PedidoCerebro"); //modelo


router.get('/zombies/:owner', async (req, res)=>{
    Usuario.findOne({email: req.params.owner}, function(error, user){
      
      console.log('Tipo de usuario: ' + user.typeA);
      try{
        //admin
        if(user.typeA == 0){
          Zombie.find().exec((error, zombies)=>{
            if(!error){
                res.status(200).json(zombies);
            }else{
                res.status(500).json(error);
            }
          });
          //normal
        }else{
          Zombie.find({owner:{$eq: req.params.owner}}).exec((error,zombies)=>{
            if(!error){
              
                res.status(200).json(zombies);
            }else{
                res.status(500).json(error);
            }
          });
        }
      }catch (e){
        res.status(500).json(e);
      }
    } 
  );
});

router.get('/zombieData/:id', async (req, res)=>{
  try{
    let zombieData = Zombie.findById(req.params.id);
    res.status(200).json(zombieData);

  }catch(e){
    res.status(500).json({mensajeError:e}); 
  }
  
});

router.post("/zombies/new", async function(req,res){
    let data=req.body;
  
    let nuevoZombie=new Zombie({
      name: data.name,
      email:data.email,
      type: data.type,
      owner: data.owner
    });
    nuevoZombie.save(function(error){
      if(error){
        let errMessage=error.message;
        res.status(500).json({mensajeError:errMessage});
        return error;
      }else{
        res.status(200).json("/prueba");
        }
      });
    });
    
router.delete('/zombies/delete/:id', async function(req,res){
    try{
        var zombie=await Zombie.findById(req.params.id);
        zombie.remove();
    
        res.status(200).json('#');
    }catch(e){
        res.status(500).json({mensajeError:e});
    }
});


router.put('/zombies/edit/:id', async function(req,res){
  try{
    var zombie=await Zombie.findById(req.params.id);
    zombie.name=req.body.name;
    zombie.email=req.body.email;
    zombie.type=req.body.type;

    await zombie.save();
    res.status(200).json(zombie);
  }
  catch(e){
    
    res.status(500).json({mensajeError:e});
  }
});

//___________________________________________


router.put('/cerebros/edit/:id', async function(req,res){
  try{
    let cerebro=await Cerebro.findById(req.params.id);
    cerebro.falvor=req.body.flavor;
    cerebro.Description=req.body.Description;
    cerebro.IQ=req.body.IQ;
    cerebro.Picture=req.body.Picture;

    await cerebro.save();
    res.status(200).json('/cerebros');
  }
  catch(e){
    res.status(500).json({mensajeError:e});
  }
});

router.get('/cerebros/:owner', async function(req,res){
  Usuario.findOne({email: req.params.owner}, async function(error, user){
    console.log('Tipo de usuario: ' + user.typeA);
    try{
      //admin
      if(user.typeA == 0){
        Cerebro.find().exec((error, cerebros)=>{
          if(!error){
              res.status(200).json(cerebros);
          }else{
              res.status(500).json(error);
          }
        });
        //normal
      }else{
        Cerebro.find({owner:{$eq: req.params.owner}}).exec((error,cerebros)=>{
          if(!error){
            
              res.status(200).json(cerebros);
          }else{
              res.status(500).json(error);
          }
        });
      }
    }catch (e){
      res.status(500).json(e);
    }
  } 
);

});

router.post("/cerebro/new",async function(req,res){
  let data=req.body;

  let nuevoCerebro=new Cerebro ({
    flavor: data.flavor,
    Description:data.Description,
    IQ: data.IQ,
    Picture:data.Picture,
    owner: data.owner
  });
  nuevoCerebro.save(function(error){
    if(error){
      let errMessage=error.message;
      console.log("\n" + errMessage + "\n");
      res.status(500).json({mensajeError:errMessage});
    }else{
      res.status(200).json("/prueba");
      }
    });
    
});

router.delete('/cerebros/delete/:id', async function(req,res){
  try{
    let cerebro=await Cerebro.findById(req.params.id);
    cerebro.remove();

    res.status(200).json("/cerebros");
  }catch(e){
    res.status(500).json({mensajeError:e});
  }
});


//---------------------------------
router.post("/registro/new",async function(req,res){
  let data=req.body;

  let nuevoUser=new Usuario({
    email: data.email,
    password: data.password,
    typeA: 1
  });
  nuevoUser.save(function(error){
    if(error){
      let errMessage=error.message;
      res.status(500).json({mensajeError:errMessage});
      return error;
    }else{
      res.status(200).json("/prueba");
      }
    });
  });

  /*router.post("/autenticar",async function(req,res){
    let data=req.body;
    try{
      let userData= await Usuario.find({email: {$eq: data.email}});
      //res.json(userData);
        
      if(data.password == userData.password){
        const payload = {
          check: true
        };
  
        const _token = jwt.sign(payload, app.get('llave'),{
          expiresIn: 1440
          
        });
        res.json({
          mensaje: 'Autenticación correcta',
          token: _token
        });
      }else{
        res.json({mensaje: "Usuario o contraseña incorrectos"});
      }
    }catch (e){
      res.status(500).json({mensajeError:e});
    }
    });*/

    router.post('/usuario/login', function(req,res){
      var data = req.body;
      Usuario.findOne({email: data.email}, function(error, user){
        if(user == null){
          res.status(500).json({errors: "usuario no encontrado"});
        }else {
          
            if(data.password == user.password){
              //loggeado = true;
              res.status(200).json({});
            } else {
              res.status(500).json({errors: "contraseña o correo erroneos"});
            }
          
        }
      });
    });

    



    //graficas____________________________________________________________________________
    router.get('/cerebrosChart/:owner', async (req, res)=>{
      var saboresCount;
      Usuario.findOne({email: req.params.owner}, async function(error, user){

        try{
          if(user.typeA == 0){
            var spicy =await Cerebro.find({flavor: {$eq: 'Spicy'}}).count();
            var sweet =await Cerebro.find({flavor: {$eq: 'Sweet'}}).count();
            var bitter =await Cerebro.find({flavor: {$eq: 'Bitter'}}).count();
            var salty =await Cerebro.find({flavor: {$eq: 'Salty'}}).count();
            
            saboresCount = {
              cSpicy: spicy,
              cSweet: sweet,
              cBitter: bitter,
              cSalty: salty
            };
  
            res.status(200).json(saboresCount);

          }else{
            
            spicy =await Cerebro.find({$and: [{flavor: {$eq: 'Spicy'}},{owner: {$eq: user.email}}]}).count();
            sweet =await Cerebro.find({$and: [{flavor: {$eq: 'Sweet'}},{owner: {$eq: user.email}}]}).count();
            bitter =await Cerebro.find({$and: [{flavor: {$eq: 'Bitter'}},{owner: {$eq: user.email}}]}).count();
            salty =await Cerebro.find({$and: [{flavor: {$eq: 'Salty'}},{owner: {$eq: user.email}}]}).count();
            
            saboresCount ={
              cSpicy: spicy,
              cSweet: sweet,
              cBitter: bitter,
              cSalty: salty
            };
  
            res.status(200).json(saboresCount);
          }
          
        }catch (e){
          res.status(500).json(e);
        }
      } 
    );
  });


  router.get('/usuarioChart', async (req, res)=>{
      var usuariosCount = [];
      Usuario.find({},{email:1,_id:0}).exec(async (error, users)=>{
        if(!error){
          console.log(users);
          
          for (var pos in users){
            var cantidad = await Cerebro.find({owner: {$eq: users[pos].email}}).count();
             usuariosCount[pos] = {y:cantidad, label: users[pos].email};
          }
          

          res.status(200).json(usuariosCount);
        }else{
          res.status(500).json(error);
        }
      });
  });


  //__________________________________________________________________________PEDIDOS

  router.post('/pedidos/cerebros/new', async function(req,res){
    var data = req.body;
    let nuevoPedido=new PedidoCerebro({
      cerebro: data.cerebro,
      emailUsuario:data.emailUsuario,
      tipoEnvio: data.envio,
      cantidad: data.cantidadCerebros,
      fechaPedido:data.fPedido,
      fechaEntrega:data.fEntrega
    });
    nuevoPedido.save(function(error,newData){
      if(error){
        let errMessage=error.message;
        res.status(500).json({mensajeError:errMessage});
        return error;
      }else{
        res.status(200).json(newData);
        }
      });
  });



  router.get('/pedidos/cerebros/:user', async function(req, res){
    PedidoCerebro.find({emailUsuario: req.params.user}, function(error, data){
      if(!error){
        res.status(200).json(data);
      }else{
        res.status(500).json(error);
      }
    });
});

module.exports = router;
   