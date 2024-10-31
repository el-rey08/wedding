const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')

exports.signUp = async(req, res)=>{
    try {
        const {
            userName,
            email,
            password
        }=req.body
        if(!userName || !email || !password){
            return res.status(400).json({
                message:"please input the missing field(s) "
            })
        }
        const existingUser = await userModel.findOne({email: email.toLowerCase().trim()})
        if(existingUser){
            return res.status(400).json({
                message: 'user already exist'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const file = req.file;
        if (!file) {
          return res.status(400).json({
            message: "Student picture is required",
          });
        }
    
        const image = await cloudinary.uploader.upload(req.file.path);
        const data = new userModel({
            userName,
            email: email.toLowerCase().trim(),
            password: hash,
            picture: image.secure_url
        })
        await data.save()
        res.status(200).json({
            message: 'usere created successfully',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}