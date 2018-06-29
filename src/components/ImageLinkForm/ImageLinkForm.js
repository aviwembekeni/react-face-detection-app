import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    
    return(
       <div className="ma4 mt0">
          <p className='f5'>
          {'This Magic Brain App will detect faces i your pictures. Give it A Try'}
          </p>
          <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type="text" onChange={onInputChange}/>
                <button
                   className='w-30 grow f4 link pv2 dib white bg-light-purple'
                   onClick={onSubmit}>Detect</button>
            </div>
          </div>
       </div>
    )
}

export default ImageLinkForm;