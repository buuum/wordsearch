var wordsearch;

wordsearch = (function() {
  function wordsearch($words, orientations) {
    var defaultOrientations;
    if (orientations == null) {
      orientations = false;
    }
    this.letters = "AABBCCDDEEFFGGHHIIJKLLMMNNOOPPQRSSTTUUVWXYZ";
    defaultOrientations = ['horizontal', 'horizontalBack', 'vertical', 'verticalUp', 'diagonal', 'diagonalUp', 'diagonalBack', 'diagonalUpBack'];
    if (orientations) {
      this.allOrientations = orientations;
    } else {
      this.allOrientations = defaultOrientations;
    }
    this.wordList = this.parseWords($words);
    this.orientations = {
      horizontal: function(x, y, i) {
        return {
          x: x + i,
          y: y
        };
      },
      horizontalBack: function(x, y, i) {
        return {
          x: x - i,
          y: y
        };
      },
      vertical: function(x, y, i) {
        return {
          x: x,
          y: y + i
        };
      },
      verticalUp: function(x, y, i) {
        return {
          x: x,
          y: y - i
        };
      },
      diagonal: function(x, y, i) {
        return {
          x: x + i,
          y: y + i
        };
      },
      diagonalBack: function(x, y, i) {
        return {
          x: x - i,
          y: y + i
        };
      },
      diagonalUp: function(x, y, i) {
        return {
          x: x + i,
          y: y - i
        };
      },
      diagonalUpBack: function(x, y, i) {
        return {
          x: x - i,
          y: y - i
        };
      }
    };
    this.checkOrientations = {
      horizontal: function(x, y, h, w, l) {
        return w >= x + l;
      },
      horizontalBack: function(x, y, h, w, l) {
        return x + 1 >= l;
      },
      vertical: function(x, y, h, w, l) {
        return h >= y + l;
      },
      verticalUp: function(x, y, h, w, l) {
        return y + 1 >= l;
      },
      diagonal: function(x, y, h, w, l) {
        return w >= x + l && h >= y + l;
      },
      diagonalBack: function(x, y, h, w, l) {
        return x + 1 >= l && h >= y + l;
      },
      diagonalUp: function(x, y, h, w, l) {
        return w >= x + l && y + 1 >= l;
      },
      diagonalUpBack: function(x, y, h, w, l) {
        return x + 1 >= l && y + 1 >= l;
      }
    };
    this.skipOrientations = {
      horizontal: function(x, y, l) {
        return {
          x: 0,
          y: y + 1
        };
      },
      horizontalBack: function(x, y, l) {
        return {
          x: l - 1,
          y: y
        };
      },
      vertical: function(x, y, l) {
        return {
          x: 0,
          y: y + 100
        };
      },
      verticalUp: function(x, y, l) {
        return {
          x: 0,
          y: l - 1
        };
      },
      diagonal: function(x, y, l) {
        return {
          x: 0,
          y: y + 1
        };
      },
      diagonalBack: function(x, y, l) {
        return {
          x: l - 1,
          y: x >= l - 1 ? y + 1 : y
        };
      },
      diagonalUp: function(x, y, l) {
        return {
          x: 0,
          y: y < l - 1 ? l - 1 : y + 1
        };
      },
      diagonalUpBack: function(x, y, l) {
        return {
          x: l - 1,
          y: x >= l - 1 ? y + 1 : y
        };
      }
    };
  }

  wordsearch.prototype.parseWords = function(words) {
    words = words.map(function(x) {
      return x.toUpperCase();
    });
    return words.slice(0).sort(function(a, b) {
      var base;
      return typeof (base = a.length < b.length) === "function" ? base({
        1: 0
      }) : void 0;
    });
  };

  wordsearch.prototype.fillPuzzle = function(words, options) {
    var i, j, len, puzzle;
    puzzle = [];
    i = void 0;
    j = void 0;
    len = void 0;
    i = 0;
    while (i < options.height) {
      puzzle.push([]);
      j = 0;
      while (j < options.width) {
        puzzle[i].push('');
        j++;
      }
      i++;
    }
    i = 0;
    len = words.length;
    while (i < len) {
      if (!this.placeWordInPuzzle(puzzle, options, words[i])) {
        return null;
      }
      i++;
    }
    return puzzle;
  };

  wordsearch.prototype.placeWordInPuzzle = function(puzzle, options, word) {
    var locations, sel;
    locations = this.findBestLocations(puzzle, options, word);
    if (locations.length === 0) {
      return false;
    }
    sel = locations[Math.floor(Math.random() * locations.length)];
    this.placeWord(puzzle, word, sel.x, sel.y, this.orientations[sel.orientation]);
    return true;
  };

  wordsearch.prototype.generate = function(options) {
    var attempts, default_options, puzzle;
    if (options == null) {
      options = {};
    }
    puzzle;
    default_options = {
      height: this.wordList[0].length,
      width: this.wordList[0].length,
      orientations: this.allOrientations,
      fillBlanks: true,
      maxAttempts: 3,
      preferOverlap: true
    };
    options = $.extend(default_options, options);
    if (!options.height) {
      options.height = this.wordList[0].length;
    }
    if (!options.width) {
      options.width = this.wordList[0].length;
    }
    while (!puzzle) {
      while (!puzzle && attempts++ < options.maxAttempts) {
        puzzle = this.fillPuzzle(this.wordList, options);
      }
      if (!puzzle) {
        options.height++;
        options.width++;
        attempts = 0;
      }
    }
    if (options.fillBlanks) {
      this.fillBlanks(puzzle, options);
    }
    return puzzle;
  };

  wordsearch.prototype.findBestLocations = function(puzzle, options, word) {
    var check, height, k, len, locations, maxOverlap, next, nextPossible, orientation, overlap, skipTo, width, wordLength, x, y;
    locations = [];
    height = options.height;
    width = options.width;
    wordLength = word.length;
    maxOverlap = 0;
    k = 0;
    len = options.orientations.length;
    while (k < len) {
      orientation = options.orientations[k];
      check = this.checkOrientations[orientation];
      next = this.orientations[orientation];
      skipTo = this.skipOrientations[orientation];
      x = 0;
      y = 0;
      while (y < height) {
        if (check(x, y, height, width, wordLength)) {
          overlap = this.calcOverlap(word, puzzle, x, y, next);
          if (overlap >= maxOverlap || !options.preferOverlap && overlap > -1) {
            maxOverlap = overlap;
            locations.push({
              x: x,
              y: y,
              orientation: orientation,
              overlap: overlap
            });
          }
          x++;
          if (x >= width) {
            x = 0;
            y++;
          }
        } else {
          nextPossible = skipTo(x, y, wordLength);
          x = nextPossible.x;
          y = nextPossible.y;
        }
      }
      k++;
    }
    if (options.preferOverlap) {
      return this.pruneLocations(locations, maxOverlap);
    } else {
      return locations;
    }
  };

  wordsearch.prototype.calcOverlap = function(word, puzzle, x, y, fnGetSquare) {
    var i, len, next, overlap, square;
    overlap = 0;
    i = 0;
    len = word.length;
    while (i < len) {
      next = fnGetSquare(x, y, i);
      square = puzzle[next.y][next.x];
      if (square === word[i]) {
        overlap++;
      } else if (square !== '') {
        return -1;
      }
      i++;
    }
    return overlap;
  };

  wordsearch.prototype.pruneLocations = function(locations, overlap) {
    var i, len, pruned;
    pruned = [];
    i = 0;
    len = locations.length;
    while (i < len) {
      if (locations[i].overlap >= overlap) {
        pruned.push(locations[i]);
      }
      i++;
    }
    return pruned;
  };

  wordsearch.prototype.placeWord = function(puzzle, word, x, y, fnGetSquare) {
    var i, len, next;
    i = 0;
    len = word.length;
    while (i < len) {
      next = fnGetSquare(x, y, i);
      puzzle[next.y][next.x] = word[i];
      i++;
    }
  };

  wordsearch.prototype.fillBlanks = function(puzzle) {
    var height, i, j, randomLetter, row, width;
    i = 0;
    height = puzzle.length;
    while (i < height) {
      row = puzzle[i];
      j = 0;
      width = row.length;
      while (j < width) {
        if (!puzzle[i][j]) {
          randomLetter = Math.floor(Math.random() * this.letters.length);
          puzzle[i][j] = this.letters[randomLetter];
        }
        j++;
      }
      i++;
    }
  };

  wordsearch.prototype.print = function(puzzle) {
    var height, i, j, puzzleString, row, width;
    puzzleString = '';
    i = 0;
    height = puzzle.length;
    while (i < height) {
      row = puzzle[i];
      j = 0;
      width = row.length;
      while (j < width) {
        puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
        j++;
      }
      puzzleString += '\n';
      i++;
    }
    console.log(puzzleString);
    return puzzleString;
  };

  wordsearch.prototype.checkWord = function(classname) {
    var find, selected_word;
    find = false;
    selected_word = '';
    $.each($(classname), function(i, el) {
      return selected_word += $(el).text();
    });
    $.each(this.wordList, (function(_this) {
      return function(i, el) {
        if (el === selected_word || el === _this.reverse(selected_word)) {
          find = _this.wordList.splice(i, 1);
          return find = find[0];
        }
      };
    })(this));
    return find;
  };

  wordsearch.prototype.reverse = function(s) {
    return s.split("").reverse().join("");
  };

  return wordsearch;

})();
