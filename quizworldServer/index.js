import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const app = new express();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
db.connect();

function generateToken(userId) {
  const payload = { id: userId };
  const secretKey = 'secret';
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
}

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/getCategories', async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM category');
    res.json(categories.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get('/getQuestions', async (req, res) => {
  try {
    const { quizId } = req.query;
    const numericId = parseInt(quizId, 10);
    const questions = await db.query(
      `
      SELECT id, question from question 
    WHERE cat_id = $1
    AND accepted = true
    ORDER BY RANDOM ()
    LIMIT 5;
      `,
      [numericId]
    );
    res.json(questions.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get('/getAnswers', async (req, res) => {
  try {
    const { questionId } = req.query;
    const numericId = parseInt(questionId, 10);
    const answers = await db.query(
      `SELECT * FROM answer where question_id=$1 ORDER BY RANDOM ()`,
      [numericId]
    );
    res.json(answers.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post('/register', async (req, res) => {
  const username = req.body.params.username;
  const password = req.body.params.password;

  try {
    const checkResult = await db.query(
      'SELECT * FROM userProfile WHERE username = $1',
      [username]
    );

    if (checkResult.rows.length > 0) {
      res.status(200).json({
        status: false,
        result:
          "'Username already exists. Try loggin in or use different username.'",
      });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log('Error hashing password: ' + err);
        }
        const result = await db.query(
          'INSERT INTO userprofile (username, password) VALUES ($1, $2)',
          [username, hash]
        );
      });

      res.status(201).json({
        status: true,
        result: 'Account created successfully! Please, log in.',
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {
  const username = req.body.params.username;
  const password = req.body.params.password;

  try {
    const result = await db.query(
      'SELECT *FROM userProfile WHERE username = $1',
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          console.log('Error comparing password: ' + err);
        } else {
          if (result) {
            res.status(200).json({
              status: true,
              result: 'Logged in successfully!',
              userId: user.id,
              userRole: user.role,
              authToken: generateToken(user.id),
            });
          } else {
            res.status(200).json({
              status: false,
              result: 'Failed to log in.',
            });
          }
        }
      });
    } else {
      res.status(200).json({
        status: false,
        result:
          "Username not found, check your spelling or register if you don't have an account.",
      });
    }
  } catch (err) {
    console.log('Error while trying to log in: ' + err);
  }
});

app.post('/addQuestion', verifyToken, async (req, res) => {
  const formData = req.body.formData;
  const { answer1, answer2, answer3, answer4 } = formData;
  const answers = { answer1, answer2, answer3, answer4 };
  const userId = req.body.userId;

  //delete this later
  //'INSERT INTO userprofile (username, password) VALUES ($1, $2)',
  //delete from answer where question_id = 95

  if (req.user.id !== parseInt(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    //TODO
    //Add answers only when adding questions was successull
    const resultAddingQuestion = await db.query(
      `INSERT INTO question (question, cat_id, submittedby) VALUES ($1, $2, $3) RETURNING id`, //submittedby containes user id
      [formData.question, formData.category, userId]
    );

    const insertedId = resultAddingQuestion.rows[0].id;

    let index = 1;
    for (const [key, answer] of Object.entries(answers)) {
      await db.query(
        'INSERT INTO answer (answer, correct, question_id) VALUES ($1, $2, $3)',
        [answer, index === parseInt(formData.correct), insertedId]
      );
      index++;
    }

    //response on success
    res.status(200).json({
      status: true,
      result: 'Question was added successfully, will be reviewed shortly!',
    });
    console.log('Added successfully');
  } catch (err) {
    //response on failure
    res.status(400).json({
      status: true,
      result: 'Something went wrong. Try again!',
    });
    console.log('ERROR ADDING QUESTION AND ANSWERS' + err);
  }
});

app.get('/questionsToVerify', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT question.id, question.question, question.cat_id, category.name AS categoryName, question.accepted, question.submittedby FROM question JOIN category ON question.cat_id = category.id WHERE accepted = false'
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.log('Error getting not accepted questions.' + err);
    res.status(400).json({
      result: "Couldn't get questions to verify",
    });
  }
});

app.delete('/deleteQuestion/:questionId', verifyToken, async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const result = await db.query('DELETE FROM question WHERE id=$1', [
      questionId,
    ]);
    res.status(200).json({
      result: 'Question Deleted successfully',
    });
  } catch (err) {
    console.log('Error during deleting question.');
    res.status(400).json({
      result: 'Something went wrong while trying to delete question. //SERVER',
    });
  }
});

app.put('/acceptQuestion/:questionId', verifyToken, async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const result = await db.query(
      'UPDATE question SET accepted = true WHERE id=$1',
      [questionId]
    );
    res.status(200).json({
      result: 'Question Accepted Succesfully',
    });
  } catch (err) {
    console.log('Error accepting question //SERVER: ' + err);
    res.status(400).json({
      result: 'Error accepting question //Server',
    });
  }
});

app.get('/verifyRole/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.query('SELECT role FROM userprofile where id=$1', [
      userId,
    ]);
    const userRole = result.rows[0];

    res.status(200).json({
      userRole: userRole,
    });
  } catch (err) {
    console.log('error getting user role //server: ', err);
    res.status(400).json({
      result: 'Failed to get user role',
    });
  }
});

app.listen(4000, () => {
  console.log(`Application running on port 4000.`);
});

//VERIFY TOKEN MIDDLEWARE

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Access Denied');
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, 'secret');
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid Token');
  }
}
