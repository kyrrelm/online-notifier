// Generated by CoffeeScript 1.4.0
(function() {
  var $, createBusDataRequest, displayItems, findUpdatedPosts, insertBusInfo, iteration, listDinners, ls, mainLoop, newsLimit, updateBus, updateCantinas, updateCoffee, updateHours, updateMeetings, updateNews, updateOffice, updateServant,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  ls = localStorage;

  iteration = 0;

  newsLimit = 8;

  mainLoop = function() {
    if (DEBUG) {
      console.log("\n#" + iteration);
    }
    if (iteration % UPDATE_OFFICE_INTERVAL === 0 && ls.showOffice === 'true') {
      updateOffice();
    }
    if (iteration % UPDATE_SERVANT_INTERVAL === 0 && ls.showOffice === 'true') {
      updateServant();
    }
    if (iteration % UPDATE_MEETINGS_INTERVAL === 0 && ls.showOffice === 'true') {
      updateMeetings();
    }
    if (iteration % UPDATE_COFFEE_INTERVAL === 0 && ls.showOffice === 'true') {
      updateCoffee();
    }
    if (iteration % UPDATE_CANTINAS_INTERVAL === 0 && ls.showCantina === 'true') {
      updateCantinas();
    }
    if (iteration % UPDATE_HOURS_INTERVAL === 0 && ls.showCantina === 'true') {
      updateHours();
    }
    if (iteration % UPDATE_BUS_INTERVAL === 0 && ls.showBus === 'true') {
      updateBus();
    }
    if (iteration % UPDATE_NEWS_INTERVAL === 0) {
      updateNews();
    }
    if (10000 < iteration) {
      iteration = 0;
    } else {
      iteration++;
    }
    return setTimeout((function() {
      return mainLoop();
    }), PAGE_LOOP);
  };

  updateOffice = function() {
    if (DEBUG) {
      console.log('updateOffice');
    }
    return Office.get(function(status, title, message) {
      if (ls.currentStatus !== status || ls.currentStatusMessage !== message) {
        $('#office img').attr('src', 'img/status-' + status + '.png');
        $('#office #subtext').html(message);
        ls.currentStatus = status;
        return ls.currentStatusMessage = message;
      }
    });
  };

  updateServant = function() {
    if (DEBUG) {
      console.log('updateServant');
    }
    return Servant.get(function(servant) {
      return $('#todays #schedule #servant').html('- ' + servant);
    });
  };

  updateMeetings = function() {
    if (DEBUG) {
      console.log('updateMeetings');
    }
    return Meetings.get(function(meetings) {
      meetings = meetings.replace(/\n/g, '<br />');
      return $('#todays #schedule #meetings').html(meetings);
    });
  };

  updateCoffee = function() {
    if (DEBUG) {
      console.log('updateCoffee');
    }
    return Coffee.get(true, function(pots, age) {
      $('#todays #coffee #pots').html('- ' + pots);
      return $('#todays #coffee #age').html(age);
    });
  };

  updateNews = function() {
    var chosenAffiliation, feedItems;
    if (DEBUG) {
      console.log('updateNews');
    }
    feedItems = ls.feedItems;
    if (feedItems !== void 0) {
      return displayItems(JSON.parse(feedItems));
    } else {
      chosenAffiliation = ls.affiliationName;
      return $('#news').html('<div class="post"><div class="title">Nyheter</div><div class="item">Frakoblet fra ' + chosenAffiliation + '</div></div>');
    }
  };

  displayItems = function(items) {
    var feedName, index, link, mostRecent, newsList, updatedList, viewedList, _results;
    mostRecent = items[0].link;
    ls.mostRecentRead = mostRecent;
    $('#news').html('');
    feedName = items.feedName;
    newsList = JSON.parse(ls.newsList);
    viewedList = JSON.parse(ls.viewedNewsList);
    updatedList = findUpdatedPosts(viewedList, newsList);
    viewedList = [];
    $.each(items, function(index, item) {
      var altLink, date, htmlItem, _ref;
      if (index < newsLimit) {
        viewedList.push(item.link);
        htmlItem = '<div class="post"><div class="title">';
        if (index < ls.unreadCount) {
          if (_ref = item.link, __indexOf.call(updatedList.indexOf, _ref) >= 0) {
            htmlItem += '<span class="unread">UPDATED <b>::</b> </span>';
          } else {
            htmlItem += '<span class="unread">NEW <b>::</b> </span>';
          }
        }
        date = altLink = '';
        if (item.date !== null) {
          date = ' den ' + item.date;
        }
        if (item.altLink !== null) {
          altLink = ' name="' + item.altLink + '"';
        }
        htmlItem += item.title + '\
        </div>\
          <div class="item" data="' + item.link + '"' + altLink + '>\
            <img src="' + item.image + '" width="107" />\
            <div class="textwrapper">\
              <div class="emphasized">- Skrevet av ' + item.creator + date + '</div>\
              ' + item.description + '\
            </div>\
          </div>\
        </div>';
        return $('#news').append(htmlItem);
      }
    });
    ls.viewedNewsList = JSON.stringify(viewedList);
    Browser.setBadgeText('');
    ls.unreadCount = 0;
    $('.item').click(function() {
      Browser.openTab($(this).attr('data'));
      return window.close();
    });
    if (feedName === 'online') {
      _results = [];
      for (index in viewedList) {
        link = viewedList[index];
        _results.push(News.online_getImage(link, function(link, image) {
          var altLink;
          $('.item[data="' + link + '"] img').attr('src', image);
          altLink = $('.item[data="' + link + '"]').attr('name');
          if (altLink !== 'null') {
            return $('.item[data="' + link + '"]').attr('data', altLink);
          }
        }));
      }
      return _results;
    }
  };

  findUpdatedPosts = function(viewedList, newsList) {
    var news, updatedList, viewed, _i, _j, _len, _len1;
    updatedList = [];
    for (_i = 0, _len = viewedList.length; _i < _len; _i++) {
      viewed = viewedList[_i];
      for (_j = 0, _len1 = newsList.length; _j < _len1; _j++) {
        news = newsList[_j];
        if (viewedList[viewed] === newsList[news]) {
          updatedList.push(viewedList[viewed]);
        }
      }
    }
    return updatedList;
  };

  updateBus = function() {
    if (DEBUG) {
      console.log('updateBus');
    }
    if (!navigator.onLine) {
      $('#bus #first_bus .name').html(ls.first_bus_name);
      $('#bus #second_bus .name').html(ls.second_bus_name);
      $('#bus #first_bus .first .line').html('<div class="error">Frakoblet fra api.visuweb.no</div>');
      return $('#bus #second_bus .first .line').html('<div class="error">Frakoblet fra api.visuweb.no</div>');
    } else {
      createBusDataRequest('first_bus', '#first_bus');
      return createBusDataRequest('second_bus', '#second_bus');
    }
  };

  createBusDataRequest = function(bus, cssIdentificator) {
    var activeLines;
    activeLines = ls[bus + '_active_lines'];
    activeLines = JSON.parse(activeLines);
    return Bus.get(ls[bus], activeLines, function(lines) {
      return insertBusInfo(lines, ls[bus + '_name'], cssIdentificator);
    });
  };

  insertBusInfo = function(lines, stopName, cssIdentificator) {
    var busStop, i, spans, _results;
    busStop = '#bus ' + cssIdentificator;
    spans = ['first', 'second', 'third', 'fourth'];
    $(busStop + ' .name').html(stopName);
    for (i in spans) {
      $(busStop + ' .' + spans[i] + ' .line').html('');
      $(busStop + ' .' + spans[i] + ' .time').html('');
    }
    if (typeof lines === 'string') {
      return $(busStop + ' .first .line').html('<div class="error">' + lines + '</div>');
    } else {
      if (lines['departures'].length === 0) {
        return $(busStop + ' .first .line').html('<div class="error">....zzzZZZzzz....</div>');
      } else {
        _results = [];
        for (i in spans) {
          $(busStop + ' .' + spans[i] + ' .line').append(lines['destination'][i]);
          _results.push($(busStop + ' .' + spans[i] + ' .time').append(lines['departures'][i]));
        }
        return _results;
      }
    }
  };

  updateCantinas = function() {
    if (DEBUG) {
      console.log('updateCantinas');
    }
    Cantina.get(ls.left_cantina, function(menu) {
      $('#cantinas #left .title').html(ls.left_cantina);
      return $('#cantinas #left #dinnerbox').html(listDinners(menu));
    });
    return Cantina.get(ls.right_cantina, function(menu) {
      $('#cantinas #right .title').html(ls.right_cantina);
      return $('#cantinas #right #dinnerbox').html(listDinners(menu));
    });
  };

  listDinners = function(menu) {
    var dinner, dinnerlist, _i, _len;
    dinnerlist = '';
    if (typeof menu === 'string') {
      dinnerlist += '<li>' + menu + '</li>';
    } else {
      for (_i = 0, _len = menu.length; _i < _len; _i++) {
        dinner = menu[_i];
        if (dinner.price !== null) {
          dinner.price = dinner.price + ',- ';
          dinnerlist += '<li id="' + dinner.index + '">' + dinner.price + dinner.text + '</li>';
        } else {
          dinnerlist += '<li class="message" id="' + dinner.index + '">"' + dinner.text + '"</li>';
        }
      }
    }
    return dinnerlist;
  };

  updateHours = function() {
    if (DEBUG) {
      console.log('updateHours');
    }
    Hours.get(ls.left_cantina, function(hours) {
      return $('#cantinas #left .hours').html(hours);
    });
    return Hours.get(ls.right_cantina, function(hours) {
      return $('#cantinas #right .hours').html(hours);
    });
  };

  $(function() {
    var html;
    if (DEBUG) {
      $('html').css('cursor', 'auto');
      $('#overlay').hide();
    }
    $.ajaxSetup({
      timeout: AJAX_TIMEOUT
    });
    ls.removeItem('mostRecentRead');
    ls.removeItem('currentStatus');
    ls.removeItem('currentStatusMessage');
    if (ls.showOffice !== 'true') {
      $('#office').hide();
    }
    if (ls.showOffice !== 'true') {
      $('#todays').hide();
    }
    if (ls.showCantina !== 'true') {
      $('#cantinas').hide();
    }
    if (ls.showBus !== 'true') {
      $('#bus').hide();
    }
    if (OPERATING_SYSTEM === 'Windows') {
      $('#pagefliptext').attr("style", "bottom:9px;");
      $('#pagefliplink').attr("style", "bottom:9px;");
    }
    html = $('#pagefliplink').html().replace(/__creator__/g, CREATOR_NAME);
    $('#pagefliplink').html(html);
    setInterval((function() {
      return $(".pageflipcursor").animate({
        opacity: 0
      }, "fast", "swing", function() {
        return $(this).animate({
          opacity: 1
        }, "fast", "swing");
      });
    }), 600);
    setInterval((function() {
      var hours, minutes, _d;
      _d = new Date();
      minutes = _d.getMinutes();
      hours = _d.getHours();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      $("#bus #clock #minutes").html(minutes);
      return $("#bus #clock #hours").html(hours);
    }), 1000);
    setInterval((function() {
      var linebreaks, num, random;
      random = Math.ceil(Math.random() * 25);
      linebreaks = ((function() {
        var _i, _results;
        _results = [];
        for (num = _i = 0; 0 <= random ? _i <= random : _i >= random; num = 0 <= random ? ++_i : --_i) {
          _results.push('<br />');
        }
        return _results;
      })()).join(' ');
      $('#overlay').html(linebreaks + 'preventing image burn-in...');
      $('#overlay').css('opacity', 1);
      return setTimeout((function() {
        return $('#overlay').css('opacity', 0);
      }), 3500);
    }), 1800000);
    if (!DEBUG) {
      setTimeout((function() {
        return document.location.reload();
      }), 3600000);
    }
    return mainLoop();
  });

}).call(this);
