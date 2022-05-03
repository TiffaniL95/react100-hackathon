import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const style = {
   width: '50%',
   height: '200px'
}

class GoogleMap extends Component {

   render() {
      return (
         <Map
            google={this.props.google}
            zoom={12}
            style={style}
            initialCenter={{
            lat: 40.854885,
            lng: -88.081807
            }}
         />
      )
   }
}

export default GoogleApiWrapper({
   apiKey: process.env.REACT_APP_MAP_KEY
})(GoogleMap);