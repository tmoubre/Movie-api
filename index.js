const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.Users;
mongoose.connect('mongodb://127.0.0.1:27017/topMovies', { useNewUrlParser: true, useUnifiedTopology: true });
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require("path");    

//Add Users
app.post('/users', async (req, res) => {
    await Users.findOne({ userId: req.body.userId })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.userId + 'User already exsits');
            } else {
                Users
                    .create({
                        userId: req.body.userId,
                        password: req.body.password,
                        email: req.body.email,
                        birthDate: req.body.birthDate
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('error:' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('error' + error);
        });
});

// Update User
app.put('/users/:userId', async (req, res) => {
    await Users.findOneAndUpdate({ userId: req.params.userId }, { $set:
      {
        userId: req.body.userId,
        password: req.body.password,
        email: req.body.email,
        birthDate: req.body.birthDate
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });

  // Delete a user by username
app.delete('/users/:userId', async (req, res) => {
    await Users.findOneAndRemove({ userId: req.params.userId })
      .then((user) => {
        if (user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Add a movie to a user's list of favorites
app.post('/users/:userId/:favoriteMovies', async (req, res) => {
  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $push: { favoriteMovies: req.params.favoriteMovies } },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);})
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//delete Favorite Movie
app.delete('/users/:userId/:favoriteMovies', async (req, res) => {
  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $pull: { favoriteMovies: req.params.FavoriteMovies } },
    { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) =>
      res.status(500).send('Error:' + err)
    );
});

//Log to terminal with morgan

app.use (morgan('combined'));

//serve files from pulic directory staticly
app.use(express.static('public'));

//Get route for movies and returns top 10 movies
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies)=>{
        res.status(201).json(movies);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error:"+ err);
    });
});

