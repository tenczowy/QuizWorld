import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const app = new express();
const saltRounds = process.env.SALT_ROUNDS;
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
    console.log(answers.rows);
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
          'INSERT INTO userProfile (username, password) VALUES ($1, $2)',
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

app.post('/addQuestion', async (req, res) => {
  const data = req.body.params.formData;
  const category = data.category;
  const question = data.question;
  const answer1 = data.answer1;
  const answer2 = data.answer2;
  const answer3 = data.answer3;
  const answer4 = data.answer4;
  const correct = data.correct;

  console.log(answer2);
});

app.listen(4000, () => {
  console.log(`Application running on port 4000.`);
});
