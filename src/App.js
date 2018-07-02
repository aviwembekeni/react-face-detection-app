import React, { Component } from 'react';
import './App.css';
import Navigation  from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from 'react-particles-js';
import Clarifai from'clarifai';

const particlesOptions = {
  particles: {
    line_linked: {
      number: {
        value: 30,
        density: {
          enable:true,
          value_area: 800
        }
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: 'cf835141369c429d82a23d9ce6f51454'
})

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  displayFaceBox = (box) => {
    
    this.setState({box: box});
  }

  calculateFaceLocation = (data) => {
    
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const img = document.getElementById('inputImage');
      const width = Number(img.width);
      const height = Number(img.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      } 
      
  }

  onInputChange = (e) => {
      this.setState({input: e.target.value})
      
  }

  onSubmit = () => {

    this.setState({imgUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL,
       this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log("err", err))
    
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {input, imgUrl, box, route, isSignedIn} = this.state;
    return (
      <div className="App">
        {/*<Particles className="particles"
              params={particlesOptions}
           
    />*/}
        
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
         ? 
         <div>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition box={box} imgUrl={imgUrl}/>
        </div>
         
        : (route === 'signin')?
        <SignIn onRouteChange={this.onRouteChange}/>
        :
        <Register onRouteChange={this.onRouteChange}/>
        }
      </div>
    );
  }
}

export default App;
