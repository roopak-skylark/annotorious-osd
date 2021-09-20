import './App.css';
import OpenSeadragon from 'openseadragon';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import {useEffect, useState} from "react";
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import './colorSelector.css'

const ColorSelectorWidget = function(args) {

  // 1. Find a current color setting in the annotation, if any
  const currentColorBody = args.annotation ?
    args.annotation.bodies.find(function(b) {
      return b.purpose == 'highlighting';
    }) : null;

  // 2. Keep the value in a constiable
  const currentColorValue = currentColorBody ? currentColorBody.value : null;

  // 3. Triggers callbacks on user action
  const addTag = function(evt) {
    if (currentColorBody) {
      args.onUpdateBody(currentColorBody, {
        type: 'TextualBody',
        purpose: 'highlighting',
        value: evt.target.dataset.tag
      });
    } else {
      args.onAppendBody({
        type: 'TextualBody',
        purpose: 'highlighting',
        value: evt.target.dataset.tag
      });
    }
  }

  // 4. This part renders the UI elements
  const createButton = function(value) {
    const button = document.createElement('button');

    if (value == currentColorValue)
      button.className = 'selected';

    button.dataset.tag = value;
    button.style.backgroundColor = value;
    button.addEventListener('click', addTag);
    return button;
  }

  const container = document.createElement('div');
  container.className = 'colorselector-widget';

  const button1 = createButton('RED');
  const button2 = createButton('GREEN');
  const button3 = createButton('BLUE');

  container.appendChild(button1);
  container.appendChild(button2);
  container.appendChild(button3);

  return container;
}

const ColorFormatter = function(annotation) {
  const highlightBody = annotation.bodies.find(function(b) {
    return b.purpose == 'highlighting';
  });

  if (highlightBody)
    return highlightBody.value;
}

function App() {

  const[annotorious, setAnnotorious] = useState(null);

  useEffect(() => {
    const viewer = OpenSeadragon({
      showNavigator:  true,
      id: "openseadragon",
      prefixUrl: "images/",
      tileSources: "https://storage.googleapis.com/makerzhub-static/opensea/output/helloworld.dzi"
    });

    const config = {
      formatter: ColorFormatter,//strokeFormatter,
      //disableEditor: true,
      widgets: [
        'COMMENT',
        ColorSelectorWidget
      ]
    };
    let a = Annotorious(viewer, config)
    setAnnotorious(a);
  }, [])

  return (
    <div className="App">
      <header className="App-header">

        <div
          className='osd'
          id="openseadragon"
          style={{
            height: "540px",
            width: "960px"
          }}>
        </div>
      </header>
    </div>
  );
}

export default App;
