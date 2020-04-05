//MODELO CEREBRO
var mongoose=require('mongoose');
var modelSchema=mongoose.Schema({
    flavor:{
        type:String,
        enum:["Spicy","Sweet","Bitter","Salty"],
        required:[true,"Debe de ingresar un sabor para el cerebro"]
    },
    Description:{
        type:String,
        maxlength:[150,"Descripción muy larga"],
        required:[true,"Debe de haber una descripción del cerebro"]
    },
    IQ:{
        type:Number,
        min:[0,"Numeros mayores a -1"],
        max:[1000,"El límite de IQ es de 1000"],
        require:[true,"Debe de ingresar una IQ para el cerebro"]
    },
    picture:String,
    
    owner:{
        type: String
    }
});

var Cerebro=mongoose.model("Cerebro",modelSchema);
module.exports=Cerebro;