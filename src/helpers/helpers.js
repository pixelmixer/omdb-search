import React from 'react'
import { IMDB_ACTOR_SEARCH } from '../constants/constants';

// Inputs a string of actors, comma seperated and returns an array of JSX anchor tags with links to an IMDB search page with their name prepopulated.
// I couldn't find a very good place to get actor details directly with a short turnaround so I compromised by including the search.
const decorateActorNames = (actors) => actors.split(', ').map((actor, index, actors) => <span key={`actor-${index}`}><a target="_blank" href={`${IMDB_ACTOR_SEARCH}${actor}`}>{actor}</a>{(index < actors.length - 1) && ', ' }</span>)

export { decorateActorNames }
