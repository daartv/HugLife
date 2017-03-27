import React, { Component } from 'react';
import $ from 'jquery';
import BarProfile from './BarProfile.jsx';
import Header from './Header.jsx';
import BartenderProfile from './BartenderProfile.jsx';

const divStyle = {
  display: 'inline-block',
  float: 'right',
  height: '400px',
  width: '400px',
  border: 'solid Black 2px'
};
const mapStyle = {
  height: '400px',
  width: '400px',
  border: 'solid Black 2px',
  backgroundImage: 'url(./loading-map.gif)',
  backgroundSize: '100%',
  backgroundPosition: 'center'

};

class BarList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 'home',
      value: 'Enter Bar',
      bars: [{name: 'Tempest', key: 1}, {name: 'Databases', key: 2}, {name: 'Ol\'McDonalds', key: 3}],
      currentBar: [{name:'Tempest', key: 1}]
    }
  }

  handleChange(e) {
    this.setState ({
      value: e.target.value
    });
  }


  componentDidMount() { 

    var context = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
   
        var map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 10
        });

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pos,
          types: ['bar'],
          rankBy: google.maps.places.RankBy.DISTANCE
        }, function(results, status, pagination) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.log('error')
              return;
            } else {

            function addMarker(place) {
              var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              label: '' + (i + 1)
            });
            }

            function addHome(place) {
              var marker = new google.maps.Marker({
              map: map,
              position: place,
              label: {text: 'X', labelColor: 'green'}

            });
            }
              console.log(results);
              context.setState({
                bars: results
              });

              for (var i = 0; i < results.length; i++){
                addMarker(results[i]);
              }

              addHome(pos);

            }

            $.ajax({
              url:'/barlist',
              data: JSON.stringify(results),
              type: 'POST',
              contentType: 'text/plain',
              success: function(){
                console.log('SENT TO SERVER');
              },
              error: function(err){
                console.log('ERR', err);
              }
            })
        }) 

      }, function(error){
        console.log(error);

      }, function(){

        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.7876, lng: -122.4001},
          zoom: 15
        });

         var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: {lat: 37.7876, lng: -122.4001},
          types: ['bar'],
          rankBy: google.maps.places.RankBy.DISTANCE


        }, function(results, status, pagination) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.log('error')
              return;
            } else {

            function addMarker(place) {
              var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              label: '' + (i + 1)
            });
            }

            function addHome(place) {
              var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              label: 'X',
              labelColor: 'green'
            });
            }
              console.log(results);
              context.setState({
                bars: results
              });

              for (var i = 0; i < results.length; i++){
                addMarker(results[i]);
              }

            }
        }) 
        alert('GEOLOCATION ACCESS DENIED: LOCATION DEFAULTED TO HACK REACTOR SF');
      })
    } else {
      // do nothing
    }


    $('#rater').hide();

  }

  //OnClick of a bar, the bar profile component should re render to show the information the bar that was clicked
  render() {

    return (
      <div className='container'>
        <Header />
        <div className='jumbotron'>
          <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} />
          <button className='btn btn-primary'>Add Bar</button> 
        </div>
        <div className='jumbotron'>
          <h4>Bars Near You</h4>
          <ol>
            {this.state.bars.map(bar => <li key={bar.id} bar={bar}>{bar.name}</li>)}
          </ol>
          </div>
        <div style={mapStyle} id="map">
        </div>
        * Numbers on map correspond to numbers on list
        ** X on map is your current location
        <BarProfile />
      </div>
    )
  }
}

export default BarList;