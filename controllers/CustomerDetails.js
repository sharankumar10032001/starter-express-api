import CustomerDetailsModel from "../model/CustomerDetails.js";
import nodemailer from "nodemailer";

let users = [];

export const getUsers = async (req, res) => {
  console.log(`Users in the database: ${users}`);
  const get = await CustomerDetailsModel.getUsers(res.body);

  res.send(get);
};
export const activeUsers = async (req, res) => {
  console.log(`Users in the database: ${users}`);
  const get = await CustomerDetailsModel.activeUsers(req.body);

  res.send(get);
};
export const noactiveUsers = async (req, res) => {
  console.log(`Users in the database: ${users}`);
  const get = await CustomerDetailsModel.noactiveUsers(res.body);

  res.send(get);
};


export const createUser = async (req, res) => {
  
  try {
    let result = await CustomerDetailsModel.createUser(req.body);

    res.send(result);
  } catch (error) {
    res.send({ success: false, statusCode: 404, message: error.message });
  }

  // users.push({...user, id: uuid()});

  console.log(`User [${user.firstName}] added to the database.`);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const result = await CustomerDetailsModel.login(email, password);
  res.send(result);
};

export const sendmail = async (req, res, next) => {
  var mailOptions = {
    from: 'sharan.shanmugavadivel@augustahitech.com',
    to: 'sarashar10@yopmail.com',
    subject: 'Testing Nodemailer',
    text: 'Hi, this is a Nodemailer test email ;) ', 
    html: '<b> Hi </b><br> this is a Nodemailer test email'
  };
  var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "sharan.shanmugavadivel@augustahitech.com", //generated by Mailtrap
      pass: "Balaji@123" //generated by Mailtrap
    }
  });

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});


res.send("mail api pressed")

};

export const getUser = async (req, res) => {
  console.log(res.body);
  console.log(req.params.id);
  const result = await CustomerDetailsModel.getUser(req.params.id);

  res.send(result);
};

export const deleteUser = async (req, res) => {
  const deleteone = await CustomerDetailsModel.deleteUser(req.params.id);

  res.send("delete sucesssfully");
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updateone = await CustomerDetailsModel.updateUser(id, updates)
      .then((response) => {
        return "successfully";
      })
      .catch((error) => {
        return error;
      });

    console.log(
      ` ${req.body.firstName} ${req.body.lastName} username has been updated  `
    );
    res.send("Updated sucesssfully");
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
