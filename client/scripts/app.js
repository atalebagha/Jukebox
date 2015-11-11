
var JukeBox = React.createClass({
  getInitialState: function(){
    return {
        searchResults: [],
        queue: []
      };
  },

  onAddToQueue: function(song){
    if (this.state.queue.indexOf(song) === -1) {
      this.setState({queue: this.state.queue.concat(song)});
    }
  },

  onSearchResults: function(searchResults){
    this.setState({searchResults: searchResults});
  },

  render: function() {
    return (
      <div id="jukebox" className="center" >
          <h1 className="logo text-center">Jukebox</h1>
          <SearchBar onSearchResults={this.onSearchResults}/>
          <ResultList searchResults={this.state.searchResults} onAddToQueue={this.onAddToQueue}/>
          <Playlist queue={this.state.queue}/>
      </div>
    );
  }
});
// add playlist and results sections above

var SearchBar = React.createClass({

  handleClick: function(){
    var search = this.refs.search.getDOMNode().value;
    this.searchSc(search, function(results){
      this.props.onSearchResults(results);
    }.bind(this));
  },

  searchSc: function(query, cb){
    SC.get('/tracks', {
      q: query,
    }, function(res){
      cb(res);
    });
  },

  render: function() {
    return (
      <div className="container">
        <div>
          <div className="row">
            <div className="input-group input-group-lg search-bar">
              <input ref="search" type="text" className="form-control search-input" autoFocus/>
              <span className="input-group-btn">
                <button onClick={this.handleClick} className="btn btn-primary" type="button"><span className=" glyphicon glyphicon-search"></span></button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ResultList = React.createClass({

  render: function() {
    var resultNodes = this.props.searchResults.map(function (track) {
      return (
        <AudioTrack track={track} onClick={this.props.onAddToQueue}>
        </AudioTrack>
      );
    }.bind(this));

    return (
      <div className="container cont-center">
        <div className="row row-centered">
          {resultNodes}
        </div>
      </div>
    );
  }
});

var AudioTrack = React.createClass({

  handleClick: function (event) {
    this.props.onClick(this.props.track);
  },

  handleDoubleClick: function (event) {
    this.props.onStartDrag(this.props.track);
  },

  componentDidMount: function(){
    console.log(this.props.canRemove);
    $('.item').each(function(){
      var track = $(this);
      if(track.parents().index('div.queue') >= 0){
        console.log(track.parents('.queue'));
        track.hover(function(){
          track.find('.removesong').fadeIn()
        },
        function () {
          track.find('.removesong').fadeOut()
        });
      }
    });
  },

  render: function() {
    var track = this.props.track;
    return (
      <div onClick={this.handleClick} className="col-md-offset-4 col-sm-6 col-lg-offset-2 col-xs-12 thumbnail item col-centered">
        <div>
          <img className="song thumbnail-image" src={track.artwork_url} />
        </div>
        <div className="caption songinfo">
          {track.title}
          <button className="btn btn-danger removesong">Remove</button>
        </div>
      </div>
    );
  }
});

var Playlist = React.createClass({

  getInitialState() {
      return {
          currentTrack: {
            title: 'Add some tunes bro...',
            stream_url: ''
          }
      };
  },

  playSong: function(track){
    var idx = this.props.queue.indexOf(track);
    // Moves song to the front of the queue when played
    if(idx !== 0){
      this.props.queue.splice(idx, 1);
      this.props.queue.unshift(track);
    }
    this.setState({currentTrack:track});
  },

  removeSong: function (track) {
    console.log('remove', this.props.queue.indexOf(track));
    var idx = this.props.queue.indexOf(track);
    this.props.queue.splice(idx, 1);
  },

  componentDidUpdate: function(){
    console.log('updated');

    if(this.props.queue.length && this.state.currentTrack.stream_url === ''){
      this.playSong(this.props.queue[0]);
    }
  },

  componentDidMount: function(){
    // Adds event listener to the end of a song
    $('#player').on('ended', function(e){
      // Removes ended song and plays the next one
      this.props.queue.shift();
      if(this.props.queue[0]){
        this.playSong(this.props.queue[0]);
      }
    }.bind(this));
  },

  render: function() {
    var playlistNodes = this.props.queue.map(function (track) {
          return (
            <AudioTrack className='playlistitem' track={track} onClick={this.playSong} canRemove={true}/>
          );
        }.bind(this));
    return (
      <div className="queue">
        <div className="container">
          <h4>{this.state.currentTrack.title}</h4>
          <div className="row">
            <div className="btn-group col-md-2" role="group" aria-label="...">
              <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-backward"></span></button>
              <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-play"></span></button>
              <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-forward"></span></button>
            </div>
            <div className="col-md-8">
              <div className="progress">
                  <div className="progress-bar bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">

                  </div>
              </div>
            </div>
            <audio id='player' src={this.state.currentTrack.stream_url + '?client_id=' + SOUND_CLOUD_KEY} controls autoPlay>Audio</audio>
          </div>
          <div className="row">
            {playlistNodes}
          </div>
        </div>
      </div>
    );
  }
});

// render the mainbox here
React.render(
  <JukeBox />,
  document.getElementById('container')
);




