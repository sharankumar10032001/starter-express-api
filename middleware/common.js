import bcrypt from "bcryptjs";
import config from '../config/config.js';


export async function  passwordHash (data)  {
    console.log("pasword:",data)
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(data, config.saltRounds, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    
      return hashedPassword
}


