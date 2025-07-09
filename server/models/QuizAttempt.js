// const mongoose = require("mongoose");

// const quizAttemptSchema = new mongoose.Schema({
// // //   userId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     // required: true,
// //     ref: "User"
// //   },
// //   username: String,
// //   answers: Array,
// //   score: Number,
// //   total: Numbxer,
// //   submittedAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });
const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // ✅ required to make populate("user") work
  // },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User", 
    required: true,
  },
  username: String,

  answers: [
    {
      question: String,
      selected: String,
      correct: String,
    },
  ],
  score: Number,
  total: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
// // 


// const mongoose = require("mongoose");

// const attemptSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:"User",
  //   required: true,
  // },
  // username: String,
//   answers: [
//     {
//       question: String,
//       selected: String,
//       correct: String,
//     },
//   ],
//   score: Number,
//   total: Number,
//   submittedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("QuizAttempt", attemptSchema);
