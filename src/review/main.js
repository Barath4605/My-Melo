import { searchAlbum } from "./search-logic/search.js";
searchAlbum();

import { favorite } from "./fav-logic/fav.js";
favorite();

import { queue } from "./queue-logic/queue.js";
queue();

import { highlightStar, removeRating, selectedRating } from "./rating-stars/star-highlight.js";
highlightStar();
selectedRating();
removeRating();

import { tracklist } from "./tracklist/tracklist.js";
tracklist();
