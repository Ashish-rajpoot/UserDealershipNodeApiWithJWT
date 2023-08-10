const errorHandlers = (err,res)=>{
    if(err){
        console.error(err);
    }
    res.status(500).json({msg:"Server error"});
}

module.exports = {errorHandlers}