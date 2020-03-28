let express = require('express');
let router = express.Router();
let jwt= require('jsonwebtoken');

let Zombie=require("../models/Zombie"); //modelo
let Cerebro=require("../models/Cerebro"); //modelo
let Usuario=require("../models/Usuario"); //modelo

var bcrypt = require('bcrypt');

router.get('/zombies', async (req, res)=>{
    Zombie.find().exec((error,zombies)=>{
        if(!error){
            res.status(200).json(zombies);
        }else{
            res.status(500).json(error);
        }
    });
});

router.get('/zombieData/:id', async (req, res)=>{
  try{
    let zombieData = Zombie.findById(req.params.id);
    res.status(200).json(zombieData,{milk: 'puto'});

  }catch(e){
    res.status(500).json({mensajeError:e}); 
  }
  
});

router.post("/zombies/new",function(req,res){
    let data=req.body;
  
    let nuevoZombie=new Zombie({
      name: data.name,
      email:data.email,
      type: data.type
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

router.get('/cerebros', function(req,res){
  Cerebro.find().exec(function(error,cerebros)
  {
    if(!error)
    {
      res.status(200).json(cerebros);
    }else{
      res.status(500).json("/prueba");
    }
  });
});

router.post("/cerebro/new",function(req,res){
  let data=req.body;

  let nuevoCerebro=new Cerebro ({
    flavor: data.flavor,
    Description:data.Description,
    IQ: data.IQ,
    Picture:data.Picture  
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
router.post("/registro/new",function(req,res){
  let data=req.body;

  let nuevoUser=new Usuario({
    email: data.email,
    password: data.password
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

    


module.exports = router;
   