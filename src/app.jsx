import React, { Component } from 'react';
import MapContainer from './GoogleMap';
import 'regenerator-runtime/runtime';


class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         mapCenter: {lat: 38.27375749999999, lng: -122.0064998},
         zip: "",
         distance: "",
         orgs: []
      };
      this.handleZipChange = this.handleZipChange.bind(this)
      this.handleDistChange = this.handleDistChange.bind(this)
      this.findInfo = this.findInfo.bind(this)
   };

   handleZipChange(e) {
      e.target.value.length != 5 ?
         document.getElementById('zipalert').hidden = false :
         (document.getElementById('zipalert').hidden = true,
            this.setState({
               [e.target.name]: Number(e.target.value)
            }))
   };

   handleDistChange(e) {
      e.target.value > 0 && e.target.value <= 500 && Number.isInteger(+e.target.value)?
      (document.getElementById('distalert').hidden = true,
      this.setState({
         [e.target.name]: Number(e.target.value)
      })) :
      document.getElementById('distalert').hidden = false
   };

   async findInfo() {
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
            let orgInfo = []
            data.organizations.map(org => {
               if(org.address.address1 != null)
               orgInfo.push({ add: org.address, name: org.name })
            })
            this.setState({
               orgs: orgInfo
            })
         })
         .catch(error => console.log(error))

      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.zip}&key=${process.env.REACT_APP_MAP_KEY}`)
      .then(response=>response.json())
         .then(data=>{
            this.setState({
               mapCenter: data.results[0].geometry.location
            })
         }
      )
      

      let orgsClone = JSON.parse(JSON.stringify(this.state.orgs))

      orgsClone.map((eachOrg, i) => {
         fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${eachOrg.add.address1},+${eachOrg.add.state}&key=${process.env.REACT_APP_MAP_KEY}`)
         .then(response=>(response.json()))
            .then(data=>{
               Object.assign(eachOrg, {location: data.results[0].geometry.location})
            })
         .catch(error => console.log(error, eachOrg.add.address1))
      })

      this.setState({
         orgs: orgsClone
      })   
   }
   render() {
      return (
         <div className="text-center m-4">
            <h1>Rescue Me!</h1>
               <MapContainer 
                  mapCenter={this.state.mapCenter}
                  orgs={this.state.orgs}
               /> 
            <div className="my-4 row">
               <div className="col-5">
               <input className="w-100 text-center form-control" name="zip" id="zip" type="number" placeholder="Click here to enter your zipcode!" aria-label="Zip Code" defaultValue={this.state.zip} onChange={this.handleZipChange} />
               </div>
               <div className="col-2"></div>
               <div className="col-5">
               <input className="w-100 text-center form-control" name="distance" step="10" id="distance" type="number" placeholder="Click here to enter distance in miles" aria-label="distance" defaultValue={this.state.distance} onChange={this.handleDistChange}/>
               </div>
            </div>
            <div className="mt-3 yellow row">
               <div className="col-5"><span id="zipalert">Must enter a 5 digit zip code</span></div>
               <button className="btn btn-primary col-2" onClick={() => this.findInfo()}>Find rescues near me!</button>
               <div className="col-5"><span className="col-5" id="distalert">Must enter a whole number from 1 to 500</span></div>
            </div>
         </div>
      )
   }
}

export default App;