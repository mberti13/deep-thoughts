const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const { User, Thought } = require('../models');


const resolvers = {
    //query to get Thoughts
    Query:{
        me: async(parent, args, context) =>{
            if(context.user){
                const userData = await User.findOne({ _id: context.user.id })
                .select('-_v -password')
                .populate('thoughts')
                .populate('friends');
    
                return userData;
            }

            throw new AuthenticationError('Not logged in!')
            
        },
        // * get all thoughts
        thoughts: async (parent, { username }) =>{
            const params = username ? { username } : {};

            return Thought.find(params).sort({ createdAt: -1 });
        },
        // * get thought by ID
        thought: async (parent, { _id }) =>{
            return Thought.findOne({_id});
        },
        // * get all users
        users: async () =>{
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        // * get user by username
        user: async () =>{
            return User.findOne(parent, { username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        },
        Mutation:{
            addUser: async (parent, args) =>{
                const user = await User.create(args);
                const token = signToken(user)

                return { token, user };
            },
            login: async (parent, { email, password}) =>{
                const user = await User.findOne({ email });

                if(!user){
                    throw new AuthenticationError('Incorrect credentials');
                }

                const correctPw = await user.isCorrectPassword(password);

                if(!correctPw){
                    throw new AuthenticationError('Incorrect credentials')
                }

                const token = signToken(user);
                return { token, user };
            }
        }
    };



module.exports = resolvers;