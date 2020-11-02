var ROCKET_LEAGUE_SEASON = 15;

function fetchMMR() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All Players");  
    const data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
        // @todo normalize these values so it can accept e.g "steam" "Steam" etc.
        var platform = data[i][0];
        
        var search = data[i][1];
      
        Logger.log("Ones rank: " + getOnesRank(platform, search)); 
        Logger.log("Twos rank: " + getTwosRank(platform, search)); 
        Logger.log("Threes rank: " + getThreesRank(platform, search)); 
    }
}

function getOnesRank(platform, name) {
  return getRank(platform, name, "Ranked Duel 1v1");
}

function getTwosRank(platform, name) {
  return getRank(platform, name, "Ranked Doubles 2v2");
}

function getThreesRank(platform, name) {
  return getRank(platform, name, "Ranked Standard 3v3");
}

function getRank(platform, name, rank) {
  var season = ROCKET_LEAGUE_SEASON;

  var player_stats = getStats(platform, name);
  
  for(var j = 0; j < player_stats.data.segments.length; j++) {
    var segment = player_stats.data.segments[j];
    
    if(segment.type == "playlist" && segment.attributes.season == season) {
      if(segment.metadata.name == rank) {
        return segment.stats.rating.value; 
      }
    }
  }
  
  return null;
}

function getStats(platform, name) { 
  var cache = CacheService.getDocumentCache(); 
  var key = platform + "/" + name;
  var player = JSON.parse(cache.get(key));
  
  if(player == null) { 
    var player_data = fetchPlayer(platform, name);
  
    var player_id;
    
    player_id = player_data.data[0].platformUserIdentifier;
  
    player = fetchStats(platform, player_id);
  
    // cache API output for 24 hours.
    cache.put(key, JSON.stringify(player), 60 * 60 * 24);
  }
  
  return player;
} 

function fetchPlayer(platform, name) {
  const endpoint = "https://api.tracker.gg/api/v2/rocket-league/standard/search?platform=" + platform + "&query=" + name + "&autocomplete=true"
 
  var data = null;
  
  try {
    data = JSON.parse(UrlFetchApp.fetch(endpoint).getContentText());
  } catch (ex) {
    
  }

  return data;
}

function fetchStats(platform, player) { 
  const endpoint = "https://api.tracker.gg/api/v2/rocket-league/standard/profile/" + platform + "/" + player;

  var data = null;
  
  try {
    data = JSON.parse(UrlFetchApp.fetch(endpoint).getContentText());
  } catch (ex) {
    
  }
  
  return data;
}

