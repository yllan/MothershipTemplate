$(function() {
  document.title = mothership.app
  $("#app-name").text(mothership.app)

  /* 
    "2.1" => [2, 1, 0]
    "2.1.5" => [2, 1, 5]
  */
  var parsedVersion = function(rawVersion) {
    var result = rawVersion.match(/(\d+)(\.(\d+))?(\.(\d+))?/)
    if (result == null) return [0, 0, 0]
    if (result[5] == undefined) result[5] = 0;
    if (result[3] == undefined) result[3] = 0;
    if (result[1] == undefined) result[1] = 0;
    return [result[1] - 0, result[3] - 0, result[5] - 0]
  }

  // ascending
  mothership.versions.sort(function (r1, r2) {
    var v1 = parsedVersion(r1.version)
    var v2 = parsedVersion(r2.version)
    
    for (var idx = 0; idx < 3; idx++) {
      if (v1[idx] > v2[idx]) return 1;
      else if (v1[idx] < v2[idx]) return -1;
    };
    return 0;
  })

  $.each(mothership.versions, function(idx, version) {
    var version_div = $('<div class="version"><h2 class="version-number"></h2></div>')
    $("h2", version_div).text(mothership.app + " " + version.version)
    
    // insert release notes
    if (version["release-notes"] && version["release-notes"].length > 0) {
      var release_note_ul = $('<ul class="release-notes"></ul>');
      version_div.append(release_note_ul)

      $.each(version["release-notes"], function(i, note) {
        var note_li = $('<li class="release-note"><div class="subject"></div></li>')
        note_li.addClass(note["type"])
        $(".subject", note_li).text(note["release-note-subject"])
        if (note["release-note-message"] && note["release-note-message"].length > 0) {
          $('<p class="message"></p>').text(note["release-note-message"]).appendTo(note_li)
        }
        release_note_ul.prepend(note_li)
      })
    }

    if (version["vcs-commits"] && version["vcs-commits"].length > 0) {
      var vcs_logs_ul = $('<ul class="vcs-logs"></ul>')
      version_div.append(vcs_logs_ul)

      $.each(version["vcs-commits"], function(i, commit) {
        var commit_li = $('<li class="commit"><span class="hex"></span><span class="subject"></span><p class="message"></p><date class="date"></date></li>')
        $(".subject", commit_li).text(commit["commit-subject"])
        $(".message", commit_li).text(commit["commit-message"])
        $(".hex", commit_li).text(commit["commit-hex"])
        $(".date", commit_li).text(commit["commit-date"])
        vcs_logs_ul.prepend(commit_li)
      })

    }

    $("#versions").prepend(version_div)
    console.log(version.version)
  })

})
