import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import 'regenerator-runtime/runtime';
import axios from 'axios';


class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   };

   componentDidMount() {
      let token = ""
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", process.env.REACT_APP_PET_KEY);
      params.append("client_secret", process.env.REACT_APP_PET_SECRET);


      fetch("https://api.petfinder.com/v2/oauth2/token",
         {
            method: "POST",
            body: params,
         })
      .then(response => response.json().then(data=>token=data.access_token))
      .catch(error => console.log(error))

      fetch("https://api.petfinder.com/v2/organizations", { headers: { Authorization: `Bearer ${token}` } })
         .then(response => console.log(response))
         .catch(error => console.log(error, token))
      
      // axios
         
      // .post("https://api.petfinder.com/v2/oauth2/token", params)
      // .then(response => token = response.data.access_token)
      // .catch(error => console.log(error))

      // axios

      // .get("https://api.petfinder.com/v2/organizations", { headers: { Authorization: `Bearer ${token}` } })
      // .then(response => console.log(response))
      // .catch(error => console.log(error, token))
   }

   render() {
      return (
         <div>
            <h1>Rescue Me!</h1>
            <GoogleMap/>
            <button className="float-end" onClick={()=>this.token(req,res)}>Click!</button>
            {/* If type selected provide dropdown with checkboxes? */}
            {/* <select name="animal-type">
               <option>Dynamically fill with map then res.types[i].name?</option>
               <option>Dynamically fill with map to state then this.state.data[i].name?</option>
            </select> */}
            {/* <label forHtml="breed">Breed</label>
            <select name="breed" id="breed" multiple="multiple">
               <option value="option1">dynamically fill? each selected will append search param or assign to variable within search?</option>
            </select>
            <label forHtml="size">Size</label>
            <select name="size" id="size" multiple="multiple">
               <option value="option1">dynamically fill? each selected will append search param or assign to variable within search?</option>
            </select>
            <label forHtml="gender">Gender</label>
            <select name="gender" id="gender" multiple="multiple">
               <option value="option1">dynamically fill? each selected will append search param or assign to variable within search?</option>
            </select>
            <label forHtml="age">Age</label>
            <select name="age" id="age" multiple="multiple">
               <option value="option1">dynamically fill? each selected will append search param or assign to variable within search?</option>
            </select>
            <label forHtml="coat">Coat</label>
            <select name="coat" id="coat" multiple="multiple">
               <option value="option1">dynamically fill? each selected will append search param or assign to variable within search?</option>
            </select>
            <label forHtml="good-with">Good with</label>
            <select name="good-with" id="good-with" multiple="multiple">
               <option value="kids">Kids</option>
               <option value="cats">Cats</option>
               <option value="dogs">Dogs</option>
            </select>
            <label forHtml="house-trained"><input type="checkbox" />House Trained</label>
            <label forHtml="special-needs"><input type="checkbox" />Special Needs</label> */}

            {/* once chosen map through results and render animal info*/}
            <AnimalInfo />
         </div>
      )
   }
}

class AnimalInfo extends Component {
   render() {
      return (
         <div name="animal-info">
            <div>Picture</div>
            <div>Name</div>
         </div>
      )
   }
}

export default App;