import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import MapContainer from './GoogleMapMarkers'
import 'regenerator-runtime/runtime';


class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         mapCenter: { lat: 39.8097343, lng: -98.5556199 },
         zip: "",
         distance: "",
         orgs: [],
         update: false,
         zipEntered: false
      };
      this.handleZipChange = this.handleZipChange.bind(this)
      this.handleDistChange = this.handleDistChange.bind(this)
      this.findInfo = this.findInfo.bind(this)
      this.button = this.button.bind(this)
   };

   handleZipChange(e) {
      e.target.value.length != 5 ?
         (document.getElementById('zipalert').hidden = false,
         document.getElementById('distalert').hidden = true,
         this.setState({
            zipEntered: false
         })) :
         (document.getElementById('zipalert').hidden = true,
            document.getElementById('distalert').hidden = false,
            this.setState({
               [e.target.name]: Number(e.target.value),
               zipEntered: true
            }))
   };

   handleDistChange(e) {
      document.getElementById("distance").value > 0 ?
         (document.getElementById('distalert').hidden = true,
            this.setState({
               [e.target.name]: Number(e.target.value)
            }), this.findInfo()) :
         document.getElementById('distalert').hidden = false
   };

   async findInfo() {
      let orgInfo = []
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", process.env.REACT_APP_PET_KEY);
      params.append("client_secret", process.env.REACT_APP_PET_SECRET);


      const fetchToken = await fetch("https://api.petfinder.com/v2/oauth2/token",
         {
            method: "POST",
            body: params,
         })
         .then(response => response.json()).then(data => data.access_token)
         .catch(error => console.log(error))

      const fetchOrgInfo = await fetch(`https://api.petfinder.com/v2/organizations?location=${this.state.zip}&distance=${this.state.distance}`, { headers: { Authorization: `Bearer ${fetchToken}` } })
         .then(response => response.json())
         .then(data => {
            data.organizations.forEach(org => {
               if (org.address.address1 != null && !org.address.address1.match(/^p\.?o\.?\s?box/i)) {
                  orgInfo.push({ add: org.address, name: org.name })
               }
            })
         })
         .catch(error => console.log(error))

      orgInfo.forEach((eachOrg, i) => {
         fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${eachOrg.add.address1},+${eachOrg.add.state}&key=${process.env.REACT_APP_MAP_KEY}`)
            .then(response => (response.json()))
            .then(data => {
               Object.assign(eachOrg, { location: data.results[0].geometry.location })
            })
            .catch(error => console.log(error, eachOrg.add.address1))
      })

      this.setState({
         orgs: orgInfo
      })

   }

   button() {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.zip}&key=${process.env.REACT_APP_MAP_KEY}`)
         .then(response => response.json())
         .then(data => {
            this.setState({
               mapCenter: data.results[0].geometry.location,
               update:true
            })
         })
   }

   render() {
      return (
         <div className="text-center m-4">
            <h1>Rescue Me!</h1>
            {
               this.state.update == false ?
                  <GoogleMap
                     mapCenter={this.state.mapCenter}
                  /> :
                  <MapContainer
                     mapCenter={this.state.mapCenter}
                     orgs={this.state.orgs}
                  />
            }
            <div className="my-4 row">
               <div className="col-5">
                  <input className="w-100 text-center form-control" name="zip" id="zip" type="number" placeholder="Click here to enter your zipcode!" aria-label="Zip Code" defaultValue={this.state.zip} onChange={this.handleZipChange} />
               </div>
               <div className="col-2"></div>
               <div className="col-5">
                  {
                     this.state.zipEntered == true ?
                        <select className="w-100 text-center form-control" name="distance" id="distance" defaultValue="0" aria-label="distance" onChange={this.handleDistChange}>
                           <option value="0" disabled>Click here to select distance</option>
                           <option value="5">5</option>
                           <option value="10">10</option>
                           <option value="15">15</option>
                           <option value="20">20</option>
                           <option value="30">30</option>
                           <option value="40">40</option>
                           <option value="50">50</option>
                        </select> :
                        <div></div>
                  }
               </div>
            </div>
            <div className="mt-3 yellow row">
               <div className="col-5"><span id="zipalert">Must enter a 5 digit zip code</span></div>
               {
                  this.state.orgs == 0 ?
                     <button className="btn btn-primary col-2" onClick={() => this.button()} disabled>Fill out required fields</button> :
                     <button className="btn btn-primary col-2" onClick={() => this.button()}>Find rescues near me!</button>
               }
               <div className="col-5"><span className="col-5" id="distalert" hidden>Must select a distance!</span></div>
            </div>
         </div>
      )
   }
}

export default App;