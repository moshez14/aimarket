const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
source: [
  {
    cameras: [
    {
      name: String,
      code: String
    }
  ]
    ,filesLink: [
      {
        name: String,
        link: String
      }
    ]}],
usersettings: [
  {
  routines:[
      {
        RoutineName:String,
        sourceselected: String,
        ModelSelected: String,
        messageselect:String
      }
    ]

  }
]
 });

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;
