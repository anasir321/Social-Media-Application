import User from '../models/user.js';

/* READ ROUTES */
export const getUser = async (req,res) => {
    try{    
        const { id } = req.params; // id is the user id
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const getUserFriends = async (req,res) => {
    try{ 
        const { id } = req.params; // id is the user id
        const user = await User.findById(id);
        const friends = await Promise.all( // to get the friends of the user by doing api calls
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({  _id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE ROUTES */
export const addRemoveFriend = async (req,res) => {
    try{
        const {id,friendId} = req.params; // id is the user id
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId); // remove the friend
            friend.friends = friend.friends.filter((id) => id !== id); // remove the user from the friend
        } else {
            user.friends.push(friendId); // add the friend
            friend.friends.push(id); // add the user to the friend
        }
        await user.save();
        await friend.save();
        
        const friends = await Promise.all( // to get the friends of the user by doing api calls
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({  _id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    }
    catch(err){
        res.status(403).json({ message: err.message });
    }
}
