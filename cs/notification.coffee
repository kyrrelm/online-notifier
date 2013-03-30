# Notify Coffeescript that jQuery is here
$ = jQuery
ls = localStorage

setNotification = ->
  try
    title = ls.notificationTitle
    link = ls.notificationLink
    description = ls.notificationDescription
    creator = ls.notificationCreator
    image = ls.notificationImage
    feedKey = ls.notificationFeedKey
    feedName = ls.notificationFeedName
    
    # Shorten title and description to fit nicely
    maxlength = 90
    if maxlength < description.length
      description = description.substring(0, maxlength) + '...'
    
    # Capture clicks
    $('#notification').click ->
      Browser.openTab link
      window.close

    # Create the HTML
    $('#notification').html '
      <div class="item">
        <div class="title">' + title + '</div>
        <img src="' + image + '" />
        <div class="textwrapper">
          <div class="emphasized">- Av ' + creator + '</div>
          <div class="description">' + description + '</div>
        </div>
      </div>
      </a>'

    if Affiliation.org[feedKey].getImage isnt undefined
      # If the organization has an image API, use it
      Affiliation.org[feedKey].getImage link, (link, image) ->
        $('img').prop 'src', image

  catch e
    log 'ERROR in desktop notification', e

# Support for inspection of desktop notification views disappeared
# in a Chrome version back in 2012. Use the background process to
# log debug messages out.
# https://code.google.com/p/chromium/issues/detail?id=162724
log = (object) ->
  if DEBUG then Browser.getBackgroundProcess().console.log object

# show the html5 notification with timeout when the document is ready
$ ->
  setNotification()
  # setTimeout ( ->
  #   window.close()
  # ), 5000
