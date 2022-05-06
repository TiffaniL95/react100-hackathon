import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const containerStyle = {
   position: 'relative',
   width: '100%',
   height: '400px'
}

class MapContainer extends Component {

   render() {
      return (
         <Map
            google={this.props.google}
            zoom={9}
            containerStyle={containerStyle}
            center={this.props.mapCenter}
         >
            
            {
               this.props.orgs.map((eachOrg, i) => {
                  console.log(`org list-${i}`, 'each org', eachOrg, 'location', eachOrg.location)
//                  console.log(`org list-${i}`, 'each org', eachOrg, 'name', eachOrg.name)
                  return <Marker
                     key={i}
                     position={eachOrg.location}
                     name={eachOrg.name}
                     
                  />
               })
            }
         </Map>
      )
   }
}

// console.log(this.props.orgs[i].add.address1, data.results[i].geometry.location.lat, data.results[i].geometry.location.lng)
export default GoogleApiWrapper({
   apiKey: process.env.REACT_APP_MAP_KEY
})(MapContainer);