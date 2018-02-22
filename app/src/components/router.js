import routie from './routie'
import transparency from './transparency'
import sections from './sections'
import helpers from './helpers'
import api from './api'

const router = {
	init() {
		routie({
			'home': function() {
				sections.toggle("home")
			},
			'pokemon': function() {
				sections.toggle("pokemon")
				helpers.toggleLoader()
				api.call('https://pokeapi.co/api/v2/pokemon/?limit=151')
					.then((data) => {
						helpers.toggleLoader()
						const directives = {
							name: {
								href() {
									return `#pokemon/${this.name}`
								}
							}
						}

						let dataPokemon = data.results.map(function(i) {
							return {
								name: i.name,
								url: i.url,
								count: (0+i)
							}
						}).sort((a, b) => a.name.localeCompare(b.name))

						const pokemonInput = document.querySelector('#pokemon > input')

						pokemonInput.addEventListener('keyup', (e) => {
							const filteredPokemon = dataPokemon.filter((x, i) => {
								return x.name.startsWith(e.target.value)
							})

							Transparency.render(document.querySelector('#pokemon-list'), filteredPokemon, directives)
							document.querySelector('#pokemon > p').innerHTML = filteredPokemon.length
						})

						Transparency.render(document.querySelector('#pokemon-list'), dataPokemon, directives)
						document.querySelector('#pokemon > p').innerHTML = dataPokemon.length
					})
					.catch(reason => console.log(reason.message))
			},
			'pokemon/?:name': function(name) {
				helpers.toggleLoader()
				api.call(`https://pokeapi.co/api/v2/pokemon/${name}`).then((data) => {
					helpers.toggleLoader()
					// extract the pokemon data
					const pokeDetails = {
						name: data.name,
						id: data.id,
						sprite: data.sprites.front_default
					}
					// additional data for the html element
					const directives = {
						sprite: {
							src() {
								return `${this.sprite}`
							},
							alt() {
								// still providing a dynamic alt
								return `A sprite image of the pokemon ${this.name}`
							}
						}
					}

					sections.toggle(name)
					document.querySelector('#pokemon-detail').classList.remove('hidden')
					document.querySelector('#pokemon > input').value = ''
					Transparency.render(document.querySelector('#pokemon-detail'), pokeDetails, directives)
				})
			}
		})
	},
	checkHash() {
		if (window.location.hash) {
			sections.toggle(helpers.splitHash(location.hash))
		} else {
			document.querySelector('#home').classList.remove('hidden')
		}
	}
}

export default router