var Game;

Game = (function() {
  function Game(words, options) {
    var default_options;
    if (options == null) {
      options = {};
    }
    default_options = {
      container_game: '.game',
      container_words: '.words',
      select_class: '.highlighted',
      button_class: '.puzzleSquare',
      selected_word_clas: '.through',
      orientations: false,
      onFindWord: function(word) {},
      onEndGame: function(time) {}
    };
    this.options = $.extend(default_options, options);
    this.start_time = 0;
    this.selection = false;
    this.count_resolved = words.length;
    this.isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      this.isMobile = true;
    }
    this.wordsearch = new wordsearch(words, this.options.orientations);
  }

  Game.prototype.initialize = function(min_rows, min_columns) {
    if (min_rows == null) {
      min_rows = false;
    }
    if (min_columns == null) {
      min_columns = false;
    }
    this.renderPuzzle(this.wordsearch.generate({
      height: min_columns,
      width: min_rows
    }));
    this.renderWords();
    return this.start_time = new Date().getTime();
  };

  Game.prototype.renderWords = function() {
    var ul;
    ul = $('<ul />');
    $.each(this.wordsearch.wordList, (function(_this) {
      return function(i, el) {
        var li;
        li = $('<li />').text(el);
        li.attr('data-name', el);
        return ul.append(li);
      };
    })(this));
    return $(this.options.container_words).append(ul);
  };

  Game.prototype.renderPuzzle = function(puzzle) {
    var height, i, j, output, row, width;
    output = '';
    i = 0;
    height = puzzle.length;
    while (i < height) {
      row = puzzle[i];
      output += '<ul>';
      j = 0;
      width = row.length;
      while (j < width) {
        output += '<li class="' + this.name(this.options.button_class) + '" x="' + j + '" y="' + i + '">';
        output += row[j] || '&nbsp;';
        output += '</li>';
        j++;
      }
      output += '</ul>';
      i++;
    }
    $(this.options.container_game).append(output);
    return this.initializeEvents();
  };

  Game.prototype.initializeEvents = function() {
    if (this.isMobile) {
      $(this.options.container_game).on('touchmove', (function(_this) {
        return function(evt) {
          return _this.onMove(_this.gic(evt.originalEvent.touches[0].pageX, evt.originalEvent.touches[0].pageY));
        };
      })(this));
      $(this.options.container_game).on('touchend', (function(_this) {
        return function() {
          return _this.onEnd();
        };
      })(this));
      return $(this.options.container_game).on('touchstart', (function(_this) {
        return function(evt) {
          return _this.onStart($(evt.target), evt);
        };
      })(this));
    } else {
      $(this.options.button_class).on('mouseover', (function(_this) {
        return function(evt) {
          return _this.onMove($(evt.target));
        };
      })(this));
      $(this.options.button_class).on('mouseup', (function(_this) {
        return function() {
          return _this.onEnd();
        };
      })(this));
      return $(this.options.button_class).on('mousedown', (function(_this) {
        return function(evt) {
          return _this.onStart($(evt.target), evt);
        };
      })(this));
    }
  };

  Game.prototype.onStart = function(gridItem, evt) {
    var x, y;
    x = gridItem.attr("x").toString();
    y = gridItem.attr("y").toString();
    gridItem.addClass(this.name(this.options.select_class));
    this.selection = {
      dist: 0
    };
    this.selection.start = {
      item: gridItem,
      x: x,
      y: y
    };
    evt.preventDefault();
    return false;
  };

  Game.prototype.onMove = function(gridItem) {
    var x, y;
    if (this.selection === false) {
      return;
    }
    x = gridItem.attr("x").toString();
    y = gridItem.attr("y").toString();
    this.selection.current = {
      item: gridItem,
      x: x,
      y: y
    };
    $(this.options.select_class).removeClass(this.name(this.options.select_class));
    return this.drawGridLine(this.selection.start, this.selection.current);
  };

  Game.prototype.onEnd = function() {
    var word;
    if (word = this.wordsearch.checkWord(this.options.select_class)) {
      this.findWord(word);
    }
    this.selection = false;
    return $(this.options.select_class).removeClass(this.name(this.options.select_class));
  };

  Game.prototype.findWord = function(word) {
    var time;
    $(this.options.select_class).addClass('find');
    $(this.options.select_class).addClass('r' + this.count_resolved);
    this.count_resolved--;
    $(this.options.container_words).find("[data-name='" + word + "']").addClass(this.name(this.options.selected_word_clas));
    this.options.onFindWord(word);
    if (this.count_resolved <= 0) {
      time = new Date().getTime();
      return this.options.onEndGame((time - this.start_time) / 1000);
    }
  };

  Game.prototype.gic = function(x, y) {
    var c;
    c = $(this.options.container_game).offset();
    x = Math.floor((x - c.left) / ($(this.options.button_class).outerWidth(true)));
    y = Math.floor((y - c.top) / ($(this.options.button_class).outerHeight(true)));
    return this.gi(x, y);
  };

  Game.prototype.gi = function(x, y) {
    return $(this.options.button_class + "[x=" + x + "][y=" + y + "]");
  };

  Game.prototype.drawGridLine = function(start, end) {
    var dx, dy, e2, err, sx, sy, x0, x1, y0, y1;
    x0 = parseInt(start.x);
    y0 = parseInt(start.y);
    x1 = parseInt(end.x);
    y1 = parseInt(end.y);
    dx = Math.abs(x1 - x0);
    dy = Math.abs(y1 - y0);
    sx = x0 < x1 ? 1 : -1;
    sy = y0 < y1 ? 1 : -1;
    err = dx - dy;
    this.selection.dist = 0;
    while (true) {
      this.selection.dist++;
      this.gi(x0, y0).addClass(this.name(this.options.select_class));
      if (x0 === x1 && y0 === y1) {
        break;
      }
      e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  Game.prototype.name = function(name) {
    return name.substr(1);
  };

  return Game;

})();
