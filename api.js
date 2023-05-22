const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
  .catch(error => console.error('Erro ao conectar ao MongoDB:', error));

// Definição do esquema do filme
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number
});

// Modelo do filme
const Movie = mongoose.model('Movie', movieSchema);

// Rota GET /api/movies - Retorna todos os filmes
app.get('/api/movies', (req, res) => {
  Movie.find({}, (error, movies) => {
    if (error) {
      console.error('Erro ao buscar os filmes:', error);
      res.status(500).json({ message: 'Erro ao buscar os filmes' });
    } else {
      res.json(movies);
    }
  });
});

// Rota GET /api/movies/:id - Retorna um filme específico com base no ID
app.get('/api/movies/:id', (req, res) => {
  const id = req.params.id;
  Movie.findById(id, (error, movie) => {
    if (error) {
      console.error('Erro ao buscar o filme:', error);
      res.status(500).json({ message: 'Erro ao buscar o filme' });
    } else if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Filme não encontrado' });
    }
  });
});

// Rota POST /api/movies - Cria um novo filme
app.post('/api/movies', (req, res) => {
  const { title, director, year } = req.body;
  const newMovie = new Movie({ title, director, year });
  newMovie.save((error, movie) => {
    if (error) {
      console.error('Erro ao criar o filme:', error);
      res.status(500).json({ message: 'Erro ao criar o filme' });
    } else {
      res.status(201).json(movie);
    }
  });
});

// Rota PUT /api/movies/:id - Atualiza um filme existente
app.put('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    const { title, director, year } = req.body;
    Movie.findByIdAndUpdate(id, { title, director, year }, { new: true }, (error, movie) => {
      if (error) {
        console.error('Erro ao atualizar o filme:', error);
        res.status(500).json({ message: 'Erro ao atualizar o filme' });
      } else if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: 'Filme não encontrado' });
      }
    });
  });
  