// Get all users
app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Get a user by username
app.get('/users/:userId', async (req, res) => {
    await Users.findOne({ userId: req.params.userId })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//Get route for movie titles
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Get route for movie genre


//Get route for movie genre
app.get('/genre/:name', (req, res) => {
    Movies.findOne({ 'genre.name': req.params.name })
        .then((genre) => {
            res.json(genre.genre.description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error:" + err);
        });
});

//Get route for movie Director
app.get('/director/:name',(req, res) => {
    Movies.findOne({ 'director.name': req.params.name })
        .then((director) => {
            res.json(director.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error:" + err);
        });
});


        
//log to txt file
app.get('/log', (req, res) => {
    res.send('This is a log.');
  });
// GET route for "/" that returns a default textual response
app.get('/', (req, res) => {
	res.send(
		'Welcome to my API! Please Go to /documentation.html to view the documentation.'
	);
});

// Error-handling middleware
// app.use((err, req, res, next) => {
// 	console.error('Error:', err.stack);
// 	res.status(500).send('Check Code No response received.');
// });

// Start the server
app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});






// let users = [

// {   id: 1,
//     name:"Kathy",
//     favoriteMovies:[]
// },
//  {   id: 2,
//     name:"Todd",
//     favoriteMovies:[]
// },
// ]

// Movie Data

// let topMovies = [
//     {
//         title: 'Dune: Part Two',
//         description: '2024 American epic science fiction film directed and co-produced by Denis Villeneuve, who co-wrote the screenplay with Jon Spaihts.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dune_Part_Two_poster.jpeg/220px-Dune_Part_Two_poster.jpeg',
//         director: {
//             name: 'Denis Villeneuve',
//             description:'Denis Villeneuve OC CQ RCA (French: [dəni vilnœv]; born October 3, 1967) is a Canadian filmmaker. He has received seven Canadian Screen Awards as well as nominations for three Academy Awards, five BAFTA Awards, and two Golden Globe Awards.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Atlas',
//         description: ' 2024 American science fiction action film starring Jennifer Lopez as a highly skilled counterterrorism analyst, who harbors a profound skepticism towards artificial intelligence, and who comes to realize that it may be her sole recourse following the failure of a mission aimed at apprehending a rogue robot.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atlas_2024_film_poster.png/220px-Atlas_2024_film_poster.png',
//         director: {
//             name: 'Brad Peyton',
//             description:'Brad Peyton (born May 27, 1978) is a Canadian filmmaker, best known for directing the Dwayne Johnson star vehicles Journey 2: The Mysterious Island (2012), San Andreas (2015), and Rampage (2018) as well as the Netflix series Daybreak (2019).',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Code 8: Part II',
//         description: ' 2024 Canadian superhero science fiction action film[1] directed by Jeff Chan, who co-wrote the screenplay with Chris Paré, Sherren Lee and Jesse LaVercombe.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Code_eight_part_II_poster.jpg/220px-Code_eight_part_II_poster.jpg',
//         director: {
//             name:'Brad Peyton',
//             description:'Brad Peyton (born May 27, 1978) is a Canadian filmmaker, best known for directing the Dwayne Johnson star vehicles Journey 2: The Mysterious Island (2012), San Andreas (2015), and Rampage (2018) as well as the Netflix series Daybreak (2019).',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Rebel Moon – Part Two: The Scargiver',
//         description: ' 2024 American epic space opera film directed by Zack Snyder from a screenplay he co-wrote with Kurt Johnstad and Shay Hatten. A direct sequel to Rebel Moon – Part One: A Child of Fire (2023), the film takes place on the moon of Veldt where Kora and the crew of warriors ventures to help the farmers to defend and fight for their home against the Motherworld.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Rebel_Moon_%E2%80%93_Part_Two_The_Scargiver_poster.jpg/220px-Rebel_Moon_%E2%80%93_Part_Two_The_Scargiver_poster.jpg',
//         director: {
//             name:'Zachary Edward Snyder',
//             description:'(born March 1, 1966) is an American filmmaker. He made his feature film debut in 2004 with Dawn of the Dead, a remake of the 1978 horror film of the same name.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Kingdom of the Planet of the Apes',
//         description: ' 2024 American science fiction action film directed by Wes Ball and written by Josh Friedman.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Kingdom_of_the_Planet_of_the_Apes_poster.jpg/220px-Kingdom_of_the_Planet_of_the_Apes_poster.jpg',
//         director: {
//             name:'Wes Ball',
//             description:'(born October 28, 1980) is an American film director and producer. He is best known for directing the Maze Runner film trilogy (2014–2018).',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Ghostbusters: Frozen Empire',
//         description: ' 2024 American supernatural comedy film directed by Gil Kenan from a screenplay he co-wrote with Jason Reitman.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Ghostbusters_%282024%29_poster.jpg/220px-Ghostbusters_%282024%29_poster.jpg',
//         director: {
//             name:'Gil Kenan',
//             description:'(born October 16, 1976)[1] is a British–American filmmaker. He is best known for directing the films Monster House (2006) and Ghostbusters: Frozen Empire (2024), the former of which was nominated for the Academy Award for Best Animated Feature.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Ghostbusters: Frozen Empire',
//         description: ' 2024 American supernatural comedy film directed by Gil Kenan from a screenplay he co-wrote with Jason Reitman.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Ghostbusters_%282024%29_poster.jpg/220px-Ghostbusters_%282024%29_poster.jpg',
//         director: {
//             name:'Gil Kenan',
//             description:'(born October 16, 1976)[1] is a British–American filmmaker. He is best known for directing the films Monster House (2006) and Ghostbusters: Frozen Empire (2024), the former of which was nominated for the Academy Award for Best Animated Feature.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Logan',
//         description: '2017 American superhero film starring Hugh Jackman as the titular character',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Logan_2017_poster.jpg',
//         director: {
//             name:'James Allen Mangold',
//             description:'(born December 16, 1963) is an American film director, producer and screenwriter.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Aquaman and the Lost Kingdom',
//         description: '2023 American superhero film based on the DC Comics character Aquaman.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Aquaman_and_the_Lost_Kingdom_poster.jpg/220px-Aquaman_and_the_Lost_Kingdom_poster.jpg',
//         director: {
//             name:'James Wan',
//             description:'(born 26 February 1977) is an Australian filmmaker. He has primarily worked in the horror genre as the co-creator of the Saw and Insidious franchises and the creator of The Conjuring Universe.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
//     {
//         title: 'Star Trek Into Darkness',
//         description: '2013 American science fiction action film directed by J. J. Abrams and written by Roberto Orci, Alex Kurtzman, and Damon Lindelof.',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/StarTrekIntoDarkness_FinalUSPoster.jpg/220px-StarTrekIntoDarkness_FinalUSPoster.jpg',
//         director: {
//             name:'Jeffrey Jacob Abrams',
//             description:'(born June 27, 1966)[1] is an American filmmaker and composer.',
//         },
//         genre: {
//             name:'scifi',
//             description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
//         },
//     },
// ];

    // const newUser = req.body;

    // if (newUser.name){
    //     newUser.id = uuid.v4();
    //     users.push(newUser);
    //     res.status(201).json(newUser)
    // } else{
    //     res.status(400).send('users need names')
    // }   
    // })
    //delete User ID
// app.delete('/users/:id',(req,res) => {
//     const { id, } = req.params;

//     let user = users.find(user => user.id == id);

//    if(user){
//     users = users.filter(user => user.id != id)
//     res.status(200).send(`user ${id} has been deleted`);
//    }else{
//     res.status(400).send('no such user')
//    }
//     })

//add Favorite Movie
// app.post('/users/:id/:movietitle',(req,res) => {
//     const { id, movietitle } = req.params;
//     console.log(`Received request to add movie "${movietitle}" for user with ID: ${id}`);

//     let user = users.find(user => user.id == id);

//    if(user){
//     user.favoriteMovies.push(movietitle);
//     res.status(200).send(`${movietitle} has been added to user ${id}'s array`);;
//    }else{
//     res.status(400).send('no such user')
//    }
// })

//Get route for users
// app.get('/users', (req, res) => {
//     res.status(200).json(users);
// });
//update Users
// app.put('/users/:id',(req,res) =>{
//     const { id } = req.params;
//     const updatedUser = req.body;
    
//    let user = users.find(user => user.id == id);

//    if(user){
//     user.name=updatedUser.name;
//     res.status(200).send(`user ${id} has been updated`);
//    }else{
//     res.status(400).send('no such user')
//    }
//     })