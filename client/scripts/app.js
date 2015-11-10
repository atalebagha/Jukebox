
var JukeBox = React.createClass({
  getInitialState: function(){
    return {
        searchResults: [],
        queue: []
      };
  },

  onAddToQueue: function(song){
    this.setState({queue: this.state.queue.concat(song)});
  },

  onSearchResults: function(searchResults){
    this.setState({searchResults: searchResults});
  },

  render: function() {
    return (
      <div id="jukebox" className="center" >
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
        <div className="jumbotron">
          <div className="row">
            <div className="input-group">
              <input ref="search" type="text" className="form-control" placeholder="Search for..." />
              <span className="input-group-btn">
                <button onClick={this.handleClick} className="btn btn-primary" type="button"><span className=" glyphicon glyphicon-search">Search</span></button>
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
      console.log(track);
      return (
        <AudioTrack track={track} onClick={this.props.onAddToQueue}>
        </AudioTrack>
      );
    }.bind(this));

    return (
      <div className="container">
        <div className="row">
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

  render: function() {
    var track = this.props.track;
    return (
      <div onClick={this.handleClick} className="col-md-4 col-sm-6 col-lg-2 col-xs-12 jumbo-numbers">
        {track.title}
      </div>
    );
  }
});

var Playlist = React.createClass({

  getInitialState() {
      return {
          player: {iframe:null}
      };
  },

  playSong: function(track){
    var track_url = 'http://soundcloud.com/forss/flickermood';
    SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
      this.setState({player:oEmbed});
      console.log(this.state.player);
    }.bind(this));
  },

  render: function() {
    var playlistNodes = this.props.queue.map(function (track) {
          return (
            <AudioTrack track={track} onClick={this.playSong} />
          );
        }.bind(this));
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="player">{this.state.player.iframe}</div>
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




