module.exports = {

    setReturn(status,erro_msg,data = null){
        return {
            status,
            erro_msg,
            data,
            
        }
    },
}