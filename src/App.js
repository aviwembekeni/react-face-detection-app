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



const intialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = intialState;
  }

  componentDidMount() {
    fetch('https://face-recognition-app-av.herokuapp.com/')
    .then(response => response.json())
    .then(console.log)
    .catch(err => console.log(err))
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

      fetch('https://face-recognition-app-av.herokuapp.com/imageUrl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://face-recognition-app-av.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch( console.log)
        }
       this.displayFaceBox(this.calculateFaceLocation(response))

      })
      .catch(err => console.log("err", err))

  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(intialState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  loadUser = (data) => {

     this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: 0,
      joined: new Date()
     }})

  }

  render() {
    const {input, imgUrl, box, route, isSignedIn, user} = this.state;
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
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition box={box} imgUrl={imgUrl}/>
        </div>

        : (route === 'signin')?
        <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        :
        <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        }
      </div>
    );
  }
}

export default App;
