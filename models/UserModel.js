import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userCategories:[String]
})

UserSchema.methods.toJSON = function(){
    let obj = this.toObject()
    delete obj.password
    return obj
}

export default mongoose.model('User', UserSchema)