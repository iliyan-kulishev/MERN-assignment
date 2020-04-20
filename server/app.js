const mongoose = require("mongoose"); // We need the mongoose library


//#region Question Model
  const Schema = mongoose.Schema;
  const questionSchema = new Schema({
    text: String,
    answers: [{ text: String, votes: Number }],
  });

  const questionModel = mongoose.model("question", questionSchema);
//#endregion


//#region Database operations


async function getQuestions() {
  try {
    return await questionModel.find({});
  } catch (error) {
    console.error("getQuestions:", error.message);
    return {};
  }
}

async function getQuestion(questionId) {
  try {
    return await questionModel.findById(questionId);
  } catch (error) {
    console.error("getQuestion:", error.message);
    return {};
  }
}

async function postQuestion(newQuestion) {
  // TODO: Error handling
  let question = new questionModel(newQuestion);
  try {
    return question.save();
  } catch (error) {
    console.error("postQuestion:", error.message);
    return {};
  }
}

async function postAnswer(questionId, answer) {
  // TODO: Error handling
  const question = await getQuestion(questionId);
  answer.votes = 0;
  question.answers.push(answer);

  try {
    return question.save();
  } catch (error) {
    console.error("postAnswer:", error.message);
    return {};
  }
}

function getAnswer(question, answerId) {
  try {
    console.log(answerId);
    return question.answers.find(answer => answer._id == answerId);
  } catch (error) {
    console.error("getAnswer:", error.message);
    return {};
  }
}

async function putVote(questionId, answerId) {
  // TODO: Error handling
  const question = await getQuestion(questionId);
  const answer = getAnswer(question, answerId);
  answer.votes = answer.votes + 1;

  return question.save();
}

//#region Test data

  /** Random test data to the database
   * This method adds a bunch of test data if the database is empty.
   * @param count The amount of questions to add.
   * @returns {Promise} Resolves when everything has been saved.
   */
  async function addQuestions(count = 10) {
    const answers = [
      { text: "This question requires a lot of research", votes: 2 },
      { text: "I don't know the answer", votes: 3 },
      { text: "Can you give more details about this issue", votes: 0 },
      { text: "This is the solution", votes: 3 },
      { text: "Check this out", votes: 0 }
    ];
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomQuestion() {
      return [
        "How do I return the response from an Observable in Angular 2?",
        "Can you help me with this React app?",
        "Objects in JavaScript",
        "How to build an API?"
      ][getRandomInt(0, 3)];
    }

    function getRandomAnswers() {
      const shuffled = answers.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, getRandomInt(1, shuffled.length));
    }

    let questionLength = (await getQuestions()).length;
    console.log("Question collection size:", questionLength);

    if (questionLength === 0) {
      let promises = [];

      for (let i = 0; i < count; i++) {
        let question = new questionModel({
          text: getRandomQuestion(),
          answers: getRandomAnswers()
        });
        promises.push(question.save());
      }
      console.log("Test data inserted");
      return Promise.all(promises);
    }
  }


//#endregion


//#endregion


//#region API 

//External libraries
const express = require("express");
const bodyParser = require("body-parser"); //useful to take data in from the request and send that data to a database
const cors = require("cors");
const morgan = require("morgan"); // Log out all http requests to the console

//Configuration
const appName = "Express API Template";
const app = express(); // Get the express app.
const port = process.env.PORT || 8080; // Pick either port 8080 or the port in the PORT env variable.

//Using the dependencies
app.use(bodyParser.json());
app.use(cors()); // Enable Cross Origin Resource Sharing across all routes. Basically open up your API to everyone.
app.use(morgan("combined"));
app.use(express.static("../client/build")); // Only needed when running build in production mode

//Routes
//Read questions
app.get("/api/questions", (request, response) => {
  getQuestions().then(question => response.json(question));
});

//Read question id
app.get("/api/questions/:questionId", (request, response) => {
  const questionId = request.params.questionId;
  getQuestion(questionId).then(question => response.json(question));
});

///Create question
app.post("/api/questions", (request, response) => {
  let question = {
    text: request.body.text,
    answers: []
  };
  postQuestion(question).then(newQuestion => response.json(newQuestion));
});

///Post a new answer for a specific question id
app.post("/api/questions/:questionId/answers", (request, response) => {
  // To add answers, we need the id of the question, and some answers text from the request body.
  postAnswer(request.params.questionId, request.body) // request.body is an answer object
    .then(updatedQuestion => response.json(updatedQuestion));
});

//Update Vote
app.put(
  "/api/questions/:questionId/answers/:answerId/vote",
  (request, response) => {
    //Path parameter

    putVote(request.params.questionId, request.params.answerId) // request.body is an answer object
      .then(updatedVote => response.json(updatedVote));
  }
);

app.get('*', (request, response) =>
    response.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

//#endregion


//#region Start


const url = process.env.MONGO_URL || 'mongodb://localhost/db';
mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
      console.log("Database connected");
    })
    .then(async () => {
        await addQuestions(); // Fill in test data if needed.
        app.listen(port); // Start the API when db connection is ready
        console.log(`API running on port ${port}!`);
    })
    .catch(error => console.error(error));
  

//#endregion
