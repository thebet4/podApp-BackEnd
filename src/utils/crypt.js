const bcrypt = require('bcrypt');

module.exports = {
    async encrypt(text){
        const salt = bcrypt.genSaltSync();
        let hash = await bcrypt.hashSync(text,salt);  
        return hash;
    },

    async decrypt(text,hash){
        const valid = await bcrypt.compareSync(text,hash);
        return valid;
    }

}