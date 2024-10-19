import User from "./models/users.model.js";

class UserDao {
    async findById(id) {
        return await User.findById(id); 
    }

    async findOne(query){
        return await User.findOne(query); 
    }

    async save(userData) {
        const user = new User(userData);
        return await user.save(); 
    }

}

export default new UserDao();