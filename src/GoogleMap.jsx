import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const containerStyle = {
   position: 'relative',
   width: '100%',
   height: '400px'
}

class GoogleMap extends Component {
   
   render() {
      return (
         <Map
            google={this.props.google}
            zoom={8}
            containerStyle={containerStyle}
            initialCenter={this.props.mapCenter}
         />
      )
   }
}

export default GoogleApiWrapper({
   apiKey: process.env.REACT_APP_MAP_KEY
})(GoogleMap);