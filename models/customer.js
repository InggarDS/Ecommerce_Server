'use strict';

const { hash } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {

  const { Model } = sequelize.Sequelize
  
  class Customer extends Model {}

  Customer.init({
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: {
        args: true,
        msg: 'Email cannot be empty',
      },
      notNull: {
        args: true,
        msg: 'Email cannot be null',
      },
      isEmail: {
        args: true,
        msg: 'must an email format (ex. foo@mail.com)'
      },
      isUnique(value) {
        return Customer.findOne({where: {email:value}})
              .then(result => {
                if (result) {
                  throw new Error('Email already exist')
                }
              })
       }
     }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Email cannot be null'
        }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate: (customer, options) => {
        customer.password = hash(customer.password)
        if (customer.fname == null || customer == ''){
          customer.fname = customer.email.split('@')[0]
        }
      }   
    }
  })

  Customer.associate = function(models) {
   Customer.hasMany(models.Order)
  };
  return Customer;
};