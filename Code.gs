function fetchMMR() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All Players");  
    const data = sheet.getDataRange().getValues();
    const season = 15;

    for (var i = 1; i < data.length; i++) {
        // @todo normalize these values so it can accept e.g "steam" "Steam" etc.
        var platform = data[i][0];
        
        var search = data[i][1];
      
        var player_data = fetchPlayer(platform, search);
      
        var player;
      
        // @todo make this work for platforms that aren't steam.
        if(platform == "steam") {
          player = player_data.data[0].platformUserIdentifier;
        }
      
        var player_stats = fetchStats(platform, player);
      
        for(var j = 0; j < player_stats.data.segments.length; j++) {
          var segment = player_stats.data.segments[j];
          
          if(segment.type == "playlist" && segment.attributes.season == season) {
            if(segment.metadata.name == "Ranked Duel 1v1") {
              Logger.log("Ones rank: " + segment.stats.rating.value); 
            }

            if(segment.metadata.name == "Ranked Doubles 2v2") {
              Logger.log("Twos rank: " + segment.stats.rating.value); 
            }
            
            if(segment.metadata.name == "Ranked Standard 3v3") {
              Logger.log("Threes rank: " + segment.stats.rating.value); 
            }
          }
        }
    }
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