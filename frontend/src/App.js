import './App.css';
import MyImage from './assets/home-page-logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={MyImage} alt="Home Page Logo">
        </img>
      </header>
    </div>
  );
}

export default App;
