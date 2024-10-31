const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
            return
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}