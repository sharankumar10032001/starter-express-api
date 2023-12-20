import mongoose from "mongoose";
import { generateJwtToken } from '../middleware/generateToken.js';
import { passwordHash } from '../middleware/common.js';
import bcrypt from "bcryptjs";
import config from '../config/config.js';


const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const CustomerDetailsschenma = new Schema({
  "firstName": String,
  "lastName": String,
  "email": String,
  "password": String,
  "adharNo": String,
  "panNo": String,
  "address": String,
  "contactNo": String,
  "isActive": { type: Boolean, default: true },
  "isDeleted": { type: Boolean, default: false }
});

export var CustomerDetailsmodel = mongoose.model('CustomerDetails', CustomerDetailsschenma);
export function model() {
  return CustomerDetailsmodel;

}
export async function createUser(body) {
  console.log('--> method hit')
  let callback;
  try {

    let user = await CustomerDetailsmodel.find({ email: body.email });
    if (user) {
      return {
        success: true,
        statusCode: 404,
        displayMessage: "Already Created",
        data: {
          "accountId": callback._id.toString(),
          "name": callback.firstName + " " + callback.raj,
          "email": callback.email
        }
      };
    } else {

      let callback = await CustomerDetailsmodel.create(body)

      return {
        success: true,
        statusCode: 200,
        displayMessage: "Account Signed Up and Login Successfully",
        data: {
          "accountId": callback._id.toString(),
          "name": callback.firstName + " " + callback.raj,
          "email": callback.email
        }
      };




    }
    // }else{

    //     callback="Customer {Pls Fill Email&Password OR Invalid Username/Password!}"
    //   return callback;

    // }

  } catch (error) {
    console.log(error);
    return "Something Went Wrong";
  }


}

export async function getUsers(body) {
  console.log("-->got user hit");
  const get = await CustomerDetailsmodel.find(body);
  return get;

}
export async function activeUsers(body) {
  console.log("-->got user hit");
  const get = await CustomerDetailsmodel.find({ isActive: true, _id: body.id });
  return get;

}
export async function noactiveUsers(body) {
  console.log("-->got user hit");
  const get = await CustomerDetailsmodel.find(body);
  return get;

}

export async function getUser(id) {
  console.log("-->found respective user");


  const findone = await CustomerDetailsmodel.findById(id);

  return findone;
}
// Email Checking Regex
function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) { return true; }

  return false;
}
// Email Checking Regex END

export async function login(email, password) {
  let callback;
  console.log(email)
  console.log(password)
  try {
    if (!isEmail(email)) {
      callback = {
        statusCode: 404,
        hasError: true,
        message: "Please Check And Enter A Valid Email ID"
      }
      return callback
    }
    let user = await CustomerDetailsmodel.find({ email });

    if (!user.length) {
      callback = {
        statusCode: 404,
        hasError: true,
        message: "Hello User, Your Email are Not Registered ,Pls Sign Up"
      }
      return callback
    }
    else {
      let passwordHash = user[0].password;
      const match = await bcrypt.compare(password, passwordHash);
      if (!match) {
        callback = {
          statusCode: 404,
          hasError: true,
          message: "Incorrect Password"
        }
        return callback
      }
      else {
        console.log("user", user)
        let Customeruser = user[0];
        const accesstoken = generateJwtToken({
          accountId: Customeruser._id.toString(),
          firstName: Customeruser.firstName,
          lastName: Customeruser.lastName,
          email: Customeruser.email
        })
        callback = {
          statusCode: 200,
          accesstoken: accesstoken,
          message: "User Login Successfully",
          hasError: false,
        }
        return callback;

      }

    }
  }
  catch (error) {
    callback = {
      statusCode: 402,
      hasError: false,
      message: "Something Went Wrong",
    }
    console.log("login catch->", error);
    return callback;
  }
}

export async function deleteUser(body) {
  console.log("-->detele respective user");


  const deleteone = await CustomerDetailsmodel.findByIdAndDelete(body);

  return deleteone;
}

export async function updateUser(req, res, next) {
  console.log(req);
  console.log("-->update respective user");
  const deleteone = await CustomerDetailsmodel.findByIdAndUpdate(req, res);

  return deleteone;
}




export default { createUser, login, activeUsers, noactiveUsers, CustomerDetailsschenma, model, getUsers, getUser, deleteUser, updateUser };








