truncateTweets = function(tweets){
  for (i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    if (tweet.innerText.length > 140) {
      //truncateTweet(tweet);
      tweet.querySelector('.stream-item').style.display = 'none';
    }
    tweet.className = tweet.className + ' truncated';
  }
}

/*
truncateTweet = function(tweet){
  if (tweet.nodeName == 'LI') {
    tweet = tweet.querySelector('.tweet-text');
  }
  if (tweet.className.match(/truncated/)) return;
  
  var truncatedTweet = '';
  if (tweet.children.length > 0) {
    var truncatedTweet = shortenedTweetHTML(tweet);
  } else {
    var truncatedTweet = tweet.innerText.slice(0,140);
  }
  var truncatedContainer = document.createElement('SPAN');
   truncatedContainer.className = 'truncatedTweet';
   truncatedContainer.innerHTML = truncatedTweet + ' '; // + '&hellip;';
  
  var expand = document.createElement('A');
   expand.href      = '#';
   expand.className = 'expandTweet';
   expand.innerHTML = '[more]';
   expand.addEventListener("click", expandTweet);
   truncatedContainer.appendChild(expand);
  
  var originalContainer = document.createElement('SPAN');
   originalContainer.style.display = 'none';
   originalContainer.className     = 'originalTweet';
   originalContainer.innerHTML     = tweet.innerHTML;
   
  if (truncatedContainer.innerText.length < originalContainer.innerText.length) {
    tweet.innerHTML = '';
     tweet.appendChild(truncatedContainer);
     tweet.appendChild(originalContainer);
     expand.addEventListener("mouseenter", expandTweet);
   }
}

shortenedTweetHTML = function(tweet){
  var tweetHtml = '';
  var fragmentHtml;
  var fragmentText;
  var length = 0;
  for (i = 0; i < tweet.childNodes.length; i++){
    if (length >= 140) break;
    var el = tweet.childNodes[i];
    if (el.nodeName == '#text') {
      fragmentHtml = fragmentText = el.textContent.slice(0, 140-length); //append plaintext as-is
      length += fragmentText.length;
    
    } else if (el.nodeName == 'A') {
      if (el.className.match('twitter-atreply')) { //append at-replies and keep the links, but truncate the text
        var dup = el.cloneNode();
        dup.innerText = fragmentText = el.innerText.slice(0, 140-length);
        fragmentHtml  = dup.outerHTML;
        length += fragmentText.length;
  
      } else if(el.className.match('twitter-timeline-link')) {
        if (el.className.match('ui-hidden')) {
          //don't append hidden links
        } else {
          fragmentText = el.innerText;
          fragmentHtml  = el.outerHTML;
        }
        length += 23; //all links count for 23 characters, but display as shortened fragments 
        
      } else {
        fragmentText = el.innerText;
        fragmentHtml  = el.outerHTML;
        length += fragmentText.length;
      }
    } else {
      //console.log('attempting to truncate unknown element' + el.nodeName + '.' + el.className);
      fragmentText = el.innerText;
      fragmentHtml  = el.outerHTML;
      length += fragmentText.length;
    }
    
    tweetHtml += fragmentHtml;
  }
  
  return tweetHtml;
}

expandTweet = function(){
  var tweet;
  if (this.className.match('tweet-text')) {
    tweet = this;
  } else {
    tweet = this.parentNode.parentNode;
  }
  
  if (!tweet.className.match("expanded")) {
    for (i=0; i<tweet.childNodes.length; i++) {
      if (tweet.childNodes[i].className == 'truncatedTweet') {
        tweet.childNodes[i].style.display = 'none';
      } else {
        tweet.childNodes[i].style.display = '';
      }
    }
    
    tweet.className = tweet.className + ' expanded';
  }
  return false;
}
*/
checkDomChange = function(){
  var feed = document.getElementById('stream-items-id');
  var tweets = feed.querySelectorAll('#stream-items-id p.tweet-text:not(.truncated)');
  if (tweets.length > 0) {
    truncateTweets(tweets);
  }
}

var observer;
observeMutations = function(){
  // create an observer instance
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.id == 'stream-items-id' && mutation.type == 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
        checkDomChange();
        //truncateTweets(mutation.addedNodes);
      }
    });    
  });
  observer.observe(document.getElementById('stream-items-id'), { childList: true, subtree : false });
}

initialize = function(){
  if (observer) observer.disconnect();
  checkDomChange();
  observeMutations();
}

window.onhashchange = function() { 
  initialize();
}

initialize();
